# CSRF Protection - Code Examples

Complete code examples for integrating CSRF protection in your application.

---

## Table of Contents

1. [Basic Integration](#basic-integration)
2. [Advanced Hook Usage](#advanced-hook-usage)
3. [API Integration Examples](#api-integration-examples)
4. [Error Handling Examples](#error-handling-examples)
5. [Testing Examples](#testing-examples)
6. [Backend Examples](#backend-examples)

---

## Basic Integration

### Example 1: App.tsx Setup (Recommended)

```typescript
// src/App.tsx
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useCsrfInit } from '@/hooks/useCsrf';

const App: React.FC = () => {
  // Initialize CSRF protection on app mount
  // Token automatically fetched and stored in memory
  useCsrfInit();

  return (
    <BrowserRouter>
      <Routes>
        {/* Your routes */}
      </Routes>
    </BrowserRouter>
  );
};

export default App;
```

### Example 2: Simple API Call with CSRF

```typescript
// src/pages/LeadCapture.tsx
import React, { useState } from 'react';
import { submitAssessment } from '@/utils/api';
import type { ContactInfo } from '@/utils/api';

const LeadCapture: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (contactInfo: ContactInfo) => {
    setLoading(true);
    setError(null);

    try {
      // CSRF token automatically included by submitAssessment()
      const response = await submitAssessment({
        assessment: assessmentData,
        contactInfo,
        leadSource: 'web',
      });

      if (response.success) {
        console.log('Submitted successfully:', response.data);
        navigate('/confirmation');
      } else {
        setError(response.error || 'Submission failed');
      }
    } catch (error) {
      setError('An unexpected error occurred');
      console.error('Submission error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
      {error && <div className="error">{error}</div>}
      <button type="submit" disabled={loading}>
        {loading ? 'Submitting...' : 'Submit'}
      </button>
    </form>
  );
};
```

---

## Advanced Hook Usage

### Example 3: Full-Featured CSRF Hook

```typescript
// src/App.tsx
import React from 'react';
import { useCsrf } from '@/hooks/useCsrf';

const App: React.FC = () => {
  const csrf = useCsrf({
    autoFetch: true,        // Fetch token on mount
    autoRefresh: true,      // Auto-refresh expiring tokens
    refreshInterval: 300000, // Check every 5 minutes
    onSuccess: (token) => {
      console.log('CSRF token ready');
    },
    onError: (error) => {
      console.error('CSRF initialization failed:', error);
      // Show notification to user
    },
  });

  // Show loading state while token is being fetched
  if (csrf.isLoading) {
    return (
      <div className="loading-screen">
        <h2>Initializing security...</h2>
      </div>
    );
  }

  // Show error if token fetch failed
  if (csrf.error) {
    return (
      <div className="error-screen">
        <h2>Security Initialization Failed</h2>
        <p>{csrf.error.message}</p>
        <button onClick={csrf.refresh}>Retry</button>
      </div>
    );
  }

  return <YourApp />;
};
```

### Example 4: Manual Token Refresh

```typescript
// src/components/SecuritySettings.tsx
import React from 'react';
import { useCsrf } from '@/hooks/useCsrf';

const SecuritySettings: React.FC = () => {
  const {
    isLoading,
    isReady,
    error,
    expiresAt,
    refresh,
    clear,
    getInfo,
  } = useCsrf({ autoFetch: false });

  const handleRefresh = async () => {
    try {
      await refresh();
      alert('Security token refreshed successfully');
    } catch (error) {
      alert('Failed to refresh token');
    }
  };

  const handleClear = () => {
    clear();
    alert('Security token cleared');
  };

  const handleCheckStatus = () => {
    const info = getInfo();
    console.log('Token info:', info);
  };

  return (
    <div className="security-settings">
      <h2>Security Settings</h2>

      <div className="status">
        <p>Status: {isReady ? '✅ Protected' : '⚠️ Not Protected'}</p>
        {expiresAt && <p>Expires: {new Date(expiresAt).toLocaleString()}</p>}
        {error && <p className="error">Error: {error.message}</p>}
      </div>

      <div className="actions">
        <button onClick={handleRefresh} disabled={isLoading}>
          {isLoading ? 'Refreshing...' : 'Refresh Token'}
        </button>
        <button onClick={handleClear}>Clear Token</button>
        <button onClick={handleCheckStatus}>Check Status</button>
      </div>
    </div>
  );
};
```

### Example 5: Status Indicator Component

```typescript
// src/components/CsrfStatusIndicator.tsx
import React from 'react';
import { useCsrfStatus } from '@/hooks/useCsrf';

const CsrfStatusIndicator: React.FC = () => {
  const { hasToken, expiresAt, timeRemaining, isExpired } = useCsrfStatus();

  const getStatusColor = () => {
    if (!hasToken || isExpired) return 'red';
    if (timeRemaining && timeRemaining < 300000) return 'yellow'; // <5 min
    return 'green';
  };

  const getStatusText = () => {
    if (!hasToken) return 'No Token';
    if (isExpired) return 'Expired';
    const minutes = timeRemaining ? Math.floor(timeRemaining / 60000) : 0;
    return `${minutes} min remaining`;
  };

  return (
    <div className="csrf-status" style={{ color: getStatusColor() }}>
      🔒 Security: {getStatusText()}
    </div>
  );
};
```

---

## API Integration Examples

### Example 6: Custom API Function with CSRF

```typescript
// src/utils/customApi.ts
import { getCsrfToken, fetchCsrfToken } from '@/utils/csrfToken';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const customApiCall = async (
  endpoint: string,
  data: unknown
): Promise<Response> => {
  // Get CSRF token
  let csrfToken = getCsrfToken();

  // If no token, fetch new one
  if (!csrfToken) {
    csrfToken = await fetchCsrfToken();
  }

  // Make request with CSRF token
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRF-Token': csrfToken,
    },
    credentials: 'include', // Important for session cookies
    body: JSON.stringify(data),
  });

  // Handle 403 CSRF error
  if (response.status === 403) {
    const errorData = await response.json();

    if (errorData.code === 'CSRF_TOKEN_INVALID') {
      // Refresh token and retry
      const { refreshCsrfToken } = await import('@/utils/csrfToken');
      const newToken = await refreshCsrfToken();

      // Retry with new token
      return fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': newToken,
        },
        credentials: 'include',
        body: JSON.stringify(data),
      });
    }
  }

  return response;
};
```

### Example 7: Batch Operations with CSRF

```typescript
// src/utils/batchApi.ts
import { batchOperations, submitAssessment, saveProgress } from '@/utils/api';
import type { AssessmentSubmissionPayload, SaveProgressPayload } from '@/utils/api';

export const submitMultipleAssessments = async (
  assessments: AssessmentSubmissionPayload[]
): Promise<void> => {
  // All calls automatically include CSRF token
  const operations = assessments.map((assessment) =>
    submitAssessment(assessment)
  );

  const results = await batchOperations(operations);

  results.forEach((result, index) => {
    if (result.success) {
      console.log(`Assessment ${index + 1} submitted:`, result.data);
    } else {
      console.error(`Assessment ${index + 1} failed:`, result.error);
    }
  });
};
```

---

## Error Handling Examples

### Example 8: Comprehensive Error Handling

```typescript
// src/pages/AssessmentSubmit.tsx
import React, { useState } from 'react';
import { submitAssessment, ApiErrorCode } from '@/utils/api';
import { CsrfError, CsrfErrorCode } from '@/utils/csrfToken';

const AssessmentSubmit: React.FC = () => {
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (data: AssessmentData) => {
    try {
      const response = await submitAssessment(data);

      if (!response.success) {
        // Handle specific error codes
        switch (response.code) {
          case ApiErrorCode.CSRF_TOKEN_INVALID:
            setError(
              'Your session has expired. Please refresh the page and try again.'
            );
            break;

          case ApiErrorCode.FORBIDDEN:
            setError('Access denied. Please check your permissions.');
            break;

          case ApiErrorCode.VALIDATION_ERROR:
            setError('Please check your input and try again.');
            break;

          case ApiErrorCode.NETWORK_ERROR:
            setError('Network error. Please check your connection.');
            break;

          case ApiErrorCode.TIMEOUT_ERROR:
            setError('Request timed out. Please try again.');
            break;

          default:
            setError(response.error || 'An unexpected error occurred');
        }
      } else {
        // Success
        navigate('/success');
      }
    } catch (error) {
      // Handle CSRF-specific errors
      if (error instanceof CsrfError) {
        switch (error.code) {
          case CsrfErrorCode.FETCH_FAILED:
            setError('Failed to initialize security. Please refresh the page.');
            break;

          case CsrfErrorCode.NETWORK_ERROR:
            setError('Network error. Please check your connection.');
            break;

          default:
            setError('Security error. Please refresh the page.');
        }
      } else {
        setError('An unexpected error occurred');
      }
    }
  };

  return (
    <div>
      {error && (
        <div className="error-banner">
          <p>{error}</p>
          <button onClick={() => setError(null)}>Dismiss</button>
        </div>
      )}
      {/* Form */}
    </div>
  );
};
```

### Example 9: Error Recovery

```typescript
// src/hooks/useApiWithRetry.ts
import { useState } from 'react';
import { refreshCsrfToken } from '@/utils/csrfToken';
import { ApiErrorCode } from '@/utils/api';

export const useApiWithRetry = () => {
  const [isRetrying, setIsRetrying] = useState(false);

  const callWithRetry = async <T,>(
    apiCall: () => Promise<T>,
    maxRetries = 3
  ): Promise<T> => {
    let lastError: Error | null = null;

    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        return await apiCall();
      } catch (error) {
        lastError = error as Error;

        // If CSRF error, refresh token and retry
        if (error.code === ApiErrorCode.CSRF_TOKEN_INVALID) {
          setIsRetrying(true);
          await refreshCsrfToken();
          setIsRetrying(false);
          continue;
        }

        // If network error, wait and retry
        if (error.code === ApiErrorCode.NETWORK_ERROR) {
          await new Promise((resolve) => setTimeout(resolve, 1000 * (attempt + 1)));
          continue;
        }

        // Other errors, don't retry
        throw error;
      }
    }

    throw lastError;
  };

  return { callWithRetry, isRetrying };
};

// Usage
const { callWithRetry, isRetrying } = useApiWithRetry();

const handleSubmit = async () => {
  try {
    const result = await callWithRetry(() => submitAssessment(data));
    console.log('Success:', result);
  } catch (error) {
    console.error('Failed after retries:', error);
  }
};
```

---

## Testing Examples

### Example 10: Unit Tests for CSRF Functions

```typescript
// src/utils/__tests__/csrfToken.test.ts
import {
  fetchCsrfToken,
  getCsrfToken,
  setCsrfToken,
  clearCsrfToken,
} from '../csrfToken';

describe('CSRF Token Management', () => {
  beforeEach(() => {
    clearCsrfToken();
  });

  describe('fetchCsrfToken', () => {
    it('should fetch token from server', async () => {
      global.fetch = jest.fn(() =>
        Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve({
              token: 'test-token-123',
              expiresAt: new Date(Date.now() + 3600000).toISOString(),
            }),
        })
      ) as jest.Mock;

      const token = await fetchCsrfToken();

      expect(token).toBe('test-token-123');
      expect(getCsrfToken()).toBe('test-token-123');
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/csrf-token'),
        expect.objectContaining({
          method: 'GET',
          credentials: 'include',
        })
      );
    });

    it('should throw error on server failure', async () => {
      global.fetch = jest.fn(() =>
        Promise.resolve({
          ok: false,
          status: 500,
          json: () => Promise.resolve({ error: 'Server error' }),
        })
      ) as jest.Mock;

      await expect(fetchCsrfToken()).rejects.toThrow();
    });

    it('should handle network errors', async () => {
      global.fetch = jest.fn(() =>
        Promise.reject(new TypeError('Network error'))
      ) as jest.Mock;

      await expect(fetchCsrfToken()).rejects.toThrow('Network error');
    });
  });

  describe('setCsrfToken / getCsrfToken', () => {
    it('should store and retrieve token', () => {
      setCsrfToken('test-token');
      expect(getCsrfToken()).toBe('test-token');
    });

    it('should return null for expired token', () => {
      const pastDate = new Date(Date.now() - 3600000);
      setCsrfToken('test-token', pastDate);
      expect(getCsrfToken()).toBeNull();
    });
  });

  describe('clearCsrfToken', () => {
    it('should clear token', () => {
      setCsrfToken('test-token');
      expect(getCsrfToken()).toBe('test-token');

      clearCsrfToken();
      expect(getCsrfToken()).toBeNull();
    });
  });
});
```

### Example 11: Integration Tests

```typescript
// src/utils/__tests__/api.integration.test.ts
import { render, waitFor } from '@testing-library/react';
import { submitAssessment } from '../api';
import { getCsrfToken } from '../csrfToken';

describe('API with CSRF Integration', () => {
  beforeEach(() => {
    // Mock CSRF endpoint
    global.fetch = jest.fn((url) => {
      if (url.includes('/csrf-token')) {
        return Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve({
              token: 'mock-csrf-token',
            }),
        });
      }

      // Mock API endpoint
      return Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            success: true,
            assessmentId: '123',
          }),
      });
    }) as jest.Mock;
  });

  it('should include CSRF token in POST requests', async () => {
    const response = await submitAssessment({
      assessment: mockAssessment,
      contactInfo: mockContact,
    });

    expect(response.success).toBe(true);
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/assessment/submit'),
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          'X-CSRF-Token': expect.any(String),
        }),
      })
    );
  });

  it('should refresh token on 403 and retry', async () => {
    let callCount = 0;

    global.fetch = jest.fn((url) => {
      if (url.includes('/csrf-token')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ token: 'new-token' }),
        });
      }

      callCount++;
      if (callCount === 1) {
        // First call returns 403
        return Promise.resolve({
          ok: false,
          status: 403,
          json: () =>
            Promise.resolve({
              code: 'CSRF_TOKEN_INVALID',
            }),
        });
      }

      // Second call succeeds
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ success: true }),
      });
    }) as jest.Mock;

    const response = await submitAssessment({
      assessment: mockAssessment,
      contactInfo: mockContact,
    });

    expect(response.success).toBe(true);
    expect(callCount).toBe(2); // Should have retried
  });
});
```

---

## Backend Examples

### Example 12: Express.js Backend

```javascript
// server/middleware/csrf.js
const crypto = require('crypto');

// CSRF Token Generation Endpoint
app.get('/api/csrf-token', (req, res) => {
  // Generate cryptographically secure token
  const token = crypto.randomBytes(32).toString('hex');

  // Store in session
  req.session.csrfToken = token;

  // Set expiration
  const expiresAt = new Date(Date.now() + 3600000).toISOString(); // 1 hour

  res.json({ token, expiresAt });
});

// CSRF Validation Middleware
const validateCsrf = (req, res, next) => {
  // Skip for GET, HEAD, OPTIONS
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
    return next();
  }

  // Get token from header
  const clientToken = req.headers['x-csrf-token'];

  // Get token from session
  const sessionToken = req.session.csrfToken;

  // Validate
  if (!clientToken) {
    return res.status(403).json({
      error: 'CSRF token missing',
      code: 'CSRF_TOKEN_MISSING',
    });
  }

  if (clientToken !== sessionToken) {
    return res.status(403).json({
      error: 'Invalid CSRF token',
      code: 'CSRF_TOKEN_INVALID',
    });
  }

  next();
};

// Apply to all API routes
app.use('/api', validateCsrf);

// CORS Configuration
const cors = require('cors');

app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true, // REQUIRED
    allowedHeaders: ['Content-Type', 'X-CSRF-Token'],
  })
);

// Session Configuration
const session = require('express-session');

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 3600000, // 1 hour
    },
  })
);
```

### Example 13: NestJS Backend

```typescript
// src/csrf/csrf.guard.ts
import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';

@Injectable()
export class CsrfGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();

    // Skip for GET requests
    if (request.method === 'GET') {
      return true;
    }

    // Get tokens
    const clientToken = request.headers['x-csrf-token'];
    const sessionToken = request.session.csrfToken;

    // Validate
    if (!clientToken || clientToken !== sessionToken) {
      throw new ForbiddenException({
        error: 'Invalid CSRF token',
        code: 'CSRF_TOKEN_INVALID',
      });
    }

    return true;
  }
}

// src/csrf/csrf.controller.ts
import { Controller, Get, Session } from '@nestjs/common';
import * as crypto from 'crypto';

@Controller('api')
export class CsrfController {
  @Get('csrf-token')
  getCsrfToken(@Session() session: Record<string, any>) {
    const token = crypto.randomBytes(32).toString('hex');
    session.csrfToken = token;

    const expiresAt = new Date(Date.now() + 3600000).toISOString();

    return { token, expiresAt };
  }
}
```

---

## Summary

These examples cover:
- ✅ Basic app integration
- ✅ Advanced hook usage
- ✅ Custom API calls with CSRF
- ✅ Error handling strategies
- ✅ Testing approaches
- ✅ Backend implementation

For more information, see:
- [CSRF_PROTECTION.md](./CSRF_PROTECTION.md) - Full documentation
- [CSRF_QUICK_START.md](./CSRF_QUICK_START.md) - Quick start guide
