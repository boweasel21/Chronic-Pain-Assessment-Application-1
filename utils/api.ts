/**
 * API service utility for Primary Cell Assessment
 * Handles all API communication with type-safe error handling
 * Designed for Emergent.sh backend integration
 *
 * Security Features:
 * - CSRF token protection for all state-changing requests
 * - Automatic token refresh on 403 Forbidden responses
 * - Secure token storage in memory (not localStorage)
 */

import type { AssessmentResponse } from '../types';
import {
  fetchCsrfToken,
  getCsrfToken,
  clearCsrfToken,
  refreshCsrfToken,
  CsrfError,
} from '../src/utils/csrfToken';

/**
 * Environment configuration
 */
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';
const API_TIMEOUT = parseInt(import.meta.env.VITE_API_TIMEOUT || '30000', 10);

/**
 * API Error Codes
 */
export enum ApiErrorCode {
  NETWORK_ERROR = 'NETWORK_ERROR',
  TIMEOUT_ERROR = 'TIMEOUT_ERROR',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  INVALID_EMAIL = 'INVALID_EMAIL',
  INVALID_PHONE = 'INVALID_PHONE',
  SERVER_ERROR = 'SERVER_ERROR',
  NOT_FOUND = 'NOT_FOUND',
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  CSRF_TOKEN_MISSING = 'CSRF_TOKEN_MISSING',
  CSRF_TOKEN_INVALID = 'CSRF_TOKEN_INVALID',
  RATE_LIMIT = 'RATE_LIMIT',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
}

/**
 * API response structure
 */
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  code?: ApiErrorCode;
  message?: string;
}

/**
 * Assessment submission response
 */
export interface SubmitAssessmentResponse {
  assessmentId: string;
  leadId: string;
  success: boolean;
}

/**
 * Email results response
 */
export interface EmailResultsResponse {
  success: boolean;
  messageId: string;
}

/**
 * Lead capture response
 */
export interface LeadCaptureResponse {
  leadId: string;
}

/**
 * Save progress response
 */
export interface SaveProgressResponse {
  success: boolean;
  assessmentId?: string;
}

/**
 * Contact information for lead capture
 */
export interface ContactInfo {
  name: string;
  email: string;
  phone?: string;
}

/**
 * Assessment submission payload
 */
export interface AssessmentSubmissionPayload {
  assessment: AssessmentResponse;
  contactInfo: ContactInfo;
  leadSource?: string;
  metadata?: {
    userAgent?: string;
    referrer?: string;
    timestamp: string;
  };
}

/**
 * Save progress payload
 */
export interface SaveProgressPayload {
  assessmentId?: string;
  progress: Partial<AssessmentResponse>;
}

/**
 * API Error class for structured error handling
 */
export class ApiError extends Error {
  constructor(
    message: string,
    public code: ApiErrorCode,
    public statusCode?: number,
    public details?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

/**
 * Request logger - logs requests without PII
 */
const logRequest = (method: string, url: string, payload?: unknown): void => {
  if (import.meta.env.DEV) {
    const sanitizedPayload = payload ? sanitizeForLogging(payload) : null;
    // eslint-disable-next-line no-console
    console.debug('[API Request]', {
      method,
      url: url.replace(API_BASE_URL, ''),
      timestamp: new Date().toISOString(),
      payload: sanitizedPayload,
    });
  }
};

/**
 * Response logger - logs responses without PII
 */
const logResponse = (
  method: string,
  url: string,
  status: number,
  success: boolean
): void => {
  if (import.meta.env.DEV) {
    // eslint-disable-next-line no-console
    console.debug('[API Response]', {
      method,
      url: url.replace(API_BASE_URL, ''),
      status,
      success,
      timestamp: new Date().toISOString(),
    });
  }
};

/**
 * Sanitize data for logging - removes PII
 */
const sanitizeForLogging = (data: unknown): unknown => {
  if (!data || typeof data !== 'object') {
    return data;
  }

  const sanitized = { ...(data as Record<string, unknown>) };
  const piiFields = ['name', 'email', 'phone', 'phoneNumber', 'contactInfo'];

  piiFields.forEach((field) => {
    if (field in sanitized) {
      sanitized[field] = '[REDACTED]';
    }
  });

  // Recursively sanitize nested objects
  Object.keys(sanitized).forEach((key) => {
    if (sanitized[key] && typeof sanitized[key] === 'object') {
      sanitized[key] = sanitizeForLogging(sanitized[key]);
    }
  });

  return sanitized;
};

/**
 * Retry configuration for exponential backoff
 */
interface RetryConfig {
  maxRetries: number;
  baseDelay: number;
  maxDelay: number;
}

const DEFAULT_RETRY_CONFIG: RetryConfig = {
  maxRetries: 3,
  baseDelay: 1000,
  maxDelay: 10000,
};

/**
 * Sleep utility for retry delays
 */
const sleep = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Calculate exponential backoff delay
 */
const getRetryDelay = (attempt: number, config: RetryConfig): number => {
  const delay = config.baseDelay * Math.pow(2, attempt);
  return Math.min(delay, config.maxDelay);
};

/**
 * Determine if error is retryable
 */
const isRetryableError = (error: unknown): boolean => {
  if (error instanceof ApiError) {
    return (
      error.code === ApiErrorCode.NETWORK_ERROR ||
      error.code === ApiErrorCode.TIMEOUT_ERROR ||
      (error.statusCode !== undefined && error.statusCode >= 500)
    );
  }
  return error instanceof TypeError; // Network errors
};

/**
 * Gets CSRF token for request, fetching if needed
 * @returns CSRF token or null if fetch fails
 */
const getCsrfTokenForRequest = async (): Promise<string | null> => {
  try {
    // Try to get cached token first
    let token = getCsrfToken();

    // If no valid cached token, fetch new one
    if (!token) {
      token = await fetchCsrfToken();
    }

    return token;
  } catch (error) {
    if (import.meta.env.DEV) {
      // eslint-disable-next-line no-console
      console.error('[API] Failed to get CSRF token:', error);
    }
    return null;
  }
};

/**
 * Determines if request method requires CSRF protection
 * @param method - HTTP method
 * @returns True if method is state-changing (POST, PUT, DELETE, PATCH)
 */
const requiresCsrfToken = (method: string = 'GET'): boolean => {
  const stateChangingMethods = ['POST', 'PUT', 'DELETE', 'PATCH'];
  return stateChangingMethods.includes(method.toUpperCase());
};

/**
 * Type-safe fetch wrapper with error handling, retry logic, and CSRF protection
 * @param url - API endpoint URL
 * @param options - Fetch options
 * @param retryConfig - Retry configuration
 * @returns Parsed response data
 */
const apiFetch = async <T>(
  url: string,
  options: RequestInit = {},
  retryConfig: RetryConfig = DEFAULT_RETRY_CONFIG
): Promise<ApiResponse<T>> => {
  let lastError: unknown;

  for (let attempt = 0; attempt <= retryConfig.maxRetries; attempt++) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);

    try {
      // Add CSRF token for state-changing requests
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(options.headers as Record<string, string>),
      };

      if (requiresCsrfToken(options.method)) {
        const csrfToken = await getCsrfTokenForRequest();
        if (csrfToken) {
          headers['X-CSRF-Token'] = csrfToken;
        } else if (import.meta.env.DEV) {
          // eslint-disable-next-line no-console
          console.warn('[API] CSRF token unavailable for state-changing request');
        }
      }

      logRequest(options.method || 'GET', url, options.body);

      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        credentials: 'include', // Important: Include cookies for session-based CSRF
        headers,
      });

      clearTimeout(timeoutId);

      logResponse(
        options.method || 'GET',
        url,
        response.status,
        response.ok
      );

      // Handle 403 Forbidden - likely CSRF token issue
      if (response.status === 403) {
        const errorData = await response.json().catch(() => ({}));

        // Check if it's a CSRF token error
        const isCsrfError =
          errorData.code === 'CSRF_TOKEN_INVALID' ||
          errorData.code === 'CSRF_TOKEN_MISSING' ||
          errorData.message?.toLowerCase().includes('csrf');

        if (isCsrfError && requiresCsrfToken(options.method)) {
          // Try to refresh token and retry once
          if (attempt === 0) {
            try {
              await refreshCsrfToken();
              // Retry the request with new token
              continue;
            } catch (csrfError) {
              if (import.meta.env.DEV) {
                // eslint-disable-next-line no-console
                console.error('[API] CSRF token refresh failed:', csrfError);
              }
            }
          }

          return {
            success: false,
            error: 'Security token expired. Please refresh the page and try again.',
            code: ApiErrorCode.CSRF_TOKEN_INVALID,
          };
        }

        // Other 403 errors
        return {
          success: false,
          error: errorData.error || errorData.message || 'Access forbidden',
          code: ApiErrorCode.FORBIDDEN,
        };
      }

      // Handle non-OK responses
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorCode = mapHttpStatusToErrorCode(response.status);

        const apiError = new ApiError(
          errorData.error || errorData.message || 'Request failed',
          errorCode,
          response.status,
          errorData
        );

        // Don't retry client errors (4xx) except 403 (handled above)
        if (response.status >= 400 && response.status < 500) {
          return {
            success: false,
            error: apiError.message,
            code: apiError.code,
          };
        }

        throw apiError;
      }

      // Parse successful response
      const data = await response.json();

      // Check if server sent a new CSRF token in response
      const newCsrfToken = response.headers.get('X-CSRF-Token');
      if (newCsrfToken) {
        const { setCsrfToken } = await import('../src/utils/csrfToken');
        setCsrfToken(newCsrfToken);
      }

      return {
        success: true,
        data,
      };
    } catch (error) {
      clearTimeout(timeoutId);
      lastError = error;

      // Handle abort/timeout
      if (error instanceof Error && error.name === 'AbortError') {
        const timeoutError = new ApiError(
          'Request timeout. Please try again.',
          ApiErrorCode.TIMEOUT_ERROR
        );
        lastError = timeoutError;
      }

      // Handle network errors
      if (error instanceof TypeError) {
        lastError = new ApiError(
          'Network error. Please check your connection.',
          ApiErrorCode.NETWORK_ERROR
        );
      }

      // Check if we should retry
      if (attempt < retryConfig.maxRetries && isRetryableError(lastError)) {
        const delay = getRetryDelay(attempt, retryConfig);
        await sleep(delay);
        continue;
      }

      // No more retries, return error
      break;
    }
  }

  // All retries exhausted
  if (lastError instanceof ApiError) {
    return {
      success: false,
      error: lastError.message,
      code: lastError.code,
    };
  }

  return {
    success: false,
    error: 'An unexpected error occurred. Please try again.',
    code: ApiErrorCode.UNKNOWN_ERROR,
  };
};

/**
 * Map HTTP status codes to API error codes
 */
const mapHttpStatusToErrorCode = (status: number): ApiErrorCode => {
  switch (status) {
    case 400:
      return ApiErrorCode.VALIDATION_ERROR;
    case 401:
      return ApiErrorCode.UNAUTHORIZED;
    case 403:
      return ApiErrorCode.FORBIDDEN;
    case 404:
      return ApiErrorCode.NOT_FOUND;
    case 429:
      return ApiErrorCode.RATE_LIMIT;
    case 500:
    case 502:
    case 503:
    case 504:
      return ApiErrorCode.SERVER_ERROR;
    default:
      return ApiErrorCode.UNKNOWN_ERROR;
  }
};

/**
 * Validates email format
 */
const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validates phone format (basic validation)
 */
const isValidPhone = (phone: string): boolean => {
  const phoneRegex = /^[\d\s\-\+\(\)]{10,}$/;
  return phoneRegex.test(phone);
};

/**
 * Submits completed assessment to the API
 * @param payload - Assessment submission payload
 * @returns Promise with assessment ID, lead ID, and success status
 */
export const submitAssessment = async (
  payload: AssessmentSubmissionPayload
): Promise<ApiResponse<SubmitAssessmentResponse>> => {
  // Validate contact info
  if (!payload.contactInfo.email || !isValidEmail(payload.contactInfo.email)) {
    return {
      success: false,
      error: 'Please provide a valid email address',
      code: ApiErrorCode.INVALID_EMAIL,
    };
  }

  if (
    payload.contactInfo.phone &&
    !isValidPhone(payload.contactInfo.phone)
  ) {
    return {
      success: false,
      error: 'Please provide a valid phone number',
      code: ApiErrorCode.INVALID_PHONE,
    };
  }

  if (!payload.contactInfo.name || payload.contactInfo.name.trim().length < 2) {
    return {
      success: false,
      error: 'Please provide a valid name',
      code: ApiErrorCode.VALIDATION_ERROR,
    };
  }

  const url = `${API_BASE_URL}/api/assessment/submit`;

  const requestPayload = {
    ...payload,
    metadata: {
      userAgent: navigator.userAgent,
      referrer: document.referrer,
      timestamp: new Date().toISOString(),
      ...payload.metadata,
    },
  };

  return await apiFetch<SubmitAssessmentResponse>(url, {
    method: 'POST',
    body: JSON.stringify(requestPayload),
  });
};

/**
 * Saves assessment progress (for incomplete assessments)
 * @param payload - Save progress payload
 * @returns Promise with save status and assessment ID
 */
export const saveProgress = async (
  payload: SaveProgressPayload
): Promise<ApiResponse<SaveProgressResponse>> => {
  const url = `${API_BASE_URL}/api/assessment/save-progress`;

  return await apiFetch<SaveProgressResponse>(
    url,
    {
      method: 'POST',
      body: JSON.stringify({
        ...payload,
        savedAt: new Date().toISOString(),
      }),
    },
    { maxRetries: 1, baseDelay: 500, maxDelay: 1000 } // Lower retry for auto-save
  );
};

/**
 * Sends assessment results to user's email
 * @param email - User's email address
 * @param assessmentId - Assessment ID
 * @returns Promise with email send status and message ID
 */
export const sendEmailResults = async (
  email: string,
  assessmentId: string
): Promise<ApiResponse<EmailResultsResponse>> => {
  if (!email || !isValidEmail(email)) {
    return {
      success: false,
      error: 'Please provide a valid email address',
      code: ApiErrorCode.INVALID_EMAIL,
    };
  }

  if (!assessmentId) {
    return {
      success: false,
      error: 'Assessment ID is required',
      code: ApiErrorCode.VALIDATION_ERROR,
    };
  }

  const url = `${API_BASE_URL}/api/email/send-results`;

  return await apiFetch<EmailResultsResponse>(url, {
    method: 'POST',
    body: JSON.stringify({
      email,
      assessmentId,
      sentAt: new Date().toISOString(),
    }),
  });
};

/**
 * Health check endpoint to verify API connectivity
 * @returns Promise with health status
 */
export const checkApiHealth = async (): Promise<
  ApiResponse<{ status: string; version?: string }>
> => {
  const url = `${API_BASE_URL}/health`;

  return await apiFetch<{ status: string; version?: string }>(
    url,
    { method: 'GET' },
    { maxRetries: 1, baseDelay: 500, maxDelay: 1000 }
  );
};

/**
 * Batch operation helper for multiple API calls
 * @param operations - Array of API operation promises
 * @returns Promise with all results
 */
export const batchOperations = async <T>(
  operations: Promise<ApiResponse<T>>[]
): Promise<ApiResponse<T>[]> => {
  const results = await Promise.allSettled(operations);

  return results.map((result) => {
    if (result.status === 'fulfilled') {
      return result.value;
    }
    return {
      success: false,
      error: 'Operation failed',
      code: ApiErrorCode.UNKNOWN_ERROR,
    };
  });
};

/**
 * Initializes CSRF protection by fetching initial token
 * Should be called when application starts
 * @returns Promise that resolves when CSRF token is ready
 */
export const initializeCsrfProtection = async (): Promise<void> => {
  try {
    await fetchCsrfToken();
    if (import.meta.env.DEV) {
      // eslint-disable-next-line no-console
      console.info('[API] CSRF protection initialized');
    }
  } catch (error) {
    if (import.meta.env.DEV) {
      // eslint-disable-next-line no-console
      console.error('[API] Failed to initialize CSRF protection:', error);
    }
    // Don't throw - app should still work, just without CSRF protection
  }
};

/**
 * Clears all security tokens (call on logout)
 * @returns void
 */
export const clearSecurityTokens = (): void => {
  clearCsrfToken();
  if (import.meta.env.DEV) {
    // eslint-disable-next-line no-console
    console.info('[API] Security tokens cleared');
  }
};

/**
 * Re-exports CSRF utilities for convenience
 */
export {
  fetchCsrfToken,
  getCsrfToken,
  clearCsrfToken,
  refreshCsrfToken,
  CsrfError,
} from '../src/utils/csrfToken';
