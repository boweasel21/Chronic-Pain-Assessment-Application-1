/**
 * LeadCapture Module Exports
 * @module LeadCapture
 */

// Main component
export { LeadCapture } from './LeadCapture';
export { default } from './LeadCapture';

// Sub-components (for testing or reuse)
export { ContactFormInputs } from './ContactFormInputs';
export { PrivacyNotice } from './PrivacyNotice';
export { ErrorDisplay } from './ErrorDisplay';
export { SuccessAnimation } from './SuccessAnimation';
export { SubmissionStatus } from './SubmissionStatus';

// Types
export type {
  FormValues,
  FormErrors,
  FormTouched,
  SubmissionState,
  FormFieldName,
} from './types';

// Validation constants
export {
  RFC5322_EMAIL_REGEX,
  PHONE_REGEX,
  NAME_REGEX,
} from './types';
