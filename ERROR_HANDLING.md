# Error Handling & Environment Validation

This document describes the production-ready error handling and environment validation system implemented in the application.

## Overview

The error handling system provides comprehensive coverage for:

1. **React Rendering Errors** - ErrorBoundary component
2. **Async/Promise Errors** - Global error handlers
3. **Environment Validation** - Startup validation
4. **API Errors** - Integrated error logging
5. **Error Monitoring** - Sentry integration ready

## Architecture

### Error Handling Flow

```
┌─────────────────────────────────────────┐
│         Application Startup             │
│  1. Validate Environment Variables      │
│  2. Initialize Error Monitoring         │
│  3. Setup Global Error Handlers         │
└─────────────────────────────────────────┘
                    │
        ┌───────────┴───────────┐
        │                       │
┌───────▼──────┐      ┌────────▼────────┐
│ React Errors │      │  Async Errors   │
│ (Boundary)   │      │  (Global)       │
└───────┬──────┘      └────────┬────────┘
        │                      │
        └──────────┬───────────┘
                   │
        ┌──────────▼──────────┐
        │   Error Logger      │
        │  - Console (dev)    │
        │  - Sentry (prod)    │
        │  - PII Filtering    │
        └─────────────────────┘
```

## Components

### 1. ErrorBoundary Component

**Location:** `/src/components/ErrorBoundary.tsx`

Catches errors during React rendering, lifecycle methods, and constructors.

#### Features:
- ✅ Catches React rendering errors
- ✅ Displays user-friendly fallback UI
- ✅ Shows detailed errors in development
- ✅ Provides "Try Again" and "Reload" buttons
- ✅ Logs errors to monitoring service
- ❌ Does NOT catch async errors (use global handler)

#### Usage:

```typescript
import { ErrorBoundary } from '@/components/ErrorBoundary';

// Wrap your app or components
<ErrorBoundary>
  <App />
</ErrorBoundary>

// With custom fallback
<ErrorBoundary
  fallback={<CustomErrorUI />}
  onError={(error, errorInfo) => {
    // Custom error handling
  }}
>
  <MyComponent />
</ErrorBoundary>
```

### 2. Error Logger

**Location:** `/src/utils/errorLogger.ts`

Safely logs errors to monitoring services with PII filtering.

#### Features:
- ✅ Production-safe logging (no console in prod)
- ✅ PII/sensitive data filtering
- ✅ Context enrichment
- ✅ Sentry integration ready
- ✅ Environment-aware

#### Usage:

```typescript
import { logError, logWarning, logInfo } from '@/utils/errorLogger';

// Log an error
try {
  // risky operation
} catch (error) {
  logError(error as Error, {
    userId: 'user123',
    action: 'fetchData',
    endpoint: '/api/data',
  });
}

// Log a warning
logWarning('Data sync delayed', {
  retryCount: 3,
  lastAttempt: new Date().toISOString(),
});

// Log info (dev only)
logInfo('Feature flag enabled', {
  feature: 'newUI',
  userId: 'user123',
});
```

#### Sensitive Field Filtering:

The following fields are automatically redacted:
- password
- token, apiKey, api_key
- secret, authorization, auth
- ssn, social_security
- credit_card, creditCard, cvv, pin
- phoneNumber, phone_number, email

### 3. Global Error Handler

**Location:** `/src/utils/errorHandler.ts`

Handles unhandled promise rejections and global JavaScript errors.

#### Features:
- ✅ Catches unhandled promise rejections
- ✅ Catches global JavaScript errors
- ✅ Displays user notifications
- ✅ Prevents duplicate notifications
- ✅ Logs to monitoring service

#### Usage:

```typescript
import { setupGlobalErrorHandlers, withErrorHandling } from '@/utils/errorHandler';

// Setup once at app startup (done in main.tsx)
setupGlobalErrorHandlers();

// Wrap async functions
const handleClick = withErrorHandling(async () => {
  await fetchData();
  await processData();
}, { context: 'buttonClick' });
```

### 4. Environment Validator

**Location:** `/src/utils/environmentValidator.ts`

Validates required environment variables at startup.

#### Features:
- ✅ Validates presence of required variables
- ✅ Validates format (URLs, emails, YouTube IDs, etc.)
- ✅ Production vs Development rules
- ✅ Clear error messages
- ✅ Prevents app start with invalid config

#### Required Variables:

**All Environments:**
- `VITE_API_BASE_URL` - API base URL (validated as URL)
- `VITE_VIDEO_HIGHLIGHTS_ID` - YouTube video ID (11 chars)
- `VITE_VIDEO_DEMO_ID` - YouTube video ID (11 chars)

**Production Only:**
- `VITE_CONTACT_EMAIL` - Support email (validated as email)
- `VITE_CALENDLY_URL` - Calendly URL (validated as Calendly URL)

**Recommended:**
- `VITE_APP_VERSION` - App version
- `VITE_SENTRY_DSN` - Sentry error tracking
- `VITE_PRIVACY_POLICY_URL` - Privacy policy URL

#### Usage:

```typescript
import { validateEnvironment } from '@/utils/environmentValidator';

// Validate (throws EnvironmentValidationError if invalid)
try {
  validateEnvironment();
} catch (error) {
  if (error instanceof EnvironmentValidationError) {
    // Display error to user
    displayValidationError(error);
  }
}
```

### 5. API Utility

**Location:** `/src/utils/api.ts`

Production-ready HTTP client with integrated error logging.

#### Features:
- ✅ Automatic error logging
- ✅ Retry logic for failed requests
- ✅ Timeout handling
- ✅ Request cancellation
- ✅ Type-safe responses

#### Usage:

```typescript
import { get, post, APIError } from '@/utils/api';

// GET request
try {
  const response = await get<UserData>('/api/users/123');
  console.log(response.data);
} catch (error) {
  if (error instanceof APIError) {
    console.error(`API Error: ${error.statusCode}`, error.message);
  }
}

// POST request with retry
const response = await post('/api/submit', data, {
  retries: 3,
  timeout: 10000,
});

// Request cancellation
const controller = createAbortController();
const request = get('/api/data', { signal: controller.signal });
controller.abort(); // Cancel request
```

## Environment Setup

### 1. Copy Environment Template

```bash
cp .env.example .env
```

### 2. Configure Required Variables

Edit `.env` and set:

```env
# REQUIRED - API Configuration
VITE_API_BASE_URL=https://api.primarycell.com

# REQUIRED - Video IDs (11 characters)
VITE_VIDEO_HIGHLIGHTS_ID=dQw4w9WgXcQ
VITE_VIDEO_DEMO_ID=dQw4w9WgXcQ

# REQUIRED (Production) - Contact Info
VITE_CONTACT_EMAIL=support@primarycell.com
VITE_CALENDLY_URL=https://calendly.com/your-team/call

# RECOMMENDED - Error Monitoring
VITE_SENTRY_DSN=https://your-sentry-dsn@sentry.io/project
```

### 3. Validate Configuration

The app will automatically validate on startup. If invalid:

- **Development:** Console warnings + error screen
- **Production:** Error screen prevents app from loading

## Error Monitoring Integration

### Sentry Setup (Optional)

1. **Install Sentry:**

```bash
npm install @sentry/react
```

2. **Configure in `.env`:**

```env
VITE_SENTRY_DSN=https://your-dsn@sentry.io/project
VITE_SENTRY_ENVIRONMENT=production
```

3. **Uncomment Sentry Code:**

The error logger has Sentry integration code commented out. Uncomment in:
- `/src/utils/errorLogger.ts` - `initializeErrorMonitoring()`
- `/src/utils/errorLogger.ts` - `logError()` function

## Testing Error Handling

### Test React Error Boundary

```typescript
// Create a component that throws
const BrokenComponent = () => {
  throw new Error('Test error boundary');
  return <div>This won't render</div>;
};

// Wrap in ErrorBoundary
<ErrorBoundary>
  <BrokenComponent />
</ErrorBoundary>
```

### Test Async Error Handler

```typescript
// Unhandled promise rejection
Promise.reject(new Error('Test async error'));

// Or use withErrorHandling
const buggyFunction = withErrorHandling(async () => {
  throw new Error('Test wrapped error');
});

buggyFunction();
```

### Test Environment Validation

```bash
# Remove required variable
VITE_API_BASE_URL= npm run dev

# Invalid format
VITE_API_BASE_URL=not-a-url npm run dev
```

## Best Practices

### 1. Always Wrap API Calls

```typescript
// ✅ Good
try {
  const response = await get('/api/data');
} catch (error) {
  logError(error as Error, { endpoint: '/api/data' });
  // Handle error
}

// ❌ Bad - unhandled promise rejection
get('/api/data'); // No error handling
```

### 2. Use Error Context

```typescript
// ✅ Good - Provides debugging context
logError(error, {
  userId: currentUser.id,
  action: 'submitForm',
  formData: { /* non-sensitive data */ },
});

// ❌ Bad - No context
logError(error);
```

### 3. Don't Log Sensitive Data

```typescript
// ✅ Good
logError(error, {
  userId: 'user123',
  action: 'login',
});

// ❌ Bad - Logs password
logError(error, {
  password: userPassword, // Will be redacted but still bad practice
  creditCard: '1234-5678-9012-3456', // Will be redacted
});
```

### 4. Set User Context for Better Tracking

```typescript
import { setUserContext } from '@/utils/errorLogger';

// When user logs in
setUserContext('user123', {
  plan: 'premium',
  signupDate: '2024-01-01',
});

// When user logs out
clearUserContext();
```

## Production Checklist

- [ ] `.env` file configured with all required variables
- [ ] Environment validation passing
- [ ] Error boundary wrapping app root
- [ ] Global error handlers initialized
- [ ] Sentry DSN configured (optional but recommended)
- [ ] No console.log in production code
- [ ] API errors logged with context
- [ ] Sensitive data filtered from logs
- [ ] Error UI tested and user-friendly
- [ ] Recovery mechanisms (Try Again) working

## Troubleshooting

### App Won't Start

**Error:** "Missing required environment variables"

**Solution:** Check `.env` file has all required variables from `.env.example`

### Errors Not Logging

**Issue:** Errors not appearing in Sentry

**Check:**
1. `VITE_SENTRY_DSN` is set correctly
2. Sentry code is uncommented in `errorLogger.ts`
3. `@sentry/react` package is installed

### Error Boundary Not Catching Errors

**Remember:** ErrorBoundary only catches:
- ✅ Render errors
- ✅ Lifecycle method errors
- ❌ Event handler errors (use try/catch)
- ❌ Async errors (use global handler)
- ❌ Errors in ErrorBoundary itself

## Support

For questions or issues:
- Check this documentation
- Review code comments in source files
- Contact: support@primarycell.com
