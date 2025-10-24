# API Endpoints Documentation

Complete API specification for the Primary Cell Assessment backend.

**Base URL:** `https://your-app.emergent.sh` (or configured `VITE_API_BASE_URL`)

---

## Table of Contents

1. [Health Check](#health-check)
2. [Assessment Endpoints](#assessment-endpoints)
3. [Email Endpoints](#email-endpoints)
4. [Error Handling](#error-handling)
5. [Rate Limiting](#rate-limiting)

---

## Authentication

Currently, the API does not require authentication for public-facing assessment endpoints. All endpoints are publicly accessible.

**Future Enhancement:** Add API key authentication for programmatic access.

---

## Health Check

### GET /health

Health check endpoint to verify API availability.

**Request:**
```http
GET /health HTTP/1.1
Host: your-app.emergent.sh
```

**Response (200 OK):**
```json
{
  "status": "healthy",
  "version": "1.0.0",
  "timestamp": "2025-01-15T10:30:00Z"
}
```

**Response (503 Service Unavailable):**
```json
{
  "status": "unhealthy",
  "error": "Database connection failed",
  "timestamp": "2025-01-15T10:30:00Z"
}
```

---

## Assessment Endpoints

### POST /api/assessment/submit

Submit a completed assessment with contact information.

**Request Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "assessment": {
    "conditions": ["Chronic Back Pain", "Joint Pain"],
    "sensations": ["Sharp", "Aching", "Stiffness"],
    "duration": "2-to-5-years",
    "intensity": 7,
    "previousTreatments": ["Physical Therapy", "Pain Medication"],
    "hasBudget": true,
    "budgetRange": "15k-30k",
    "urgency": "within-month",
    "activityImpact": "significant",
    "goals": "Return to running and reduce daily pain"
  },
  "contactInfo": {
    "name": "John Doe",
    "email": "john.doe@example.com",
    "phone": "+1-555-123-4567"
  },
  "leadSource": "website",
  "metadata": {
    "userAgent": "Mozilla/5.0...",
    "referrer": "https://google.com",
    "timestamp": "2025-01-15T10:30:00Z"
  }
}
```

**Field Validation:**

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| `assessment.conditions` | `string[]` | Yes | Min 1 item |
| `assessment.sensations` | `string[]` | Yes | Min 1 item |
| `assessment.intensity` | `number` | No | 1-10 |
| `contactInfo.name` | `string` | Yes | 2-100 characters |
| `contactInfo.email` | `string` | Yes | Valid email format |
| `contactInfo.phone` | `string` | No | Valid phone format |

**Response (200 OK):**
```json
{
  "success": true,
  "assessmentId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "leadId": "lead_xyz789abc123"
}
```

**Response (400 Bad Request - Validation Error):**
```json
{
  "success": false,
  "error": "Please provide a valid email address",
  "code": "INVALID_EMAIL",
  "details": {
    "field": "contactInfo.email",
    "value": "invalid-email"
  }
}
```

**Response (500 Internal Server Error):**
```json
{
  "success": false,
  "error": "Failed to save assessment. Please try again.",
  "code": "SERVER_ERROR"
}
```

**Business Logic:**

1. Validate all required fields
2. Generate unique `assessmentId` (UUID)
3. Determine qualification status based on:
   - Budget availability (`hasBudget`)
   - Urgency level
   - Treatment history
4. Save assessment to MongoDB
5. Create lead record
6. Return IDs for follow-up operations

**Qualification Rules:**

```typescript
// Automatically qualified if:
- hasBudget === true
- budgetRange in ['15k-30k', 'over-30k']
- urgency in ['immediate', 'within-month']

// Pending review if:
- hasBudget === true && budgetRange === '5k-15k'
- urgency === 'few-months'

// Disqualified if:
- hasBudget === false
- budgetRange === 'under-5k'
- urgency === 'exploring'
```

---

### POST /api/assessment/save-progress

Auto-save assessment progress (for incomplete assessments).

**Request Body:**
```json
{
  "assessmentId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "progress": {
    "conditions": ["Chronic Back Pain"],
    "sensations": ["Sharp", "Aching"],
    "duration": "2-to-5-years"
  },
  "savedAt": "2025-01-15T10:30:00Z"
}
```

**Field Notes:**

- `assessmentId` is optional on first save (will be generated)
- `progress` contains partial `AssessmentResponse` data
- Only saves data provided; does not overwrite missing fields

**Response (200 OK):**
```json
{
  "success": true,
  "assessmentId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
}
```

**Response (400 Bad Request):**
```json
{
  "success": false,
  "error": "Invalid assessment data",
  "code": "VALIDATION_ERROR"
}
```

**Business Logic:**

1. If `assessmentId` provided:
   - Update existing draft assessment
   - Set `status = 'draft'`
   - Update `updatedAt` timestamp
2. If no `assessmentId`:
   - Create new draft assessment
   - Generate `assessmentId`
   - Set `status = 'draft'`
3. Do not create lead record for drafts
4. Auto-delete drafts after 90 days of inactivity

---

## Email Endpoints

### POST /api/email/send-results

Send assessment results to user's email.

**Request Body:**
```json
{
  "email": "john.doe@example.com",
  "assessmentId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "sentAt": "2025-01-15T10:45:00Z"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "messageId": "msg_abc123xyz789"
}
```

**Response (400 Bad Request):**
```json
{
  "success": false,
  "error": "Please provide a valid email address",
  "code": "INVALID_EMAIL"
}
```

**Response (404 Not Found):**
```json
{
  "success": false,
  "error": "Assessment not found",
  "code": "NOT_FOUND"
}
```

**Response (500 Internal Server Error):**
```json
{
  "success": false,
  "error": "Failed to send email. Please try again.",
  "code": "SERVER_ERROR"
}
```

**Business Logic:**

1. Validate email format
2. Lookup assessment by `assessmentId`
3. Generate personalized email content based on:
   - Conditions selected
   - Pain intensity and duration
   - Budget range
   - Qualification status
4. Send email via configured provider (SendGrid, AWS SES, etc.)
5. Log email in `email_logs` collection
6. Return `messageId` for tracking

**Email Template Variables:**

```typescript
{
  recipientName: string;
  conditions: string[];
  intensity: number;
  duration: string;
  qualificationStatus: 'qualified' | 'disqualified' | 'pending';
  nextSteps: string[];
  calendlyUrl?: string;  // If qualified
  resultsUrl: string;    // Link back to results page
}
```

---

## Error Handling

All endpoints follow consistent error response format:

### Error Response Structure

```json
{
  "success": false,
  "error": "Human-readable error message",
  "code": "ERROR_CODE",
  "details": {
    "field": "fieldName",
    "message": "Specific validation error"
  }
}
```

### Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `VALIDATION_ERROR` | 400 | Request validation failed |
| `INVALID_EMAIL` | 400 | Email format invalid |
| `INVALID_PHONE` | 400 | Phone format invalid |
| `NOT_FOUND` | 404 | Resource not found |
| `UNAUTHORIZED` | 401 | Authentication required |
| `RATE_LIMIT` | 429 | Too many requests |
| `SERVER_ERROR` | 500 | Internal server error |
| `NETWORK_ERROR` | 503 | Service unavailable |
| `TIMEOUT_ERROR` | 504 | Request timeout |
| `UNKNOWN_ERROR` | 500 | Unexpected error |

### HTTP Status Codes

- **200 OK** - Request successful
- **400 Bad Request** - Invalid request data
- **401 Unauthorized** - Authentication required (future)
- **404 Not Found** - Resource not found
- **429 Too Many Requests** - Rate limit exceeded
- **500 Internal Server Error** - Server error
- **503 Service Unavailable** - Service temporarily unavailable
- **504 Gateway Timeout** - Request timeout

---

## Rate Limiting

To prevent abuse, the API implements rate limiting:

### Rate Limit Rules

| Endpoint | Limit | Window |
|----------|-------|--------|
| `/api/assessment/submit` | 5 requests | per 15 minutes per IP |
| `/api/assessment/save-progress` | 30 requests | per 15 minutes per IP |
| `/api/email/send-results` | 3 requests | per 15 minutes per IP |
| `/health` | 100 requests | per 1 minute per IP |

### Rate Limit Headers

All responses include rate limit headers:

```http
X-RateLimit-Limit: 5
X-RateLimit-Remaining: 3
X-RateLimit-Reset: 1642252800
```

### Rate Limit Exceeded Response

**Response (429 Too Many Requests):**
```json
{
  "success": false,
  "error": "Too many requests. Please try again later.",
  "code": "RATE_LIMIT",
  "details": {
    "retryAfter": 900,
    "limit": 5,
    "window": "15 minutes"
  }
}
```

---

## CORS Configuration

The API supports Cross-Origin Resource Sharing (CORS) for frontend access.

### CORS Headers

```http
Access-Control-Allow-Origin: https://primarycell.com
Access-Control-Allow-Methods: GET, POST, OPTIONS
Access-Control-Allow-Headers: Content-Type
Access-Control-Max-Age: 86400
```

### Allowed Origins

- Production: `https://primarycell.com`
- Staging: `https://staging.primarycell.com`
- Development: `http://localhost:5173`

---

## Request/Response Examples

### Complete Assessment Submission Flow

**1. Start Assessment (Auto-save progress)**

```bash
curl -X POST https://your-app.emergent.sh/api/assessment/save-progress \
  -H "Content-Type: application/json" \
  -d '{
    "progress": {
      "conditions": ["Chronic Back Pain"],
      "sensations": ["Sharp"]
    }
  }'
```

**Response:**
```json
{
  "success": true,
  "assessmentId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
}
```

**2. Continue Assessment (Update progress)**

```bash
curl -X POST https://your-app.emergent.sh/api/assessment/save-progress \
  -H "Content-Type: application/json" \
  -d '{
    "assessmentId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "progress": {
      "conditions": ["Chronic Back Pain"],
      "sensations": ["Sharp", "Aching"],
      "duration": "2-to-5-years"
    }
  }'
```

**3. Submit Complete Assessment**

```bash
curl -X POST https://your-app.emergent.sh/api/assessment/submit \
  -H "Content-Type: application/json" \
  -d '{
    "assessment": {
      "conditions": ["Chronic Back Pain"],
      "sensations": ["Sharp", "Aching"],
      "duration": "2-to-5-years",
      "intensity": 7,
      "hasBudget": true,
      "budgetRange": "15k-30k"
    },
    "contactInfo": {
      "name": "John Doe",
      "email": "john.doe@example.com"
    }
  }'
```

**4. Email Results**

```bash
curl -X POST https://your-app.emergent.sh/api/email/send-results \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john.doe@example.com",
    "assessmentId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
  }'
```

---

## Security Considerations

### Input Validation

All endpoints validate input to prevent:
- SQL/NoSQL injection
- XSS attacks
- CSRF attacks (via SameSite cookies)
- Oversized payloads (max 1MB)

### Data Sanitization

- Email addresses validated with regex
- Phone numbers sanitized before storage
- Free-text fields (goals, notes) sanitized to prevent XSS

### PII Protection

- Never log PII (name, email, phone) in application logs
- Use sanitized logging for debugging
- Encrypt PII at rest in database
- Use HTTPS for all API communication

### Rate Limiting

- Prevents brute force attacks
- Prevents resource exhaustion
- Per-IP and per-endpoint limits

---

## Testing Endpoints

### Using cURL

```bash
# Health check
curl https://your-app.emergent.sh/health

# Submit assessment (replace with actual data)
curl -X POST https://your-app.emergent.sh/api/assessment/submit \
  -H "Content-Type: application/json" \
  -d @test-assessment.json

# Send email results
curl -X POST https://your-app.emergent.sh/api/email/send-results \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","assessmentId":"test-id"}'
```

### Using Postman

Import the following collection to test all endpoints:

**Collection JSON:** (See `docs/backend/postman-collection.json`)

---

## Monitoring and Observability

### Health Metrics

Monitor the following metrics:
- Response time (p50, p95, p99)
- Error rate by endpoint
- Request volume by endpoint
- Database connection pool utilization

### Logging

All API requests logged with:
- Timestamp
- HTTP method and path
- Response status code
- Response time (ms)
- IP address (hashed for privacy)
- Error details (if applicable)

**Log Format:**
```json
{
  "timestamp": "2025-01-15T10:30:00Z",
  "method": "POST",
  "path": "/api/assessment/submit",
  "status": 200,
  "duration": 145,
  "ip_hash": "abc123...",
  "user_agent": "Mozilla/5.0..."
}
```

### Alerting

Set up alerts for:
- Error rate > 5%
- Response time p95 > 2 seconds
- Database connection failures
- Rate limit exceeded > 100/hour

---

## Changelog

### v1.0.0 (2025-01-15)
- Initial API release
- Assessment submission endpoint
- Auto-save progress endpoint
- Email results endpoint
- Health check endpoint
