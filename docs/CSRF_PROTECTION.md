# CSRF Protection Documentation

## Table of Contents

1. [Overview](#overview)
2. [CSRF Protection Strategy](#csrf-protection-strategy)
3. [Architecture](#architecture)
4. [Token Lifecycle](#token-lifecycle)
5. [Implementation Details](#implementation-details)
6. [Integration Examples](#integration-examples)
7. [Error Handling](#error-handling)
8. [Security Best Practices](#security-best-practices)
9. [Testing](#testing)
10. [Troubleshooting](#troubleshooting)

---

## Overview

This application implements comprehensive Cross-Site Request Forgery (CSRF) protection to prevent unauthorized state-changing requests. CSRF attacks trick authenticated users into executing unwanted actions on a web application where they're authenticated.

### What is CSRF?

CSRF is an attack that forces an authenticated user to execute unwanted actions. For example:
- An attacker sends a malicious link to a logged-in user
- When clicked, the link triggers an unintended action (e.g., transfer money, change email)
- The action succeeds because the user's session cookie is automatically sent

### Our Protection

We implement the **Synchronizer Token Pattern**:
1. Server generates a unique, unpredictable token
2. Client stores token in memory (not cookies or localStorage)
3. Client includes token in all state-changing requests
4. Server validates token before processing requests

---

## CSRF Protection Strategy

### Double Submit Cookie Pattern

Our implementation uses a combination of approaches:

1. **Token Generation**: Server generates CSRF tokens via `GET /api/csrf-token`
2. **In-Memory Storage**: Tokens stored in JavaScript memory (not localStorage)
3. **Header Transmission**: Tokens sent in `X-CSRF-Token` header
4. **Server Validation**: Server validates token on all POST/PUT/DELETE/PATCH requests
5. **Automatic Refresh**: Tokens automatically refreshed on 403 responses

### Why In-Memory Storage?

**Security Benefits**:
- Not vulnerable to XSS attacks reading localStorage
- Cleared automatically on page refresh/close
- No persistence across sessions
- Cannot be stolen by malicious scripts reading storage

**Trade-offs**:
- Token lost on page refresh (acceptable - user re-authenticates)
- Must be fetched on every app initialization

---

## Architecture

### Component Overview

```
┌─────────────────────────────────────────────────────────┐
│                        App.tsx                           │
│                    (useCsrfInit)                         │
│              Initializes CSRF on mount                   │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│                   src/utils/csrfToken.ts                 │
│                                                           │
│  • fetchCsrfToken() - Fetch from server                  │
│  • setCsrfToken() - Store in memory                      │
│  • getCsrfToken() - Retrieve token                       │
│  • clearCsrfToken() - Clear on logout                    │
│  • refreshCsrfToken() - Force refresh                    │
│                                                           │
│  Storage: In-memory closure (private)                    │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│                    utils/api.ts                          │
│                                                           │
│  • apiFetch() - Automatically adds CSRF header           │
│  • Handles 403 responses with token refresh              │
│  • Retries failed requests with new token                │
│  • Validates token before state-changing requests        │
└─────────────────────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│                 Backend API Server                       │
│                                                           │
│  GET  /api/csrf-token  → Returns { token, expiresAt }   │
│  POST /api/assessment/submit  → Validates X-CSRF-Token   │
│  POST /api/assessment/save-progress → Validates token    │
│  ...all state-changing endpoints                         │
└─────────────────────────────────────────────────────────┘
```

### File Structure

```
/src
├── App.tsx                    # Initializes CSRF with useCsrfInit()
├── utils/
│   └── csrfToken.ts          # Core CSRF token management
├── hooks/
│   └── useCsrf.ts            # React hooks for CSRF
/utils
└── api.ts                     # API service with CSRF integration
/docs
└── CSRF_PROTECTION.md         # This file
```

---

## Token Lifecycle

### 1. Application Initialization

```typescript
// App.tsx
const App: React.FC = () => {
  useCsrfInit(); // Fetches CSRF token on mount
  return <YourApp />;
};
```

**Flow**:
1. App component mounts
2. `useCsrfInit()` hook executes
3. Hook calls `fetchCsrfToken()`
4. Token fetched from `GET /api/csrf-token`
5. Token stored in memory
6. App ready for API calls

### 2. API Request with CSRF Token

```typescript
// Any component making API call
const handleSubmit = async (data) => {
  const response = await submitAssessment(data);
  // CSRF token automatically included
};
```

**Flow**:
1. Component calls API function (e.g., `submitAssessment()`)
2. API function calls `apiFetch()`
3. `apiFetch()` checks if request needs CSRF (POST/PUT/DELETE/PATCH)
4. Gets token from memory via `getCsrfToken()`
5. Adds token to `X-CSRF-Token` header
6. Sends request with token
7. Server validates token
8. Request processed

### 3. Token Expiration & Refresh

```typescript
// Automatic refresh on 403 Forbidden
if (response.status === 403 && isCsrfError) {
  await refreshCsrfToken();
  // Retry request with new token
}
```

**Flow**:
1. API request returns 403 Forbidden
2. `apiFetch()` detects CSRF error
3. Calls `refreshCsrfToken()`
4. Old token cleared from memory
5. New token fetched from server
6. New token stored in memory
7. Original request retried with new token

### 4. Logout / Session Termination

```typescript
// On user logout
import { clearSecurityTokens } from '@/utils/api';

const handleLogout = () => {
  clearSecurityTokens(); // Clears CSRF token
  // Clear other session data...
};
```

**Flow**:
1. User logs out
2. `clearSecurityTokens()` called
3. CSRF token cleared from memory
4. User redirected to login
5. New token fetched on next login

### Token Expiration Timeline

```
Time:     0min          30min         55min         60min
          │              │             │             │
Token:    [Generated]    [Valid]       [Expiring]    [Expired]
          │              │             │             │
Action:   Stored         In use        Refresh       New token
          in memory                    triggered     fetched
```

Default expiration: **1 hour** (configurable by server)

---

## Implementation Details

### Core Files

#### 1. `/src/utils/csrfToken.ts` - Token Management

**Key Functions**:

```typescript
/**
 * Fetch CSRF token from server
 */
export const fetchCsrfToken = async (): Promise<string>

/**
 * Store CSRF token in memory
 */
export const setCsrfToken = (token: string, expiresAt?: string): void

/**
 * Get current CSRF token
 */
export const getCsrfToken = (): string | null

/**
 * Clear CSRF token (on logout)
 */
export const clearCsrfToken = (): void

/**
 * Refresh CSRF token (force new fetch)
 */
export const refreshCsrfToken = async (): Promise<string>

/**
 * Get token expiration info
 */
export const getTokenInfo = (): TokenInfo | null
```

**Storage Mechanism**:

```typescript
// In-memory storage using closure
let csrfToken: string | null = null;
let tokenExpiresAt: Date | null = null;
let tokenFetchPromise: Promise<string> | null = null;
```

**Why Closure?**
- Variables are private to the module
- Cannot be accessed directly from outside
- More secure than `window.csrfToken` or localStorage
- Automatically garbage collected when module unloads

#### 2. `/utils/api.ts` - API Integration

**CSRF Integration Points**:

```typescript
// 1. Check if method requires CSRF
const requiresCsrfToken = (method: string): boolean => {
  return ['POST', 'PUT', 'DELETE', 'PATCH'].includes(method);
};

// 2. Get token for request
const getCsrfTokenForRequest = async (): Promise<string | null> => {
  let token = getCsrfToken();
  if (!token) {
    token = await fetchCsrfToken();
  }
  return token;
};

// 3. Add token to headers
if (requiresCsrfToken(options.method)) {
  const csrfToken = await getCsrfTokenForRequest();
  if (csrfToken) {
    headers['X-CSRF-Token'] = csrfToken;
  }
}

// 4. Handle 403 with token refresh
if (response.status === 403 && isCsrfError) {
  await refreshCsrfToken();
  // Retry request
}
```

#### 3. `/src/hooks/useCsrf.ts` - React Integration

**Available Hooks**:

```typescript
// Full-featured hook with state
const { isLoading, isReady, error, token, refresh, clear } = useCsrf({
  autoFetch: true,
  autoRefresh: false,
  refreshInterval: 300000,
});

// Simple initialization hook (recommended for App.tsx)
useCsrfInit();

// Status check hook (read-only)
const { hasToken, expiresAt, isExpired } = useCsrfStatus();
```

---

## Integration Examples

### Example 1: Basic App Initialization

```typescript
// src/App.tsx
import React from 'react';
import { useCsrfInit } from './hooks/useCsrf';

const App: React.FC = () => {
  // Initialize CSRF protection
  useCsrfInit();

  return (
    <BrowserRouter>
      <AssessmentProvider>
        <Routes>
          {/* Your routes */}
        </Routes>
      </AssessmentProvider>
    </BrowserRouter>
  );
};

export default App;
```

### Example 2: Submitting Assessment with CSRF

```typescript
// src/pages/LeadCapture.tsx
import { submitAssessment } from '@/utils/api';

const LeadCapture: React.FC = () => {
  const handleSubmit = async (contactInfo: ContactInfo) => {
    try {
      // CSRF token automatically included
      const response = await submitAssessment({
        assessment: responses,
        contactInfo,
        leadSource: 'web',
      });

      if (response.success) {
        console.log('Assessment submitted:', response.data);
        navigate('/final-video');
      } else {
        // Handle error (includes CSRF errors)
        setError(response.error || 'Submission failed');
      }
    } catch (error) {
      console.error('Submission error:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
    </form>
  );
};
```

### Example 3: Advanced Hook Usage with Auto-Refresh

```typescript
// src/App.tsx
import { useCsrf } from './hooks/useCsrf';

const App: React.FC = () => {
  const csrf = useCsrf({
    autoFetch: true,
    autoRefresh: true,
    refreshInterval: 300000, // 5 minutes
    onError: (error) => {
      console.error('CSRF initialization failed:', error);
      // Show user notification
    },
  });

  if (csrf.isLoading) {
    return <div>Initializing security...</div>;
  }

  if (csrf.error) {
    return (
      <div>
        Security initialization failed. Please refresh the page.
      </div>
    );
  }

  return <YourApp />;
};
```

### Example 4: Manual Token Refresh

```typescript
// src/components/SecuritySettings.tsx
import { useCsrf } from '@/hooks/useCsrf';

const SecuritySettings: React.FC = () => {
  const { refresh, isLoading, error, expiresAt } = useCsrf({
    autoFetch: false,
  });

  const handleRefresh = async () => {
    try {
      await refresh();
      console.log('Token refreshed successfully');
    } catch (error) {
      console.error('Token refresh failed:', error);
    }
  };

  return (
    <div>
      <h2>Security Settings</h2>
      <p>Token expires: {expiresAt}</p>
      <button onClick={handleRefresh} disabled={isLoading}>
        {isLoading ? 'Refreshing...' : 'Refresh Token'}
      </button>
      {error && <div className="error">{error.message}</div>}
    </div>
  );
};
```

### Example 5: Logout with Token Cleanup

```typescript
// src/components/Header.tsx
import { clearSecurityTokens } from '@/utils/api';
import { useNavigate } from 'react-router-dom';

const Header: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear CSRF token and other security tokens
    clearSecurityTokens();

    // Clear assessment data
    localStorage.removeItem('assessmentData');

    // Redirect to login
    navigate('/');
  };

  return (
    <header>
      <button onClick={handleLogout}>Logout</button>
    </header>
  );
};
```

### Example 6: Status Indicator Component

```typescript
// src/components/CsrfStatusIndicator.tsx
import { useCsrfStatus } from '@/hooks/useCsrf';

const CsrfStatusIndicator: React.FC = () => {
  const { hasToken, expiresAt, timeRemaining, isExpired } = useCsrfStatus();

  if (!hasToken) {
    return <div className="status-warning">⚠️ No security token</div>;
  }

  if (isExpired) {
    return <div className="status-error">❌ Token expired</div>;
  }

  const minutes = timeRemaining ? Math.floor(timeRemaining / 60000) : 0;

  return (
    <div className="status-ok">
      ✅ Protected (expires in {minutes} min)
    </div>
  );
};
```

---

## Error Handling

### Error Types

#### 1. CSRF Token Errors

```typescript
export enum CsrfErrorCode {
  FETCH_FAILED = 'CSRF_FETCH_FAILED',
  TOKEN_EXPIRED = 'CSRF_TOKEN_EXPIRED',
  TOKEN_INVALID = 'CSRF_TOKEN_INVALID',
  NETWORK_ERROR = 'CSRF_NETWORK_ERROR',
  SERVER_ERROR = 'CSRF_SERVER_ERROR',
}
```

#### 2. API Error Codes

```typescript
export enum ApiErrorCode {
  FORBIDDEN = 'FORBIDDEN',
  CSRF_TOKEN_MISSING = 'CSRF_TOKEN_MISSING',
  CSRF_TOKEN_INVALID = 'CSRF_TOKEN_INVALID',
  // ... other codes
}
```

### Error Handling Strategies

#### Strategy 1: Automatic Retry

```typescript
// In api.ts - automatic retry on 403 CSRF error
if (response.status === 403 && isCsrfError) {
  if (attempt === 0) {
    try {
      await refreshCsrfToken();
      continue; // Retry request
    } catch (csrfError) {
      // Refresh failed, return error
    }
  }
}
```

#### Strategy 2: User Notification

```typescript
const handleSubmit = async (data) => {
  const response = await submitAssessment(data);

  if (!response.success) {
    if (response.code === ApiErrorCode.CSRF_TOKEN_INVALID) {
      showNotification({
        type: 'error',
        message: 'Security token expired. Please refresh the page.',
      });
    } else {
      showNotification({
        type: 'error',
        message: response.error || 'Submission failed',
      });
    }
  }
};
```

#### Strategy 3: Graceful Degradation

```typescript
const getCsrfTokenForRequest = async (): Promise<string | null> => {
  try {
    let token = getCsrfToken();
    if (!token) {
      token = await fetchCsrfToken();
    }
    return token;
  } catch (error) {
    // Log error but don't fail - request will proceed without token
    console.error('CSRF token unavailable:', error);
    return null;
  }
};
```

### Common Error Scenarios

#### Scenario 1: Token Fetch Fails on App Load

**Cause**: Network error, server down, API unavailable

**Handling**:
```typescript
useCsrfInit(); // Fails silently, app continues to load
// Subsequent API calls will attempt to fetch token
```

**User Impact**: Minimal - app loads, first API call may fail

**Resolution**: Automatic retry on first API call

#### Scenario 2: Token Expired During Session

**Cause**: User idle for >1 hour, token expired

**Handling**:
```typescript
// API detects 403, refreshes token, retries request
if (response.status === 403 && isCsrfError) {
  await refreshCsrfToken();
  // Retry original request
}
```

**User Impact**: Transparent - request succeeds after refresh

**Resolution**: Automatic refresh and retry

#### Scenario 3: Network Error During Token Fetch

**Cause**: User offline, network interruption

**Handling**:
```typescript
try {
  await fetchCsrfToken();
} catch (error) {
  if (error.code === CsrfErrorCode.NETWORK_ERROR) {
    // Show offline message
  }
}
```

**User Impact**: Error message displayed

**Resolution**: User must restore network connection

#### Scenario 4: Server Returns Invalid Token

**Cause**: Server misconfiguration, malformed response

**Handling**:
```typescript
if (!data.token || typeof data.token !== 'string') {
  throw new CsrfError(
    'Invalid CSRF token received',
    CsrfErrorCode.TOKEN_INVALID
  );
}
```

**User Impact**: Error message, contact support

**Resolution**: Backend team investigates server issue

---

## Security Best Practices

### ✅ Do's

1. **Always use HTTPS in production**
   ```typescript
   // In production, API_BASE_URL should be HTTPS
   const API_BASE_URL = process.env.VITE_API_BASE_URL; // https://api.example.com
   ```

2. **Store tokens in memory only**
   ```typescript
   // ✅ GOOD: In-memory storage
   let csrfToken: string | null = null;

   // ❌ BAD: localStorage
   localStorage.setItem('csrf_token', token);
   ```

3. **Include credentials in requests**
   ```typescript
   // Required for session cookies
   credentials: 'include'
   ```

4. **Validate token on all state-changing requests**
   ```typescript
   const requiresCsrfToken = (method: string): boolean => {
     return ['POST', 'PUT', 'DELETE', 'PATCH'].includes(method);
   };
   ```

5. **Clear tokens on logout**
   ```typescript
   const handleLogout = () => {
     clearSecurityTokens();
     // ... other logout logic
   };
   ```

6. **Use secure headers**
   ```typescript
   headers: {
     'X-CSRF-Token': csrfToken,
     'Content-Type': 'application/json',
   }
   ```

### ❌ Don'ts

1. **Don't store tokens in localStorage**
   ```typescript
   // ❌ VULNERABLE to XSS
   localStorage.setItem('csrf_token', token);
   ```

2. **Don't send tokens in URL parameters**
   ```typescript
   // ❌ EXPOSED in browser history, logs
   fetch(`/api/submit?csrf=${token}`)
   ```

3. **Don't disable CSRF for convenience**
   ```typescript
   // ❌ INSECURE
   if (import.meta.env.DEV) {
     // Skip CSRF in development ❌ BAD
   }
   ```

4. **Don't use predictable tokens**
   ```typescript
   // ❌ Server must generate cryptographically secure random tokens
   const token = Math.random().toString(); // ❌ WEAK
   ```

5. **Don't expose tokens in logs**
   ```typescript
   // ❌ SECURITY RISK
   console.log('CSRF Token:', csrfToken);

   // ✅ SAFE
   console.log('CSRF Token: [REDACTED]');
   ```

6. **Don't skip token validation on server**
   ```typescript
   // ❌ Server must ALWAYS validate token
   if (csrfToken) { // ❌ Optional validation is useless
     validateToken(csrfToken);
   }
   ```

### Security Checklist

- [ ] HTTPS enabled in production
- [ ] Tokens stored in memory only (not localStorage)
- [ ] Tokens sent in headers (not URL)
- [ ] Tokens validated on all POST/PUT/DELETE/PATCH
- [ ] Tokens cleared on logout
- [ ] Token expiration enforced
- [ ] Automatic token refresh implemented
- [ ] Error handling for CSRF failures
- [ ] No tokens logged or exposed
- [ ] CORS configured properly on server
- [ ] SameSite cookie attribute set (server)
- [ ] Content Security Policy configured

---

## Testing

### Unit Tests

#### Test 1: Token Fetch

```typescript
// src/utils/csrfToken.test.ts
import { fetchCsrfToken, getCsrfToken } from '../csrfToken';

describe('fetchCsrfToken', () => {
  it('should fetch token from server', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ token: 'test-token-123' }),
      })
    );

    const token = await fetchCsrfToken();

    expect(token).toBe('test-token-123');
    expect(getCsrfToken()).toBe('test-token-123');
  });

  it('should handle fetch errors', async () => {
    global.fetch = jest.fn(() => Promise.reject(new Error('Network error')));

    await expect(fetchCsrfToken()).rejects.toThrow('Network error');
  });
});
```

#### Test 2: Token Storage

```typescript
describe('setCsrfToken / getCsrfToken', () => {
  it('should store and retrieve token', () => {
    setCsrfToken('test-token');
    expect(getCsrfToken()).toBe('test-token');
  });

  it('should return null for expired token', () => {
    const pastDate = new Date(Date.now() - 3600000); // 1 hour ago
    setCsrfToken('test-token', pastDate);
    expect(getCsrfToken()).toBeNull();
  });
});
```

#### Test 3: API Integration

```typescript
// utils/api.test.ts
import { submitAssessment } from '../api';

describe('submitAssessment', () => {
  it('should include CSRF token in request', async () => {
    const fetchSpy = jest.spyOn(global, 'fetch');

    await submitAssessment({
      assessment: mockAssessment,
      contactInfo: mockContact,
    });

    expect(fetchSpy).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        headers: expect.objectContaining({
          'X-CSRF-Token': expect.any(String),
        }),
      })
    );
  });
});
```

### Integration Tests

```typescript
// e2e/csrf.test.ts
describe('CSRF Protection E2E', () => {
  it('should fetch token on app load', async () => {
    render(<App />);

    await waitFor(() => {
      expect(getCsrfToken()).not.toBeNull();
    });
  });

  it('should refresh token on 403', async () => {
    // Mock 403 response
    global.fetch = jest
      .fn()
      .mockResolvedValueOnce({
        ok: false,
        status: 403,
        json: () => Promise.resolve({ code: 'CSRF_TOKEN_INVALID' }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ token: 'new-token' }),
      });

    await submitAssessment(mockData);

    // Should have retried with new token
    expect(global.fetch).toHaveBeenCalledTimes(2);
  });
});
```

---

## Troubleshooting

### Problem 1: CSRF Token Not Fetched

**Symptoms**:
- Console error: "CSRF token unavailable"
- API requests fail with 403

**Possible Causes**:
1. `useCsrfInit()` not called in App.tsx
2. Server endpoint `/api/csrf-token` not implemented
3. Network error preventing token fetch

**Solutions**:
```typescript
// 1. Verify App.tsx includes useCsrfInit
const App = () => {
  useCsrfInit(); // ✅ Should be here
  return <YourApp />;
};

// 2. Check server endpoint
curl http://localhost:3000/api/csrf-token
// Should return: { "token": "..." }

// 3. Check browser console for network errors
```

### Problem 2: 403 Forbidden on Every Request

**Symptoms**:
- All POST/PUT/DELETE requests fail
- Error: "Security token expired"

**Possible Causes**:
1. Server not validating CSRF correctly
2. Token header name mismatch
3. CORS issues

**Solutions**:
```typescript
// 1. Verify header name matches server expectation
headers['X-CSRF-Token'] = token; // Frontend
const csrfToken = req.headers['x-csrf-token']; // Backend

// 2. Check CORS configuration allows headers
Access-Control-Allow-Headers: X-CSRF-Token, Content-Type

// 3. Verify credentials are included
credentials: 'include' // Required for session cookies
```

### Problem 3: Token Lost on Page Refresh

**Symptoms**:
- Token works until page refresh
- After refresh, token is null

**Expected Behavior**:
✅ This is **normal and secure**! Tokens are stored in memory and cleared on refresh.

**Solution**:
```typescript
// Token is automatically refetched on app mount
useCsrfInit(); // Fetches new token
```

### Problem 4: Infinite Token Refresh Loop

**Symptoms**:
- Console shows repeated token fetches
- Network tab shows many `/api/csrf-token` requests

**Possible Causes**:
1. Server always returning 403 (even with valid token)
2. Token expiration set too short
3. Multiple concurrent token fetches

**Solutions**:
```typescript
// 1. Check server validation logic
// Server should accept valid tokens, not reject all

// 2. Increase token expiration (server-side)
expiresAt: new Date(Date.now() + 3600000) // 1 hour

// 3. Use singleton pattern (already implemented)
let tokenFetchPromise: Promise<string> | null = null;
if (tokenFetchPromise) return tokenFetchPromise; // ✅ Prevents concurrent fetches
```

### Problem 5: TypeScript Errors with CSRF Utilities

**Symptoms**:
- Import errors for CSRF functions
- Type errors in API calls

**Solutions**:
```typescript
// Correct import paths
import { fetchCsrfToken } from '../src/utils/csrfToken'; // From utils/api.ts
import { useCsrfInit } from './hooks/useCsrf'; // From App.tsx

// If still getting errors, check tsconfig paths
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

---

## Backend Requirements

### Server Implementation

The frontend expects the following backend endpoints:

#### 1. GET /api/csrf-token

**Purpose**: Generate and return CSRF token

**Response**:
```json
{
  "token": "a1b2c3d4e5f6...",
  "expiresAt": "2025-10-24T13:00:00Z"
}
```

**Implementation Example (Node.js/Express)**:
```javascript
const crypto = require('crypto');

app.get('/api/csrf-token', (req, res) => {
  // Generate cryptographically secure token
  const token = crypto.randomBytes(32).toString('hex');

  // Store in session (server-side)
  req.session.csrfToken = token;

  // Set expiration (1 hour)
  const expiresAt = new Date(Date.now() + 3600000).toISOString();

  res.json({ token, expiresAt });
});
```

#### 2. Validate CSRF on State-Changing Requests

**Middleware Example**:
```javascript
const validateCsrf = (req, res, next) => {
  // Only validate POST/PUT/DELETE/PATCH
  if (!['POST', 'PUT', 'DELETE', 'PATCH'].includes(req.method)) {
    return next();
  }

  // Get token from header
  const clientToken = req.headers['x-csrf-token'];

  // Get token from session
  const sessionToken = req.session.csrfToken;

  // Validate
  if (!clientToken || clientToken !== sessionToken) {
    return res.status(403).json({
      error: 'Invalid or missing CSRF token',
      code: 'CSRF_TOKEN_INVALID'
    });
  }

  next();
};

// Apply to all API routes
app.use('/api', validateCsrf);
```

#### 3. CORS Configuration

```javascript
app.use(cors({
  origin: 'http://localhost:5173', // Your frontend URL
  credentials: true, // IMPORTANT: Allow credentials
  allowedHeaders: ['Content-Type', 'X-CSRF-Token']
}));
```

#### 4. Session Configuration

```javascript
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // HTTPS only in prod
    sameSite: 'strict',
    maxAge: 3600000 // 1 hour
  }
}));
```

---

## Summary

### Key Takeaways

1. **CSRF Protection is Active**: All state-changing requests automatically protected
2. **In-Memory Storage**: Tokens never stored in localStorage (secure against XSS)
3. **Automatic Retry**: 403 errors trigger automatic token refresh and retry
4. **Zero Configuration**: Developers just call `useCsrfInit()` in App.tsx
5. **Production Ready**: Comprehensive error handling and logging

### Quick Start Checklist

For developers integrating CSRF:

- [ ] Add `useCsrfInit()` to App.tsx
- [ ] Ensure backend implements `/api/csrf-token` endpoint
- [ ] Ensure backend validates `X-CSRF-Token` header
- [ ] Configure CORS to allow `X-CSRF-Token` header
- [ ] Set `credentials: 'include'` in fetch requests
- [ ] Test state-changing requests (POST/PUT/DELETE)
- [ ] Test token refresh on 403 response
- [ ] Implement `clearSecurityTokens()` on logout

### Support

For questions or issues:
- Review this documentation
- Check browser console for CSRF logs (dev mode)
- Verify backend endpoint implementation
- Test with curl to isolate frontend/backend issues

---

**Document Version**: 1.0
**Last Updated**: October 24, 2025
**Author**: Backend Security Team
