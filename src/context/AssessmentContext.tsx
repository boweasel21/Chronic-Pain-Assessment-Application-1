/**
 * Assessment Context Provider
 * Global state management for assessment flow
 */

import React, { createContext, useContext, useReducer, useCallback, useMemo } from 'react';
import {
  AssessmentContextType,
  AssessmentResponse,
  AssessmentActionType,
  PersonalizationResult,
} from '@types/index';
import { assessmentReducer, initialState } from './AssessmentReducer';

/**
 * Assessment Context
 * Provides assessment state and actions to all child components
 */
const AssessmentContext = createContext<AssessmentContextType | undefined>(
  undefined
);

/**
 * Assessment Provider Props
 */
interface AssessmentProviderProps {
  children: React.ReactNode;
}

/**
 * Assessment Provider Component
 * Wraps the application to provide assessment state and actions
 *
 * @param props - Component props
 * @returns Provider component
 */
export const AssessmentProvider: React.FC<AssessmentProviderProps> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(assessmentReducer, initialState);

  /**
   * Updates assessment response with partial data
   * @param updates - Partial assessment response updates
   */
  const updateResponse = useCallback((updates: Partial<AssessmentResponse>) => {
    dispatch({
      type: AssessmentActionType.UPDATE_RESPONSE,
      payload: updates,
    });
  }, []);

  /**
   * Navigates to next page in assessment
   * Validates that navigation is allowed before proceeding
   */
  const nextPage = useCallback(() => {
    if (state.response.currentPage >= state.response.totalPages) {
      dispatch({
        type: AssessmentActionType.SET_ERROR,
        payload: 'Cannot navigate beyond last page',
      });
      return;
    }

    dispatch({
      type: AssessmentActionType.NEXT_PAGE,
    });
  }, [state.response.currentPage, state.response.totalPages]);

  /**
   * Navigates to previous page in assessment
   * Validates that navigation is allowed before proceeding
   */
  const prevPage = useCallback(() => {
    if (state.response.currentPage <= 1) {
      dispatch({
        type: AssessmentActionType.SET_ERROR,
        payload: 'Cannot navigate before first page',
      });
      return;
    }

    dispatch({
      type: AssessmentActionType.PREV_PAGE,
    });
  }, [state.response.currentPage]);

  /**
   * Disqualifies the user from the assessment
   * @param reason - Reason for disqualification
   */
  const disqualify = useCallback((reason: string) => {
    dispatch({
      type: AssessmentActionType.DISQUALIFY,
      payload: reason,
    });
  }, []);

  /**
   * Qualifies the user for the assessment
   */
  const qualify = useCallback(() => {
    dispatch({
      type: AssessmentActionType.QUALIFY,
    });
  }, []);

  /**
   * Resets the entire assessment to initial state
   */
  const resetAssessment = useCallback(() => {
    dispatch({
      type: AssessmentActionType.RESET_ASSESSMENT,
    });
  }, []);

  /**
   * Memoized context value to prevent unnecessary re-renders
   */
  const contextValue = useMemo<AssessmentContextType>(
    () => ({
      state,
      dispatch,
      updateResponse,
      nextPage,
      prevPage,
      disqualify,
      qualify,
      resetAssessment,
    }),
    [state, updateResponse, nextPage, prevPage, disqualify, qualify, resetAssessment]
  );

  return (
    <AssessmentContext.Provider value={contextValue}>
      {children}
    </AssessmentContext.Provider>
  );
};

/**
 * Custom hook to use assessment context
 * Throws error if used outside of AssessmentProvider
 *
 * @returns Assessment context value
 * @throws Error if used outside AssessmentProvider
 */
export const useAssessment = (): AssessmentContextType => {
  const context = useContext(AssessmentContext);

  if (context === undefined) {
    throw new Error(
      'useAssessment must be used within an AssessmentProvider. ' +
        'Wrap your component tree with <AssessmentProvider>.'
    );
  }

  return context;
};

/**
 * Hook to access assessment response
 * Convenience hook for components that only need response data
 *
 * @returns Current assessment response
 */
export const useAssessmentResponse = (): AssessmentResponse => {
  const { state } = useAssessment();
  return state.response;
};

/**
 * Hook to access personalization result
 * Convenience hook for components that display personalization results
 *
 * @returns Personalization result or null
 */
export const usePersonalizationResult = (): PersonalizationResult | null => {
  const { state } = useAssessment();
  return state.personalizationResult;
};

/**
 * Hook to check qualification status
 * Convenience hook for conditional rendering based on qualification
 *
 * @returns Object with qualification status flags
 */
export const useQualificationStatus = () => {
  const { state } = useAssessment();

  return useMemo(
    () => ({
      isQualified: state.response.qualificationStatus === 'qualified',
      isDisqualified: state.response.qualificationStatus === 'disqualified',
      isPending: state.response.qualificationStatus === 'pending',
      status: state.response.qualificationStatus,
    }),
    [state.response.qualificationStatus]
  );
};
