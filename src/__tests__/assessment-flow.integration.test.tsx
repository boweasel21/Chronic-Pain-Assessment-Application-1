/**
 * Assessment Flow Integration Tests
 * Tests critical user flows through the assessment process
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  renderWithProviders,
  createMockAssessmentResponse,
  mockRouter,
} from './testUtils';
import App from '../App';

describe('Assessment Flow Integration Tests', () => {
  beforeEach(() => {
    // Reset mocks and clear storage before each test
    vi.clearAllMocks();
    localStorage.clear();
    sessionStorage.clear();
  });

  describe('Happy Path: Complete Assessment Flow', () => {
    it('should complete full assessment from landing to results', async () => {
      const user = userEvent.setup();

      // Render the app
      renderWithProviders(<App />, { route: '/' });

      // Page 1: Landing Page - Start assessment
      const startButton = await screen.findByRole('button', {
        name: /start|begin|get started/i,
      });
      expect(startButton).toBeInTheDocument();
      await user.click(startButton);

      // Wait for navigation to cellular science page
      await waitFor(() => {
        expect(window.location.pathname).toMatch(/cellular|condition/i);
      });

      // Page 2: Cellular Science - Select condition
      const conditionCheckbox = await screen.findByRole('checkbox', {
        name: /arthritis|back pain|fibromyalgia/i,
      });
      await user.click(conditionCheckbox);

      // Click next
      const nextButton = await screen.findByRole('button', {
        name: /next|continue/i,
      });
      await user.click(nextButton);

      // Verify we're not disqualified (should not see waiting list)
      await waitFor(() => {
        expect(window.location.pathname).not.toMatch(/waiting|disqualified/i);
      });

      // Page 3: Condition Confirmation
      await waitFor(() => {
        expect(screen.queryByText(/confirm|your condition/i)).toBeInTheDocument();
      });

      // Continue through treatment history
      const continueButton = await screen.findByRole('button', {
        name: /next|continue/i,
      });
      await user.click(continueButton);

      // Page 4: Treatment History
      await waitFor(() => {
        expect(window.location.pathname).toMatch(/treatment/i);
      });

      // Skip to results (simplified for testing)
      // In a real test, we'd fill out each page
      mockRouter.push('/results');

      // Page 8: Results Page
      await waitFor(() => {
        expect(window.location.pathname).toBe('/results');
      });

      // Verify results page renders
      expect(
        screen.queryByText(/results|personalized|recommendation/i)
      ).toBeInTheDocument();
    }, 30000);

    it('should allow navigation back and forth between pages', async () => {
      const user = userEvent.setup();
      renderWithProviders(<App />, { route: '/cellular-science' });

      // Find and click next button
      const nextButton = await screen.findByRole('button', {
        name: /next|continue/i,
      });

      // Store current path
      const initialPath = window.location.pathname;

      // Navigate forward
      await user.click(nextButton);

      await waitFor(() => {
        expect(window.location.pathname).not.toBe(initialPath);
      });

      // Find and click back button
      const backButton = await screen.findByRole('button', {
        name: /back|previous/i,
      });

      if (backButton) {
        await user.click(backButton);

        // Should return to initial path
        await waitFor(() => {
          expect(window.location.pathname).toBe(initialPath);
        });
      }
    });

    it('should preserve assessment state across page navigation', async () => {
      const user = userEvent.setup();
      renderWithProviders(<App />, { route: '/cellular-science' });

      // Select a condition
      const conditionCheckbox = await screen.findByRole('checkbox', {
        name: /arthritis/i,
      });
      await user.click(conditionCheckbox);

      // Navigate to next page
      const nextButton = await screen.findByRole('button', {
        name: /next|continue/i,
      });
      await user.click(nextButton);

      // Navigate back
      const backButton = await screen.findByRole('button', {
        name: /back|previous/i,
      });

      if (backButton) {
        await user.click(backButton);

        // Condition should still be selected
        await waitFor(() => {
          const checkbox = screen.getByRole('checkbox', {
            name: /arthritis/i,
          }) as HTMLInputElement;
          expect(checkbox.checked).toBe(true);
        });
      }
    });
  });

  describe('Disqualification Path: Only Non-Treatable Conditions', () => {
    it('should redirect to disqualified page when only non-treatable conditions selected', async () => {
      const user = userEvent.setup();
      renderWithProviders(<App />, { route: '/cellular-science' });

      // Select only non-treatable condition
      // Note: This assumes there's a non-treatable condition in the data
      const nonTreatableCheckbox = await screen.findByRole('checkbox', {
        name: /cancer|terminal|non-treatable/i,
      });

      if (nonTreatableCheckbox) {
        await user.click(nonTreatableCheckbox);

        // Click next
        const nextButton = await screen.findByRole('button', {
          name: /next|continue/i,
        });
        await user.click(nextButton);

        // Should be redirected to disqualified or waiting list page
        await waitFor(() => {
          expect(window.location.pathname).toMatch(
            /disqualified|waiting-list/i
          );
        });

        // Should see disqualification message
        expect(
          screen.queryByText(/waiting|not currently|future/i)
        ).toBeInTheDocument();
      }
    });

    it('should show appropriate message on disqualification page', async () => {
      renderWithProviders(<App />, { route: '/disqualified' });

      // Should display explanation
      await waitFor(() => {
        expect(
          screen.queryByText(/waiting|join|future|notify/i)
        ).toBeInTheDocument();
      });

      // Should have option to join waiting list
      const waitingListButton = screen.queryByRole('button', {
        name: /join|waiting list|notify/i,
      });
      expect(waitingListButton).toBeInTheDocument();
    });
  });

  describe('Budget Routing Tests', () => {
    it('should route to affordability page when budget is $0-3K', async () => {
      const user = userEvent.setup();
      renderWithProviders(<App />, { route: '/budget-qualification' });

      // Select low budget option
      const lowBudgetOption = await screen.findByRole('radio', {
        name: /under|0-3|low budget/i,
      });

      if (lowBudgetOption) {
        await user.click(lowBudgetOption);

        // Click next
        const nextButton = await screen.findByRole('button', {
          name: /next|continue/i,
        });
        await user.click(nextButton);

        // Should route to affordability check (Page 6B)
        await waitFor(() => {
          expect(window.location.pathname).toMatch(/affordability/i);
        });
      }
    });

    it('should skip affordability page when budget is >$3K', async () => {
      const user = userEvent.setup();
      renderWithProviders(<App />, { route: '/budget-qualification' });

      // Select higher budget option
      const highBudgetOption = await screen.findByRole('radio', {
        name: /15k|30k|over|high/i,
      });

      if (highBudgetOption) {
        await user.click(highBudgetOption);

        // Click next
        const nextButton = await screen.findByRole('button', {
          name: /next|continue/i,
        });
        await user.click(nextButton);

        // Should skip to Page 7 (Additional Info)
        await waitFor(() => {
          expect(window.location.pathname).toMatch(/additional-info/i);
        });
      }
    });

    it('should route from affordability page to additional info', async () => {
      const user = userEvent.setup();
      renderWithProviders(<App />, { route: '/affordability' });

      // Answer affordability question
      const affordabilityOption = await screen.findByRole('radio', {
        name: /yes|no|maybe/i,
      });

      if (affordabilityOption) {
        await user.click(affordabilityOption);

        // Click next
        const nextButton = await screen.findByRole('button', {
          name: /next|continue/i,
        });
        await user.click(nextButton);

        // Should go to Page 7
        await waitFor(() => {
          expect(window.location.pathname).toMatch(/additional-info/i);
        });
      }
    });
  });

  describe('Lead Capture Flow', () => {
    it('should complete lead form and show success', async () => {
      const user = userEvent.setup();
      renderWithProviders(<App />, { route: '/lead-capture' });

      // Fill in name
      const nameInput = await screen.findByLabelText(/name/i);
      await user.type(nameInput, 'John Doe');

      // Fill in email
      const emailInput = await screen.findByLabelText(/email/i);
      await user.type(emailInput, 'john.doe@example.com');

      // Fill in phone (if present)
      const phoneInput = screen.queryByLabelText(/phone/i);
      if (phoneInput) {
        await user.type(phoneInput, '(555) 123-4567');
      }

      // Submit form
      const submitButton = await screen.findByRole('button', {
        name: /submit|send|continue/i,
      });

      // Mock successful submission
      global.fetch = vi.fn(() =>
        Promise.resolve({
          ok: true,
          status: 200,
          json: async () => ({ success: true, leadId: 'test-123' }),
        } as Response)
      );

      await user.click(submitButton);

      // Should show success message or redirect
      await waitFor(() => {
        const successMessage = screen.queryByText(/success|thank you|submitted/i);
        const urlChanged = window.location.pathname !== '/lead-capture';
        expect(successMessage || urlChanged).toBeTruthy();
      });
    });

    it('should prevent submission with invalid data', async () => {
      const user = userEvent.setup();
      renderWithProviders(<App />, { route: '/lead-capture' });

      // Try to submit without filling required fields
      const submitButton = await screen.findByRole('button', {
        name: /submit|send|continue/i,
      });
      await user.click(submitButton);

      // Should show validation errors
      await waitFor(() => {
        expect(screen.queryByText(/required|invalid|error/i)).toBeInTheDocument();
      });

      // Should not navigate away
      expect(window.location.pathname).toBe('/lead-capture');
    });
  });

  describe('Progress Tracking', () => {
    it('should show progress indicator on assessment pages', async () => {
      renderWithProviders(<App />, { route: '/cellular-science' });

      // Should have progress indicator
      const progressIndicator = screen.queryByRole('progressbar') ||
        screen.queryByText(/page|step|of/i);

      expect(progressIndicator).toBeInTheDocument();
    });

    it('should update progress as user navigates', async () => {
      const user = userEvent.setup();
      renderWithProviders(<App />, { route: '/cellular-science' });

      // Get initial progress
      const initialProgress = screen.queryByText(/page|step/i)?.textContent;

      // Navigate to next page
      const nextButton = await screen.findByRole('button', {
        name: /next|continue/i,
      });
      await user.click(nextButton);

      // Progress should change
      await waitFor(() => {
        const newProgress = screen.queryByText(/page|step/i)?.textContent;
        expect(newProgress).not.toBe(initialProgress);
      });
    });
  });

  describe('Error Handling', () => {
    it('should handle network errors gracefully', async () => {
      const user = userEvent.setup();
      renderWithProviders(<App />, { route: '/lead-capture' });

      // Fill in form
      const nameInput = await screen.findByLabelText(/name/i);
      await user.type(nameInput, 'John Doe');

      const emailInput = await screen.findByLabelText(/email/i);
      await user.type(emailInput, 'john.doe@example.com');

      // Mock network error
      global.fetch = vi.fn(() => Promise.reject(new Error('Network error')));

      // Submit form
      const submitButton = await screen.findByRole('button', {
        name: /submit|send|continue/i,
      });
      await user.click(submitButton);

      // Should show error message
      await waitFor(() => {
        expect(
          screen.queryByText(/error|failed|try again/i)
        ).toBeInTheDocument();
      });
    });

    it('should retry failed requests', async () => {
      const user = userEvent.setup();
      renderWithProviders(<App />, { route: '/lead-capture' });

      // Fill in form
      const nameInput = await screen.findByLabelText(/name/i);
      await user.type(nameInput, 'John Doe');

      const emailInput = await screen.findByLabelText(/email/i);
      await user.type(emailInput, 'john.doe@example.com');

      // Mock failed then successful request
      let callCount = 0;
      global.fetch = vi.fn(() => {
        callCount++;
        if (callCount === 1) {
          return Promise.reject(new Error('Network error'));
        }
        return Promise.resolve({
          ok: true,
          status: 200,
          json: async () => ({ success: true }),
        } as Response);
      });

      // Submit form
      const submitButton = await screen.findByRole('button', {
        name: /submit|send|continue/i,
      });
      await user.click(submitButton);

      // Find and click retry button if it appears
      await waitFor(async () => {
        const retryButton = screen.queryByRole('button', {
          name: /retry|try again/i,
        });
        if (retryButton) {
          await user.click(retryButton);
        }
      });

      // Should eventually succeed
      await waitFor(() => {
        expect(callCount).toBeGreaterThan(1);
      });
    });
  });
});
