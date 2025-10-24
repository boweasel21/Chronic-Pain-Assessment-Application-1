"""
MongoDB database connection and initialization
"""

from motor.motor_asyncio import AsyncIOMotorClient
from typing import Optional
import logging

from .config import settings

logger = logging.getLogger(__name__)

# Global database client
db_client: Optional[AsyncIOMotorClient] = None


async def init_db():
    """Initialize database connection."""
    global db_client

    try:
        db_client = AsyncIOMotorClient(settings.MONGODB_URI)

        # Test connection
        await db_client.admin.command("ping")
        logger.info("✅ Connected to MongoDB successfully")

        # Create indexes on startup
        await create_indexes()

    except Exception as e:
        logger.error(f"❌ Failed to connect to MongoDB: {str(e)}")
        raise


async def get_database():
    """Get database instance."""
    if db_client is None:
        raise RuntimeError("Database not initialized. Call init_db() first.")

    return db_client[settings.MONGODB_DATABASE]


async def close_db():
    """Close database connection."""
    global db_client

    if db_client is not None:
        db_client.close()
        logger.info("👋 MongoDB connection closed")


async def create_indexes():
    """Create database indexes for optimal performance."""
    try:
        db = await get_database()

        # ====================================================================
        # ASSESSMENTS COLLECTION INDEXES
        # ====================================================================
        assessments = db["assessments"]

        # Unique index on assessmentId
        await assessments.create_index("assessmentId", unique=True)

        # Index on email for quick lookup
        await assessments.create_index("contactInfo.email")

        # Index on status for filtering
        await assessments.create_index("status")

        # Index on qualificationStatus for reporting
        await assessments.create_index("qualificationStatus")

        # Compound index for date range queries
        await assessments.create_index([("createdAt", -1), ("status", 1)])

        # Index on completedAt for reporting
        await assessments.create_index("completedAt")

        # TTL index for auto-deleting old drafts (90 days)
        await assessments.create_index(
            "updatedAt",
            expireAfterSeconds=7776000,  # 90 days
            partialFilterExpression={"status": "draft"}
        )

        # ====================================================================
        # LEADS COLLECTION INDEXES
        # ====================================================================
        leads = db["leads"]

        # Unique index on leadId
        await leads.create_index("leadId", unique=True)

        # Index on email for quick lookup
        await leads.create_index("email")

        # Index on status for filtering
        await leads.create_index("status")

        # Index on assessmentId for linking
        await leads.create_index("assessmentId")

        # Index on followUpDate for task management
        await leads.create_index("followUpDate")

        # Index on discoveryCallScheduled for filtering
        await leads.create_index("discoveryCallScheduled")

        # Compound index for lead pipeline queries
        await leads.create_index([("status", 1), ("createdAt", -1)])

        # ====================================================================
        # EMAIL_LOGS COLLECTION INDEXES
        # ====================================================================
        email_logs = db["email_logs"]

        # Index on messageId
        await email_logs.create_index("messageId", unique=True)

        # Index on recipient email
        await email_logs.create_index("recipientEmail")

        # Index on assessmentId
        await email_logs.create_index("assessmentId")

        # Index on status
        await email_logs.create_index("status")

        # Compound index for date range queries
        await email_logs.create_index([("createdAt", -1), ("status", 1)])

        # TTL index for auto-deleting old email logs (1 year)
        await email_logs.create_index(
            "createdAt",
            expireAfterSeconds=31536000  # 365 days
        )

        logger.info("✅ Database indexes created successfully")

    except Exception as e:
        logger.error(f"❌ Failed to create indexes: {str(e)}")
        raise
