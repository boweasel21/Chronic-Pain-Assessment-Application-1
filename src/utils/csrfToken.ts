/**
 * CSRF Token Management Utility
 * Handles secure storage and retrieval of CSRF tokens for API protection
 *
 * Security Features:
 * - In-memory storage (not localStorage) to prevent XSS token theft
 * - Automatic token refresh on expiration
 * - Type-safe error handling
 * - Production-ready logging
 *
 * @module csrfToken
 */

/**
 * CSRF token response structure from server
 */
interface CsrfTokenResponse {
  token: string;
  expiresAt?: string;
}

/**
 * CSRF error codes for structured error handling
 */
export enum CsrfErrorCode {
  FETCH_FAILED = 'CSRF_FETCH_FAILED',
  TOKEN_EXPIRED = 'CSRF_TOKEN_EXPIRED',
  TOKEN_INVALID = 'CSRF_TOKEN_INVALID',
  NETWORK_ERROR = 'CSRF_NETWORK_ERROR',
  SERVER_ERROR = 'CSRF_SERVER_ERROR',
}

/**
 * CSRF Error class for structured error handling
 */
export class CsrfError extends Error {
  constructor(
    message: string,
    public code: CsrfErrorCode,
    public statusCode?: number,
    public details?: unknown
  ) {
    super(message);
    this.name = 'CsrfError';
  }
}

/**
 * Environment configuration
 */
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';
const CSRF_ENDPOINT = `${API_BASE_URL}/api/csrf-token`;
const TOKEN_REFRESH_THRESHOLD = 60000; // Refresh if expiring within 1 minute

/**
 * In-memory token storage (more secure than localStorage)
 * Using closure to prevent direct access from outside this module
 */
let csrfToken: string | null = null;
let tokenExpiresAt: Date | null = null;
let tokenFetchPromise: Promise<string> | null = null;

/**
 * Logs CSRF-related events for debugging
 * Only logs in development mode to avoid exposing sensitive info
 *
 * @param level - Log level (debug, info, warn, error)
 * @param message - Log message
 * @param data - Additional data to log (optional)
 */
const logCsrfEvent = (
  level: 'debug' | 'info' | 'warn' | 'error',
  message: string,
  data?: unknown
): void => {
  if (import.meta.env.DEV) {
    const timestamp = new Date().toISOString();
    const logData = {
      timestamp,
      message,
      ...(data && { data }),
    };

    // eslint-disable-next-line no-console
    console[level]('[CSRF]', logData);
  }
};

/**
 * Checks if the current token is expired or expiring soon
 *
 * @returns True if token is expired or expiring within threshold
 */
const isTokenExpired = (): boolean => {
  if (!tokenExpiresAt) {
    return true;
  }

  const now = new Date();
  const timeUntilExpiry = tokenExpiresAt.getTime() - now.getTime();

  return timeUntilExpiry <= TOKEN_REFRESH_THRESHOLD;
};

/**
 * Fetches a new CSRF token from the server
 * Implements singleton pattern to prevent concurrent fetch requests
 *
 * Expected server endpoint: GET /api/csrf-token
 * Expected response: { token: string, expiresAt?: string }
 *
 * @returns Promise resolving to the CSRF token string
 * @throws {CsrfError} If token fetch fails
 *
 * @example
 * ```typescript
 * try {
 *   const token = await fetchCsrfToken();
 *   console.log('CSRF token obtained:', token);
 * } catch (error) {
 *   if (error instanceof CsrfError) {
 *     console.error('CSRF error:', error.code, error.message);
 *   }
 * }
 * ```
 */
export const fetchCsrfToken = async (): Promise<string> => {
  // Return existing token if valid
  if (csrfToken && !isTokenExpired()) {
    logCsrfEvent('debug', 'Using cached CSRF token');
    return csrfToken;
  }

  // Return in-progress fetch if one exists
  if (tokenFetchPromise) {
    logCsrfEvent('debug', 'Waiting for in-progress CSRF token fetch');
    return tokenFetchPromise;
  }

  // Create new fetch promise
  tokenFetchPromise = (async () => {
    try {
      logCsrfEvent('info', 'Fetching new CSRF token from server');

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

      const response = await fetch(CSRF_ENDPOINT, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Important: Include cookies for session-based CSRF
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));

        logCsrfEvent('error', 'CSRF token fetch failed', {
          status: response.status,
          error: errorData,
        });

        throw new CsrfError(
          errorData.message || 'Failed to fetch CSRF token',
          response.status >= 500
            ? CsrfErrorCode.SERVER_ERROR
            : CsrfErrorCode.FETCH_FAILED,
          response.status,
          errorData
        );
      }

      const data: CsrfTokenResponse = await response.json();

      if (!data.token || typeof data.token !== 'string') {
        logCsrfEvent('error', 'Invalid CSRF token response', data);
        throw new CsrfError(
          'Invalid CSRF token received from server',
          CsrfErrorCode.TOKEN_INVALID
        );
      }

      // Store token in memory
      csrfToken = data.token;

      // Set expiration time if provided
      if (data.expiresAt) {
        tokenExpiresAt = new Date(data.expiresAt);
      } else {
        // Default: 1 hour expiration
        tokenExpiresAt = new Date(Date.now() + 3600000);
      }

      logCsrfEvent('info', 'CSRF token fetched successfully', {
        expiresAt: tokenExpiresAt.toISOString(),
      });

      return csrfToken;
    } catch (error) {
      logCsrfEvent('error', 'CSRF token fetch error', error);

      // Handle abort/timeout
      if (error instanceof Error && error.name === 'AbortError') {
        throw new CsrfError(
          'CSRF token request timeout. Please try again.',
          CsrfErrorCode.NETWORK_ERROR
        );
      }

      // Handle network errors
      if (error instanceof TypeError) {
        throw new CsrfError(
          'Network error while fetching CSRF token. Please check your connection.',
          CsrfErrorCode.NETWORK_ERROR
        );
      }

      // Re-throw CsrfError as-is
      if (error instanceof CsrfError) {
        throw error;
      }

      // Wrap unknown errors
      throw new CsrfError(
        'Unexpected error while fetching CSRF token',
        CsrfErrorCode.FETCH_FAILED,
        undefined,
        error
      );
    } finally {
      // Clear the fetch promise
      tokenFetchPromise = null;
    }
  })();

  return tokenFetchPromise;
};

/**
 * Stores a CSRF token in memory
 * Used when a token is provided by the server in an API response
 *
 * Security Note: Token is stored in memory only, not localStorage,
 * to prevent XSS attacks from stealing the token
 *
 * @param token - The CSRF token string to store
 * @param expiresAt - Optional expiration timestamp (ISO string or Date)
 *
 * @example
 * ```typescript
 * // Store token from server response
 * setCsrfToken('abc123xyz', '2025-10-24T12:00:00Z');
 * ```
 */
export const setCsrfToken = (token: string, expiresAt?: string | Date): void => {
  if (!token || typeof token !== 'string') {
    logCsrfEvent('warn', 'Attempted to set invalid CSRF token', { token });
    return;
  }

  csrfToken = token;

  if (expiresAt) {
    tokenExpiresAt = typeof expiresAt === 'string' ? new Date(expiresAt) : expiresAt;
  } else {
    // Default: 1 hour expiration
    tokenExpiresAt = new Date(Date.now() + 3600000);
  }

  logCsrfEvent('debug', 'CSRF token stored in memory', {
    expiresAt: tokenExpiresAt.toISOString(),
  });
};

/**
 * Retrieves the current CSRF token from memory
 * Returns null if no token exists or if token is expired
 *
 * @returns The current CSRF token or null if unavailable/expired
 *
 * @example
 * ```typescript
 * const token = getCsrfToken();
 * if (token) {
 *   // Use token in API request
 *   headers['X-CSRF-Token'] = token;
 * } else {
 *   // Fetch new token
 *   await fetchCsrfToken();
 * }
 * ```
 */
export const getCsrfToken = (): string | null => {
  if (!csrfToken) {
    logCsrfEvent('debug', 'No CSRF token in memory');
    return null;
  }

  if (isTokenExpired()) {
    logCsrfEvent('warn', 'CSRF token expired', {
      expiresAt: tokenExpiresAt?.toISOString(),
    });
    return null;
  }

  return csrfToken;
};

/**
 * Clears the CSRF token from memory
 * Should be called on user logout or session termination
 *
 * Security Note: Always clear tokens when user session ends
 * to prevent token reuse
 *
 * @example
 * ```typescript
 * // On user logout
 * clearCsrfToken();
 * // Also clear other session data...
 * ```
 */
export const clearCsrfToken = (): void => {
  const hadToken = csrfToken !== null;

  csrfToken = null;
  tokenExpiresAt = null;
  tokenFetchPromise = null;

  if (hadToken) {
    logCsrfEvent('info', 'CSRF token cleared from memory');
  }
};

/**
 * Refreshes the CSRF token if expired or expiring soon
 * Useful for long-lived sessions
 *
 * @returns Promise resolving to the refreshed token
 * @throws {CsrfError} If token refresh fails
 *
 * @example
 * ```typescript
 * // Refresh token periodically
 * setInterval(async () => {
 *   try {
 *     await refreshCsrfToken();
 *   } catch (error) {
 *     console.error('Token refresh failed:', error);
 *   }
 * }, 300000); // Every 5 minutes
 * ```
 */
export const refreshCsrfToken = async (): Promise<string> => {
  logCsrfEvent('info', 'Refreshing CSRF token');

  // Clear existing token to force fetch
  csrfToken = null;
  tokenExpiresAt = null;

  return fetchCsrfToken();
};

/**
 * Gets token expiration information
 * Useful for UI components that want to display token status
 *
 * @returns Object with expiration info or null if no token
 *
 * @example
 * ```typescript
 * const info = getTokenInfo();
 * if (info) {
 *   console.log(`Token expires at: ${info.expiresAt}`);
 *   console.log(`Time remaining: ${info.timeRemaining}ms`);
 * }
 * ```
 */
export const getTokenInfo = (): {
  hasToken: boolean;
  expiresAt: string | null;
  timeRemaining: number | null;
  isExpired: boolean;
} | null => {
  if (!csrfToken) {
    return null;
  }

  const now = Date.now();
  const expiresAtTime = tokenExpiresAt?.getTime() ?? null;
  const timeRemaining = expiresAtTime ? expiresAtTime - now : null;

  return {
    hasToken: true,
    expiresAt: tokenExpiresAt?.toISOString() ?? null,
    timeRemaining,
    isExpired: isTokenExpired(),
  };
};
