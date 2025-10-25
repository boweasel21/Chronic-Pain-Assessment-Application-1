/**
 * Type definitions for Primary Cell Assessment Application
 * All types for state management, API interactions, and domain models
 */

/**
 * Qualification status for assessment participants
 */
export type QualificationStatus = 'qualified' | 'disqualified' | 'pending';

/**
 * Type of chronic pain condition
 * This includes all specific condition IDs plus 'other' for unlisted conditions
 */
export type ConditionType =
  | 'fibromyalgia'
  | 'chronic-fatigue'
  | 'neuropathy'
  | 'complex-regional'
  | 'migraine'
  | 'back-pain'
  | 'arthritis'
  | 'lupus'
  | 'lyme'
  | 'neck-pain'
  | 'joint-pain'
  | 'muscle-pain'
  | 'tension-headaches'
  | 'autoimmune'
  | 'ehlers-danlos'
  | 'cancer-pain'
  | 'post-surgical'
  | 'active-injury'
  | 'severe-psychiatric'
  | 'kidney-disease'
  | 'liver-disease'
  | 'heart-failure'
  | 'unstable-cardiac'
  | 'severe-copd'
  | 'dementia'
  | 'rheumatoid-arthritis'
  | 'other';

/**
 * Pain sensation characteristics
 * Maps to the actual sensation IDs from the sensations data
 */
export type SensationType =
  | 'burning'
  | 'tingling'
  | 'sharp-stabbing'
  | 'aching'
  | 'throbbing'
  | 'shooting'
  | 'cramping'
  | 'electric'
  | 'pressure';

/**
 * Treatment categories available
 */
export type TreatmentCategory =
  | 'medications'
  | 'physical_therapy'
  | 'injections'
  | 'surgery'
  | 'alternative_medicine'
  | 'psychological_therapy'
  | 'none';

/**
 * Lifestyle modification areas
 */
export type LifestyleModification =
  | 'diet'
  | 'exercise'
  | 'sleep'
  | 'stress_management'
  | 'weight_loss'
  | 'ergonomics'
  | 'none';

/**
 * Support system types
 */
export type SupportType =
  | 'family'
  | 'friends'
  | 'support_group'
  | 'therapist'
  | 'online_community'
  | 'none';

/**
 * Educational interest areas
 */
export type EducationalInterest =
  | 'pain_science'
  | 'treatment_options'
  | 'self_management'
  | 'nutrition'
  | 'exercise'
  | 'mindfulness'
  | 'medications';

/**
 * Complete assessment response data structure
 */
export interface AssessmentResponse {
  // Qualification Questions
  hasClinicalDiagnosis: boolean | null;
  painDuration: number | null; // in months
  ageRange: string | null; // e.g., "18-30", "31-45", "46-60", "61+"

  // Personalization Questions
  conditionType: ConditionType | null;
  primaryLocation: string | null;
  sensations: SensationType[];
  painLevel: number | null; // 1-10 scale
  symptomTriggers: string[];
  dailyImpact: string | null;
  currentTreatments: TreatmentCategory[];
  treatmentEffectiveness: number | null; // 1-5 scale
  sideEffects: string | null;
  lifestyleModifications: LifestyleModification[];
  exerciseFrequency: string | null; // e.g., "daily", "weekly", "monthly", "rarely"
  sleepQuality: number | null; // 1-5 scale
  stressLevel: number | null; // 1-10 scale
  supportSystems: SupportType[];
  educationalInterests: EducationalInterest[];
  contactPreferences: ContactPreference[];

  // New Pages 4-7 Fields
  treatmentHistory?: string[];
  otherTreatments?: string | null;
  urgencyLevel?: 'high' | 'moderate' | 'low' | null;
  urgencySelection?: string | null;
  currentBudget?: string | null;
  budgetLevel?: string | null;
  affordabilityResponse?: string | null;
  affordabilityConfirmed?: boolean;
  additionalInfo?: string | null;

  // Lead Capture
  leadCaptureName?: string | null;
  leadCaptureEmail?: string | null;
  leadCapturePhone?: string | null;
  disqualificationReason?: string | null;

  // Proof Offer Pages 11-12 Fields
  wantsHighlightsVideo?: boolean;
  wantsDemoVideo?: boolean;

  // Metadata
  startedAt: string | null;
  completedAt: string | null;
  currentPage: number;
  totalPages: number;
  qualificationStatus: QualificationStatus;
}

/**
 * Contact preference options
 */
export type ContactPreference = 'email' | 'phone' | 'sms' | 'mail';

/**
 * Personalization result based on assessment responses
 */
export interface PersonalizationResult {
  conditionCategory: string;
  painProfile: PainProfile;
  treatmentInsights: TreatmentInsights;
  lifestyleRecommendations: LifestyleRecommendation[];
  educationalResources: EducationalResource[];
  supportOptions: SupportOption[];
  nextSteps: string[];
}

/**
 * Pain profile analysis
 */
export interface PainProfile {
  severity: 'mild' | 'moderate' | 'severe';
  duration: 'acute' | 'chronic' | 'persistent';
  characteristics: SensationType[];
  primaryImpact: string[];
  triggers: string[];
}

/**
 * Treatment effectiveness insights
 */
export interface TreatmentInsights {
  currentApproach: string;
  effectivenessRating: 'poor' | 'fair' | 'good' | 'excellent';
  gaps: string[];
  opportunities: string[];
  considerations: string[];
}

/**
 * Lifestyle recommendation
 */
export interface LifestyleRecommendation {
  category: LifestyleModification;
  priority: 'high' | 'medium' | 'low';
  description: string;
  actionItems: string[];
  expectedBenefit: string;
}

/**
 * Educational resource
 */
export interface EducationalResource {
  title: string;
  category: EducationalInterest;
  format: 'article' | 'video' | 'webinar' | 'guide' | 'course';
  duration: string;
  url: string;
  description: string;
}

/**
 * Support option
 */
export interface SupportOption {
  type: SupportType;
  name: string;
  description: string;
  availability: string;
  contactMethod: ContactPreference[];
}

/**
 * Assessment state for context
 */
export interface AssessmentState {
  response: AssessmentResponse;
  isLoading: boolean;
  error: string | null;
  personalizationResult: PersonalizationResult | null;
}

/**
 * Assessment action types
 */
export enum AssessmentActionType {
  UPDATE_RESPONSE = 'UPDATE_RESPONSE',
  NEXT_PAGE = 'NEXT_PAGE',
  PREV_PAGE = 'PREV_PAGE',
  DISQUALIFY = 'DISQUALIFY',
  QUALIFY = 'QUALIFY',
  SET_LOADING = 'SET_LOADING',
  SET_ERROR = 'SET_ERROR',
  SET_PERSONALIZATION = 'SET_PERSONALIZATION',
  RESET_ASSESSMENT = 'RESET_ASSESSMENT',
}

/**
 * Assessment action definitions
 */
export type AssessmentAction =
  | {
      type: AssessmentActionType.UPDATE_RESPONSE;
      payload: Partial<AssessmentResponse>;
    }
  | {
      type: AssessmentActionType.NEXT_PAGE;
    }
  | {
      type: AssessmentActionType.PREV_PAGE;
    }
  | {
      type: AssessmentActionType.DISQUALIFY;
      payload: string; // Reason for disqualification
    }
  | {
      type: AssessmentActionType.QUALIFY;
    }
  | {
      type: AssessmentActionType.SET_LOADING;
      payload: boolean;
    }
  | {
      type: AssessmentActionType.SET_ERROR;
      payload: string | null;
    }
  | {
      type: AssessmentActionType.SET_PERSONALIZATION;
      payload: PersonalizationResult;
    }
  | {
      type: AssessmentActionType.RESET_ASSESSMENT;
    };

/**
 * Assessment context type
 */
export interface AssessmentContextType {
  state: AssessmentState;
  dispatch: React.Dispatch<AssessmentAction>;
  updateResponse: (updates: Partial<AssessmentResponse>) => void;
  nextPage: () => void;
  prevPage: () => void;
  disqualify: (reason: string) => void;
  qualify: () => void;
  resetAssessment: () => void;
}

/**
 * Route configuration
 */
export interface RouteConfig {
  path: string;
  title: string;
  pageNumber: number;
  requiresQualification: boolean;
}

/**
 * Validation error
 */
export interface ValidationError {
  field: string;
  message: string;
}

/**
 * Form validation result
 */
export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}
