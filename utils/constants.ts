/**
 * Application constants for Primary Cell Assessment
 * Centralized location for all string constants and configuration values
 */

/**
 * API Configuration
 */
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8001',
  TIMEOUT: 30000, // 30 seconds
} as const;

/**
 * API Endpoints
 */
export const API_ENDPOINTS = {
  SUBMIT_ASSESSMENT: '/api/v1/assessments',
  SAVE_PROGRESS: '/api/v1/assessments/progress',
  SEND_EMAIL_RESULTS: '/api/v1/assessments/email',
  CAPTURE_LEAD: '/api/v1/leads',
  GET_ASSESSMENT: '/api/v1/assessments/:id',
} as const;

/**
 * Application Pages
 */
export const PAGES = {
  TOTAL_COUNT: 14,
  WELCOME: '/',
  PAGE_1: '/page-1', // Condition selection
  PAGE_2: '/page-2', // Pain sensations
  PAGE_3: '/page-3', // Duration
  PAGE_4: '/page-4', // Intensity
  PAGE_5: '/page-5', // Previous treatments
  PAGE_6: '/page-6', // Budget question
  PAGE_6B: '/page-6b', // Budget range (conditional)
  PAGE_7: '/page-7', // Urgency
  PAGE_8: '/page-8', // Activity impact
  PAGE_9: '/page-9', // Goals
  PAGE_10: '/page-10', // Contact info
  PAGE_11: '/page-11', // Results
  WAITING_LIST: '/waiting-list', // For disqualified users
  THANK_YOU: '/thank-you', // Final page
} as const;

/**
 * Budget Ranges
 */
export const BUDGET_RANGES = {
  UNDER_5K: 'under-5k',
  RANGE_5K_15K: '5k-15k',
  RANGE_15K_30K: '15k-30k',
  OVER_30K: 'over-30k',
} as const;

export type BudgetRange = typeof BUDGET_RANGES[keyof typeof BUDGET_RANGES];

/**
 * Budget Range Labels
 */
export const BUDGET_RANGE_LABELS: Record<BudgetRange, string> = {
  [BUDGET_RANGES.UNDER_5K]: 'Under $5,000',
  [BUDGET_RANGES.RANGE_5K_15K]: '$5,000 - $15,000',
  [BUDGET_RANGES.RANGE_15K_30K]: '$15,000 - $30,000',
  [BUDGET_RANGES.OVER_30K]: 'Over $30,000',
} as const;

/**
 * Urgency Levels
 */
export const URGENCY_LEVELS = {
  IMMEDIATE: 'immediate',
  WITHIN_MONTH: 'within-month',
  FEW_MONTHS: 'few-months',
  EXPLORING: 'exploring',
} as const;

export type UrgencyLevel = typeof URGENCY_LEVELS[keyof typeof URGENCY_LEVELS];

/**
 * Urgency Level Labels
 */
export const URGENCY_LEVEL_LABELS: Record<UrgencyLevel, string> = {
  [URGENCY_LEVELS.IMMEDIATE]: 'Immediately - I need help now',
  [URGENCY_LEVELS.WITHIN_MONTH]: 'Within the next month',
  [URGENCY_LEVELS.FEW_MONTHS]: 'Within the next few months',
  [URGENCY_LEVELS.EXPLORING]: 'Just exploring options',
} as const;

/**
 * Pain Duration Options
 */
export const PAIN_DURATION = {
  LESS_THAN_6_MONTHS: 'less-than-6-months',
  SIX_MONTHS_TO_2_YEARS: '6-months-to-2-years',
  TWO_TO_5_YEARS: '2-to-5-years',
  MORE_THAN_5_YEARS: 'more-than-5-years',
} as const;

export type PainDuration = typeof PAIN_DURATION[keyof typeof PAIN_DURATION];

/**
 * Pain Intensity Levels (1-10 scale)
 */
export const PAIN_INTENSITY = {
  MIN: 1,
  MAX: 10,
  MILD: 3,
  MODERATE: 5,
  SEVERE: 7,
} as const;

/**
 * Activity Impact Levels
 */
export const ACTIVITY_IMPACT = {
  MINIMAL: 'minimal',
  MODERATE: 'moderate',
  SIGNIFICANT: 'significant',
  SEVERE: 'severe',
} as const;

export type ActivityImpact = typeof ACTIVITY_IMPACT[keyof typeof ACTIVITY_IMPACT];

/**
 * Activity Impact Labels
 */
export const ACTIVITY_IMPACT_LABELS: Record<ActivityImpact, string> = {
  [ACTIVITY_IMPACT.MINIMAL]: 'Minimal - I can do most activities',
  [ACTIVITY_IMPACT.MODERATE]: 'Moderate - Some activities are limited',
  [ACTIVITY_IMPACT.SIGNIFICANT]: 'Significant - Many activities are difficult',
  [ACTIVITY_IMPACT.SEVERE]: 'Severe - Most activities are impossible',
} as const;

/**
 * Validation Rules
 */
export const VALIDATION_RULES = {
  MIN_CONDITIONS: 1,
  MIN_SENSATIONS: 1,
  MIN_TREATMENTS: 0, // Optional
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 100,
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE_REGEX: /^[\d\s\-\+\(\)]+$/,
  PHONE_MIN_LENGTH: 10,
} as const;

/**
 * Storage Keys (for local storage / session storage)
 */
export const STORAGE_KEYS = {
  ASSESSMENT_PROGRESS: 'assessment_progress',
  ASSESSMENT_ID: 'assessment_id',
  CURRENT_PAGE: 'current_page',
} as const;

/**
 * Error Messages
 */
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection and try again.',
  SERVER_ERROR: 'Server error. Please try again later.',
  VALIDATION_ERROR: 'Please check your inputs and try again.',
  REQUIRED_FIELD: 'This field is required.',
  INVALID_EMAIL: 'Please enter a valid email address.',
  INVALID_PHONE: 'Please enter a valid phone number.',
  INVALID_NAME: 'Please enter a valid name (2-100 characters).',
  MIN_CONDITIONS: 'Please select at least one condition.',
  MIN_SENSATIONS: 'Please select at least one pain sensation.',
  GENERIC_ERROR: 'An error occurred. Please try again.',
} as const;

/**
 * Success Messages
 */
export const SUCCESS_MESSAGES = {
  ASSESSMENT_SUBMITTED: 'Your assessment has been submitted successfully!',
  EMAIL_SENT: 'Results have been emailed to you.',
  PROGRESS_SAVED: 'Your progress has been saved.',
  LEAD_CAPTURED: 'Thank you for your interest!',
} as const;

/**
 * Primary Cell Messaging
 */
export const PRIMARY_CELL_MESSAGING = {
  TAGLINE: 'Addressing the root cause of chronic pain at the cellular level',
  UNTREATED_EXPLANATION:
    'Primary Cell damage - the underlying cellular dysfunction causing your persistent symptoms',
  TREATMENT_GAP:
    'What your treatments addressed vs. what they left untreated',
} as const;
