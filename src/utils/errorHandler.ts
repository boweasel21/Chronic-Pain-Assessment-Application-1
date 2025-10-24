/**
 * Global Error Handler
 * Handles async errors and unhandled promise rejections
 *
 * Features:
 * - Catches unhandled promise rejections
 * - Catches global JavaScript errors
 * - Displays user-friendly notifications
 * - Logs to monitoring service
 * - Prevents duplicate error notifications
 */

import { logError, logWarning } from './errorLogger';

/**
 * Track recently shown errors to prevent duplicate notifications
 */
const recentErrors = new Set<string>();
const ERROR_DEBOUNCE_TIME = 5000; // 5 seconds

/**
 * Generate a unique key for an error to detect duplicates
 */
const getErrorKey = (error: Error | string): string => {
  if (typeof error === 'string') {
    return error;
  }
  return `${error.name}:${error.message}`;
};

/**
 * Check if error was recently shown
 */
const isRecentError = (error: Error | string): boolean => {
  const key = getErrorKey(error);
  return recentErrors.has(key);
};

/**
 * Mark error as recently shown
 */
const markErrorAsRecent = (error: Error | string): void => {
  const key = getErrorKey(error);
  recentErrors.add(key);

  // Remove from set after debounce time
  setTimeout(() => {
    recentErrors.delete(key);
  }, ERROR_DEBOUNCE_TIME);
};

/**
 * Display user-friendly error notification
 * Uses a simple banner notification (can be replaced with toast library)
 */
const showErrorNotification = (message: string): void => {
  // Check if notification already exists
  const existingNotification = document.getElementById('global-error-notification');
  if (existingNotification) {
    existingNotification.remove();
  }

  // Create notification element
  const notification = document.createElement('div');
  notification.id = 'global-error-notification';
  notification.innerHTML = `
    <div style="
      position: fixed;
      top: 20px;
      right: 20px;
      max-width: 400px;
      background-color: #FEE2E2;
      border-left: 4px solid #DC2626;
      border-radius: 8px;
      padding: 16px 20px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      z-index: 10000;
      animation: slideIn 0.3s ease-out;
      font-family: system-ui, -apple-system, sans-serif;
    ">
      <div style="display: flex; align-items: flex-start; gap: 12px;">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#DC2626" stroke-width="2" style="flex-shrink: 0;">
          <circle cx="12" cy="12" r="10"/>
          <line x1="12" y1="8" x2="12" y2="12"/>
          <line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
        <div style="flex: 1;">
          <div style="font-weight: 600; color: #991B1B; margin-bottom: 4px;">
            Error
          </div>
          <div style="color: #7F1D1D; font-size: 14px; line-height: 1.5;">
            ${message}
          </div>
        </div>
        <button
          onclick="this.closest('#global-error-notification').remove()"
          style="
            background: none;
            border: none;
            color: #991B1B;
            cursor: pointer;
            padding: 0;
            font-size: 20px;
            line-height: 1;
            flex-shrink: 0;
          "
          aria-label="Close"
        >
          &times;
        </button>
      </div>
    </div>
  `;

  // Add animation styles
  const style = document.createElement('style');
  style.textContent = `
    @keyframes slideIn {
      from {
        transform: translateX(100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
  `;
  document.head.appendChild(style);

  // Add to DOM
  document.body.appendChild(notification);

  // Auto-remove after 10 seconds
  setTimeout(() => {
    const element = document.getElementById('global-error-notification');
    if (element) {
      element.style.animation = 'slideIn 0.3s ease-out reverse';
      setTimeout(() => element.remove(), 300);
    }
  }, 10000);
};

/**
 * Handle unhandled promise rejection
 */
const handleUnhandledRejection = (event: PromiseRejectionEvent): void => {
  event.preventDefault(); // Prevent default browser error logging

  const error = event.reason;
  const errorObj = error instanceof Error ? error : new Error(String(error));

  // Don't show duplicate errors
  if (isRecentError(errorObj)) {
    return;
  }

  // Log error
  logError(errorObj, {
    type: 'unhandledRejection',
    promise: event.promise,
  });

  // Mark as recent
  markErrorAsRecent(errorObj);

  // Show user notification
  const isDevelopment = import.meta.env.MODE === 'development';
  const message = isDevelopment
    ? `Promise Rejection: ${errorObj.message}`
    : 'An unexpected error occurred. Please try again.';

  showErrorNotification(message);
};

/**
 * Handle global JavaScript errors
 */
const handleGlobalError = (event: ErrorEvent): void => {
  event.preventDefault(); // Prevent default browser error logging

  const { error, message, filename, lineno, colno } = event;
  const errorObj = error || new Error(message);

  // Don't show duplicate errors
  if (isRecentError(errorObj)) {
    return;
  }

  // Log error
  logError(errorObj, {
    type: 'globalError',
    filename,
    lineno,
    colno,
  });

  // Mark as recent
  markErrorAsRecent(errorObj);

  // Show user notification
  const isDevelopment = import.meta.env.MODE === 'development';
  const errorMessage = isDevelopment
    ? `JavaScript Error: ${errorObj.message}`
    : 'An unexpected error occurred. Please try again.';

  showErrorNotification(errorMessage);
};

/**
 * Handle resource loading errors (images, scripts, etc.)
 */
const handleResourceError = (event: Event): void => {
  const target = event.target as HTMLElement;

  // Only handle specific resource types
  if (
    target.tagName === 'IMG' ||
    target.tagName === 'SCRIPT' ||
    target.tagName === 'LINK'
  ) {
    const resourceType = target.tagName.toLowerCase();
    const resourceUrl =
      target.getAttribute('src') || target.getAttribute('href') || 'unknown';

    // Log warning (not error, as resource errors are often non-critical)
    logWarning(`Failed to load ${resourceType}`, {
      type: 'resourceError',
      resourceType,
      resourceUrl,
    });

    // For critical resources (scripts), show notification
    if (target.tagName === 'SCRIPT') {
      const isDevelopment = import.meta.env.MODE === 'development';
      const message = isDevelopment
        ? `Failed to load script: ${resourceUrl}`
        : 'Failed to load required resources. Please refresh the page.';

      showErrorNotification(message);
    }
  }
};

/**
 * Setup global error handlers
 * Should be called once at application startup
 */
export const setupGlobalErrorHandlers = (): void => {
  const isDevelopment = import.meta.env.MODE === 'development';

  // Handle unhandled promise rejections
  window.addEventListener('unhandledrejection', handleUnhandledRejection);

  // Handle global JavaScript errors
  window.addEventListener('error', (event) => {
    // Check if it's a resource error
    if (event.target !== window) {
      handleResourceError(event);
    } else {
      handleGlobalError(event);
    }
  });

  if (isDevelopment) {
    console.info('[Error Handler] Global error handlers initialized');
  }
};

/**
 * Cleanup global error handlers
 * Should be called when unmounting or for testing
 */
export const cleanupGlobalErrorHandlers = (): void => {
  window.removeEventListener('unhandledrejection', handleUnhandledRejection);
  window.removeEventListener('error', handleGlobalError);

  // Clear recent errors
  recentErrors.clear();

  // Remove any existing notification
  const notification = document.getElementById('global-error-notification');
  if (notification) {
    notification.remove();
  }

  const isDevelopment = import.meta.env.MODE === 'development';
  if (isDevelopment) {
    console.info('[Error Handler] Global error handlers cleaned up');
  }
};

/**
 * Utility to wrap async functions with error handling
 * Useful for event handlers and callbacks
 *
 * @example
 * ```typescript
 * const handleClick = withErrorHandling(async () => {
 *   await fetchData();
 * });
 * ```
 */
export const withErrorHandling = <T extends (...args: any[]) => Promise<any>>(
  fn: T,
  context?: Record<string, unknown>
): T => {
  return (async (...args: any[]) => {
    try {
      return await fn(...args);
    } catch (error) {
      const errorObj = error instanceof Error ? error : new Error(String(error));

      logError(errorObj, {
        ...context,
        type: 'wrappedAsyncFunction',
      });

      // Show notification
      const isDevelopment = import.meta.env.MODE === 'development';
      const message = isDevelopment
        ? `Error: ${errorObj.message}`
        : 'An error occurred. Please try again.';

      showErrorNotification(message);

      throw error; // Re-throw to allow caller to handle if needed
    }
  }) as T;
};

export default {
  setupGlobalErrorHandlers,
  cleanupGlobalErrorHandlers,
  withErrorHandling,
};
