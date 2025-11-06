"""
Primary Cell Assessment API
FastAPI backend for Emergent.sh deployment

This module provides the main FastAPI application entry point.
"""

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from fastapi.responses import JSONResponse
import time
import uvicorn

from app.config import settings
from app.routers import assessment, email, health, csrf
from app.middleware.rate_limiter import rate_limiter
from app.middleware import request_logger
from app.database import init_db

# Initialize FastAPI app
app = FastAPI(
    title="Primary Cell Assessment API",
    description="Backend API for Primary Cell chronic pain assessment",
    version="1.0.0",
    docs_url="/docs" if settings.ENVIRONMENT == "development" else None,
    redoc_url="/redoc" if settings.ENVIRONMENT == "development" else None,
)

# ============================================================================
# MIDDLEWARE
# ============================================================================

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["Content-Type", "Authorization", "X-CSRF-Token", "X-Requested-With"],
    expose_headers=["X-CSRF-Token"],
    max_age=86400,  # 24 hours
)

# GZip compression for responses
app.add_middleware(GZipMiddleware, minimum_size=1000)

# Request logging middleware
@app.middleware("http")
async def log_requests(request: Request, call_next):
    """Log all incoming requests with timing information."""
    start_time = time.time()

    # Process request
    response = await call_next(request)

    # Calculate duration
    duration = time.time() - start_time

    # Log request (PII-safe)
    request_logger.log_request(
        method=request.method,
        path=request.url.path,
        status=response.status_code,
        duration=duration,
        ip=request.client.host if request.client else "unknown",
    )

    return response

# Rate limiting middleware
@app.middleware("http")
async def rate_limit_requests(request: Request, call_next):
    """Apply rate limiting to protect against abuse."""

    # Check rate limit
    is_allowed, retry_after = rate_limiter.check_rate_limit(
        ip=request.client.host if request.client else "unknown",
        endpoint=request.url.path,
    )

    if not is_allowed:
        return JSONResponse(
            status_code=429,
            content={
                "success": False,
                "error": "Too many requests. Please try again later.",
                "code": "RATE_LIMIT",
                "details": {
                    "retryAfter": retry_after,
                    "limit": rate_limiter.get_limit(request.url.path),
                    "window": "15 minutes"
                }
            }
        )

    # Process request
    response = await call_next(request)

    # Add rate limit headers
    response.headers["X-RateLimit-Limit"] = str(rate_limiter.get_limit(request.url.path))
    response.headers["X-RateLimit-Remaining"] = str(rate_limiter.get_remaining(request.client.host, request.url.path))
    response.headers["X-RateLimit-Reset"] = str(rate_limiter.get_reset_time())

    return response

# ============================================================================
# EVENT HANDLERS
# ============================================================================

@app.on_event("startup")
async def startup_event():
    """Initialize database connection and other resources on startup."""
    await init_db()
    print(f"🚀 Primary Cell Assessment API started in {settings.ENVIRONMENT} mode")

@app.on_event("shutdown")
async def shutdown_event():
    """Clean up resources on shutdown."""
    print("👋 Primary Cell Assessment API shutting down")

# ============================================================================
# EXCEPTION HANDLERS
# ============================================================================

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    """Handle all uncaught exceptions."""

    # Log error (without PII)
    request_logger.log_error(
        method=request.method,
        path=request.url.path,
        error=str(exc),
    )

    return JSONResponse(
        status_code=500,
        content={
            "success": False,
            "error": "An unexpected error occurred. Please try again.",
            "code": "SERVER_ERROR",
        }
    )

# ============================================================================
# ROUTERS
# ============================================================================

# Include all route modules
app.include_router(health.router, tags=["Health"])
app.include_router(csrf.router, prefix="/api", tags=["CSRF"])
app.include_router(assessment.router, prefix="/api/assessment", tags=["Assessment"])
app.include_router(email.router, prefix="/api/email", tags=["Email"])

# ============================================================================
# ROOT ENDPOINT
# ============================================================================

@app.get("/")
async def root():
    """Root endpoint - API information."""
    return {
        "name": "Primary Cell Assessment API",
        "version": "1.0.0",
        "status": "running",
        "docs": "/docs" if settings.ENVIRONMENT == "development" else None,
    }

# ============================================================================
# MAIN
# ============================================================================

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=settings.ENVIRONMENT == "development",
    )
