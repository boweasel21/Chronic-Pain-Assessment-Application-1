/**
 * Shared TypeScript type definitions for Primary Cell Assessment
 * Centralized type definitions used across the application
 */

/**
 * Complete assessment response structure
 * Used throughout the application for state management
 */
export interface AssessmentResponse {
  // Page 1: Condition Selection
  conditions: string[];

  // Page 2: Pain Sensations
  sensations: string[];

  // Page 3: Duration
  duration?: string;

  // Page 4: Intensity
  intensity?: number;

  // Page 5: Previous Treatments
  previousTreatments?: string[];

  // Page 6: Budget Question
  hasBudget?: boolean;

  // Page 6B: Budget Range (conditional)
  budgetRange?: string;

  // Page 7: Urgency
  urgency?: string;

  // Page 8: Activity Impact
  activityImpact?: string;

  // Page 9: Goals
  goals?: string;

  // Page 10: Contact Information
  name?: string;
  email?: string;
  phone?: string;

  // Metadata
  currentPage?: string;
  completedPages?: string[];
  startedAt?: string;
  completedAt?: string;
  assessmentId?: string;
}

/**
 * Page component props interface
 * Common props passed to all page components
 */
export interface PageProps {
  responses: AssessmentResponse;
  onUpdate: (updates: Partial<AssessmentResponse>) => void;
  onNext: () => void;
  onBack: () => void;
  isLoading?: boolean;
  errors?: string[];
}

/**
 * Form field error structure
 */
export interface FieldError {
  field: string;
  message: string;
}

/**
 * Wizard state for multi-step form
 */
export interface WizardState {
  currentStep: number;
  totalSteps: number;
  isFirstStep: boolean;
  isLastStep: boolean;
  progress: number;
  canGoBack: boolean;
  canGoForward: boolean;
}

/**
 * Analytics event tracking
 */
export interface AnalyticsEvent {
  eventName: string;
  eventData: Record<string, unknown>;
  timestamp: string;
  userId?: string;
  sessionId?: string;
}

/**
 * User session information
 */
export interface UserSession {
  sessionId: string;
  startedAt: string;
  lastActivityAt: string;
  assessmentId?: string;
  source?: string;
  referrer?: string;
}

/**
 * Result display configuration
 */
export interface ResultsConfig {
  showTreatmentBreakdown: boolean;
  showPersonalizedSummary: boolean;
  showNextSteps: boolean;
  showContactForm: boolean;
  allowEmailResults: boolean;
}

/**
 * Email template data
 */
export interface EmailTemplateData {
  recipientName: string;
  recipientEmail: string;
  assessmentId: string;
  resultsUrl: string;
  personalizedSummary: string;
  conditions: string[];
  nextSteps: string[];
}

/**
 * Lead information for CRM
 */
export interface LeadData {
  name: string;
  email: string;
  phone?: string;
  source: string;
  assessmentId?: string;
  conditions: string[];
  urgency: string;
  budgetRange?: string;
  notes?: string;
  capturedAt: string;
}

/**
 * Feature flags for A/B testing
 */
export interface FeatureFlags {
  enableProgressSave: boolean;
  enableEmailResults: boolean;
  enableWaitingList: boolean;
  showTreatmentBreakdown: boolean;
  requirePhoneNumber: boolean;
  enableAnalytics: boolean;
}

/**
 * Application configuration
 */
export interface AppConfig {
  apiBaseUrl: string;
  enableDebugMode: boolean;
  analyticsEnabled: boolean;
  maxAssessmentDuration: number; // in minutes
  autoSaveInterval: number; // in seconds
  features: FeatureFlags;
}

/**
 * Storage service interface
 */
export interface StorageService {
  get<T>(key: string): T | null;
  set<T>(key: string, value: T): void;
  remove(key: string): void;
  clear(): void;
  has(key: string): boolean;
}

/**
 * Logger service interface
 */
export interface Logger {
  debug(message: string, data?: unknown): void;
  info(message: string, data?: unknown): void;
  warn(message: string, data?: unknown): void;
  error(message: string, error?: Error | unknown): void;
}

/**
 * Notification types
 */
export type NotificationType = 'success' | 'error' | 'warning' | 'info';

/**
 * Notification message
 */
export interface Notification {
  id: string;
  type: NotificationType;
  message: string;
  duration?: number;
  dismissible?: boolean;
}

/**
 * Breadcrumb for navigation
 */
export interface Breadcrumb {
  label: string;
  path: string;
  isActive: boolean;
  isCompleted: boolean;
}

/**
 * HTTP method types
 */
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

/**
 * API request configuration
 */
export interface ApiRequestConfig {
  method: HttpMethod;
  headers?: Record<string, string>;
  body?: unknown;
  timeout?: number;
  retries?: number;
}

/**
 * Pagination parameters
 */
export interface PaginationParams {
  page: number;
  pageSize: number;
  total?: number;
}

/**
 * Sort parameters
 */
export interface SortParams {
  field: string;
  direction: 'asc' | 'desc';
}

/**
 * Filter parameters
 */
export interface FilterParams {
  field: string;
  operator: 'eq' | 'ne' | 'gt' | 'lt' | 'gte' | 'lte' | 'in' | 'contains';
  value: unknown;
}

/**
 * Query parameters for list endpoints
 */
export interface QueryParams {
  pagination?: PaginationParams;
  sort?: SortParams;
  filters?: FilterParams[];
  search?: string;
}
