/**
 * Primary Cell Assessment - Root Export
 * Central export point for all data, utilities, and types
 *
 * @example
 * // Import everything
 * import * from './index';
 *
 * // Import specific modules
 * import { CONDITIONS, SENSATIONS, TREATMENTS } from './index';
 * import { validateEmail, getNextPage, submitAssessment } from './index';
 * import type { AssessmentResponse, PageProps } from './index';
 */

// Data exports
export * from './data';

// Utility exports
export * from './utils';

// Type exports
export type * from './types';

// Re-export for convenience
export { CONDITIONS, getTreatableConditions, getNonTreatableConditions } from './data/conditions';
export { SENSATIONS, getSensationsByIds } from './data/sensations';
export { TREATMENTS, getTreatmentsByCategory, groupTreatmentsByCategory } from './data/treatments';

export {
  PAGES,
  API_ENDPOINTS,
  BUDGET_RANGES,
  URGENCY_LEVELS,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
} from './utils/constants';

export {
  validateEmail,
  validatePhone,
  validateName,
  validateCurrentPage,
  validateAssessment,
} from './utils/validation';

export {
  getNextPage,
  getPreviousPage,
  shouldDisqualify,
  getProgressPercentage,
} from './utils/routing';

export {
  generatePersonalizedResults,
  generateTreatmentGapSummary,
  getRecommendedNextSteps,
} from './utils/personalization';

export {
  submitAssessment,
  saveProgress,
  sendEmailResults,
  captureLeadInfo,
  getAssessment,
  checkApiHealth,
} from './utils/api';
