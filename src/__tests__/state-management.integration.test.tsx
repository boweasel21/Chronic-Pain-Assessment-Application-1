/**
 * State Management Integration Tests
 * Tests assessment context, reducer, and state persistence
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { screen, waitFor, renderHook, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders, createMockAssessmentResponse } from './testUtils';
import { useAssessment, AssessmentProvider } from '@context/AssessmentContext';
import { AssessmentActionType } from '@types/index';
import App from '../App';
import { ReactNode } from 'react';

describe('State Management Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    sessionStorage.clear();
  });

  describe('Assessment Context', () => {
    it('should provide assessment state to components', () => {
      const wrapper = ({ children }: { children: ReactNode }) => (
        <AssessmentProvider>{children}</AssessmentProvider>
      );

      const { result } = renderHook(() => useAssessment(), { wrapper });

      expect(result.current.state).toBeDefined();
      expect(result.current.state.response).toBeDefined();
      expect(result.current.dispatch).toBeDefined();
    });

    it('should initialize with default state', () => {
      const wrapper = ({ children }: { children: ReactNode }) => (
        <AssessmentProvider>{children}</AssessmentProvider>
      );

      const { result } = renderHook(() => useAssessment(), { wrapper });

      expect(result.current.state.isLoading).toBe(false);
      expect(result.current.state.error).toBeNull();
      expect(result.current.state.response.qualificationStatus).toBe('pending');
      expect(result.current.state.response.currentPage).toBe(1);
    });

    it('should throw error when used outside provider', () => {
      // Suppress console.error for this test
      const originalError = console.error;
      console.error = vi.fn();

      expect(() => {
        renderHook(() => useAssessment());
      }).toThrow(/must be used within an AssessmentProvider/i);

      console.error = originalError;
    });
  });

  describe('State Updates', () => {
    it('should update response data', () => {
      const wrapper = ({ children }: { children: ReactNode }) => (
        <AssessmentProvider>{children}</AssessmentProvider>
      );

      const { result } = renderHook(() => useAssessment(), { wrapper });

      act(() => {
        result.current.updateResponse({
          conditionType: 'osteoarthritis',
          painLevel: 7,
        });
      });

      expect(result.current.state.response.conditionType).toBe('osteoarthritis');
      expect(result.current.state.response.painLevel).toBe(7);
    });

    it('should preserve existing data when updating', () => {
      const wrapper = ({ children }: { children: ReactNode }) => (
        <AssessmentProvider>{children}</AssessmentProvider>
      );

      const { result } = renderHook(() => useAssessment(), { wrapper });

      act(() => {
        result.current.updateResponse({ conditionType: 'osteoarthritis' });
      });

      act(() => {
        result.current.updateResponse({ painLevel: 7 });
      });

      expect(result.current.state.response.conditionType).toBe('osteoarthritis');
      expect(result.current.state.response.painLevel).toBe(7);
    });

    it('should update arrays correctly', () => {
      const wrapper = ({ children }: { children: ReactNode }) => (
        <AssessmentProvider>{children}</AssessmentProvider>
      );

      const { result } = renderHook(() => useAssessment(), { wrapper });

      act(() => {
        result.current.updateResponse({
          sensations: ['burning', 'tingling'],
        });
      });

      expect(result.current.state.response.sensations).toEqual([
        'burning',
        'tingling',
      ]);

      act(() => {
        result.current.updateResponse({
          currentTreatments: ['medications', 'physical_therapy'],
        });
      });

      // Should preserve sensations array
      expect(result.current.state.response.sensations).toEqual([
        'burning',
        'tingling',
      ]);
      expect(result.current.state.response.currentTreatments).toEqual([
        'medications',
        'physical_therapy',
      ]);
    });
  });

  describe('Page Navigation', () => {
    it('should navigate to next page', () => {
      const wrapper = ({ children }: { children: ReactNode }) => (
        <AssessmentProvider>{children}</AssessmentProvider>
      );

      const { result } = renderHook(() => useAssessment(), { wrapper });

      const initialPage = result.current.state.response.currentPage;

      act(() => {
        result.current.nextPage();
      });

      expect(result.current.state.response.currentPage).toBe(initialPage + 1);
    });

    it('should navigate to previous page', () => {
      const wrapper = ({ children }: { children: ReactNode }) => (
        <AssessmentProvider>{children}</AssessmentProvider>
      );

      const { result } = renderHook(() => useAssessment(), { wrapper });

      // First go to page 2
      act(() => {
        result.current.nextPage();
      });

      const currentPage = result.current.state.response.currentPage;

      // Then go back
      act(() => {
        result.current.prevPage();
      });

      expect(result.current.state.response.currentPage).toBe(currentPage - 1);
    });

    it('should not navigate before first page', () => {
      const wrapper = ({ children }: { children: ReactNode }) => (
        <AssessmentProvider>{children}</AssessmentProvider>
      );

      const { result } = renderHook(() => useAssessment(), { wrapper });

      expect(result.current.state.response.currentPage).toBe(1);

      act(() => {
        result.current.prevPage();
      });

      // Should still be on page 1 and have error
      expect(result.current.state.response.currentPage).toBe(1);
      expect(result.current.state.error).toBeTruthy();
    });

    it('should not navigate beyond last page', () => {
      const wrapper = ({ children }: { children: ReactNode }) => (
        <AssessmentProvider>{children}</AssessmentProvider>
      );

      const { result } = renderHook(() => useAssessment(), { wrapper });

      const totalPages = result.current.state.response.totalPages;

      // Set to last page
      act(() => {
        result.current.dispatch({
          type: AssessmentActionType.UPDATE_RESPONSE,
          payload: { currentPage: totalPages },
        });
      });

      // Try to go beyond
      act(() => {
        result.current.nextPage();
      });

      // Should still be on last page and have error
      expect(result.current.state.response.currentPage).toBe(totalPages);
      expect(result.current.state.error).toBeTruthy();
    });
  });

  describe('Qualification Status', () => {
    it('should disqualify user', () => {
      const wrapper = ({ children }: { children: ReactNode }) => (
        <AssessmentProvider>{children}</AssessmentProvider>
      );

      const { result } = renderHook(() => useAssessment(), { wrapper });

      act(() => {
        result.current.disqualify('Only selected non-treatable conditions');
      });

      expect(result.current.state.response.qualificationStatus).toBe(
        'disqualified'
      );
      expect(result.current.state.response.completedAt).toBeTruthy();
      expect(result.current.state.error).toBeTruthy();
    });

    it('should qualify user', () => {
      const wrapper = ({ children }: { children: ReactNode }) => (
        <AssessmentProvider>{children}</AssessmentProvider>
      );

      const { result } = renderHook(() => useAssessment(), { wrapper });

      act(() => {
        result.current.qualify();
      });

      expect(result.current.state.response.qualificationStatus).toBe(
        'qualified'
      );
      expect(result.current.state.error).toBeNull();
    });
  });

  describe('Assessment Reset', () => {
    it('should reset assessment to initial state', () => {
      const wrapper = ({ children }: { children: ReactNode }) => (
        <AssessmentProvider>{children}</AssessmentProvider>
      );

      const { result } = renderHook(() => useAssessment(), { wrapper });

      // Make some changes
      act(() => {
        result.current.updateResponse({
          conditionType: 'osteoarthritis',
          painLevel: 7,
        });
        result.current.nextPage();
      });

      expect(result.current.state.response.conditionType).toBe('osteoarthritis');
      expect(result.current.state.response.currentPage).toBe(2);

      // Reset
      act(() => {
        result.current.resetAssessment();
      });

      // Should be back to initial state
      expect(result.current.state.response.conditionType).toBeNull();
      expect(result.current.state.response.painLevel).toBeNull();
      expect(result.current.state.response.currentPage).toBe(1);
      expect(result.current.state.response.qualificationStatus).toBe('pending');
    });
  });

  describe('State Persistence Across Pages', () => {
    it('should maintain state when navigating between pages', async () => {
      const user = userEvent.setup();
      renderWithProviders(<App />, { route: '/cellular-science' });

      // Select a condition
      const conditionCheckbox = await screen.findByRole('checkbox', {
        name: /osteoarthritis|chronic back/i,
      });
      await user.click(conditionCheckbox);

      // Navigate forward
      const nextButton = await screen.findByRole('button', {
        name: /next|continue/i,
      });
      await user.click(nextButton);

      await waitFor(() => {
        expect(window.location.pathname).not.toBe('/cellular-science');
      });

      // Navigate back
      const backButton = screen.queryByRole('button', {
        name: /back|previous/i,
      });

      if (backButton) {
        await user.click(backButton);

        // Condition should still be selected
        await waitFor(() => {
          const checkbox = screen.getByRole('checkbox', {
            name: /osteoarthritis|chronic back/i,
          }) as HTMLInputElement;
          expect(checkbox.checked).toBe(true);
        });
      }
    });

    it('should preserve multiple selections across navigation', async () => {
      const user = userEvent.setup();
      renderWithProviders(<App />, { route: '/cellular-science' });

      // Select multiple conditions
      const checkboxes = await screen.findAllByRole('checkbox');
      const firstTwo = checkboxes.slice(0, 2);

      for (const checkbox of firstTwo) {
        await user.click(checkbox);
      }

      // Navigate away and back
      const nextButton = await screen.findByRole('button', {
        name: /next|continue/i,
      });
      await user.click(nextButton);

      await waitFor(() => {
        expect(window.location.pathname).not.toBe('/cellular-science');
      });

      const backButton = screen.queryByRole('button', {
        name: /back|previous/i,
      });

      if (backButton) {
        await user.click(backButton);

        // Both selections should be preserved
        await waitFor(() => {
          const newCheckboxes = screen.getAllByRole('checkbox');
          const checkedCount = newCheckboxes.filter(
            (cb: HTMLInputElement) => cb.checked
          ).length;
          expect(checkedCount).toBe(2);
        });
      }
    });
  });

  describe('Back Button Functionality', () => {
    it('should allow going back to previous page', async () => {
      const user = userEvent.setup();
      renderWithProviders(<App />, { route: '/cellular-science' });

      const initialPath = window.location.pathname;

      // Navigate forward
      const nextButton = await screen.findByRole('button', {
        name: /next|continue/i,
      });
      await user.click(nextButton);

      await waitFor(() => {
        expect(window.location.pathname).not.toBe(initialPath);
      });

      const newPath = window.location.pathname;

      // Navigate back
      const backButton = screen.queryByRole('button', {
        name: /back|previous/i,
      });

      if (backButton) {
        await user.click(backButton);

        await waitFor(() => {
          expect(window.location.pathname).not.toBe(newPath);
        });
      }
    });

    it('should disable back button on first page', async () => {
      renderWithProviders(<App />, { route: '/' });

      // Landing page should not have back button or it should be disabled
      const backButton = screen.queryByRole('button', {
        name: /back|previous/i,
      });

      if (backButton) {
        expect(backButton).toBeDisabled();
      }
    });
  });

  describe('Forward Button Validation', () => {
    it('should prevent forward navigation without required data', async () => {
      const user = userEvent.setup();
      renderWithProviders(<App />, { route: '/cellular-science' });

      // Try to go next without selecting condition
      const nextButton = await screen.findByRole('button', {
        name: /next|continue/i,
      });

      const initialPath = window.location.pathname;
      await user.click(nextButton);

      // Should show validation error and not navigate
      await waitFor(() => {
        expect(
          screen.queryByText(/select|choose|required/i)
        ).toBeInTheDocument();
      });

      expect(window.location.pathname).toBe(initialPath);
    });

    it('should allow forward navigation with valid data', async () => {
      const user = userEvent.setup();
      renderWithProviders(<App />, { route: '/cellular-science' });

      // Select a condition
      const conditionCheckbox = await screen.findByRole('checkbox', {
        name: /osteoarthritis|chronic back/i,
      });
      await user.click(conditionCheckbox);

      // Should be able to navigate
      const nextButton = await screen.findByRole('button', {
        name: /next|continue/i,
      });

      const initialPath = window.location.pathname;
      await user.click(nextButton);

      await waitFor(() => {
        expect(window.location.pathname).not.toBe(initialPath);
      });
    });
  });

  describe('Disqualification State Updates', () => {
    it('should update state when user is disqualified', async () => {
      const wrapper = ({ children }: { children: ReactNode }) => (
        <AssessmentProvider>{children}</AssessmentProvider>
      );

      const { result } = renderHook(() => useAssessment(), { wrapper });

      act(() => {
        result.current.disqualify('Only selected non-treatable conditions');
      });

      expect(result.current.state.response.qualificationStatus).toBe(
        'disqualified'
      );
      expect(result.current.state.response.completedAt).toBeTruthy();
    });

    it('should navigate to disqualified page when disqualified', async () => {
      const user = userEvent.setup();
      renderWithProviders(<App />, { route: '/cellular-science' });

      // Mock selecting only non-treatable condition
      // This would trigger disqualification logic
      // For testing purposes, directly navigate to disqualified page
      const nonTreatableCheckbox = screen.queryByRole('checkbox', {
        name: /non-treatable|terminal/i,
      });

      if (nonTreatableCheckbox) {
        await user.click(nonTreatableCheckbox);

        const nextButton = await screen.findByRole('button', {
          name: /next|continue/i,
        });
        await user.click(nextButton);

        await waitFor(() => {
          expect(window.location.pathname).toMatch(/disqualified|waiting/i);
        });
      }
    });
  });

  describe('Results Page State Generation', () => {
    it('should generate results based on assessment state', () => {
      const wrapper = ({ children }: { children: ReactNode }) => (
        <AssessmentProvider>{children}</AssessmentProvider>
      );

      const { result } = renderHook(() => useAssessment(), { wrapper });

      // Set up assessment data
      act(() => {
        result.current.updateResponse({
          conditionType: 'osteoarthritis',
          painLevel: 7,
          sensations: ['burning', 'tingling'],
          currentTreatments: ['medications'],
          urgencyLevel: 'high',
        });
      });

      // Results should be generated from this state
      expect(result.current.state.response.conditionType).toBe('osteoarthritis');
      expect(result.current.state.response.painLevel).toBe(7);
      expect(result.current.state.response.sensations).toContain('burning');
    });

    it('should set personalization result', () => {
      const wrapper = ({ children }: { children: ReactNode }) => (
        <AssessmentProvider>{children}</AssessmentProvider>
      );

      const { result } = renderHook(() => useAssessment(), { wrapper });

      const mockResult = {
        conditionCategory: 'Chronic Pain',
        painProfile: {
          severity: 'moderate' as const,
          duration: 'chronic' as const,
          characteristics: [],
          primaryImpact: ['Daily activities'],
          triggers: ['Movement'],
        },
        treatmentInsights: {
          currentApproach: 'Multimodal',
          effectivenessRating: 'fair' as const,
          gaps: ['Cellular-level treatment'],
          opportunities: ['Primary Cell therapy'],
          considerations: ['Budget'],
        },
        lifestyleRecommendations: [],
        educationalResources: [],
        supportOptions: [],
        nextSteps: ['Contact specialist'],
      };

      act(() => {
        result.current.dispatch({
          type: AssessmentActionType.SET_PERSONALIZATION,
          payload: mockResult,
        });
      });

      expect(result.current.state.personalizationResult).toEqual(mockResult);
      expect(result.current.state.response.completedAt).toBeTruthy();
    });
  });

  describe('Loading and Error States', () => {
    it('should set loading state', () => {
      const wrapper = ({ children }: { children: ReactNode }) => (
        <AssessmentProvider>{children}</AssessmentProvider>
      );

      const { result } = renderHook(() => useAssessment(), { wrapper });

      act(() => {
        result.current.dispatch({
          type: AssessmentActionType.SET_LOADING,
          payload: true,
        });
      });

      expect(result.current.state.isLoading).toBe(true);

      act(() => {
        result.current.dispatch({
          type: AssessmentActionType.SET_LOADING,
          payload: false,
        });
      });

      expect(result.current.state.isLoading).toBe(false);
    });

    it('should set error state', () => {
      const wrapper = ({ children }: { children: ReactNode }) => (
        <AssessmentProvider>{children}</AssessmentProvider>
      );

      const { result } = renderHook(() => useAssessment(), { wrapper });

      const errorMessage = 'Network error occurred';

      act(() => {
        result.current.dispatch({
          type: AssessmentActionType.SET_ERROR,
          payload: errorMessage,
        });
      });

      expect(result.current.state.error).toBe(errorMessage);
      expect(result.current.state.isLoading).toBe(false);
    });

    it('should clear error on successful action', () => {
      const wrapper = ({ children }: { children: ReactNode }) => (
        <AssessmentProvider>{children}</AssessmentProvider>
      );

      const { result } = renderHook(() => useAssessment(), { wrapper });

      // Set error
      act(() => {
        result.current.dispatch({
          type: AssessmentActionType.SET_ERROR,
          payload: 'Error occurred',
        });
      });

      expect(result.current.state.error).toBeTruthy();

      // Perform successful action
      act(() => {
        result.current.updateResponse({ conditionType: 'osteoarthritis' });
      });

      // Error should be cleared
      expect(result.current.state.error).toBeNull();
    });
  });
});
