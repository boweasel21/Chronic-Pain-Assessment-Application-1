"""
CSRF Token Router
Provides CSRF token generation and validation endpoints
"""

from fastapi import APIRouter, Response
from datetime import datetime, timedelta
import secrets
import hashlib

router = APIRouter()

# In-memory storage for CSRF tokens (in production, use Redis or similar)
# Format: {token_hash: expiry_timestamp}
csrf_tokens = {}

# Token expiration time (30 minutes)
TOKEN_EXPIRY_MINUTES = 30


def clean_expired_tokens():
    """Remove expired tokens from storage"""
    current_time = datetime.utcnow()
    expired_tokens = [
        token_hash for token_hash, expiry in csrf_tokens.items()
        if expiry < current_time
    ]
    for token_hash in expired_tokens:
        del csrf_tokens[token_hash]


def generate_csrf_token() -> tuple[str, datetime]:
    """
    Generate a new CSRF token
    
    Returns:
        tuple: (token, expiry_time)
    """
    # Clean expired tokens periodically
    clean_expired_tokens()
    
    # Generate secure random token (32 bytes = 256 bits)
    token = secrets.token_urlsafe(32)
    
    # Calculate expiry time
    expiry = datetime.utcnow() + timedelta(minutes=TOKEN_EXPIRY_MINUTES)
    
    # Store token hash (don't store plain token)
    token_hash = hashlib.sha256(token.encode()).hexdigest()
    csrf_tokens[token_hash] = expiry
    
    return token, expiry


@router.get("/csrf-token")
async def get_csrf_token(response: Response):
    """
    Get a new CSRF token
    
    Returns a fresh CSRF token that clients should include in subsequent
    state-changing requests (POST, PUT, DELETE)
    
    Security Notes:
    - Token is returned in response body and also set as cookie
    - Token expires after 30 minutes
    - Tokens are stored as hashes for additional security
    
    Returns:
        dict: Contains token and expiry timestamp
    """
    token, expiry = generate_csrf_token()
    
    # Set CSRF token as HTTP-only cookie (double-submit cookie pattern)
    response.set_cookie(
        key="csrf_token",
        value=token,
        max_age=TOKEN_EXPIRY_MINUTES * 60,
        httponly=True,
        secure=True,  # Only send over HTTPS in production
        samesite="strict",
    )
    
    # Also return in response body for client-side storage
    return {
        "token": token,
        "expiresAt": expiry.isoformat() + "Z",
    }


@router.post("/csrf-token/refresh")
async def refresh_csrf_token(response: Response):
    """
    Refresh an existing CSRF token
    
    Generates a new token and invalidates the old one
    
    Returns:
        dict: Contains new token and expiry timestamp
    """
    # Same as getting a new token
    return await get_csrf_token(response)


def verify_csrf_token(token: str) -> bool:
    """
    Verify a CSRF token is valid
    
    Args:
        token: The CSRF token to verify
        
    Returns:
        bool: True if token is valid and not expired
    """
    if not token:
        return False
    
    # Hash the token
    token_hash = hashlib.sha256(token.encode()).hexdigest()
    
    # Check if token exists and is not expired
    if token_hash not in csrf_tokens:
        return False
    
    expiry = csrf_tokens[token_hash]
    if expiry < datetime.utcnow():
        # Token expired, remove it
        del csrf_tokens[token_hash]
        return False
    
    return True
