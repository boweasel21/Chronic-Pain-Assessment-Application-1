/**
 * Form Validation Integration Tests
 * Tests form validation behavior across the application
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from './testUtils';
import App from '../App';

describe('Form Validation Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    sessionStorage.clear();
  });

  describe('Email Validation', () => {
    it('should show error for invalid email format', async () => {
      const user = userEvent.setup();
      renderWithProviders(<App />, { route: '/lead-capture' });

      // Find email input
      const emailInput = await screen.findByLabelText(/email/i);

      // Type invalid email
      await user.type(emailInput, 'invalid-email');
      await user.tab(); // Trigger blur event

      // Should show validation error
      await waitFor(() => {
        expect(
          screen.queryByText(/invalid.*email|valid.*email/i)
        ).toBeInTheDocument();
      });
    });

    it('should clear error when valid email is entered', async () => {
      const user = userEvent.setup();
      renderWithProviders(<App />, { route: '/lead-capture' });

      const emailInput = await screen.findByLabelText(/email/i);

      // Type invalid email first
      await user.type(emailInput, 'invalid');
      await user.tab();

      // Wait for error to appear
      await waitFor(() => {
        expect(screen.queryByText(/invalid.*email/i)).toBeInTheDocument();
      });

      // Clear and type valid email
      await user.clear(emailInput);
      await user.type(emailInput, 'valid@example.com');
      await user.tab();

      // Error should clear
      await waitFor(() => {
        expect(screen.queryByText(/invalid.*email/i)).not.toBeInTheDocument();
      });
    });

    it('should accept various valid email formats', async () => {
      const user = userEvent.setup();
      renderWithProviders(<App />, { route: '/lead-capture' });

      const validEmails = [
        'user@example.com',
        'user.name@example.com',
        'user+tag@example.co.uk',
        'user_name@example-domain.com',
      ];

      const emailInput = await screen.findByLabelText(/email/i);

      for (const email of validEmails) {
        await user.clear(emailInput);
        await user.type(emailInput, email);
        await user.tab();

        // Should not show error
        await waitFor(() => {
          expect(screen.queryByText(/invalid.*email/i)).not.toBeInTheDocument();
        });
      }
    });

    it('should reject invalid email formats', async () => {
      const user = userEvent.setup();
      renderWithProviders(<App />, { route: '/lead-capture' });

      const invalidEmails = [
        'invalid',
        '@example.com',
        'user@',
        'user @example.com',
        'user@example',
      ];

      const emailInput = await screen.findByLabelText(/email/i);

      for (const email of invalidEmails) {
        await user.clear(emailInput);
        await user.type(emailInput, email);
        await user.tab();

        // Should show error for each invalid email
        await waitFor(() => {
          expect(
            screen.queryByText(/invalid.*email|valid.*email/i)
          ).toBeInTheDocument();
        });
      }
    });
  });

  describe('Required Field Validation', () => {
    it('should show error when required field is empty', async () => {
      const user = userEvent.setup();
      renderWithProviders(<App />, { route: '/lead-capture' });

      // Find submit button
      const submitButton = await screen.findByRole('button', {
        name: /submit|send|continue/i,
      });

      // Try to submit without filling required fields
      await user.click(submitButton);

      // Should show required field errors
      await waitFor(() => {
        expect(screen.queryByText(/required/i)).toBeInTheDocument();
      });
    });

    it('should clear error when required field is filled', async () => {
      const user = userEvent.setup();
      renderWithProviders(<App />, { route: '/lead-capture' });

      // Try to submit without data
      const submitButton = await screen.findByRole('button', {
        name: /submit|send|continue/i,
      });
      await user.click(submitButton);

      // Wait for error
      await waitFor(() => {
        expect(screen.queryByText(/required/i)).toBeInTheDocument();
      });

      // Fill in required field
      const nameInput = await screen.findByLabelText(/name/i);
      await user.type(nameInput, 'John Doe');

      // Error for name field should clear
      await waitFor(() => {
        const nameError = screen.queryByText(/name.*required/i);
        expect(nameError).not.toBeInTheDocument();
      });
    });

    it('should validate all required fields before submission', async () => {
      const user = userEvent.setup();
      renderWithProviders(<App />, { route: '/lead-capture' });

      const submitButton = await screen.findByRole('button', {
        name: /submit|send|continue/i,
      });

      // Submit empty form
      await user.click(submitButton);

      // Should show multiple required field errors
      await waitFor(() => {
        const errors = screen.queryAllByText(/required/i);
        expect(errors.length).toBeGreaterThan(0);
      });

      // Fill only one required field
      const nameInput = await screen.findByLabelText(/name/i);
      await user.type(nameInput, 'John Doe');

      // Try to submit again
      await user.click(submitButton);

      // Should still show errors for other required fields
      await waitFor(() => {
        const errors = screen.queryAllByText(/required|invalid/i);
        expect(errors.length).toBeGreaterThan(0);
      });
    });
  });

  describe('Input Sanitization', () => {
    it('should sanitize XSS attempts in text inputs', async () => {
      const user = userEvent.setup();
      renderWithProviders(<App />, { route: '/lead-capture' });

      const nameInput = await screen.findByLabelText(/name/i);

      // Try to input script tag
      const xssAttempt = '<script>alert("xss")</script>';
      await user.type(nameInput, xssAttempt);

      // Input should be sanitized (not contain script tags)
      const inputValue = (nameInput as HTMLInputElement).value;
      expect(inputValue).not.toContain('<script>');
      expect(inputValue).not.toContain('</script>');
    });

    it('should handle special characters appropriately', async () => {
      const user = userEvent.setup();
      renderWithProviders(<App />, { route: '/lead-capture' });

      const nameInput = await screen.findByLabelText(/name/i);

      // Input with special characters
      await user.type(nameInput, "O'Brien-Smith");

      // Should preserve valid special characters
      const inputValue = (nameInput as HTMLInputElement).value;
      expect(inputValue).toBe("O'Brien-Smith");
    });

    it('should prevent SQL injection attempts', async () => {
      const user = userEvent.setup();
      renderWithProviders(<App />, { route: '/lead-capture' });

      const emailInput = await screen.findByLabelText(/email/i);

      // Try SQL injection
      const sqlInjection = "'; DROP TABLE users; --";
      await user.type(emailInput, sqlInjection);

      // Should fail email validation
      await user.tab();

      await waitFor(() => {
        expect(
          screen.queryByText(/invalid.*email|valid.*email/i)
        ).toBeInTheDocument();
      });
    });
  });

  describe('Phone Number Validation', () => {
    it('should accept valid phone number formats', async () => {
      const user = userEvent.setup();
      renderWithProviders(<App />, { route: '/lead-capture' });

      const phoneInput = screen.queryByLabelText(/phone/i);
      if (!phoneInput) return; // Phone might be optional

      const validPhones = [
        '(555) 123-4567',
        '555-123-4567',
        '5551234567',
        '+1 555 123 4567',
      ];

      for (const phone of validPhones) {
        await user.clear(phoneInput);
        await user.type(phoneInput, phone);
        await user.tab();

        // Should not show error
        await waitFor(() => {
          expect(screen.queryByText(/invalid.*phone/i)).not.toBeInTheDocument();
        });
      }
    });

    it('should reject invalid phone numbers', async () => {
      const user = userEvent.setup();
      renderWithProviders(<App />, { route: '/lead-capture' });

      const phoneInput = screen.queryByLabelText(/phone/i);
      if (!phoneInput) return;

      const invalidPhones = ['123', 'abc-def-ghij', '555-12-3456'];

      for (const phone of invalidPhones) {
        await user.clear(phoneInput);
        await user.type(phoneInput, phone);
        await user.tab();

        // Should show error
        await waitFor(() => {
          expect(
            screen.queryByText(/invalid.*phone|valid.*phone/i)
          ).toBeInTheDocument();
        });
      }
    });
  });

  describe('Name Validation', () => {
    it('should reject names that are too short', async () => {
      const user = userEvent.setup();
      renderWithProviders(<App />, { route: '/lead-capture' });

      const nameInput = await screen.findByLabelText(/name/i);

      // Type single character
      await user.type(nameInput, 'A');
      await user.tab();

      // Should show error
      await waitFor(() => {
        expect(
          screen.queryByText(/invalid.*name|name.*short|characters/i)
        ).toBeInTheDocument();
      });
    });

    it('should accept valid names', async () => {
      const user = userEvent.setup();
      renderWithProviders(<App />, { route: '/lead-capture' });

      const nameInput = await screen.findByLabelText(/name/i);

      const validNames = [
        'John Doe',
        'Mary-Jane Smith',
        "O'Brien",
        'José García',
      ];

      for (const name of validNames) {
        await user.clear(nameInput);
        await user.type(nameInput, name);
        await user.tab();

        // Should not show error
        await waitFor(() => {
          expect(screen.queryByText(/invalid.*name/i)).not.toBeInTheDocument();
        });
      }
    });

    it('should reject names that are too long', async () => {
      const user = userEvent.setup();
      renderWithProviders(<App />, { route: '/lead-capture' });

      const nameInput = await screen.findByLabelText(/name/i);

      // Type very long name (over 100 characters)
      const longName = 'A'.repeat(101);
      await user.type(nameInput, longName);
      await user.tab();

      // Should show error or truncate
      await waitFor(() => {
        const inputValue = (nameInput as HTMLInputElement).value;
        const hasError = screen.queryByText(/invalid.*name|name.*long/i);
        expect(inputValue.length <= 100 || hasError).toBeTruthy();
      });
    });
  });

  describe('Real-time Validation', () => {
    it('should validate on blur', async () => {
      const user = userEvent.setup();
      renderWithProviders(<App />, { route: '/lead-capture' });

      const emailInput = await screen.findByLabelText(/email/i);

      // Type invalid email
      await user.type(emailInput, 'invalid');

      // No error while typing
      expect(screen.queryByText(/invalid.*email/i)).not.toBeInTheDocument();

      // Blur the input
      await user.tab();

      // Error should appear after blur
      await waitFor(() => {
        expect(screen.queryByText(/invalid.*email/i)).toBeInTheDocument();
      });
    });

    it('should re-validate on change after initial error', async () => {
      const user = userEvent.setup();
      renderWithProviders(<App />, { route: '/lead-capture' });

      const emailInput = await screen.findByLabelText(/email/i);

      // Type invalid email and blur
      await user.type(emailInput, 'invalid');
      await user.tab();

      // Wait for error
      await waitFor(() => {
        expect(screen.queryByText(/invalid.*email/i)).toBeInTheDocument();
      });

      // Clear and type valid email
      await user.clear(emailInput);
      await user.type(emailInput, 'valid@example.com');

      // Error should clear immediately (real-time validation)
      await waitFor(() => {
        expect(screen.queryByText(/invalid.*email/i)).not.toBeInTheDocument();
      });
    });
  });

  describe('Multiple Selection Validation', () => {
    it('should validate minimum selections for conditions', async () => {
      const user = userEvent.setup();
      renderWithProviders(<App />, { route: '/cellular-science' });

      // Try to proceed without selecting any condition
      const nextButton = await screen.findByRole('button', {
        name: /next|continue/i,
      });
      await user.click(nextButton);

      // Should show error about minimum selection
      await waitFor(() => {
        expect(
          screen.queryByText(/select|choose|required|at least/i)
        ).toBeInTheDocument();
      });
    });

    it('should allow proceeding when minimum selections met', async () => {
      const user = userEvent.setup();
      renderWithProviders(<App />, { route: '/cellular-science' });

      // Select at least one condition
      const checkbox = await screen.findByRole('checkbox', {
        name: /arthritis|back pain/i,
      });
      await user.click(checkbox);

      // Try to proceed
      const nextButton = await screen.findByRole('button', {
        name: /next|continue/i,
      });
      await user.click(nextButton);

      // Should not show minimum selection error
      await waitFor(() => {
        expect(
          screen.queryByText(/select.*at least|minimum/i)
        ).not.toBeInTheDocument();
      });
    });
  });

  describe('Form Submission Validation', () => {
    it('should prevent submission with validation errors', async () => {
      const user = userEvent.setup();
      renderWithProviders(<App />, { route: '/lead-capture' });

      // Mock fetch to track if it's called
      const mockFetch = vi.fn();
      global.fetch = mockFetch;

      // Fill form with invalid data
      const emailInput = await screen.findByLabelText(/email/i);
      await user.type(emailInput, 'invalid-email');

      // Try to submit
      const submitButton = await screen.findByRole('button', {
        name: /submit|send|continue/i,
      });
      await user.click(submitButton);

      // Should show validation errors
      await waitFor(() => {
        expect(screen.queryByText(/invalid|error/i)).toBeInTheDocument();
      });

      // Should NOT call API
      expect(mockFetch).not.toHaveBeenCalled();
    });

    it('should allow submission with valid data', async () => {
      const user = userEvent.setup();
      renderWithProviders(<App />, { route: '/lead-capture' });

      // Mock successful API response
      global.fetch = vi.fn(() =>
        Promise.resolve({
          ok: true,
          status: 200,
          json: async () => ({ success: true }),
        } as Response)
      );

      // Fill form with valid data
      const nameInput = await screen.findByLabelText(/name/i);
      await user.type(nameInput, 'John Doe');

      const emailInput = await screen.findByLabelText(/email/i);
      await user.type(emailInput, 'john.doe@example.com');

      // Submit
      const submitButton = await screen.findByRole('button', {
        name: /submit|send|continue/i,
      });
      await user.click(submitButton);

      // Should call API
      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalled();
      });
    });
  });

  describe('Accessibility', () => {
    it('should associate error messages with form fields', async () => {
      const user = userEvent.setup();
      renderWithProviders(<App />, { route: '/lead-capture' });

      const emailInput = await screen.findByLabelText(/email/i);

      // Type invalid email
      await user.type(emailInput, 'invalid');
      await user.tab();

      // Error should be associated with input via aria-describedby or aria-errormessage
      await waitFor(() => {
        const describedBy = emailInput.getAttribute('aria-describedby');
        const errorMessage = emailInput.getAttribute('aria-errormessage');
        const invalid = emailInput.getAttribute('aria-invalid');

        expect(describedBy || errorMessage || invalid === 'true').toBeTruthy();
      });
    });

    it('should mark invalid fields with aria-invalid', async () => {
      const user = userEvent.setup();
      renderWithProviders(<App />, { route: '/lead-capture' });

      const emailInput = await screen.findByLabelText(/email/i);

      // Type invalid email
      await user.type(emailInput, 'invalid');
      await user.tab();

      // Should have aria-invalid="true"
      await waitFor(() => {
        expect(emailInput.getAttribute('aria-invalid')).toBe('true');
      });

      // Fix the error
      await user.clear(emailInput);
      await user.type(emailInput, 'valid@example.com');

      // Should have aria-invalid="false" or removed
      await waitFor(() => {
        const ariaInvalid = emailInput.getAttribute('aria-invalid');
        expect(ariaInvalid === 'false' || ariaInvalid === null).toBeTruthy();
      });
    });
  });
});
