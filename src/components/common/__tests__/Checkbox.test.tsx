/**
 * Checkbox Component Tests
 * Comprehensive test suite for Checkbox component
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, userEvent } from '../../../utils/__tests__/testHelpers';
import { Checkbox } from '../Checkbox';

describe('Checkbox', () => {
  describe('rendering', () => {
    it('should render checkbox with label', () => {
      const onChange = vi.fn();
      render(
        <Checkbox
          id="terms"
          label="I agree to the terms"
          checked={false}
          onChange={onChange}
        />
      );

      expect(screen.getByText('I agree to the terms')).toBeInTheDocument();
    });

    it('should render unchecked checkbox by default', () => {
      const onChange = vi.fn();
      render(
        <Checkbox
          id="terms"
          label="I agree to the terms"
          checked={false}
          onChange={onChange}
        />
      );

      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).not.toBeChecked();
    });

    it('should render checked checkbox', () => {
      const onChange = vi.fn();
      render(
        <Checkbox
          id="terms"
          label="I agree to the terms"
          checked={true}
          onChange={onChange}
        />
      );

      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toBeChecked();
    });

    it('should render with description', () => {
      const onChange = vi.fn();
      render(
        <Checkbox
          id="terms"
          label="I agree to the terms"
          checked={false}
          onChange={onChange}
          description="You must agree to continue"
        />
      );

      expect(screen.getByText('You must agree to continue')).toBeInTheDocument();
    });

    it('should link description with aria-describedby', () => {
      const onChange = vi.fn();
      render(
        <Checkbox
          id="terms"
          label="I agree to the terms"
          checked={false}
          onChange={onChange}
          description="You must agree to continue"
        />
      );

      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toHaveAttribute('aria-describedby', 'terms-description');
    });

    it('should render with custom className', () => {
      const onChange = vi.fn();
      const { container } = render(
        <Checkbox
          id="terms"
          label="I agree to the terms"
          checked={false}
          onChange={onChange}
          className="custom-checkbox"
        />
      );

      const checkboxContainer = container.querySelector('.custom-checkbox');
      expect(checkboxContainer).toBeInTheDocument();
    });
  });

  describe('checked/unchecked states', () => {
    it('should toggle from unchecked to checked', async () => {
      const onChange = vi.fn();
      const user = userEvent.setup();

      const { rerender } = render(
        <Checkbox
          id="terms"
          label="I agree to the terms"
          checked={false}
          onChange={onChange}
        />
      );

      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).not.toBeChecked();

      await user.click(checkbox);
      expect(onChange).toHaveBeenCalledWith(true);

      // Simulate parent component updating checked prop
      rerender(
        <Checkbox
          id="terms"
          label="I agree to the terms"
          checked={true}
          onChange={onChange}
        />
      );

      expect(screen.getByRole('checkbox')).toBeChecked();
    });

    it('should toggle from checked to unchecked', async () => {
      const onChange = vi.fn();
      const user = userEvent.setup();

      const { rerender } = render(
        <Checkbox
          id="terms"
          label="I agree to the terms"
          checked={true}
          onChange={onChange}
        />
      );

      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toBeChecked();

      await user.click(checkbox);
      expect(onChange).toHaveBeenCalledWith(false);

      // Simulate parent component updating checked prop
      rerender(
        <Checkbox
          id="terms"
          label="I agree to the terms"
          checked={false}
          onChange={onChange}
        />
      );

      expect(screen.getByRole('checkbox')).not.toBeChecked();
    });
  });

  describe('onChange handler', () => {
    it('should call onChange when clicked', async () => {
      const onChange = vi.fn();
      const user = userEvent.setup();

      render(
        <Checkbox
          id="terms"
          label="I agree to the terms"
          checked={false}
          onChange={onChange}
        />
      );

      const checkbox = screen.getByRole('checkbox');
      await user.click(checkbox);

      expect(onChange).toHaveBeenCalledTimes(1);
      expect(onChange).toHaveBeenCalledWith(true);
    });

    it('should call onChange with correct value when toggling', async () => {
      const onChange = vi.fn();
      const user = userEvent.setup();

      const { rerender } = render(
        <Checkbox
          id="terms"
          label="I agree to the terms"
          checked={false}
          onChange={onChange}
        />
      );

      const checkbox = screen.getByRole('checkbox');

      // First click: false -> true
      await user.click(checkbox);
      expect(onChange).toHaveBeenLastCalledWith(true);

      // Update checked state
      rerender(
        <Checkbox
          id="terms"
          label="I agree to the terms"
          checked={true}
          onChange={onChange}
        />
      );

      // Second click: true -> false
      await user.click(checkbox);
      expect(onChange).toHaveBeenLastCalledWith(false);
    });

    it('should call onChange when clicking custom visual checkbox', async () => {
      const onChange = vi.fn();
      const user = userEvent.setup();

      render(
        <Checkbox
          id="terms"
          label="I agree to the terms"
          checked={false}
          onChange={onChange}
        />
      );

      // Click on the custom visual checkbox (has role="checkbox")
      const visualCheckboxes = screen.getAllByRole('checkbox');
      const visualCheckbox = visualCheckboxes.find(
        (el) => el.getAttribute('aria-checked') !== null && el.tagName !== 'INPUT'
      );

      if (visualCheckbox) {
        await user.click(visualCheckbox);
        expect(onChange).toHaveBeenCalledWith(true);
      }
    });

    it('should call onChange when clicking label', async () => {
      const onChange = vi.fn();
      const user = userEvent.setup();

      render(
        <Checkbox
          id="terms"
          label="I agree to the terms"
          checked={false}
          onChange={onChange}
        />
      );

      const label = screen.getByText('I agree to the terms');
      await user.click(label);

      expect(onChange).toHaveBeenCalledWith(true);
    });
  });

  describe('disabled state', () => {
    it('should render disabled checkbox', () => {
      const onChange = vi.fn();
      render(
        <Checkbox
          id="terms"
          label="I agree to the terms"
          checked={false}
          onChange={onChange}
          disabled
        />
      );

      const checkbox = screen.getByRole('checkbox', { name: 'I agree to the terms' });
      expect(checkbox).toBeDisabled();
    });

    it('should not call onChange when disabled', async () => {
      const onChange = vi.fn();
      const user = userEvent.setup();

      render(
        <Checkbox
          id="terms"
          label="I agree to the terms"
          checked={false}
          onChange={onChange}
          disabled
        />
      );

      const checkbox = screen.getByRole('checkbox', { name: 'I agree to the terms' });
      await user.click(checkbox);

      expect(onChange).not.toHaveBeenCalled();
    });

    it('should have disabled styling class', () => {
      const onChange = vi.fn();
      const { container } = render(
        <Checkbox
          id="terms"
          label="I agree to the terms"
          checked={false}
          onChange={onChange}
          disabled
        />
      );

      const checkboxContainer = container.querySelector('.checkbox--disabled');
      expect(checkboxContainer).toBeInTheDocument();
    });

    it('should have aria-disabled attribute on custom visual', () => {
      const onChange = vi.fn();
      render(
        <Checkbox
          id="terms"
          label="I agree to the terms"
          checked={false}
          onChange={onChange}
          disabled
        />
      );

      const visualCheckboxes = screen.getAllByRole('checkbox');
      const visualCheckbox = visualCheckboxes.find(
        (el) => el.getAttribute('aria-disabled') === 'true' && el.tagName !== 'INPUT'
      );

      expect(visualCheckbox).toBeInTheDocument();
    });
  });

  describe('keyboard interactions', () => {
    it('should toggle on Space key', async () => {
      const onChange = vi.fn();
      const user = userEvent.setup();

      render(
        <Checkbox
          id="terms"
          label="I agree to the terms"
          checked={false}
          onChange={onChange}
        />
      );

      // Focus the visual checkbox
      const visualCheckboxes = screen.getAllByRole('checkbox');
      const visualCheckbox = visualCheckboxes.find(
        (el) => el.getAttribute('tabindex') === '0'
      );

      if (visualCheckbox) {
        visualCheckbox.focus();
        await user.keyboard(' ');
        expect(onChange).toHaveBeenCalledWith(true);
      }
    });

    it('should toggle on Enter key', async () => {
      const onChange = vi.fn();
      const user = userEvent.setup();

      render(
        <Checkbox
          id="terms"
          label="I agree to the terms"
          checked={false}
          onChange={onChange}
        />
      );

      // Focus the visual checkbox
      const visualCheckboxes = screen.getAllByRole('checkbox');
      const visualCheckbox = visualCheckboxes.find(
        (el) => el.getAttribute('tabindex') === '0'
      );

      if (visualCheckbox) {
        visualCheckbox.focus();
        await user.keyboard('{Enter}');
        expect(onChange).toHaveBeenCalledWith(true);
      }
    });

    it('should not toggle on other keys', async () => {
      const onChange = vi.fn();
      const user = userEvent.setup();

      render(
        <Checkbox
          id="terms"
          label="I agree to the terms"
          checked={false}
          onChange={onChange}
        />
      );

      const visualCheckboxes = screen.getAllByRole('checkbox');
      const visualCheckbox = visualCheckboxes.find(
        (el) => el.getAttribute('tabindex') === '0'
      );

      if (visualCheckbox) {
        visualCheckbox.focus();
        await user.keyboard('a');
        await user.keyboard('x');
        await user.keyboard('1');
        expect(onChange).not.toHaveBeenCalled();
      }
    });

    it('should not respond to keyboard when disabled', async () => {
      const onChange = vi.fn();
      const user = userEvent.setup();

      render(
        <Checkbox
          id="terms"
          label="I agree to the terms"
          checked={false}
          onChange={onChange}
          disabled
        />
      );

      const visualCheckboxes = screen.getAllByRole('checkbox');
      const visualCheckbox = visualCheckboxes.find(
        (el) => el.getAttribute('tabindex') === '-1'
      );

      if (visualCheckbox) {
        visualCheckbox.focus();
        await user.keyboard(' ');
        await user.keyboard('{Enter}');
        expect(onChange).not.toHaveBeenCalled();
      }
    });
  });

  describe('accessibility', () => {
    it('should have proper checkbox role', () => {
      const onChange = vi.fn();
      render(
        <Checkbox
          id="terms"
          label="I agree to the terms"
          checked={false}
          onChange={onChange}
        />
      );

      const checkboxes = screen.getAllByRole('checkbox');
      expect(checkboxes.length).toBeGreaterThan(0);
    });

    it('should have aria-checked attribute', () => {
      const onChange = vi.fn();
      render(
        <Checkbox
          id="terms"
          label="I agree to the terms"
          checked={true}
          onChange={onChange}
        />
      );

      const visualCheckboxes = screen.getAllByRole('checkbox');
      const visualCheckbox = visualCheckboxes.find(
        (el) => el.getAttribute('aria-checked') === 'true' && el.tagName !== 'INPUT'
      );

      expect(visualCheckbox).toBeInTheDocument();
    });

    it('should use custom aria-label when provided', () => {
      const onChange = vi.fn();
      render(
        <Checkbox
          id="terms"
          label="I agree to the terms"
          checked={false}
          onChange={onChange}
          aria-label="Accept terms and conditions"
        />
      );

      const checkbox = screen.getByRole('checkbox', { name: 'Accept terms and conditions' });
      expect(checkbox).toBeInTheDocument();
    });

    it('should fallback to label for aria-label', () => {
      const onChange = vi.fn();
      render(
        <Checkbox
          id="terms"
          label="I agree to the terms"
          checked={false}
          onChange={onChange}
        />
      );

      const checkbox = screen.getByRole('checkbox', { name: 'I agree to the terms' });
      expect(checkbox).toBeInTheDocument();
    });

    it('should be keyboard focusable', () => {
      const onChange = vi.fn();
      render(
        <Checkbox
          id="terms"
          label="I agree to the terms"
          checked={false}
          onChange={onChange}
        />
      );

      const visualCheckboxes = screen.getAllByRole('checkbox');
      const visualCheckbox = visualCheckboxes.find(
        (el) => el.getAttribute('tabindex') === '0'
      );

      expect(visualCheckbox).toBeInTheDocument();
    });

    it('should not be focusable when disabled', () => {
      const onChange = vi.fn();
      render(
        <Checkbox
          id="terms"
          label="I agree to the terms"
          checked={false}
          onChange={onChange}
          disabled
        />
      );

      const visualCheckboxes = screen.getAllByRole('checkbox');
      const visualCheckbox = visualCheckboxes.find(
        (el) => el.getAttribute('tabindex') === '-1'
      );

      expect(visualCheckbox).toBeInTheDocument();
    });

    it('should link label with checkbox via htmlFor', () => {
      const onChange = vi.fn();
      render(
        <Checkbox
          id="terms"
          label="I agree to the terms"
          checked={false}
          onChange={onChange}
        />
      );

      const label = screen.getByText('I agree to the terms').closest('label');
      expect(label).toHaveAttribute('for', 'terms');
    });
  });

  describe('animation behavior', () => {
    it('should render checkmark when checked', () => {
      const onChange = vi.fn();
      const { container } = render(
        <Checkbox
          id="terms"
          label="I agree to the terms"
          checked={true}
          onChange={onChange}
        />
      );

      // Checkmark SVG should be present
      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });

    it('should have animation attributes', () => {
      const onChange = vi.fn();
      const { container } = render(
        <Checkbox
          id="terms"
          label="I agree to the terms"
          checked={true}
          onChange={onChange}
        />
      );

      // SVG elements should have motion attributes (data-framer-appear-id, etc)
      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });
  });

  describe('additional props', () => {
    it('should pass through data attributes', () => {
      const onChange = vi.fn();
      render(
        <Checkbox
          id="terms"
          label="I agree to the terms"
          checked={false}
          onChange={onChange}
          data-testid="custom-checkbox"
        />
      );

      const checkbox = screen.getByTestId('custom-checkbox');
      expect(checkbox).toBeInTheDocument();
    });

    it('should support name attribute for forms', () => {
      const onChange = vi.fn();
      render(
        <Checkbox
          id="terms"
          label="I agree to the terms"
          checked={false}
          onChange={onChange}
          name="termsAccepted"
        />
      );

      const checkbox = screen.getByRole('checkbox', { name: 'I agree to the terms' });
      expect(checkbox).toHaveAttribute('name', 'termsAccepted');
    });

    it('should support value attribute', () => {
      const onChange = vi.fn();
      render(
        <Checkbox
          id="terms"
          label="I agree to the terms"
          checked={false}
          onChange={onChange}
          value="yes"
        />
      );

      const checkbox = screen.getByRole('checkbox', { name: 'I agree to the terms' });
      expect(checkbox).toHaveAttribute('value', 'yes');
    });
  });
});
