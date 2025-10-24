"""
Input sanitization utilities to prevent XSS and injection attacks
"""

import html
import re
from typing import Optional


def sanitize_text(text: str, max_length: int = 1000) -> str:
    """
    Sanitize user-provided text to prevent XSS attacks.

    Args:
        text: Raw user input text
        max_length: Maximum allowed length

    Returns:
        str: Sanitized text
    """
    if not text:
        return ""

    # Truncate to max length
    text = text[:max_length]

    # Escape HTML entities
    text = html.escape(text)

    # Remove any remaining script tags (paranoid check)
    text = re.sub(r'<script[^>]*>.*?</script>', '', text, flags=re.IGNORECASE | re.DOTALL)

    # Remove event handlers
    text = re.sub(r'on\w+\s*=\s*["\']?[^"\']*["\']?', '', text, flags=re.IGNORECASE)

    return text.strip()


def sanitize_email(email: str) -> str:
    """
    Sanitize email address.

    Args:
        email: Raw email input

    Returns:
        str: Sanitized email
    """
    if not email:
        return ""

    # Convert to lowercase and strip whitespace
    email = email.lower().strip()

    # Remove any HTML entities
    email = html.unescape(email)

    # Basic validation (detailed validation done by Pydantic)
    if not re.match(r'^[^\s@]+@[^\s@]+\.[^\s@]+$', email):
        return ""

    return email


def sanitize_phone(phone: Optional[str]) -> Optional[str]:
    """
    Sanitize phone number.

    Args:
        phone: Raw phone input

    Returns:
        str: Sanitized phone number or None
    """
    if not phone:
        return None

    # Remove all non-digit, non-space, non-dash, non-plus characters
    phone = re.sub(r'[^\d\s\-\+\(\)]', '', phone)

    return phone.strip() if phone else None
