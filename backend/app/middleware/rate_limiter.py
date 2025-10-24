"""
Rate limiting middleware to prevent API abuse
"""

from datetime import datetime, timedelta
from typing import Dict, Tuple
import time

from ..config import settings


class RateLimiter:
    """
    Simple in-memory rate limiter.
    For production, use Redis-based rate limiting.
    """

    def __init__(self):
        """Initialize rate limiter with storage."""
        self.requests: Dict[str, list] = {}
        self.window_seconds = 900  # 15 minutes

    def check_rate_limit(self, ip: str, endpoint: str) -> Tuple[bool, int]:
        """
        Check if request is within rate limit.

        Args:
            ip: Client IP address
            endpoint: API endpoint path

        Returns:
            Tuple[bool, int]: (is_allowed, retry_after_seconds)
        """
        if not settings.RATE_LIMIT_ENABLED:
            return True, 0

        # Get rate limit for endpoint
        limit = self.get_limit(endpoint)

        # Create key for tracking
        key = f"{ip}:{endpoint}"

        # Get current timestamp
        now = time.time()
        window_start = now - self.window_seconds

        # Initialize or clean old requests
        if key not in self.requests:
            self.requests[key] = []

        # Remove requests outside window
        self.requests[key] = [
            req_time for req_time in self.requests[key]
            if req_time > window_start
        ]

        # Check if limit exceeded
        if len(self.requests[key]) >= limit:
            oldest_request = min(self.requests[key])
            retry_after = int(oldest_request + self.window_seconds - now)
            return False, max(retry_after, 0)

        # Add current request
        self.requests[key].append(now)

        return True, 0

    def get_limit(self, endpoint: str) -> int:
        """
        Get rate limit for endpoint.

        Args:
            endpoint: API endpoint path

        Returns:
            int: Maximum requests per window
        """
        if "/api/assessment/submit" in endpoint:
            return settings.RATE_LIMIT_SUBMIT_ASSESSMENT
        elif "/api/assessment/save-progress" in endpoint:
            return settings.RATE_LIMIT_SAVE_PROGRESS
        elif "/api/email/send-results" in endpoint:
            return settings.RATE_LIMIT_SEND_EMAIL
        elif "/health" in endpoint:
            return settings.RATE_LIMIT_HEALTH
        else:
            return 60  # Default: 60 requests per 15 minutes

    def get_remaining(self, ip: str, endpoint: str) -> int:
        """
        Get remaining requests in current window.

        Args:
            ip: Client IP address
            endpoint: API endpoint path

        Returns:
            int: Remaining requests
        """
        key = f"{ip}:{endpoint}"
        limit = self.get_limit(endpoint)

        if key not in self.requests:
            return limit

        # Clean old requests
        now = time.time()
        window_start = now - self.window_seconds
        self.requests[key] = [
            req_time for req_time in self.requests[key]
            if req_time > window_start
        ]

        return max(limit - len(self.requests[key]), 0)

    def get_reset_time(self) -> int:
        """
        Get timestamp when rate limit window resets.

        Returns:
            int: Unix timestamp
        """
        return int(time.time() + self.window_seconds)


# Global rate limiter instance
rate_limiter = RateLimiter()
