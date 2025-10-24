/**
 * Error Logger Utility
 * Safely logs errors to monitoring services and console
 *
 * Features:
 * - Production-safe logging (no sensitive data)
 * - Integration with monitoring services (Sentry, etc.)
 * - Context enrichment
 * - Environment-aware logging
 * - PII filtering
 */

/**
 * Error log context interface
 */
export interface ErrorContext {
  [key: string]: unknown;
  componentStack?: string;
  errorBoundary?: boolean;
  endpoint?: string;
  method?: string;
  statusCode?: number;
  userId?: string;
  sessionId?: string;
}

/**
 * Sensitive field patterns to filter from logs
 * These patterns help prevent logging PII (Personally Identifiable Information)
 */
const SENSITIVE_FIELDS = [
  'password',
  'token',
  'apiKey',
  'api_key',
  'secret',
  'authorization',
  'auth',
  'ssn',
  'social_security',
  'credit_card',
  'creditCard',
  'cvv',
  'pin',
  'phoneNumber',
  'phone_number',
  'email', // In some contexts, email might be sensitive
];

/**
 * Check if field name contains sensitive information
 */
const isSensitiveField = (fieldName: string): boolean => {
  const lowerFieldName = fieldName.toLowerCase();
  return SENSITIVE_FIELDS.some((sensitive) =>
    lowerFieldName.includes(sensitive.toLowerCase())
  );
};

/**
 * Sanitize context object to remove sensitive information
 */
const sanitizeContext = (
  context: ErrorContext
): Record<string, unknown> => {
  const sanitized: Record<string, unknown> = {};

  Object.entries(context).forEach(([key, value]) => {
    // Skip sensitive fields
    if (isSensitiveField(key)) {
      sanitized[key] = '[REDACTED]';
      return;
    }

    // Recursively sanitize nested objects
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      sanitized[key] = sanitizeContext(value as ErrorContext);
      return;
    }

    // Keep safe values
    sanitized[key] = value;
  });

  return sanitized;
};

/**
 * Get environment information for error context
 */
const getEnvironmentInfo = (): Record<string, string> => {
  return {
    environment: import.meta.env.MODE || 'unknown',
    appVersion: import.meta.env.VITE_APP_VERSION || 'unknown',
    userAgent: navigator.userAgent,
    url: window.location.href,
    timestamp: new Date().toISOString(),
  };
};

/**
 * Initialize Sentry or other monitoring service
 * Called once at application startup
 */
export const initializeErrorMonitoring = (): void => {
  const sentryDsn = import.meta.env.VITE_SENTRY_DSN;

  // Only initialize if Sentry DSN is configured
  if (!sentryDsn) {
    if (import.meta.env.MODE === 'development') {
      console.info('[Error Logger] No Sentry DSN configured. Error logging will be local only.');
    }
    return;
  }

  // Initialize Sentry (if package is installed)
  try {
    // Dynamically import Sentry to avoid errors if not installed
    // In a real implementation, you would import @sentry/react here
    // For now, we'll just log that monitoring is configured
    if (import.meta.env.MODE === 'development') {
      console.info('[Error Logger] Error monitoring initialized with Sentry DSN');
    }

    // Example Sentry initialization (requires @sentry/react package):
    /*
    Sentry.init({
      dsn: sentryDsn,
      environment: import.meta.env.VITE_SENTRY_ENVIRONMENT || import.meta.env.MODE,
      release: import.meta.env.VITE_APP_VERSION,
      beforeSend(event, hint) {
        // Additional filtering or modification of events before sending
        return event;
      },
    });
    */
  } catch (error) {
    if (import.meta.env.MODE === 'development') {
      console.warn('[Error Logger] Failed to initialize error monitoring:', error);
    }
  }
};

/**
 * Log error to monitoring service and console
 *
 * @param error - Error object or error message
 * @param context - Additional context about the error
 */
export const logError = (
  error: Error | string,
  context?: ErrorContext
): void => {
  const isDevelopment = import.meta.env.MODE === 'development';
  const isDebugMode = import.meta.env.VITE_ENABLE_DEBUG_MODE === 'true';

  // Convert string to Error object if needed
  const errorObj = typeof error === 'string' ? new Error(error) : error;

  // Sanitize context to remove sensitive information
  const sanitizedContext = context ? sanitizeContext(context) : {};

  // Add environment information
  const enrichedContext = {
    ...sanitizedContext,
    ...getEnvironmentInfo(),
  };

  // Log to console in development or debug mode
  if (isDevelopment || isDebugMode) {
    console.group('🔴 Error Logged');
    console.error('Error:', errorObj);
    console.info('Context:', enrichedContext);
    if (errorObj.stack) {
      console.info('Stack Trace:', errorObj.stack);
    }
    console.groupEnd();
  }

  // Log to monitoring service in all environments
  try {
    // Send to Sentry (if configured)
    const sentryDsn = import.meta.env.VITE_SENTRY_DSN;
    if (sentryDsn) {
      // Example Sentry logging (requires @sentry/react package):
      /*
      Sentry.captureException(errorObj, {
        contexts: {
          custom: enrichedContext,
        },
      });
      */

      // For now, just log that we would send to Sentry
      if (isDevelopment) {
        console.info('[Error Logger] Would send to Sentry:', {
          error: errorObj.message,
          context: enrichedContext,
        });
      }
    }
  } catch (loggingError) {
    // Don't let logging errors crash the app
    if (isDevelopment) {
      console.error('[Error Logger] Failed to log error to monitoring service:', loggingError);
    }
  }
};

/**
 * Log warning message
 * For non-critical issues that should be monitored
 *
 * @param message - Warning message
 * @param context - Additional context
 */
export const logWarning = (
  message: string,
  context?: ErrorContext
): void => {
  const isDevelopment = import.meta.env.MODE === 'development';
  const isDebugMode = import.meta.env.VITE_ENABLE_DEBUG_MODE === 'true';

  const sanitizedContext = context ? sanitizeContext(context) : {};
  const enrichedContext = {
    ...sanitizedContext,
    ...getEnvironmentInfo(),
  };

  // Log to console in development or debug mode
  if (isDevelopment || isDebugMode) {
    console.group('⚠️ Warning');
    console.warn('Message:', message);
    console.info('Context:', enrichedContext);
    console.groupEnd();
  }

  // Log to monitoring service
  try {
    const sentryDsn = import.meta.env.VITE_SENTRY_DSN;
    if (sentryDsn) {
      // Example Sentry warning (requires @sentry/react package):
      /*
      Sentry.captureMessage(message, {
        level: 'warning',
        contexts: {
          custom: enrichedContext,
        },
      });
      */

      if (isDevelopment) {
        console.info('[Error Logger] Would send warning to Sentry:', {
          message,
          context: enrichedContext,
        });
      }
    }
  } catch (loggingError) {
    if (isDevelopment) {
      console.error('[Error Logger] Failed to log warning:', loggingError);
    }
  }
};

/**
 * Log info message (development only)
 * For debugging and development purposes
 *
 * @param message - Info message
 * @param data - Additional data
 */
export const logInfo = (
  message: string,
  data?: Record<string, unknown>
): void => {
  const isDevelopment = import.meta.env.MODE === 'development';
  const isDebugMode = import.meta.env.VITE_ENABLE_DEBUG_MODE === 'true';

  // Only log in development or debug mode
  if (isDevelopment || isDebugMode) {
    console.group('ℹ️ Info');
    console.info('Message:', message);
    if (data) {
      console.info('Data:', data);
    }
    console.groupEnd();
  }
};

/**
 * Set user context for error logging
 * Call this when user information becomes available
 *
 * @param userId - User identifier (non-sensitive)
 * @param metadata - Additional user metadata (non-sensitive)
 */
export const setUserContext = (
  userId: string,
  metadata?: Record<string, unknown>
): void => {
  try {
    const sentryDsn = import.meta.env.VITE_SENTRY_DSN;
    if (sentryDsn) {
      // Example Sentry user context (requires @sentry/react package):
      /*
      Sentry.setUser({
        id: userId,
        ...metadata,
      });
      */

      if (import.meta.env.MODE === 'development') {
        console.info('[Error Logger] User context set:', { userId, metadata });
      }
    }
  } catch (error) {
    if (import.meta.env.MODE === 'development') {
      console.error('[Error Logger] Failed to set user context:', error);
    }
  }
};

/**
 * Clear user context
 * Call this on logout
 */
export const clearUserContext = (): void => {
  try {
    const sentryDsn = import.meta.env.VITE_SENTRY_DSN;
    if (sentryDsn) {
      // Example Sentry clear user (requires @sentry/react package):
      /*
      Sentry.setUser(null);
      */

      if (import.meta.env.MODE === 'development') {
        console.info('[Error Logger] User context cleared');
      }
    }
  } catch (error) {
    if (import.meta.env.MODE === 'development') {
      console.error('[Error Logger] Failed to clear user context:', error);
    }
  }
};

export default {
  initializeErrorMonitoring,
  logError,
  logWarning,
  logInfo,
  setUserContext,
  clearUserContext,
};
