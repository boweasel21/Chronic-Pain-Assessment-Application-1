/**
 * Shared types for LeadCapture components
 * @module LeadCapture/types
 */

/**
 * RFC 5322 compliant email validation regex
 */
export const RFC5322_EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

/**
 * Phone validation regex - minimum 10 digits
 */
export const PHONE_REGEX = /^\d{10,}$/;

/**
 * Name validation regex - letters, spaces, hyphens, apostrophes only
 */
export const NAME_REGEX = /^[a-zA-Z\s-']+$/;

/**
 * Form field values interface
 * @interface FormValues
 */
export interface FormValues {
  /** User's full name */
  name: string;
  /** User's email address */
  email: string;
  /** User's phone number */
  phone: string;
}

/**
 * Form field errors interface
 * @interface FormErrors
 */
export interface FormErrors {
  /** Name field error message */
  name?: string;
  /** Email field error message */
  email?: string;
  /** Phone field error message */
  phone?: string;
}

/**
 * Form field touched state interface
 * @interface FormTouched
 */
export interface FormTouched {
  /** Whether name field has been touched */
  name: boolean;
  /** Whether email field has been touched */
  email: boolean;
  /** Whether phone field has been touched */
  phone: boolean;
}

/**
 * Form submission states
 * @typedef {string} SubmissionState
 */
export type SubmissionState = 'idle' | 'loading' | 'success' | 'error';

/**
 * Form field names type
 * @typedef {string} FormFieldName
 */
export type FormFieldName = 'name' | 'email' | 'phone';
