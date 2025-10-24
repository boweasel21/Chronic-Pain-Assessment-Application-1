"""
Email router - handles sending assessment results via email
"""

from fastapi import APIRouter, HTTPException
from datetime import datetime
import uuid

from ..models import (
    SendEmailRequest,
    SendEmailResponse,
    EmailLogDocument,
    EmailStatus,
    EmailType,
)
from ..database import get_database
from ..services.email_service import send_assessment_results_email
from ..config import settings

router = APIRouter()


@router.post("/send-results", response_model=SendEmailResponse)
async def send_results(request: SendEmailRequest):
    """
    Send assessment results to user's email.

    This endpoint:
    1. Validates the email and assessment ID
    2. Retrieves the assessment from the database
    3. Generates personalized email content
    4. Sends email via configured provider (SendGrid, AWS SES, etc.)
    5. Logs the email in the database

    Args:
        request: Email address and assessment ID

    Returns:
        SendEmailResponse: Message ID for tracking

    Raises:
        HTTPException: If validation fails or email sending fails
    """

    # Check if email feature is enabled
    if not settings.ENABLE_EMAIL_RESULTS:
        raise HTTPException(
            status_code=503,
            detail={
                "success": False,
                "error": "Email functionality is currently disabled",
                "code": "SERVICE_UNAVAILABLE",
            }
        )

    try:
        db = await get_database()

        # Retrieve assessment from database
        assessment = await db.assessments.find_one(
            {"assessmentId": request.assessmentId}
        )

        if not assessment:
            raise HTTPException(
                status_code=404,
                detail={
                    "success": False,
                    "error": "Assessment not found",
                    "code": "NOT_FOUND",
                }
            )

        # Generate unique message ID
        message_id = f"msg_{uuid.uuid4().hex[:12]}"

        # Send email via service
        try:
            provider_message_id = await send_assessment_results_email(
                recipient_email=request.email,
                recipient_name=assessment.get("contactInfo", {}).get("name", ""),
                assessment_data=assessment,
            )

            email_status = EmailStatus.SENT

        except Exception as email_error:
            # Log failed email attempt
            email_status = EmailStatus.FAILED
            provider_message_id = None

        # Log email in database
        email_log = EmailLogDocument(
            messageId=message_id,
            recipientEmail=request.email,
            recipientName=assessment.get("contactInfo", {}).get("name"),
            subject="Your Primary Cell Assessment Results",
            emailType=EmailType.RESULTS,
            assessmentId=request.assessmentId,
            leadId=assessment.get("leadId"),
            status=email_status,
            sentAt=datetime.utcnow() if email_status == EmailStatus.SENT else None,
            provider=settings.EMAIL_PROVIDER,
            providerMessageId=provider_message_id,
            error={"message": str(email_error)} if email_status == EmailStatus.FAILED else None,
        )

        await db.email_logs.insert_one(email_log.model_dump(by_alias=True))

        if email_status == EmailStatus.FAILED:
            raise HTTPException(
                status_code=500,
                detail={
                    "success": False,
                    "error": "Failed to send email. Please try again.",
                    "code": "SERVER_ERROR",
                }
            )

        return SendEmailResponse(
            success=True,
            messageId=message_id,
        )

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail={
                "success": False,
                "error": "An unexpected error occurred. Please try again.",
                "code": "SERVER_ERROR",
            }
        )
