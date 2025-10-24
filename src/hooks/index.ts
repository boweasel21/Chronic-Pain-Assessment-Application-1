/**
 * Hooks Module Exports
 *
 * @description Central export point for all custom React hooks used throughout
 * the application. This provides a clean import interface for consuming components.
 *
 * @module hooks
 */

// Accessibility hooks
export {
  usePrefersReducedMotion,
  usePageFocus,
  useAnnounce,
  useSkipLink,
  type LiveRegionPriority
} from './useAccessibility';

// Re-export default object for convenience
export { default as accessibility } from './useAccessibility';

// CSRF Protection hooks
export {
  useCsrf,
  useCsrfInit,
  useCsrfStatus,
} from './useCsrf';
