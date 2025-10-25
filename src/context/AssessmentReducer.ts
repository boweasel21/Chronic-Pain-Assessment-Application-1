/**
 * Assessment Reducer
 * Manages state transitions for the assessment flow
 */

import {
  AssessmentState,
  AssessmentAction,
  AssessmentActionType,
  AssessmentResponse,
} from '@types';

/**
 * Total number of assessment pages
 */
const TOTAL_PAGES = 17;

/**
 * Creates initial assessment response
 */
export const createInitialResponse = (): AssessmentResponse => ({
  // Qualification
  hasClinicalDiagnosis: null,
  painDuration: null,
  ageRange: null,

  // Personalization
  conditionType: null,
  primaryLocation: null,
  sensations: [],
  painLevel: null,
  symptomTriggers: [],
  dailyImpact: null,
  currentTreatments: [],
  treatmentEffectiveness: null,
  sideEffects: null,
  lifestyleModifications: [],
  exerciseFrequency: null,
  sleepQuality: null,
  stressLevel: null,
  supportSystems: [],
  educationalInterests: [],
  contactPreferences: [],

  // Metadata
  startedAt: new Date().toISOString(),
  completedAt: null,
  currentPage: 1,
  totalPages: TOTAL_PAGES,
  qualificationStatus: 'pending',
});

/**
 * Initial assessment state
 */
export const initialState: AssessmentState = {
  response: createInitialResponse(),
  isLoading: false,
  error: null,
  personalizationResult: null,
};

/**
 * Validates page transition
 * @param currentPage - Current page number
 * @param direction - Direction of navigation ('next' | 'prev')
 * @returns Validated next page number
 * @throws Error if transition is invalid
 */
const validatePageTransition = (
  currentPage: number,
  direction: 'next' | 'prev'
): number => {
  if (direction === 'next') {
    if (currentPage >= TOTAL_PAGES) {
      throw new Error('Cannot navigate beyond last page');
    }
    return currentPage + 1;
  } else {
    if (currentPage <= 1) {
      throw new Error('Cannot navigate before first page');
    }
    return currentPage - 1;
  }
};

/**
 * Merges response updates safely
 * @param current - Current assessment response
 * @param updates - Partial updates to apply
 * @returns Updated assessment response
 */
const mergeResponseUpdates = (
  current: AssessmentResponse,
  updates: Partial<AssessmentResponse>
): AssessmentResponse => {
  return {
    ...current,
    ...updates,
    // Preserve arrays and objects properly
    sensations:
      updates.sensations !== undefined ? updates.sensations : current.sensations,
    symptomTriggers:
      updates.symptomTriggers !== undefined
        ? updates.symptomTriggers
        : current.symptomTriggers,
    currentTreatments:
      updates.currentTreatments !== undefined
        ? updates.currentTreatments
        : current.currentTreatments,
    lifestyleModifications:
      updates.lifestyleModifications !== undefined
        ? updates.lifestyleModifications
        : current.lifestyleModifications,
    supportSystems:
      updates.supportSystems !== undefined
        ? updates.supportSystems
        : current.supportSystems,
    educationalInterests:
      updates.educationalInterests !== undefined
        ? updates.educationalInterests
        : current.educationalInterests,
    contactPreferences:
      updates.contactPreferences !== undefined
        ? updates.contactPreferences
        : current.contactPreferences,
  };
};

/**
 * Assessment reducer function
 * Handles all state transitions for the assessment flow
 *
 * @param state - Current assessment state
 * @param action - Action to perform
 * @returns Updated assessment state
 */
export const assessmentReducer = (
  state: AssessmentState,
  action: AssessmentAction
): AssessmentState => {
  try {
    switch (action.type) {
      case AssessmentActionType.UPDATE_RESPONSE: {
        const updatedResponse = mergeResponseUpdates(
          state.response,
          action.payload
        );

        return {
          ...state,
          response: updatedResponse,
          error: null,
        };
      }

      case AssessmentActionType.NEXT_PAGE: {
        const nextPage = validatePageTransition(
          state.response.currentPage,
          'next'
        );

        return {
          ...state,
          response: {
            ...state.response,
            currentPage: nextPage,
          },
          error: null,
        };
      }

      case AssessmentActionType.PREV_PAGE: {
        const prevPage = validatePageTransition(
          state.response.currentPage,
          'prev'
        );

        return {
          ...state,
          response: {
            ...state.response,
            currentPage: prevPage,
          },
          error: null,
        };
      }

      case AssessmentActionType.DISQUALIFY: {
        return {
          ...state,
          response: {
            ...state.response,
            qualificationStatus: 'disqualified',
            disqualificationReason: action.payload,
            completedAt: new Date().toISOString(),
          },
          error: action.payload,
        };
      }

      case AssessmentActionType.QUALIFY: {
        return {
          ...state,
          response: {
            ...state.response,
            qualificationStatus: 'qualified',
          },
          error: null,
        };
      }

      case AssessmentActionType.SET_LOADING: {
        return {
          ...state,
          isLoading: action.payload,
        };
      }

      case AssessmentActionType.SET_ERROR: {
        return {
          ...state,
          error: action.payload,
          isLoading: false,
        };
      }

      case AssessmentActionType.SET_PERSONALIZATION: {
        return {
          ...state,
          personalizationResult: action.payload,
          response: {
            ...state.response,
            completedAt: new Date().toISOString(),
          },
          isLoading: false,
          error: null,
        };
      }

      case AssessmentActionType.RESET_ASSESSMENT: {
        return {
          ...initialState,
          response: createInitialResponse(),
        };
      }

      default: {
        // TypeScript exhaustiveness check
        const exhaustiveCheck: never = action;
        throw new Error(
          `Unhandled action type: ${(exhaustiveCheck as AssessmentAction).type}`
        );
      }
    }
  } catch (error) {
    // Handle reducer errors gracefully
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown reducer error';

    return {
      ...state,
      error: errorMessage,
      isLoading: false,
    };
  }
};
