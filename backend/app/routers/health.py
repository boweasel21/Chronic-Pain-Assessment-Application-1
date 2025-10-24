"""
Health check router
"""

from fastapi import APIRouter
from datetime import datetime

from ..config import settings
from ..database import get_database

router = APIRouter()


@router.get("/health")
async def health_check():
    """
    Health check endpoint to verify API availability.

    Returns:
        dict: Health status and version information
    """
    try:
        # Check database connection
        db = await get_database()
        await db.command("ping")

        return {
            "status": "healthy",
            "version": settings.VERSION,
            "environment": settings.ENVIRONMENT,
            "timestamp": datetime.utcnow().isoformat()
        }

    except Exception as e:
        return {
            "status": "unhealthy",
            "error": "Database connection failed",
            "timestamp": datetime.utcnow().isoformat()
        }
