/**
 * CSRF Protection React Hook
 * Initializes CSRF token on component mount and provides token management
 *
 * Usage:
 * - Import at root level (App.tsx) to initialize CSRF protection
 * - Can also be used in components that need token refresh functionality
 *
 * @module useCsrf
 */

import { useEffect, useState, useCallback } from 'react';
import {
  fetchCsrfToken,
  getCsrfToken,
  refreshCsrfToken,
  clearCsrfToken,
  getTokenInfo,
  CsrfError,
} from '../utils/csrfToken';

/**
 * CSRF hook state interface
 */
interface UseCsrfState {
  /** Whether CSRF token is currently being fetched */
  isLoading: boolean;
  /** Whether CSRF token is available and valid */
  isReady: boolean;
  /** Any error that occurred during token fetch */
  error: CsrfError | Error | null;
  /** Current CSRF token (null if not available) */
  token: string | null;
  /** Token expiration timestamp (null if not available) */
  expiresAt: string | null;
}

/**
 * CSRF hook return value
 */
interface UseCsrfReturn extends UseCsrfState {
  /** Manually refresh the CSRF token */
  refresh: () => Promise<void>;
  /** Clear the CSRF token */
  clear: () => void;
  /** Get current token info */
  getInfo: () => ReturnType<typeof getTokenInfo>;
}

/**
 * Hook options
 */
interface UseCsrfOptions {
  /** Whether to automatically fetch token on mount (default: true) */
  autoFetch?: boolean;
  /** Whether to automatically refresh token when expired (default: false) */
  autoRefresh?: boolean;
  /** Refresh interval in milliseconds (only used if autoRefresh is true) */
  refreshInterval?: number;
  /** Callback when token is successfully fetched */
  onSuccess?: (token: string) => void;
  /** Callback when token fetch fails */
  onError?: (error: CsrfError | Error) => void;
}

/**
 * React hook for CSRF protection
 * Fetches and manages CSRF token lifecycle
 *
 * @param options - Hook configuration options
 * @returns CSRF state and management functions
 *
 * @example
 * ```typescript
 * // Basic usage in App.tsx
 * function App() {
 *   const csrf = useCsrf();
 *
 *   if (!csrf.isReady) {
 *     return <div>Initializing security...</div>;
 *   }
 *
 *   return <YourApp />;
 * }
 * ```
 *
 * @example
 * ```typescript
 * // Advanced usage with options
 * function App() {
 *   const csrf = useCsrf({
 *     autoRefresh: true,
 *     refreshInterval: 300000, // 5 minutes
 *     onError: (error) => {
 *       console.error('CSRF error:', error);
 *       showNotification('Security initialization failed');
 *     }
 *   });
 *
 *   return <YourApp />;
 * }
 * ```
 *
 * @example
 * ```typescript
 * // Manual token refresh
 * function SecuritySettings() {
 *   const { refresh, isLoading, error } = useCsrf({ autoFetch: false });
 *
 *   const handleRefresh = async () => {
 *     await refresh();
 *   };
 *
 *   return (
 *     <button onClick={handleRefresh} disabled={isLoading}>
 *       Refresh Security Token
 *     </button>
 *   );
 * }
 * ```
 */
export const useCsrf = (options: UseCsrfOptions = {}): UseCsrfReturn => {
  const {
    autoFetch = true,
    autoRefresh = false,
    refreshInterval = 300000, // 5 minutes default
    onSuccess,
    onError,
  } = options;

  const [state, setState] = useState<UseCsrfState>({
    isLoading: false,
    isReady: false,
    error: null,
    token: null,
    expiresAt: null,
  });

  /**
   * Fetches CSRF token and updates state
   */
  const fetchToken = useCallback(async (): Promise<void> => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const token = await fetchCsrfToken();
      const info = getTokenInfo();

      setState({
        isLoading: false,
        isReady: true,
        error: null,
        token,
        expiresAt: info?.expiresAt ?? null,
      });

      onSuccess?.(token);
    } catch (error) {
      const csrfError =
        error instanceof CsrfError || error instanceof Error
          ? error
          : new Error('Unknown CSRF error');

      setState((prev) => ({
        ...prev,
        isLoading: false,
        isReady: false,
        error: csrfError,
      }));

      onError?.(csrfError);
    }
  }, [onSuccess, onError]);

  /**
   * Refreshes CSRF token
   */
  const refresh = useCallback(async (): Promise<void> => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const token = await refreshCsrfToken();
      const info = getTokenInfo();

      setState({
        isLoading: false,
        isReady: true,
        error: null,
        token,
        expiresAt: info?.expiresAt ?? null,
      });

      onSuccess?.(token);
    } catch (error) {
      const csrfError =
        error instanceof CsrfError || error instanceof Error
          ? error
          : new Error('Unknown CSRF error');

      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: csrfError,
      }));

      onError?.(csrfError);
    }
  }, [onSuccess, onError]);

  /**
   * Clears CSRF token
   */
  const clear = useCallback((): void => {
    clearCsrfToken();
    setState({
      isLoading: false,
      isReady: false,
      error: null,
      token: null,
      expiresAt: null,
    });
  }, []);

  /**
   * Gets current token info
   */
  const getInfo = useCallback(() => {
    return getTokenInfo();
  }, []);

  /**
   * Fetch token on mount if autoFetch is enabled
   */
  useEffect(() => {
    if (autoFetch) {
      fetchToken().catch((error) => {
        // Error already handled in fetchToken
        if (import.meta.env.DEV) {
          // eslint-disable-next-line no-console
          console.error('[useCsrf] Initial token fetch failed:', error);
        }
      });
    }
  }, [autoFetch, fetchToken]);

  /**
   * Set up auto-refresh if enabled
   */
  useEffect(() => {
    if (!autoRefresh || !state.isReady) {
      return;
    }

    const intervalId = setInterval(() => {
      const info = getTokenInfo();

      // Refresh if token is expired or expiring soon
      if (!info || info.isExpired) {
        refresh().catch((error) => {
          if (import.meta.env.DEV) {
            // eslint-disable-next-line no-console
            console.error('[useCsrf] Auto-refresh failed:', error);
          }
        });
      }
    }, refreshInterval);

    return () => {
      clearInterval(intervalId);
    };
  }, [autoRefresh, refreshInterval, state.isReady, refresh]);

  return {
    ...state,
    refresh,
    clear,
    getInfo,
  };
};

/**
 * Hook that only initializes CSRF protection without returning state
 * Useful when you just want to initialize at app root and don't need state
 *
 * @example
 * ```typescript
 * function App() {
 *   useCsrfInit(); // Initialize and forget
 *
 *   return <YourApp />;
 * }
 * ```
 */
export const useCsrfInit = (): void => {
  useEffect(() => {
    fetchCsrfToken().catch((error) => {
      if (import.meta.env.DEV) {
        // eslint-disable-next-line no-console
        console.error('[useCsrfInit] CSRF initialization failed:', error);
      }
    });
  }, []);
};

/**
 * Hook for components that need to check CSRF token status
 * Does not fetch token, only reads current state
 *
 * @returns Current CSRF token status
 *
 * @example
 * ```typescript
 * function SecurityIndicator() {
 *   const status = useCsrfStatus();
 *
 *   return (
 *     <div>
 *       CSRF Status: {status.hasToken ? 'Protected' : 'Unprotected'}
 *       {status.expiresAt && <span>Expires: {status.expiresAt}</span>}
 *     </div>
 *   );
 * }
 * ```
 */
export const useCsrfStatus = (): {
  hasToken: boolean;
  token: string | null;
  expiresAt: string | null;
  timeRemaining: number | null;
  isExpired: boolean;
} => {
  const [status, setStatus] = useState(() => {
    const token = getCsrfToken();
    const info = getTokenInfo();

    return {
      hasToken: token !== null,
      token,
      expiresAt: info?.expiresAt ?? null,
      timeRemaining: info?.timeRemaining ?? null,
      isExpired: info?.isExpired ?? true,
    };
  });

  useEffect(() => {
    // Update status periodically
    const intervalId = setInterval(() => {
      const token = getCsrfToken();
      const info = getTokenInfo();

      setStatus({
        hasToken: token !== null,
        token,
        expiresAt: info?.expiresAt ?? null,
        timeRemaining: info?.timeRemaining ?? null,
        isExpired: info?.isExpired ?? true,
      });
    }, 1000); // Check every second

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  return status;
};
