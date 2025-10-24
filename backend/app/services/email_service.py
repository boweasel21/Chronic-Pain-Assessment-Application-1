"""
Email service for sending assessment results
Supports multiple providers: SendGrid, AWS SES
"""

from typing import Optional
import logging

from ..config import settings

logger = logging.getLogger(__name__)


async def send_assessment_results_email(
    recipient_email: str,
    recipient_name: str,
    assessment_data: dict,
) -> str:
    """
    Send personalized assessment results email.

    Args:
        recipient_email: Recipient's email address
        recipient_name: Recipient's name
        assessment_data: Complete assessment data

    Returns:
        str: Provider message ID

    Raises:
        Exception: If email sending fails
    """

    provider = settings.EMAIL_PROVIDER.lower()

    if provider == "sendgrid":
        return await send_via_sendgrid(recipient_email, recipient_name, assessment_data)
    elif provider == "aws-ses":
        return await send_via_aws_ses(recipient_email, recipient_name, assessment_data)
    else:
        raise ValueError(f"Unsupported email provider: {provider}")


async def send_via_sendgrid(
    recipient_email: str,
    recipient_name: str,
    assessment_data: dict,
) -> str:
    """
    Send email via SendGrid.

    Args:
        recipient_email: Recipient's email address
        recipient_name: Recipient's name
        assessment_data: Complete assessment data

    Returns:
        str: SendGrid message ID

    Raises:
        Exception: If sending fails
    """
    try:
        from sendgrid import SendGridAPIClient
        from sendgrid.helpers.mail import Mail, Email, To, Content

        # Prepare email content
        subject = "Your Primary Cell Assessment Results"
        html_content = generate_email_html(recipient_name, assessment_data)

        # Create message
        message = Mail(
            from_email=Email(settings.SENDGRID_FROM_EMAIL, settings.SENDGRID_FROM_NAME),
            to_emails=To(recipient_email, recipient_name),
            subject=subject,
            html_content=Content("text/html", html_content),
        )

        # Send email
        sg = SendGridAPIClient(settings.SENDGRID_API_KEY)
        response = sg.send(message)

        # Extract message ID from response headers
        message_id = response.headers.get("X-Message-Id", "unknown")

        logger.info(f"Email sent via SendGrid: {message_id}")

        return message_id

    except Exception as e:
        logger.error(f"Failed to send email via SendGrid: {str(e)}")
        raise


async def send_via_aws_ses(
    recipient_email: str,
    recipient_name: str,
    assessment_data: dict,
) -> str:
    """
    Send email via AWS SES.

    Args:
        recipient_email: Recipient's email address
        recipient_name: Recipient's name
        assessment_data: Complete assessment data

    Returns:
        str: AWS SES message ID

    Raises:
        Exception: If sending fails
    """
    try:
        import boto3

        # Initialize SES client
        ses = boto3.client(
            'ses',
            region_name=settings.AWS_REGION,
            aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
            aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
        )

        # Prepare email content
        subject = "Your Primary Cell Assessment Results"
        html_body = generate_email_html(recipient_name, assessment_data)

        # Send email
        response = ses.send_email(
            Source=f"{settings.SENDGRID_FROM_NAME} <{settings.SENDGRID_FROM_EMAIL}>",
            Destination={'ToAddresses': [recipient_email]},
            Message={
                'Subject': {'Data': subject},
                'Body': {'Html': {'Data': html_body}},
            }
        )

        message_id = response['MessageId']

        logger.info(f"Email sent via AWS SES: {message_id}")

        return message_id

    except Exception as e:
        logger.error(f"Failed to send email via AWS SES: {str(e)}")
        raise


def generate_email_html(recipient_name: str, assessment_data: dict) -> str:
    """
    Generate personalized HTML email content.

    Args:
        recipient_name: Recipient's name
        assessment_data: Complete assessment data

    Returns:
        str: HTML email content
    """

    conditions = ", ".join(assessment_data.get("conditions", []))
    intensity = assessment_data.get("intensity", "N/A")
    qualification_status = assessment_data.get("qualificationStatus", "pending")

    # Determine next steps based on qualification
    if qualification_status == "qualified":
        next_steps = """
        <h2>Next Steps</h2>
        <ol>
            <li>Schedule your complimentary discovery call</li>
            <li>Speak with a Primary Cell specialist</li>
            <li>Learn about personalized treatment options</li>
        </ol>
        <p>
            <a href="https://calendly.com/primarycell/discovery-call"
               style="background-color: #0066cc; color: white; padding: 12px 24px;
                      text-decoration: none; border-radius: 4px; display: inline-block;">
                Schedule Discovery Call
            </a>
        </p>
        """
    else:
        next_steps = """
        <h2>What's Next?</h2>
        <p>Thank you for completing the assessment. Our team will review your responses
           and reach out within 2-3 business days to discuss potential next steps.</p>
        """

    html = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #0066cc;">Your Primary Cell Assessment Results</h1>

        <p>Dear {recipient_name},</p>

        <p>Thank you for completing the Primary Cell Assessment. Based on your responses,
           here's a summary of what we learned about your chronic pain condition.</p>

        <h2>Assessment Summary</h2>
        <ul>
            <li><strong>Conditions:</strong> {conditions}</li>
            <li><strong>Pain Intensity:</strong> {intensity}/10</li>
        </ul>

        <h2>Understanding Primary Cell Therapy</h2>
        <p>Primary Cell therapy addresses chronic pain at the cellular level, targeting
           the root cause of your symptoms rather than just managing pain.</p>

        {next_steps}

        <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">

        <p style="font-size: 12px; color: #666;">
            If you have any questions, please don't hesitate to reach out to our team at
            <a href="mailto:{settings.SENDGRID_FROM_EMAIL}">{settings.SENDGRID_FROM_EMAIL}</a>
        </p>

        <p style="font-size: 12px; color: #666;">
            &copy; 2025 Primary Cell. All rights reserved.
        </p>
    </body>
    </html>
    """

    return html
