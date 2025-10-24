# Integration Setup Guide

Step-by-step guide for integrating the frontend with the Emergent.sh backend.

---

## Quick Start

### 1. Backend Setup (5 minutes)

```bash
cd backend

# Install dependencies
pip install -r requirements.txt

# Copy environment template
cp .env.example .env

# Edit .env with your MongoDB URI
nano .env

# Run backend locally
uvicorn main:app --reload
```

Backend will run on `http://localhost:8000`

### 2. Frontend Setup (2 minutes)

```bash
# In project root
cp .env.example .env

# Update frontend .env
nano .env
# Set: VITE_API_BASE_URL=http://localhost:8000

# Install dependencies
npm install

# Run frontend
npm run dev
```

Frontend will run on `http://localhost:5173`

### 3. Test Integration

Open `http://localhost:5173` and complete an assessment.

---

## API Integration in Frontend

### Using the API Service

The frontend includes a complete API service in `/utils/api.ts`. Here's how to use it:

#### Submit Complete Assessment

```typescript
import { submitAssessment } from '@/utils/api';
import type { AssessmentResponse } from '@/types';

// When user completes assessment
const handleSubmit = async (
  assessment: AssessmentResponse,
  contactInfo: { name: string; email: string; phone?: string }
) => {
  const response = await submitAssessment({
    assessment,
    contactInfo,
    leadSource: 'website',
  });

  if (response.success) {
    const { assessmentId, leadId } = response.data!;
    // Redirect to results page
    navigate(`/results?id=${assessmentId}`);
  } else {
    // Show error message
    setError(response.error || 'Failed to submit assessment');
  }
};
```

#### Auto-Save Progress

```typescript
import { saveProgress } from '@/utils/api';

// Auto-save every 30 seconds
useEffect(() => {
  const interval = setInterval(async () => {
    if (assessmentId && hasUnsavedChanges) {
      const response = await saveProgress({
        assessmentId,
        progress: currentResponses,
      });

      if (response.success) {
        setHasUnsavedChanges(false);
      }
    }
  }, 30000); // 30 seconds

  return () => clearInterval(interval);
}, [assessmentId, hasUnsavedChanges, currentResponses]);
```

#### Send Email Results

```typescript
import { sendEmailResults } from '@/utils/api';

const handleEmailResults = async (email: string, assessmentId: string) => {
  const response = await sendEmailResults(email, assessmentId);

  if (response.success) {
    showNotification('Results sent to your email!');
  } else {
    showError(response.error || 'Failed to send email');
  }
};
```

---

## Error Handling

The API service includes comprehensive error handling:

```typescript
// All API functions return consistent response format
type ApiResponse<T> = {
  success: boolean;
  data?: T;
  error?: string;
  code?: ApiErrorCode;
};

// Error codes
enum ApiErrorCode {
  NETWORK_ERROR = 'NETWORK_ERROR',
  TIMEOUT_ERROR = 'TIMEOUT_ERROR',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  INVALID_EMAIL = 'INVALID_EMAIL',
  INVALID_PHONE = 'INVALID_PHONE',
  SERVER_ERROR = 'SERVER_ERROR',
  NOT_FOUND = 'NOT_FOUND',
  RATE_LIMIT = 'RATE_LIMIT',
}
```

### Example Error Handling

```typescript
const response = await submitAssessment(payload);

if (!response.success) {
  switch (response.code) {
    case 'INVALID_EMAIL':
      setEmailError('Please enter a valid email address');
      break;
    case 'NETWORK_ERROR':
      setError('Network error. Please check your connection.');
      break;
    case 'RATE_LIMIT':
      setError('Too many requests. Please try again in a few minutes.');
      break;
    default:
      setError(response.error || 'An unexpected error occurred');
  }
}
```

---

## Retry Logic

The API service includes automatic retry with exponential backoff for:
- Network errors
- Timeout errors
- Server errors (5xx)

Configuration:
```typescript
// Default retry config
{
  maxRetries: 3,        // Max 3 retry attempts
  baseDelay: 1000,      // Start with 1 second delay
  maxDelay: 10000,      // Max 10 second delay
}
```

Client errors (4xx) are NOT retried as they require user action.

---

## Timeout Handling

All API requests timeout after 30 seconds (configurable via `VITE_API_TIMEOUT`).

```typescript
// Configure timeout in .env
VITE_API_TIMEOUT=30000  // 30 seconds
```

When a timeout occurs:
1. Request is aborted
2. Error with code `TIMEOUT_ERROR` is returned
3. User-friendly message shown
4. Automatic retry attempted (for retryable endpoints)

---

## Request Logging

The API service logs all requests in development mode WITHOUT PII:

```typescript
// Example log output (dev only)
[API Request] {
  method: 'POST',
  url: '/api/assessment/submit',
  timestamp: '2025-01-15T10:30:00Z',
  payload: {
    assessment: { conditions: [...], ... },
    contactInfo: '[REDACTED]',  // PII removed
  }
}

[API Response] {
  method: 'POST',
  url: '/api/assessment/submit',
  status: 200,
  success: true,
  timestamp: '2025-01-15T10:30:01Z'
}
```

PII fields automatically redacted:
- `name`
- `email`
- `phone`
- `contactInfo`

---

## Type Safety

All API functions are fully typed:

```typescript
// Request types
interface AssessmentSubmissionPayload {
  assessment: AssessmentResponse;
  contactInfo: ContactInfo;
  leadSource?: string;
  metadata?: {
    userAgent?: string;
    referrer?: string;
    timestamp: string;
  };
}

// Response types
interface SubmitAssessmentResponse {
  assessmentId: string;
  leadId: string;
  success: boolean;
}

// API function
async function submitAssessment(
  payload: AssessmentSubmissionPayload
): Promise<ApiResponse<SubmitAssessmentResponse>>
```

TypeScript will catch type errors at compile time.

---

## Environment Configuration

### Development

```bash
# .env (frontend)
VITE_API_BASE_URL=http://localhost:8000
VITE_API_TIMEOUT=30000
VITE_ENABLE_DEBUG_MODE=true
```

### Staging

```bash
# .env (frontend)
VITE_API_BASE_URL=https://staging-api.primarycell.com
VITE_API_TIMEOUT=30000
VITE_ENABLE_DEBUG_MODE=false
```

### Production

```bash
# .env (frontend)
VITE_API_BASE_URL=https://api.primarycell.com
VITE_API_TIMEOUT=30000
VITE_ENABLE_DEBUG_MODE=false
VITE_ENABLE_ANALYTICS=true
```

---

## Testing API Integration

### 1. Manual Testing

```bash
# Start backend
cd backend
uvicorn main:app --reload

# Start frontend
npm run dev

# Test in browser
open http://localhost:5173
```

### 2. API Testing with cURL

```bash
# Health check
curl http://localhost:8000/health

# Submit assessment
curl -X POST http://localhost:8000/api/assessment/submit \
  -H "Content-Type: application/json" \
  -d '{
    "assessment": {
      "conditions": ["Test"],
      "sensations": ["Test"]
    },
    "contactInfo": {
      "name": "Test User",
      "email": "test@example.com"
    }
  }'

# Save progress
curl -X POST http://localhost:8000/api/assessment/save-progress \
  -H "Content-Type: application/json" \
  -d '{
    "progress": {
      "conditions": ["Test"]
    }
  }'
```

### 3. Automated Testing

Create `tests/api-integration.test.ts`:

```typescript
import { describe, it, expect } from 'vitest';
import { submitAssessment, saveProgress } from '@/utils/api';

describe('API Integration', () => {
  it('should submit assessment successfully', async () => {
    const response = await submitAssessment({
      assessment: {
        conditions: ['Test'],
        sensations: ['Test'],
      },
      contactInfo: {
        name: 'Test User',
        email: 'test@example.com',
      },
    });

    expect(response.success).toBe(true);
    expect(response.data?.assessmentId).toBeDefined();
  });

  it('should save progress successfully', async () => {
    const response = await saveProgress({
      progress: {
        conditions: ['Test'],
      },
    });

    expect(response.success).toBe(true);
  });
});
```

---

## Common Integration Issues

### Issue: CORS Errors

**Error:** `Access to fetch blocked by CORS policy`

**Solution:**
1. Add frontend URL to backend CORS_ORIGINS
2. Ensure both use same protocol (http or https)
3. Check for typos in URLs

```python
# backend/app/config.py
CORS_ORIGINS = [
    "http://localhost:5173",  # Add your frontend URL
    "https://primarycell.com",
]
```

### Issue: API URL Not Found

**Error:** `404 Not Found`

**Solution:**
1. Verify `VITE_API_BASE_URL` in frontend .env
2. Check backend is running
3. Verify endpoint paths match API documentation

### Issue: Validation Errors

**Error:** `VALIDATION_ERROR` or `INVALID_EMAIL`

**Solution:**
1. Check request payload matches API schema
2. Validate email format client-side first
3. Review validation rules in API documentation

### Issue: Network Errors

**Error:** `NETWORK_ERROR`

**Solution:**
1. Check backend is running and accessible
2. Verify firewall settings
3. Check network connectivity
4. Review browser console for CORS errors

---

## Monitoring Integration

### Frontend Monitoring

Add console logging in development:

```typescript
if (import.meta.env.DEV) {
  console.log('API Request:', {
    endpoint: '/api/assessment/submit',
    payload: sanitizedPayload,
  });
}
```

### Backend Monitoring

View backend logs:

```bash
# Local development
uvicorn main:app --reload --log-level debug

# Production (Emergent.sh)
emergent logs --tail --app=your-app-name
```

---

## Next Steps

1. ✅ Complete local setup
2. ✅ Test all API endpoints
3. ✅ Configure environment variables
4. ✅ Deploy to staging
5. ✅ Test in staging environment
6. ✅ Deploy to production
7. ✅ Monitor and maintain

Refer to [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for production deployment steps.
