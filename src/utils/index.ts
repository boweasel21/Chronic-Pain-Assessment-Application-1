/**
 * Utils Index
 * Central export point for all utility functions
 */

export {
  logError,
  logWarning,
  logInfo,
  setUserContext,
  clearUserContext,
  initializeErrorMonitoring,
} from './errorLogger';

export type { ErrorContext } from './errorLogger';

export {
  setupGlobalErrorHandlers,
  cleanupGlobalErrorHandlers,
  withErrorHandling,
} from './errorHandler';

export {
  validateEnvironment,
  getEnvironmentSummary,
  displayValidationError,
  EnvironmentValidationError,
} from './environmentValidator';

// CSRF Protection
export {
  fetchCsrfToken,
  getCsrfToken,
  setCsrfToken,
  clearCsrfToken,
  refreshCsrfToken,
  getTokenInfo,
  CsrfError,
} from './csrfToken';

export type { CsrfErrorCode } from './csrfToken';
