"""
Configuration settings for Primary Cell Assessment API
Loads environment variables and provides application settings
"""

from pydantic_settings import BaseSettings
from typing import List
import os


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""

    # ========================================================================
    # APPLICATION SETTINGS
    # ========================================================================
    APP_NAME: str = "Primary Cell Assessment API"
    VERSION: str = "1.0.0"
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")

    # ========================================================================
    # DATABASE SETTINGS
    # ========================================================================
    MONGODB_URI: str = os.getenv(
        "MONGODB_URI",
        "mongodb://localhost:27017"
    )
    MONGODB_DATABASE: str = os.getenv("MONGODB_DATABASE", "primary_cell_assessment")

    # ========================================================================
    # CORS SETTINGS
    # ========================================================================
    CORS_ORIGINS: List[str] = [
        "http://localhost:5173",  # Vite dev server
        "http://localhost:3000",  # Alternative dev port
        "http://localhost:4173",  # Vite preview server
        "https://primarycell.com",
        "https://www.primarycell.com",
        "https://*.preview.emergentagent.com",  # All Emergent preview domains
    ]

    # Add additional CORS origins from environment
    @property
    def cors_origins(self) -> List[str]:
        additional_origins = os.getenv("CORS_ORIGINS", "")
        if additional_origins:
            return self.CORS_ORIGINS + additional_origins.split(",")
        return self.CORS_ORIGINS

    # ========================================================================
    # EMAIL SETTINGS
    # ========================================================================
    EMAIL_PROVIDER: str = os.getenv("EMAIL_PROVIDER", "sendgrid")

    # SendGrid
    SENDGRID_API_KEY: str = os.getenv("SENDGRID_API_KEY", "")
    SENDGRID_FROM_EMAIL: str = os.getenv("SENDGRID_FROM_EMAIL", "noreply@primarycell.com")
    SENDGRID_FROM_NAME: str = os.getenv("SENDGRID_FROM_NAME", "Primary Cell Assessment")

    # AWS SES (alternative)
    AWS_ACCESS_KEY_ID: str = os.getenv("AWS_ACCESS_KEY_ID", "")
    AWS_SECRET_ACCESS_KEY: str = os.getenv("AWS_SECRET_ACCESS_KEY", "")
    AWS_REGION: str = os.getenv("AWS_REGION", "us-east-1")

    # Email templates
    RESULTS_EMAIL_TEMPLATE_ID: str = os.getenv("RESULTS_EMAIL_TEMPLATE_ID", "")

    # ========================================================================
    # RATE LIMITING
    # ========================================================================
    RATE_LIMIT_ENABLED: bool = os.getenv("RATE_LIMIT_ENABLED", "true").lower() == "true"

    # Rate limits per endpoint (requests per 15 minutes)
    RATE_LIMIT_SUBMIT_ASSESSMENT: int = int(os.getenv("RATE_LIMIT_SUBMIT_ASSESSMENT", "5"))
    RATE_LIMIT_SAVE_PROGRESS: int = int(os.getenv("RATE_LIMIT_SAVE_PROGRESS", "30"))
    RATE_LIMIT_SEND_EMAIL: int = int(os.getenv("RATE_LIMIT_SEND_EMAIL", "3"))
    RATE_LIMIT_HEALTH: int = int(os.getenv("RATE_LIMIT_HEALTH", "100"))

    # ========================================================================
    # SECURITY SETTINGS
    # ========================================================================
    # API Keys for programmatic access (optional)
    API_KEYS: List[str] = os.getenv("API_KEYS", "").split(",") if os.getenv("API_KEYS") else []

    # Maximum request body size (1MB)
    MAX_REQUEST_SIZE: int = int(os.getenv("MAX_REQUEST_SIZE", "1048576"))

    # ========================================================================
    # LOGGING SETTINGS
    # ========================================================================
    LOG_LEVEL: str = os.getenv("LOG_LEVEL", "INFO")

    # Sentry for error tracking (optional)
    SENTRY_DSN: str = os.getenv("SENTRY_DSN", "")
    SENTRY_ENVIRONMENT: str = os.getenv("SENTRY_ENVIRONMENT", ENVIRONMENT)

    # ========================================================================
    # FEATURE FLAGS
    # ========================================================================
    ENABLE_EMAIL_RESULTS: bool = os.getenv("ENABLE_EMAIL_RESULTS", "true").lower() == "true"
    ENABLE_AUTO_SAVE: bool = os.getenv("ENABLE_AUTO_SAVE", "true").lower() == "true"

    # ========================================================================
    # CRM INTEGRATION (Optional)
    # ========================================================================
    CRM_ENABLED: bool = os.getenv("CRM_ENABLED", "false").lower() == "true"
    CRM_PROVIDER: str = os.getenv("CRM_PROVIDER", "")  # e.g., 'salesforce', 'hubspot'
    CRM_API_KEY: str = os.getenv("CRM_API_KEY", "")
    CRM_API_URL: str = os.getenv("CRM_API_URL", "")

    # ========================================================================
    # REDIS SETTINGS (for rate limiting and caching)
    # ========================================================================
    REDIS_URL: str = os.getenv("REDIS_URL", "redis://localhost:6379")
    REDIS_ENABLED: bool = os.getenv("REDIS_ENABLED", "false").lower() == "true"

    class Config:
        env_file = ".env"
        case_sensitive = True


# Global settings instance
settings = Settings()
