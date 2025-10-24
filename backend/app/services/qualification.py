"""
Lead qualification service
Determines if a lead is qualified based on assessment responses
"""

from typing import Optional
from ..models import QualificationStatus


def determine_qualification_status(
    has_budget: Optional[bool],
    budget_range: Optional[str],
    urgency: Optional[str],
) -> QualificationStatus:
    """
    Determine lead qualification status based on assessment responses.

    Qualification Rules:
    - QUALIFIED: Has budget AND (budget >= $15k OR urgency is immediate/within-month)
    - DISQUALIFIED: No budget OR budget < $5k
    - PENDING: All other cases

    Args:
        has_budget: Whether user has budget for treatment
        budget_range: Budget range selection
        urgency: Treatment urgency level

    Returns:
        QualificationStatus: Qualified, disqualified, or pending
    """

    # Disqualified if no budget
    if has_budget is False:
        return QualificationStatus.DISQUALIFIED

    # Disqualified if budget is under $5k
    if budget_range == "under-5k":
        return QualificationStatus.DISQUALIFIED

    # Qualified if budget is $15k+ or urgency is high
    if budget_range in ["15k-30k", "over-30k"]:
        return QualificationStatus.QUALIFIED

    if urgency in ["immediate", "within-month"]:
        return QualificationStatus.QUALIFIED

    # Pending review for mid-range budget or mid-urgency
    if budget_range == "5k-15k" or urgency == "few-months":
        return QualificationStatus.PENDING

    # Default to pending
    return QualificationStatus.PENDING


def get_disqualification_reason(
    has_budget: Optional[bool],
    budget_range: Optional[str],
    urgency: Optional[str],
) -> Optional[str]:
    """
    Get human-readable disqualification reason.

    Args:
        has_budget: Whether user has budget for treatment
        budget_range: Budget range selection
        urgency: Treatment urgency level

    Returns:
        str: Disqualification reason or None if not disqualified
    """

    if has_budget is False:
        return "No budget allocated for treatment"

    if budget_range == "under-5k":
        return "Budget below minimum treatment cost"

    return None
