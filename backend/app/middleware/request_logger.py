"""
Request logging middleware
Logs all API requests without PII
"""

import logging
import hashlib
from datetime import datetime
from typing import Optional

logger = logging.getLogger(__name__)


def hash_ip(ip: str) -> str:
    """
    Hash IP address for privacy-safe logging.

    Args:
        ip: IP address

    Returns:
        str: Hashed IP (first 8 characters of SHA256)
    """
    return hashlib.sha256(ip.encode()).hexdigest()[:8]


def log_request(
    method: str,
    path: str,
    status: int,
    duration: float,
    ip: str,
) -> None:
    """
    Log API request without PII.

    Args:
        method: HTTP method
        path: Request path
        status: Response status code
        duration: Request duration in seconds
        ip: Client IP address
    """
    # Hash IP for privacy
    ip_hash = hash_ip(ip)

    # Format duration
    duration_ms = int(duration * 1000)

    # Log request
    logger.info(
        f"{method} {path} - {status} - {duration_ms}ms - {ip_hash}"
    )


def log_error(
    method: str,
    path: str,
    error: str,
) -> None:
    """
    Log API error without PII.

    Args:
        method: HTTP method
        path: Request path
        error: Error message
    """
    logger.error(
        f"{method} {path} - ERROR: {error}"
    )
