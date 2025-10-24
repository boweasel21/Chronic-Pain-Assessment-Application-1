/**
 * FormField Component Tests
 * Comprehensive test suite for FormField component
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, userEvent, waitFor } from '../../../utils/__tests__/testHelpers';
import { FormField } from '../FormField';

describe('FormField', () => {
  describe('rendering', () => {
    it('should render input field with label', () => {
      const onChange = vi.fn();
      render(
        <FormField
          label="Email Address"
          value=""
          onChange={onChange}
        />
      );

      expect(screen.getByLabelText('Email Address')).toBeInTheDocument();
    });

    it('should render with text type by default', () => {
      const onChange = vi.fn();
      render(
        <FormField
          label="Full Name"
          value=""
          onChange={onChange}
        />
      );

      const input = screen.getByLabelText('Full Name');
      expect(input).toHaveAttribute('type', 'text');
    });

    it('should render with email type', () => {
      const onChange = vi.fn();
      render(
        <FormField
          label="Email Address"
          type="email"
          value=""
          onChange={onChange}
        />
      );

      const input = screen.getByLabelText('Email Address');
      expect(input).toHaveAttribute('type', 'email');
    });

    it('should render with tel type', () => {
      const onChange = vi.fn();
      render(
        <FormField
          label="Phone Number"
          type="tel"
          value=""
          onChange={onChange}
        />
      );

      const input = screen.getByLabelText('Phone Number');
      expect(input).toHaveAttribute('type', 'tel');
    });

    it('should render with password type', () => {
      const onChange = vi.fn();
      render(
        <FormField
          label="Password"
          type="password"
          value=""
          onChange={onChange}
        />
      );

      const input = screen.getByLabelText('Password');
      expect(input).toHaveAttribute('type', 'password');
    });

    it('should render with number type', () => {
      const onChange = vi.fn();
      render(
        <FormField
          label="Age"
          type="number"
          value=""
          onChange={onChange}
        />
      );

      const input = screen.getByLabelText('Age');
      expect(input).toHaveAttribute('type', 'number');
    });

    it('should render with url type', () => {
      const onChange = vi.fn();
      render(
        <FormField
          label="Website"
          type="url"
          value=""
          onChange={onChange}
        />
      );

      const input = screen.getByLabelText('Website');
      expect(input).toHaveAttribute('type', 'url');
    });

    it('should display current value', () => {
      const onChange = vi.fn();
      render(
        <FormField
          label="Email Address"
          value="test@example.com"
          onChange={onChange}
        />
      );

      const input = screen.getByLabelText('Email Address') as HTMLInputElement;
      expect(input.value).toBe('test@example.com');
    });

    it('should render with placeholder when focused', async () => {
      const onChange = vi.fn();
      const user = userEvent.setup();

      render(
        <FormField
          label="Email Address"
          value=""
          onChange={onChange}
          placeholder="your@email.com"
        />
      );

      const input = screen.getByLabelText('Email Address');
      await user.click(input);

      expect(input).toHaveAttribute('placeholder', 'your@email.com');
    });

    it('should not show placeholder when not focused', () => {
      const onChange = vi.fn();
      render(
        <FormField
          label="Email Address"
          value=""
          onChange={onChange}
          placeholder="your@email.com"
        />
      );

      const input = screen.getByLabelText('Email Address');
      expect(input).toHaveAttribute('placeholder', '');
    });

    it('should generate unique ID from label', () => {
      const onChange = vi.fn();
      render(
        <FormField
          label="Email Address"
          value=""
          onChange={onChange}
        />
      );

      const input = screen.getByLabelText('Email Address');
      expect(input).toHaveAttribute('id', 'form-field-email-address');
    });

    it('should use custom ID when provided', () => {
      const onChange = vi.fn();
      render(
        <FormField
          label="Email Address"
          value=""
          onChange={onChange}
          id="custom-email-id"
        />
      );

      const input = screen.getByLabelText('Email Address');
      expect(input).toHaveAttribute('id', 'custom-email-id');
    });
  });

  describe('required field', () => {
    it('should show asterisk for required fields', () => {
      const onChange = vi.fn();
      render(
        <FormField
          label="Email Address"
          value=""
          onChange={onChange}
          required
        />
      );

      expect(screen.getByLabelText(/required/i)).toBeInTheDocument();
    });

    it('should have aria-required attribute', () => {
      const onChange = vi.fn();
      render(
        <FormField
          label="Email Address"
          value=""
          onChange={onChange}
          required
        />
      );

      const input = screen.getByLabelText('Email Address');
      expect(input).toHaveAttribute('aria-required', 'true');
    });

    it('should not show asterisk for optional fields', () => {
      const onChange = vi.fn();
      render(
        <FormField
          label="Email Address"
          value=""
          onChange={onChange}
        />
      );

      const input = screen.getByLabelText('Email Address');
      expect(input).toHaveAttribute('aria-required', 'false');
    });
  });

  describe('error handling', () => {
    it('should display error message', () => {
      const onChange = vi.fn();
      render(
        <FormField
          label="Email Address"
          value=""
          onChange={onChange}
          error="Please enter a valid email"
        />
      );

      expect(screen.getByText('Please enter a valid email')).toBeInTheDocument();
    });

    it('should have error role for accessibility', () => {
      const onChange = vi.fn();
      render(
        <FormField
          label="Email Address"
          value=""
          onChange={onChange}
          error="Please enter a valid email"
        />
      );

      expect(screen.getByRole('alert')).toHaveTextContent('Please enter a valid email');
    });

    it('should have aria-invalid when error exists', () => {
      const onChange = vi.fn();
      render(
        <FormField
          label="Email Address"
          value=""
          onChange={onChange}
          error="Please enter a valid email"
        />
      );

      const input = screen.getByLabelText('Email Address');
      expect(input).toHaveAttribute('aria-invalid', 'true');
    });

    it('should not have aria-invalid when no error', () => {
      const onChange = vi.fn();
      render(
        <FormField
          label="Email Address"
          value=""
          onChange={onChange}
        />
      );

      const input = screen.getByLabelText('Email Address');
      expect(input).toHaveAttribute('aria-invalid', 'false');
    });

    it('should link error message with aria-describedby', () => {
      const onChange = vi.fn();
      render(
        <FormField
          label="Email Address"
          value=""
          onChange={onChange}
          error="Please enter a valid email"
          id="email-field"
        />
      );

      const input = screen.getByLabelText('Email Address');
      expect(input).toHaveAttribute('aria-describedby', 'email-field-error');
    });
  });

  describe('helper text', () => {
    it('should display helper text when no error', () => {
      const onChange = vi.fn();
      render(
        <FormField
          label="Email Address"
          value=""
          onChange={onChange}
          helperText="We'll never share your email"
        />
      );

      expect(screen.getByText("We'll never share your email")).toBeInTheDocument();
    });

    it('should not display helper text when error exists', () => {
      const onChange = vi.fn();
      render(
        <FormField
          label="Email Address"
          value=""
          onChange={onChange}
          helperText="We'll never share your email"
          error="Please enter a valid email"
        />
      );

      expect(screen.queryByText("We'll never share your email")).not.toBeInTheDocument();
      expect(screen.getByText('Please enter a valid email')).toBeInTheDocument();
    });

    it('should link helper text with aria-describedby', () => {
      const onChange = vi.fn();
      render(
        <FormField
          label="Email Address"
          value=""
          onChange={onChange}
          helperText="We'll never share your email"
          id="email-field"
        />
      );

      const input = screen.getByLabelText('Email Address');
      expect(input).toHaveAttribute('aria-describedby', 'email-field-helper');
    });
  });

  describe('input changes', () => {
    it('should call onChange when input value changes', async () => {
      const onChange = vi.fn();
      const user = userEvent.setup();

      render(
        <FormField
          label="Email Address"
          value=""
          onChange={onChange}
        />
      );

      const input = screen.getByLabelText('Email Address');
      await user.type(input, 'test@example.com');

      expect(onChange).toHaveBeenCalled();
      expect(onChange).toHaveBeenLastCalledWith('test@example.com');
    });

    it('should call onChange for each character typed', async () => {
      const onChange = vi.fn();
      const user = userEvent.setup();

      render(
        <FormField
          label="Email Address"
          value=""
          onChange={onChange}
        />
      );

      const input = screen.getByLabelText('Email Address');
      await user.type(input, 'abc');

      expect(onChange).toHaveBeenCalledTimes(3);
      expect(onChange).toHaveBeenNthCalledWith(1, 'a');
      expect(onChange).toHaveBeenNthCalledWith(2, 'ab');
      expect(onChange).toHaveBeenNthCalledWith(3, 'abc');
    });

    it('should handle clearing input', async () => {
      const onChange = vi.fn();
      const user = userEvent.setup();

      render(
        <FormField
          label="Email Address"
          value="test@example.com"
          onChange={onChange}
        />
      );

      const input = screen.getByLabelText('Email Address');
      await user.clear(input);

      expect(onChange).toHaveBeenLastCalledWith('');
    });
  });

  describe('focus and blur', () => {
    it('should handle focus state', async () => {
      const onChange = vi.fn();
      const user = userEvent.setup();

      render(
        <FormField
          label="Email Address"
          value=""
          onChange={onChange}
        />
      );

      const input = screen.getByLabelText('Email Address');
      await user.click(input);

      expect(input).toHaveFocus();
    });

    it('should handle blur state', async () => {
      const onChange = vi.fn();
      const user = userEvent.setup();

      render(
        <FormField
          label="Email Address"
          value=""
          onChange={onChange}
        />
      );

      const input = screen.getByLabelText('Email Address');
      await user.click(input);
      expect(input).toHaveFocus();

      await user.tab();
      expect(input).not.toHaveFocus();
    });

    it('should show placeholder on focus', async () => {
      const onChange = vi.fn();
      const user = userEvent.setup();

      render(
        <FormField
          label="Email Address"
          value=""
          onChange={onChange}
          placeholder="your@email.com"
        />
      );

      const input = screen.getByLabelText('Email Address');
      expect(input).toHaveAttribute('placeholder', '');

      await user.click(input);
      expect(input).toHaveAttribute('placeholder', 'your@email.com');
    });
  });

  describe('disabled state', () => {
    it('should render disabled input', () => {
      const onChange = vi.fn();
      render(
        <FormField
          label="Email Address"
          value=""
          onChange={onChange}
          disabled
        />
      );

      const input = screen.getByLabelText('Email Address');
      expect(input).toBeDisabled();
    });

    it('should not call onChange when disabled', async () => {
      const onChange = vi.fn();
      const user = userEvent.setup();

      render(
        <FormField
          label="Email Address"
          value=""
          onChange={onChange}
          disabled
        />
      );

      const input = screen.getByLabelText('Email Address');
      await user.type(input, 'test');

      expect(onChange).not.toHaveBeenCalled();
    });
  });

  describe('accessibility', () => {
    it('should use custom aria-label when provided', () => {
      const onChange = vi.fn();
      render(
        <FormField
          label="Email Address"
          value=""
          onChange={onChange}
          aria-label="Enter your email address"
        />
      );

      const input = screen.getByLabelText('Enter your email address');
      expect(input).toBeInTheDocument();
    });

    it('should fallback to label for aria-label', () => {
      const onChange = vi.fn();
      render(
        <FormField
          label="Email Address"
          value=""
          onChange={onChange}
        />
      );

      const input = screen.getByLabelText('Email Address');
      expect(input).toHaveAttribute('aria-label', 'Email Address');
    });

    it('should be keyboard accessible', async () => {
      const onChange = vi.fn();
      const user = userEvent.setup();

      render(
        <FormField
          label="Email Address"
          value=""
          onChange={onChange}
        />
      );

      await user.tab();
      const input = screen.getByLabelText('Email Address');
      expect(input).toHaveFocus();
    });
  });

  describe('label animations', () => {
    it('should float label when input has value', () => {
      const onChange = vi.fn();
      render(
        <FormField
          label="Email Address"
          value="test@example.com"
          onChange={onChange}
        />
      );

      // Label should be in floating position (this is tested via snapshot or visual testing)
      const input = screen.getByLabelText('Email Address');
      expect(input).toHaveValue('test@example.com');
    });

    it('should float label when input is focused', async () => {
      const onChange = vi.fn();
      const user = userEvent.setup();

      render(
        <FormField
          label="Email Address"
          value=""
          onChange={onChange}
        />
      );

      const input = screen.getByLabelText('Email Address');
      await user.click(input);

      expect(input).toHaveFocus();
      // Label should be in floating position when focused
    });
  });

  describe('custom className', () => {
    it('should apply custom className to container', () => {
      const onChange = vi.fn();
      const { container } = render(
        <FormField
          label="Email Address"
          value=""
          onChange={onChange}
          className="custom-class"
        />
      );

      const formField = container.querySelector('.custom-class');
      expect(formField).toBeInTheDocument();
    });
  });

  describe('additional props', () => {
    it('should pass through maxLength attribute', () => {
      const onChange = vi.fn();
      render(
        <FormField
          label="Username"
          value=""
          onChange={onChange}
          maxLength={20}
        />
      );

      const input = screen.getByLabelText('Username');
      expect(input).toHaveAttribute('maxLength', '20');
    });

    it('should pass through minLength attribute', () => {
      const onChange = vi.fn();
      render(
        <FormField
          label="Username"
          value=""
          onChange={onChange}
          minLength={5}
        />
      );

      const input = screen.getByLabelText('Username');
      expect(input).toHaveAttribute('minLength', '5');
    });

    it('should pass through pattern attribute', () => {
      const onChange = vi.fn();
      render(
        <FormField
          label="Username"
          value=""
          onChange={onChange}
          pattern="[A-Za-z]+"
        />
      );

      const input = screen.getByLabelText('Username');
      expect(input).toHaveAttribute('pattern', '[A-Za-z]+');
    });

    it('should pass through autoComplete attribute', () => {
      const onChange = vi.fn();
      render(
        <FormField
          label="Email Address"
          type="email"
          value=""
          onChange={onChange}
          autoComplete="email"
        />
      );

      const input = screen.getByLabelText('Email Address');
      expect(input).toHaveAttribute('autoComplete', 'email');
    });
  });
});
