/**
 * API Utility
 * Production-ready HTTP client with error handling and logging
 *
 * Features:
 * - Automatic error logging
 * - Request/response interceptors
 * - Timeout handling
 * - Type-safe error handling
 * - Retry logic
 * - Request cancellation
 */

import { logError, logWarning } from './errorLogger';

/**
 * API Error class
 * Custom error class for API-related errors
 */
export class APIError extends Error {
  constructor(
    message: string,
    public readonly statusCode?: number,
    public readonly endpoint?: string,
    public readonly method?: string,
    public readonly responseData?: unknown
  ) {
    super(message);
    this.name = 'APIError';
  }
}

/**
 * API request options
 */
export interface APIRequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  headers?: Record<string, string>;
  body?: unknown;
  timeout?: number;
  retries?: number;
  retryDelay?: number;
  signal?: AbortSignal;
}

/**
 * API response type
 */
export interface APIResponse<T = unknown> {
  data: T;
  status: number;
  statusText: string;
  headers: Headers;
}

/**
 * Default request timeout (30 seconds)
 */
const DEFAULT_TIMEOUT = Number(import.meta.env.VITE_API_TIMEOUT) || 30000;

/**
 * Default retry configuration
 */
const DEFAULT_RETRIES = 0;
const DEFAULT_RETRY_DELAY = 1000;

/**
 * Get base URL from environment
 */
const getBaseURL = (): string => {
  const baseUrl = import.meta.env.VITE_API_BASE_URL;
  if (!baseUrl) {
    throw new Error('VITE_API_BASE_URL is not configured');
  }
  return baseUrl;
};

/**
 * Create abort controller with timeout
 */
const createTimeoutController = (
  timeout: number,
  externalSignal?: AbortSignal
): AbortController => {
  const controller = new AbortController();

  // Set timeout
  const timeoutId = setTimeout(() => {
    controller.abort();
  }, timeout);

  // Listen to external signal if provided
  if (externalSignal) {
    externalSignal.addEventListener('abort', () => {
      clearTimeout(timeoutId);
      controller.abort();
    });
  }

  return controller;
};

/**
 * Delay for retry
 */
const delay = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

/**
 * Check if error is retryable
 */
const isRetryableError = (error: unknown): boolean => {
  if (error instanceof APIError) {
    // Retry on 5xx errors or network errors
    return (
      !error.statusCode ||
      (error.statusCode >= 500 && error.statusCode < 600)
    );
  }

  // Retry on network errors
  if (error instanceof TypeError && error.message.includes('fetch')) {
    return true;
  }

  return false;
};

/**
 * Make HTTP request
 */
export const request = async <T = unknown>(
  endpoint: string,
  options: APIRequestOptions = {}
): Promise<APIResponse<T>> => {
  const {
    method = 'GET',
    headers = {},
    body,
    timeout = DEFAULT_TIMEOUT,
    retries = DEFAULT_RETRIES,
    retryDelay = DEFAULT_RETRY_DELAY,
    signal,
  } = options;

  const baseUrl = getBaseURL();
  const url = endpoint.startsWith('http')
    ? endpoint
    : `${baseUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  // Create abort controller with timeout
  const controller = createTimeoutController(timeout, signal);

  // Prepare request options
  const fetchOptions: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    signal: controller.signal,
  };

  // Add body if present
  if (body && method !== 'GET') {
    fetchOptions.body = JSON.stringify(body);
  }

  let lastError: unknown;
  let attempt = 0;

  // Retry loop
  while (attempt <= retries) {
    try {
      if (import.meta.env.MODE === 'development' && import.meta.env.VITE_ENABLE_DEBUG_MODE === 'true') {
        console.info(`[API] ${method} ${url}`, { attempt, body });
      }

      const response = await fetch(url, fetchOptions);

      // Parse response
      let data: T;
      const contentType = response.headers.get('content-type');

      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        data = (await response.text()) as unknown as T;
      }

      // Check if response is successful
      if (!response.ok) {
        const error = new APIError(
          `HTTP ${response.status}: ${response.statusText}`,
          response.status,
          endpoint,
          method,
          data
        );

        // Log error
        logError(error, {
          endpoint,
          method,
          statusCode: response.status,
          responseData: data,
          attempt,
        });

        throw error;
      }

      // Log successful request in debug mode
      if (import.meta.env.MODE === 'development' && import.meta.env.VITE_ENABLE_DEBUG_MODE === 'true') {
        console.info(`[API] ${method} ${url} - Success`, data);
      }

      return {
        data,
        status: response.status,
        statusText: response.statusText,
        headers: response.headers,
      };
    } catch (error) {
      lastError = error;

      // Check if we should retry
      if (attempt < retries && isRetryableError(error)) {
        attempt++;
        logWarning(`Retrying request (attempt ${attempt}/${retries})`, {
          endpoint,
          method,
          error: error instanceof Error ? error.message : String(error),
        });
        await delay(retryDelay * attempt); // Exponential backoff
        continue;
      }

      // Convert to APIError if not already
      if (!(error instanceof APIError)) {
        const apiError = new APIError(
          error instanceof Error ? error.message : String(error),
          undefined,
          endpoint,
          method
        );

        // Log error
        logError(apiError, {
          endpoint,
          method,
          originalError: error,
          attempt,
        });

        throw apiError;
      }

      throw error;
    }
  }

  // Should never reach here, but TypeScript needs it
  throw lastError;
};

/**
 * GET request
 */
export const get = <T = unknown>(
  endpoint: string,
  options?: Omit<APIRequestOptions, 'method' | 'body'>
): Promise<APIResponse<T>> => {
  return request<T>(endpoint, { ...options, method: 'GET' });
};

/**
 * POST request
 */
export const post = <T = unknown>(
  endpoint: string,
  body?: unknown,
  options?: Omit<APIRequestOptions, 'method' | 'body'>
): Promise<APIResponse<T>> => {
  return request<T>(endpoint, { ...options, method: 'POST', body });
};

/**
 * PUT request
 */
export const put = <T = unknown>(
  endpoint: string,
  body?: unknown,
  options?: Omit<APIRequestOptions, 'method' | 'body'>
): Promise<APIResponse<T>> => {
  return request<T>(endpoint, { ...options, method: 'PUT', body });
};

/**
 * PATCH request
 */
export const patch = <T = unknown>(
  endpoint: string,
  body?: unknown,
  options?: Omit<APIRequestOptions, 'method' | 'body'>
): Promise<APIResponse<T>> => {
  return request<T>(endpoint, { ...options, method: 'PATCH', body });
};

/**
 * DELETE request
 */
export const del = <T = unknown>(
  endpoint: string,
  options?: Omit<APIRequestOptions, 'method' | 'body'>
): Promise<APIResponse<T>> => {
  return request<T>(endpoint, { ...options, method: 'DELETE' });
};

/**
 * Create abort controller for request cancellation
 */
export const createAbortController = (): AbortController => {
  return new AbortController();
};

export default {
  request,
  get,
  post,
  put,
  patch,
  del,
  createAbortController,
  APIError,
};
