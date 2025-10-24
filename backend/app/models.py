"""
Pydantic models for request/response validation
"""

from pydantic import BaseModel, Field, EmailStr, field_validator
from typing import Optional, List
from datetime import datetime
from enum import Enum


# ============================================================================
# ENUMS
# ============================================================================

class AssessmentStatus(str, Enum):
    """Assessment status options."""
    COMPLETED = "completed"
    DRAFT = "draft"


class QualificationStatus(str, Enum):
    """Lead qualification status options."""
    QUALIFIED = "qualified"
    DISQUALIFIED = "disqualified"
    PENDING = "pending"


class LeadStatus(str, Enum):
    """Lead status in pipeline."""
    NEW = "new"
    CONTACTED = "contacted"
    QUALIFIED = "qualified"
    DISQUALIFIED = "disqualified"
    CONVERTED = "converted"


class EmailStatus(str, Enum):
    """Email delivery status."""
    QUEUED = "queued"
    SENT = "sent"
    DELIVERED = "delivered"
    BOUNCED = "bounced"
    FAILED = "failed"


class EmailType(str, Enum):
    """Email template types."""
    RESULTS = "results"
    FOLLOW_UP = "follow_up"
    WELCOME = "welcome"
    DISQUALIFICATION = "disqualification"


# ============================================================================
# REQUEST/RESPONSE MODELS
# ============================================================================

class ContactInfo(BaseModel):
    """Contact information."""
    name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    phone: Optional[str] = Field(None, pattern=r"^[\d\s\-\+\(\)]{10,}$")


class AssessmentData(BaseModel):
    """Assessment response data."""
    conditions: List[str] = Field(..., min_length=1)
    sensations: List[str] = Field(..., min_length=1)
    duration: Optional[str] = None
    intensity: Optional[int] = Field(None, ge=1, le=10)
    previousTreatments: Optional[List[str]] = None
    hasBudget: Optional[bool] = None
    budgetRange: Optional[str] = None
    urgency: Optional[str] = None
    activityImpact: Optional[str] = None
    goals: Optional[str] = Field(None, max_length=1000)


class Metadata(BaseModel):
    """Request metadata."""
    userAgent: str
    referrer: str
    timestamp: datetime
    ipAddress: Optional[str] = None
    sessionId: Optional[str] = None


class SubmitAssessmentRequest(BaseModel):
    """Request body for submitting complete assessment."""
    assessment: AssessmentData
    contactInfo: ContactInfo
    leadSource: Optional[str] = Field(default="website")
    metadata: Optional[Metadata] = None


class SubmitAssessmentResponse(BaseModel):
    """Response from assessment submission."""
    success: bool
    assessmentId: str
    leadId: str


class SaveProgressRequest(BaseModel):
    """Request body for saving assessment progress."""
    assessmentId: Optional[str] = None
    progress: dict  # Partial AssessmentData
    savedAt: Optional[datetime] = None


class SaveProgressResponse(BaseModel):
    """Response from save progress."""
    success: bool
    assessmentId: Optional[str] = None


class SendEmailRequest(BaseModel):
    """Request body for sending email results."""
    email: EmailStr
    assessmentId: str
    sentAt: Optional[datetime] = None


class SendEmailResponse(BaseModel):
    """Response from sending email."""
    success: bool
    messageId: str


class ApiErrorResponse(BaseModel):
    """Standard error response."""
    success: bool = False
    error: str
    code: str
    details: Optional[dict] = None


# ============================================================================
# DATABASE MODELS
# ============================================================================

class AssessmentDocument(BaseModel):
    """Assessment document in MongoDB."""
    assessmentId: str
    conditions: List[str]
    sensations: List[str]
    duration: Optional[str] = None
    intensity: Optional[int] = None
    previousTreatments: Optional[List[str]] = None
    hasBudget: Optional[bool] = None
    budgetRange: Optional[str] = None
    urgency: Optional[str] = None
    activityImpact: Optional[str] = None
    goals: Optional[str] = None

    contactInfo: ContactInfo

    leadSource: str
    qualificationStatus: QualificationStatus
    disqualificationReason: Optional[str] = None

    status: AssessmentStatus
    startedAt: Optional[datetime] = None
    completedAt: Optional[datetime] = None

    metadata: Optional[Metadata] = None

    createdAt: datetime = Field(default_factory=datetime.utcnow)
    updatedAt: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }


class LeadDocument(BaseModel):
    """Lead document in MongoDB."""
    leadId: str
    name: str
    email: EmailStr
    phone: Optional[str] = None

    source: str
    assessmentId: Optional[str] = None

    status: LeadStatus
    qualificationStatus: QualificationStatus
    disqualificationReason: Optional[str] = None

    assessmentSummary: Optional[dict] = None

    discoveryCallScheduled: bool = False
    discoveryCallDate: Optional[datetime] = None
    followUpDate: Optional[datetime] = None
    lastContacted: Optional[datetime] = None
    contactAttempts: int = 0

    notes: List[str] = Field(default_factory=list)
    tags: List[str] = Field(default_factory=list)

    crmSyncStatus: Optional[str] = None
    crmLeadId: Optional[str] = None
    crmLastSyncedAt: Optional[datetime] = None

    createdAt: datetime = Field(default_factory=datetime.utcnow)
    updatedAt: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }


class EmailLogDocument(BaseModel):
    """Email log document in MongoDB."""
    messageId: str
    recipientEmail: EmailStr
    recipientName: Optional[str] = None

    subject: str
    emailType: EmailType
    templateId: Optional[str] = None

    assessmentId: Optional[str] = None
    leadId: Optional[str] = None

    status: EmailStatus
    sentAt: Optional[datetime] = None
    deliveredAt: Optional[datetime] = None
    openedAt: Optional[datetime] = None
    clickedAt: Optional[datetime] = None

    error: Optional[dict] = None

    provider: str
    providerMessageId: Optional[str] = None

    createdAt: datetime = Field(default_factory=datetime.utcnow)
    updatedAt: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }


# ============================================================================
# VALIDATION HELPERS
# ============================================================================

def validate_email(email: str) -> bool:
    """Validate email format."""
    import re
    pattern = r"^[^\s@]+@[^\s@]+\.[^\s@]+$"
    return bool(re.match(pattern, email))


def validate_phone(phone: str) -> bool:
    """Validate phone format."""
    import re
    pattern = r"^[\d\s\-\+\(\)]{10,}$"
    return bool(re.match(pattern, phone))
