"""
Assessment router - handles assessment submission and progress saving
"""

from fastapi import APIRouter, HTTPException
from datetime import datetime
import uuid

from ..models import (
    SubmitAssessmentRequest,
    SubmitAssessmentResponse,
    SaveProgressRequest,
    SaveProgressResponse,
    AssessmentDocument,
    LeadDocument,
    QualificationStatus,
    AssessmentStatus,
    LeadStatus,
    ApiErrorResponse,
)
from ..database import get_database
from ..services.qualification import determine_qualification_status
from ..utils.sanitizer import sanitize_text

router = APIRouter()


@router.post("/submit", response_model=SubmitAssessmentResponse)
async def submit_assessment(request: SubmitAssessmentRequest):
    """
    Submit a completed assessment with contact information.

    This endpoint:
    1. Validates the assessment data
    2. Determines qualification status based on responses
    3. Saves the assessment to MongoDB
    4. Creates a lead record
    5. Returns assessment and lead IDs

    Args:
        request: Complete assessment data and contact info

    Returns:
        SubmitAssessmentResponse: Assessment and lead IDs

    Raises:
        HTTPException: If validation fails or database error occurs
    """
    try:
        # Generate unique IDs
        assessment_id = str(uuid.uuid4())
        lead_id = f"lead_{uuid.uuid4().hex[:12]}"

        # Determine qualification status
        qualification_status = determine_qualification_status(
            has_budget=request.assessment.hasBudget,
            budget_range=request.assessment.budgetRange,
            urgency=request.assessment.urgency,
        )

        # Sanitize free-text fields
        sanitized_goals = None
        if request.assessment.goals:
            sanitized_goals = sanitize_text(request.assessment.goals)

        # Create assessment document
        assessment_doc = AssessmentDocument(
            assessmentId=assessment_id,
            conditions=request.assessment.conditions,
            sensations=request.assessment.sensations,
            duration=request.assessment.duration,
            intensity=request.assessment.intensity,
            previousTreatments=request.assessment.previousTreatments,
            hasBudget=request.assessment.hasBudget,
            budgetRange=request.assessment.budgetRange,
            urgency=request.assessment.urgency,
            activityImpact=request.assessment.activityImpact,
            goals=sanitized_goals,
            contactInfo=request.contactInfo,
            leadSource=request.leadSource,
            qualificationStatus=qualification_status,
            status=AssessmentStatus.COMPLETED,
            completedAt=datetime.utcnow(),
            metadata=request.metadata,
        )

        # Save to database
        db = await get_database()
        await db.assessments.insert_one(assessment_doc.model_dump(by_alias=True))

        # Create lead document
        lead_doc = LeadDocument(
            leadId=lead_id,
            name=request.contactInfo.name,
            email=request.contactInfo.email,
            phone=request.contactInfo.phone,
            source=request.leadSource,
            assessmentId=assessment_id,
            status=LeadStatus.NEW,
            qualificationStatus=qualification_status,
            assessmentSummary={
                "conditions": request.assessment.conditions,
                "urgency": request.assessment.urgency,
                "budgetRange": request.assessment.budgetRange,
                "intensity": request.assessment.intensity,
            },
        )

        # Save lead to database
        await db.leads.insert_one(lead_doc.model_dump(by_alias=True))

        return SubmitAssessmentResponse(
            success=True,
            assessmentId=assessment_id,
            leadId=lead_id,
        )

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail={
                "success": False,
                "error": "Failed to save assessment. Please try again.",
                "code": "SERVER_ERROR",
            }
        )


@router.post("/save-progress", response_model=SaveProgressResponse)
async def save_progress(request: SaveProgressRequest):
    """
    Save assessment progress for incomplete assessments.

    This endpoint allows users to save their progress and return later.
    Drafts are automatically deleted after 90 days of inactivity.

    Args:
        request: Assessment ID (optional) and partial progress data

    Returns:
        SaveProgressResponse: Assessment ID

    Raises:
        HTTPException: If validation fails or database error occurs
    """
    try:
        db = await get_database()

        # If assessmentId provided, update existing draft
        if request.assessmentId:
            update_result = await db.assessments.update_one(
                {"assessmentId": request.assessmentId, "status": "draft"},
                {
                    "$set": {
                        **request.progress,
                        "updatedAt": datetime.utcnow(),
                    }
                }
            )

            if update_result.matched_count == 0:
                raise HTTPException(
                    status_code=404,
                    detail={
                        "success": False,
                        "error": "Assessment not found",
                        "code": "NOT_FOUND",
                    }
                )

            return SaveProgressResponse(
                success=True,
                assessmentId=request.assessmentId,
            )

        # Otherwise, create new draft
        else:
            assessment_id = str(uuid.uuid4())

            draft_doc = {
                "assessmentId": assessment_id,
                "status": "draft",
                "createdAt": datetime.utcnow(),
                "updatedAt": datetime.utcnow(),
                **request.progress,
            }

            await db.assessments.insert_one(draft_doc)

            return SaveProgressResponse(
                success=True,
                assessmentId=assessment_id,
            )

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail={
                "success": False,
                "error": "Failed to save progress. Please try again.",
                "code": "SERVER_ERROR",
            }
        )
