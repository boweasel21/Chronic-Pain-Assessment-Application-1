/**
 * Validation utility functions for Primary Cell Assessment
 * Handles form validation, input sanitization, and error reporting
 */

import {
  VALIDATION_RULES,
  ERROR_MESSAGES,
  PAGES,
} from './constants';
import {
  sanitizeEmail,
  sanitizePhone,
  sanitizeName,
  sanitizeText,
} from './sanitizer';

/**
 * Validation result interface
 */
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

/**
 * Assessment response structure (for validation)
 */
export interface AssessmentResponses {
  conditions?: string[];
  sensations?: string[];
  duration?: string;
  intensity?: number;
  previousTreatments?: string[];
  hasBudget?: boolean;
  budgetRange?: string;
  urgency?: string;
  activityImpact?: string;
  goals?: string;
  name?: string;
  email?: string;
  phone?: string;
  currentPage?: string;
}

/**
 * Validates email address format
 *
 * @description Sanitizes and validates email address format.
 * SECURITY: Sanitizes input before validation to prevent injection attacks.
 *
 * @param {string} email - Email address to validate
 * @returns {boolean} True if email is valid after sanitization
 */
export const validateEmail = (email: string): boolean => {
  if (!email || typeof email !== 'string') {
    return false;
  }

  const sanitized = sanitizeEmail(email);

  if (sanitized.length === 0) {
    return false;
  }

  return VALIDATION_RULES.EMAIL_REGEX.test(sanitized);
};

/**
 * Validates phone number format
 *
 * @description Sanitizes and validates phone number format.
 * SECURITY: Sanitizes input before validation to prevent injection attacks.
 *
 * @param {string} phone - Phone number to validate
 * @returns {boolean} True if phone is valid after sanitization
 */
export const validatePhone = (phone: string): boolean => {
  if (!phone || typeof phone !== 'string') {
    return false;
  }

  const sanitized = sanitizePhone(phone);

  if (sanitized.length === 0) {
    return false;
  }

  const digitsOnly = sanitized.replace(/\D/g, '');

  if (digitsOnly.length < VALIDATION_RULES.PHONE_MIN_LENGTH) {
    return false;
  }

  return VALIDATION_RULES.PHONE_REGEX.test(sanitized);
};

/**
 * Validates name format
 *
 * @description Sanitizes and validates name format.
 * SECURITY: Sanitizes input before validation to prevent injection attacks.
 *
 * @param {string} name - Name to validate
 * @returns {boolean} True if name is valid after sanitization
 */
export const validateName = (name: string): boolean => {
  if (!name || typeof name !== 'string') {
    return false;
  }

  const sanitized = sanitizeName(name, VALIDATION_RULES.NAME_MAX_LENGTH);

  if (
    sanitized.length < VALIDATION_RULES.NAME_MIN_LENGTH ||
    sanitized.length > VALIDATION_RULES.NAME_MAX_LENGTH
  ) {
    return false;
  }

  return true;
};

/**
 * Validates condition selection
 * @param conditions - Array of condition IDs
 * @returns Validation result
 */
export const validateConditions = (conditions?: string[]): ValidationResult => {
  const errors: string[] = [];

  if (!conditions || !Array.isArray(conditions)) {
    errors.push(ERROR_MESSAGES.MIN_CONDITIONS);
    return { isValid: false, errors };
  }

  if (conditions.length < VALIDATION_RULES.MIN_CONDITIONS) {
    errors.push(ERROR_MESSAGES.MIN_CONDITIONS);
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Validates sensation selection
 * @param sensations - Array of sensation IDs
 * @returns Validation result
 */
export const validateSensations = (sensations?: string[]): ValidationResult => {
  const errors: string[] = [];

  if (!sensations || !Array.isArray(sensations)) {
    errors.push(ERROR_MESSAGES.MIN_SENSATIONS);
    return { isValid: false, errors };
  }

  if (sensations.length < VALIDATION_RULES.MIN_SENSATIONS) {
    errors.push(ERROR_MESSAGES.MIN_SENSATIONS);
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Validates pain duration selection
 * @param duration - Duration option
 * @returns Validation result
 */
export const validateDuration = (duration?: string): ValidationResult => {
  const errors: string[] = [];

  if (!duration || typeof duration !== 'string' || duration.trim().length === 0) {
    errors.push(ERROR_MESSAGES.REQUIRED_FIELD);
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Validates pain intensity level
 * @param intensity - Intensity level (1-10)
 * @returns Validation result
 */
export const validateIntensity = (intensity?: number): ValidationResult => {
  const errors: string[] = [];

  if (
    intensity === undefined ||
    intensity === null ||
    typeof intensity !== 'number'
  ) {
    errors.push(ERROR_MESSAGES.REQUIRED_FIELD);
    return { isValid: false, errors };
  }

  if (
    intensity < VALIDATION_RULES.MIN_CONDITIONS ||
    intensity > 10 ||
    !Number.isInteger(intensity)
  ) {
    errors.push('Please select a pain intensity level between 1 and 10.');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Validates budget question response
 * @param hasBudget - Whether user has budget
 * @returns Validation result
 */
export const validateBudgetQuestion = (hasBudget?: boolean): ValidationResult => {
  const errors: string[] = [];

  if (hasBudget === undefined || hasBudget === null) {
    errors.push(ERROR_MESSAGES.REQUIRED_FIELD);
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Validates budget range selection
 * @param budgetRange - Budget range option
 * @returns Validation result
 */
export const validateBudgetRange = (budgetRange?: string): ValidationResult => {
  const errors: string[] = [];

  if (!budgetRange || typeof budgetRange !== 'string' || budgetRange.trim().length === 0) {
    errors.push(ERROR_MESSAGES.REQUIRED_FIELD);
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Validates urgency selection
 * @param urgency - Urgency level
 * @returns Validation result
 */
export const validateUrgency = (urgency?: string): ValidationResult => {
  const errors: string[] = [];

  if (!urgency || typeof urgency !== 'string' || urgency.trim().length === 0) {
    errors.push(ERROR_MESSAGES.REQUIRED_FIELD);
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Validates activity impact selection
 * @param activityImpact - Activity impact level
 * @returns Validation result
 */
export const validateActivityImpact = (activityImpact?: string): ValidationResult => {
  const errors: string[] = [];

  if (!activityImpact || typeof activityImpact !== 'string' || activityImpact.trim().length === 0) {
    errors.push(ERROR_MESSAGES.REQUIRED_FIELD);
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Validates contact information
 * @param name - User's name
 * @param email - User's email
 * @param phone - User's phone (optional)
 * @returns Validation result
 */
export const validateContactInfo = (
  name?: string,
  email?: string,
  phone?: string
): ValidationResult => {
  const errors: string[] = [];

  // Validate name
  if (!name || !validateName(name)) {
    errors.push(ERROR_MESSAGES.INVALID_NAME);
  }

  // Validate email
  if (!email || !validateEmail(email)) {
    errors.push(ERROR_MESSAGES.INVALID_EMAIL);
  }

  // Validate phone if provided
  if (phone && phone.trim().length > 0 && !validatePhone(phone)) {
    errors.push(ERROR_MESSAGES.INVALID_PHONE);
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Validates the current page based on responses
 * @param responses - Current assessment responses
 * @returns Validation result with page-specific errors
 */
export const validateCurrentPage = (responses: AssessmentResponses): ValidationResult => {
  const currentPage = responses.currentPage;
  let validationResult: ValidationResult = { isValid: true, errors: [] };

  switch (currentPage) {
    case PAGES.PAGE_1:
      validationResult = validateConditions(responses.conditions);
      break;

    case PAGES.PAGE_2:
      validationResult = validateSensations(responses.sensations);
      break;

    case PAGES.PAGE_3:
      validationResult = validateDuration(responses.duration);
      break;

    case PAGES.PAGE_4:
      validationResult = validateIntensity(responses.intensity);
      break;

    case PAGES.PAGE_5:
      // Previous treatments are optional, no validation needed
      validationResult = { isValid: true, errors: [] };
      break;

    case PAGES.PAGE_6:
      validationResult = validateBudgetQuestion(responses.hasBudget);
      break;

    case PAGES.PAGE_6B:
      validationResult = validateBudgetRange(responses.budgetRange);
      break;

    case PAGES.PAGE_7:
      validationResult = validateUrgency(responses.urgency);
      break;

    case PAGES.PAGE_8:
      validationResult = validateActivityImpact(responses.activityImpact);
      break;

    case PAGES.PAGE_9:
      // Goals are optional, no validation needed
      validationResult = { isValid: true, errors: [] };
      break;

    case PAGES.PAGE_10:
      validationResult = validateContactInfo(
        responses.name,
        responses.email,
        responses.phone
      );
      break;

    default:
      // No validation for other pages
      validationResult = { isValid: true, errors: [] };
  }

  return validationResult;
};

/**
 * Validates the entire assessment before submission
 * @param responses - Complete assessment responses
 * @returns Validation result with all errors
 */
export const validateAssessment = (responses: AssessmentResponses): ValidationResult => {
  const allErrors: string[] = [];

  // Validate all required fields
  const conditionsResult = validateConditions(responses.conditions);
  const sensationsResult = validateSensations(responses.sensations);
  const durationResult = validateDuration(responses.duration);
  const intensityResult = validateIntensity(responses.intensity);
  const urgencyResult = validateUrgency(responses.urgency);
  const activityImpactResult = validateActivityImpact(responses.activityImpact);
  const contactResult = validateContactInfo(
    responses.name,
    responses.email,
    responses.phone
  );

  // Collect all errors
  allErrors.push(...conditionsResult.errors);
  allErrors.push(...sensationsResult.errors);
  allErrors.push(...durationResult.errors);
  allErrors.push(...intensityResult.errors);
  allErrors.push(...urgencyResult.errors);
  allErrors.push(...activityImpactResult.errors);
  allErrors.push(...contactResult.errors);

  // Validate budget-related fields if applicable
  if (responses.hasBudget === true) {
    const budgetRangeResult = validateBudgetRange(responses.budgetRange);
    allErrors.push(...budgetRangeResult.errors);
  }

  return {
    isValid: allErrors.length === 0,
    errors: allErrors,
  };
};
