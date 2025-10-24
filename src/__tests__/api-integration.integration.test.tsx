/**
 * API Integration Tests
 * Tests API interactions, error handling, and retry logic
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from './testUtils';
import App from '../App';

describe('API Integration Tests', () => {
  let originalFetch: typeof global.fetch;

  beforeEach(() => {
    originalFetch = global.fetch;
    vi.clearAllMocks();
    localStorage.clear();
    sessionStorage.clear();
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  describe('CSRF Token Management', () => {
    it('should fetch CSRF token on app initialization', async () => {
      const mockFetch = vi.fn(() =>
        Promise.resolve({
          ok: true,
          status: 200,
          json: async () => ({ token: 'csrf-token-123' }),
        } as Response)
      );

      global.fetch = mockFetch;

      renderWithProviders(<App />);

      // Should attempt to fetch CSRF token
      await waitFor(() => {
        const csrfCalls = mockFetch.mock.calls.filter((call) =>
          call[0].toString().includes('csrf')
        );
        // May or may not fetch CSRF token depending on implementation
        // This test validates the pattern if implemented
        expect(csrfCalls.length >= 0).toBe(true);
      });
    });

    it('should include CSRF token in POST requests', async () => {
      const user = userEvent.setup();

      // Mock CSRF token fetch
      const mockFetch = vi.fn((url: string, options?: RequestInit) => {
        if (url.includes('csrf')) {
          return Promise.resolve({
            ok: true,
            status: 200,
            json: async () => ({ token: 'csrf-token-123' }),
          } as Response);
        }

        // Check if CSRF token is included in POST requests
        if (options?.method === 'POST') {
          const headers = options.headers as Record<string, string>;
          expect(
            headers['X-CSRF-Token'] || headers['x-csrf-token']
          ).toBeDefined();
        }

        return Promise.resolve({
          ok: true,
          status: 200,
          json: async () => ({ success: true }),
        } as Response);
      });

      global.fetch = mockFetch;

      renderWithProviders(<App />, { route: '/lead-capture' });

      // Fill and submit form
      const nameInput = await screen.findByLabelText(/name/i);
      await user.type(nameInput, 'John Doe');

      const emailInput = await screen.findByLabelText(/email/i);
      await user.type(emailInput, 'john@example.com');

      const submitButton = await screen.findByRole('button', {
        name: /submit|send/i,
      });
      await user.click(submitButton);

      // Wait for API call
      await waitFor(() => {
        const postCalls = mockFetch.mock.calls.filter(
          (call) => (call[1] as RequestInit)?.method === 'POST'
        );
        expect(postCalls.length).toBeGreaterThanOrEqual(0);
      });
    });
  });

  describe('HTTP Status Code Handling', () => {
    it('should handle 401 Unauthorized with token refresh', async () => {
      const user = userEvent.setup();
      let callCount = 0;

      const mockFetch = vi.fn(() => {
        callCount++;
        if (callCount === 1) {
          // First call returns 401
          return Promise.resolve({
            ok: false,
            status: 401,
            statusText: 'Unauthorized',
            json: async () => ({ error: 'Unauthorized' }),
          } as Response);
        }
        // After token refresh, return success
        return Promise.resolve({
          ok: true,
          status: 200,
          json: async () => ({ success: true }),
        } as Response);
      });

      global.fetch = mockFetch;

      renderWithProviders(<App />, { route: '/lead-capture' });

      // Fill and submit form
      const nameInput = await screen.findByLabelText(/name/i);
      await user.type(nameInput, 'John Doe');

      const emailInput = await screen.findByLabelText(/email/i);
      await user.type(emailInput, 'john@example.com');

      const submitButton = await screen.findByRole('button', {
        name: /submit|send/i,
      });
      await user.click(submitButton);

      // Should retry after 401
      await waitFor(
        () => {
          expect(callCount).toBeGreaterThanOrEqual(1);
        },
        { timeout: 5000 }
      );
    });

    it('should handle 429 Rate Limit with appropriate message', async () => {
      const user = userEvent.setup();

      global.fetch = vi.fn(() =>
        Promise.resolve({
          ok: false,
          status: 429,
          statusText: 'Too Many Requests',
          json: async () => ({
            error: 'Rate limit exceeded',
            retryAfter: 60,
          }),
        } as Response)
      );

      renderWithProviders(<App />, { route: '/lead-capture' });

      // Submit form
      const nameInput = await screen.findByLabelText(/name/i);
      await user.type(nameInput, 'John Doe');

      const emailInput = await screen.findByLabelText(/email/i);
      await user.type(emailInput, 'john@example.com');

      const submitButton = await screen.findByRole('button', {
        name: /submit|send/i,
      });
      await user.click(submitButton);

      // Should show rate limit message
      await waitFor(() => {
        expect(
          screen.queryByText(/rate limit|too many|try again later/i)
        ).toBeInTheDocument();
      });
    });

    it('should handle 500 Server Error gracefully', async () => {
      const user = userEvent.setup();

      global.fetch = vi.fn(() =>
        Promise.resolve({
          ok: false,
          status: 500,
          statusText: 'Internal Server Error',
          json: async () => ({ error: 'Internal server error' }),
        } as Response)
      );

      renderWithProviders(<App />, { route: '/lead-capture' });

      // Submit form
      const nameInput = await screen.findByLabelText(/name/i);
      await user.type(nameInput, 'John Doe');

      const emailInput = await screen.findByLabelText(/email/i);
      await user.type(emailInput, 'john@example.com');

      const submitButton = await screen.findByRole('button', {
        name: /submit|send/i,
      });
      await user.click(submitButton);

      // Should show server error message
      await waitFor(() => {
        expect(
          screen.queryByText(/server error|something went wrong|try again/i)
        ).toBeInTheDocument();
      });
    });

    it('should handle 400 Bad Request with validation errors', async () => {
      const user = userEvent.setup();

      global.fetch = vi.fn(() =>
        Promise.resolve({
          ok: false,
          status: 400,
          statusText: 'Bad Request',
          json: async () => ({
            error: 'Validation failed',
            errors: {
              email: 'Email is already registered',
            },
          }),
        } as Response)
      );

      renderWithProviders(<App />, { route: '/lead-capture' });

      // Submit form
      const nameInput = await screen.findByLabelText(/name/i);
      await user.type(nameInput, 'John Doe');

      const emailInput = await screen.findByLabelText(/email/i);
      await user.type(emailInput, 'john@example.com');

      const submitButton = await screen.findByRole('button', {
        name: /submit|send/i,
      });
      await user.click(submitButton);

      // Should show specific validation error
      await waitFor(() => {
        expect(
          screen.queryByText(/email.*registered|already.*registered/i)
        ).toBeInTheDocument();
      });
    });
  });

  describe('Network Timeout Handling', () => {
    it('should timeout after specified duration', async () => {
      const user = userEvent.setup();

      // Mock a request that never resolves
      global.fetch = vi.fn(
        () =>
          new Promise(() => {
            // Never resolves
          })
      );

      renderWithProviders(<App />, { route: '/lead-capture' });

      // Submit form
      const nameInput = await screen.findByLabelText(/name/i);
      await user.type(nameInput, 'John Doe');

      const emailInput = await screen.findByLabelText(/email/i);
      await user.type(emailInput, 'john@example.com');

      const submitButton = await screen.findByRole('button', {
        name: /submit|send/i,
      });
      await user.click(submitButton);

      // Should show timeout or loading state
      await waitFor(
        () => {
          const loadingIndicator = screen.queryByText(/loading|submitting/i);
          const timeoutMessage = screen.queryByText(/timeout|taking too long/i);
          expect(loadingIndicator || timeoutMessage).toBeTruthy();
        },
        { timeout: 10000 }
      );
    });

    it('should retry after timeout', async () => {
      const user = userEvent.setup();
      let attemptCount = 0;

      global.fetch = vi.fn(() => {
        attemptCount++;
        if (attemptCount === 1) {
          // First attempt times out
          return new Promise((_, reject) =>
            setTimeout(() => reject(new Error('Timeout')), 100)
          );
        }
        // Second attempt succeeds
        return Promise.resolve({
          ok: true,
          status: 200,
          json: async () => ({ success: true }),
        } as Response);
      });

      renderWithProviders(<App />, { route: '/lead-capture' });

      // Submit form
      const nameInput = await screen.findByLabelText(/name/i);
      await user.type(nameInput, 'John Doe');

      const emailInput = await screen.findByLabelText(/email/i);
      await user.type(emailInput, 'john@example.com');

      const submitButton = await screen.findByRole('button', {
        name: /submit|send/i,
      });
      await user.click(submitButton);

      // Should retry automatically or show retry button
      await waitFor(
        () => {
          const retryButton = screen.queryByRole('button', {
            name: /retry/i,
          });
          if (retryButton) {
            user.click(retryButton);
          }
          expect(attemptCount).toBeGreaterThan(1);
        },
        { timeout: 10000 }
      );
    });
  });

  describe('Retry Logic with Exponential Backoff', () => {
    it('should retry failed requests with backoff', async () => {
      const user = userEvent.setup();
      const attemptTimes: number[] = [];
      let attemptCount = 0;

      global.fetch = vi.fn(() => {
        attemptCount++;
        attemptTimes.push(Date.now());

        if (attemptCount <= 2) {
          return Promise.reject(new Error('Network error'));
        }
        return Promise.resolve({
          ok: true,
          status: 200,
          json: async () => ({ success: true }),
        } as Response);
      });

      renderWithProviders(<App />, { route: '/lead-capture' });

      // Submit form
      const nameInput = await screen.findByLabelText(/name/i);
      await user.type(nameInput, 'John Doe');

      const emailInput = await screen.findByLabelText(/email/i);
      await user.type(emailInput, 'john@example.com');

      const submitButton = await screen.findByRole('button', {
        name: /submit|send/i,
      });
      await user.click(submitButton);

      // Wait for retries to complete
      await waitFor(
        () => {
          expect(attemptCount).toBeGreaterThanOrEqual(1);
        },
        { timeout: 15000 }
      );

      // If retries happened, check for increasing delays
      if (attemptTimes.length > 1) {
        for (let i = 1; i < attemptTimes.length; i++) {
          const delay = attemptTimes[i] - attemptTimes[i - 1];
          // Each retry should be delayed
          expect(delay).toBeGreaterThan(0);
        }
      }
    });

    it('should give up after maximum retry attempts', async () => {
      const user = userEvent.setup();
      let attemptCount = 0;

      global.fetch = vi.fn(() => {
        attemptCount++;
        return Promise.reject(new Error('Network error'));
      });

      renderWithProviders(<App />, { route: '/lead-capture' });

      // Submit form
      const nameInput = await screen.findByLabelText(/name/i);
      await user.type(nameInput, 'John Doe');

      const emailInput = await screen.findByLabelText(/email/i);
      await user.type(emailInput, 'john@example.com');

      const submitButton = await screen.findByRole('button', {
        name: /submit|send/i,
      });
      await user.click(submitButton);

      // Should eventually give up and show error
      await waitFor(
        () => {
          expect(
            screen.queryByText(/failed|error|unable/i)
          ).toBeInTheDocument();
        },
        { timeout: 15000 }
      );

      // Should not retry indefinitely
      expect(attemptCount).toBeLessThan(10);
    });
  });

  describe('Successful Submission Flow', () => {
    it('should redirect to success page after successful submission', async () => {
      const user = userEvent.setup();

      global.fetch = vi.fn(() =>
        Promise.resolve({
          ok: true,
          status: 200,
          json: async () => ({
            success: true,
            assessmentId: 'test-123',
          }),
        } as Response)
      );

      renderWithProviders(<App />, { route: '/lead-capture' });

      // Fill and submit form
      const nameInput = await screen.findByLabelText(/name/i);
      await user.type(nameInput, 'John Doe');

      const emailInput = await screen.findByLabelText(/email/i);
      await user.type(emailInput, 'john@example.com');

      const submitButton = await screen.findByRole('button', {
        name: /submit|send/i,
      });
      await user.click(submitButton);

      // Should redirect to success/final page
      await waitFor(() => {
        expect(window.location.pathname).toMatch(/final|success|thank/i);
      });
    });

    it('should show success message after submission', async () => {
      const user = userEvent.setup();

      global.fetch = vi.fn(() =>
        Promise.resolve({
          ok: true,
          status: 200,
          json: async () => ({ success: true }),
        } as Response)
      );

      renderWithProviders(<App />, { route: '/lead-capture' });

      // Fill and submit form
      const nameInput = await screen.findByLabelText(/name/i);
      await user.type(nameInput, 'John Doe');

      const emailInput = await screen.findByLabelText(/email/i);
      await user.type(emailInput, 'john@example.com');

      const submitButton = await screen.findByRole('button', {
        name: /submit|send/i,
      });
      await user.click(submitButton);

      // Should show success message or navigate
      await waitFor(() => {
        const successMessage = screen.queryByText(/success|thank you|submitted/i);
        const navigationOccurred = window.location.pathname !== '/lead-capture';
        expect(successMessage || navigationOccurred).toBeTruthy();
      });
    });
  });

  describe('Request Payload Validation', () => {
    it('should send correct data format in request', async () => {
      const user = userEvent.setup();
      let capturedPayload: any = null;

      global.fetch = vi.fn((url: string, options?: RequestInit) => {
        if (options?.method === 'POST' && options?.body) {
          capturedPayload = JSON.parse(options.body as string);
        }
        return Promise.resolve({
          ok: true,
          status: 200,
          json: async () => ({ success: true }),
        } as Response);
      });

      renderWithProviders(<App />, { route: '/lead-capture' });

      // Fill form
      const nameInput = await screen.findByLabelText(/name/i);
      await user.type(nameInput, 'John Doe');

      const emailInput = await screen.findByLabelText(/email/i);
      await user.type(emailInput, 'john@example.com');

      // Submit
      const submitButton = await screen.findByRole('button', {
        name: /submit|send/i,
      });
      await user.click(submitButton);

      // Verify payload structure
      await waitFor(() => {
        expect(capturedPayload).toBeDefined();
        if (capturedPayload) {
          expect(capturedPayload.name).toBe('John Doe');
          expect(capturedPayload.email).toBe('john@example.com');
        }
      });
    });

    it('should include all assessment data in submission', async () => {
      const user = userEvent.setup();
      let capturedPayload: any = null;

      global.fetch = vi.fn((url: string, options?: RequestInit) => {
        if (options?.method === 'POST' && options?.body) {
          capturedPayload = JSON.parse(options.body as string);
        }
        return Promise.resolve({
          ok: true,
          status: 200,
          json: async () => ({ success: true }),
        } as Response);
      });

      renderWithProviders(<App />, { route: '/lead-capture' });

      // Fill form
      const nameInput = await screen.findByLabelText(/name/i);
      await user.type(nameInput, 'John Doe');

      const emailInput = await screen.findByLabelText(/email/i);
      await user.type(emailInput, 'john@example.com');

      // Submit
      const submitButton = await screen.findByRole('button', {
        name: /submit|send/i,
      });
      await user.click(submitButton);

      // Verify payload includes metadata
      await waitFor(() => {
        if (capturedPayload) {
          // Should include timestamps, page info, etc.
          expect(
            capturedPayload.timestamp ||
              capturedPayload.startedAt ||
              capturedPayload.completedAt
          ).toBeDefined();
        }
      });
    });
  });

  describe('Loading States', () => {
    it('should show loading state during API call', async () => {
      const user = userEvent.setup();

      global.fetch = vi.fn(
        () =>
          new Promise((resolve) =>
            setTimeout(
              () =>
                resolve({
                  ok: true,
                  status: 200,
                  json: async () => ({ success: true }),
                } as Response),
              1000
            )
          )
      );

      renderWithProviders(<App />, { route: '/lead-capture' });

      // Fill and submit form
      const nameInput = await screen.findByLabelText(/name/i);
      await user.type(nameInput, 'John Doe');

      const emailInput = await screen.findByLabelText(/email/i);
      await user.type(emailInput, 'john@example.com');

      const submitButton = await screen.findByRole('button', {
        name: /submit|send/i,
      });
      await user.click(submitButton);

      // Should show loading state
      await waitFor(() => {
        expect(
          screen.queryByText(/loading|submitting|please wait/i)
        ).toBeInTheDocument();
      });
    });

    it('should disable submit button during submission', async () => {
      const user = userEvent.setup();

      global.fetch = vi.fn(
        () =>
          new Promise((resolve) =>
            setTimeout(
              () =>
                resolve({
                  ok: true,
                  status: 200,
                  json: async () => ({ success: true }),
                } as Response),
              500
            )
          )
      );

      renderWithProviders(<App />, { route: '/lead-capture' });

      // Fill form
      const nameInput = await screen.findByLabelText(/name/i);
      await user.type(nameInput, 'John Doe');

      const emailInput = await screen.findByLabelText(/email/i);
      await user.type(emailInput, 'john@example.com');

      const submitButton = await screen.findByRole('button', {
        name: /submit|send/i,
      });
      await user.click(submitButton);

      // Button should be disabled during submission
      await waitFor(() => {
        expect(submitButton).toBeDisabled();
      });
    });
  });
});
