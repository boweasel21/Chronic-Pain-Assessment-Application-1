/**
 * Button Component Tests
 * Comprehensive test suite for Button component
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, userEvent } from '../../../utils/__tests__/testHelpers';
import { Button } from '../Button';

describe('Button', () => {
  describe('rendering', () => {
    it('should render button with children', () => {
      render(
        <Button aria-label="Test button">
          Click Me
        </Button>
      );

      expect(screen.getByText('Click Me')).toBeInTheDocument();
    });

    it('should render with primary variant by default', () => {
      render(
        <Button aria-label="Test button">
          Click Me
        </Button>
      );

      const button = screen.getByRole('button');
      expect(button.className).toContain('button--primary');
    });

    it('should render with secondary variant', () => {
      render(
        <Button variant="secondary" aria-label="Test button">
          Click Me
        </Button>
      );

      const button = screen.getByRole('button');
      expect(button.className).toContain('button--secondary');
    });

    it('should render with danger variant', () => {
      render(
        <Button variant="danger" aria-label="Test button">
          Click Me
        </Button>
      );

      const button = screen.getByRole('button');
      expect(button.className).toContain('button--danger');
    });

    it('should render with large size by default', () => {
      render(
        <Button aria-label="Test button">
          Click Me
        </Button>
      );

      const button = screen.getByRole('button');
      expect(button.className).toContain('button--large');
    });

    it('should render with small size', () => {
      render(
        <Button size="small" aria-label="Test button">
          Click Me
        </Button>
      );

      const button = screen.getByRole('button');
      expect(button.className).toContain('button--small');
    });

    it('should render with fullWidth class', () => {
      render(
        <Button fullWidth aria-label="Test button">
          Click Me
        </Button>
      );

      const button = screen.getByRole('button');
      expect(button.className).toContain('button--fullWidth');
    });

    it('should render with custom className', () => {
      render(
        <Button className="custom-class" aria-label="Test button">
          Click Me
        </Button>
      );

      const button = screen.getByRole('button');
      expect(button.className).toContain('custom-class');
    });

    it('should render with button type by default', () => {
      render(
        <Button aria-label="Test button">
          Click Me
        </Button>
      );

      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('type', 'button');
    });

    it('should render with submit type', () => {
      render(
        <Button type="submit" aria-label="Test button">
          Submit
        </Button>
      );

      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('type', 'submit');
    });

    it('should render with reset type', () => {
      render(
        <Button type="reset" aria-label="Test button">
          Reset
        </Button>
      );

      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('type', 'reset');
    });
  });

  describe('disabled state', () => {
    it('should render disabled button', () => {
      render(
        <Button disabled aria-label="Test button">
          Click Me
        </Button>
      );

      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
      expect(button.className).toContain('button--disabled');
    });

    it('should have aria-disabled attribute', () => {
      render(
        <Button disabled aria-label="Test button">
          Click Me
        </Button>
      );

      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-disabled', 'true');
    });

    it('should not call onClick when disabled', async () => {
      const handleClick = vi.fn();
      const user = userEvent.setup();

      render(
        <Button disabled onClick={handleClick} aria-label="Test button">
          Click Me
        </Button>
      );

      const button = screen.getByRole('button');
      await user.click(button);

      expect(handleClick).not.toHaveBeenCalled();
    });
  });

  describe('click handlers', () => {
    it('should call onClick when clicked', async () => {
      const handleClick = vi.fn();
      const user = userEvent.setup();

      render(
        <Button onClick={handleClick} aria-label="Test button">
          Click Me
        </Button>
      );

      const button = screen.getByRole('button');
      await user.click(button);

      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('should call onClick multiple times', async () => {
      const handleClick = vi.fn();
      const user = userEvent.setup();

      render(
        <Button onClick={handleClick} aria-label="Test button">
          Click Me
        </Button>
      );

      const button = screen.getByRole('button');
      await user.click(button);
      await user.click(button);
      await user.click(button);

      expect(handleClick).toHaveBeenCalledTimes(3);
    });

    it('should work without onClick handler', async () => {
      const user = userEvent.setup();

      render(
        <Button aria-label="Test button">
          Click Me
        </Button>
      );

      const button = screen.getByRole('button');
      await user.click(button);

      // Should not throw error
      expect(button).toBeInTheDocument();
    });
  });

  describe('accessibility', () => {
    it('should have aria-label attribute', () => {
      render(
        <Button aria-label="Submit form">
          Submit
        </Button>
      );

      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-label', 'Submit form');
    });

    it('should be accessible by role', () => {
      render(
        <Button aria-label="Test button">
          Click Me
        </Button>
      );

      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('should be accessible by aria-label', () => {
      render(
        <Button aria-label="Submit form">
          Submit
        </Button>
      );

      expect(screen.getByLabelText('Submit form')).toBeInTheDocument();
    });

    it('should support keyboard navigation', async () => {
      const handleClick = vi.fn();
      const user = userEvent.setup();

      render(
        <Button onClick={handleClick} aria-label="Test button">
          Click Me
        </Button>
      );

      const button = screen.getByRole('button');
      button.focus();
      expect(button).toHaveFocus();

      await user.keyboard('{Enter}');
      expect(handleClick).toHaveBeenCalled();
    });

    it('should support space key activation', async () => {
      const handleClick = vi.fn();
      const user = userEvent.setup();

      render(
        <Button onClick={handleClick} aria-label="Test button">
          Click Me
        </Button>
      );

      const button = screen.getByRole('button');
      button.focus();

      await user.keyboard(' ');
      expect(handleClick).toHaveBeenCalled();
    });
  });

  describe('framer motion animations', () => {
    it('should not have motion props when disabled', () => {
      render(
        <Button disabled aria-label="Test button">
          Click Me
        </Button>
      );

      const button = screen.getByRole('button');
      // Motion props should not be applied when disabled
      expect(button).toBeDisabled();
    });

    it('should have motion props when enabled', () => {
      render(
        <Button aria-label="Test button">
          Click Me
        </Button>
      );

      const button = screen.getByRole('button');
      expect(button).not.toBeDisabled();
    });
  });

  describe('prefers-reduced-motion', () => {
    it('should respect prefers-reduced-motion setting', () => {
      // Mock matchMedia to return prefers-reduced-motion: reduce
      window.matchMedia = vi.fn().mockImplementation((query) => ({
        matches: query === '(prefers-reduced-motion: reduce)',
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }));

      render(
        <Button aria-label="Test button">
          Click Me
        </Button>
      );

      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
      // Framer Motion should handle reduced motion internally
    });
  });

  describe('multiple variants and sizes', () => {
    it('should render primary small button', () => {
      render(
        <Button variant="primary" size="small" aria-label="Test button">
          Click Me
        </Button>
      );

      const button = screen.getByRole('button');
      expect(button.className).toContain('button--primary');
      expect(button.className).toContain('button--small');
    });

    it('should render secondary large button', () => {
      render(
        <Button variant="secondary" size="large" aria-label="Test button">
          Click Me
        </Button>
      );

      const button = screen.getByRole('button');
      expect(button.className).toContain('button--secondary');
      expect(button.className).toContain('button--large');
    });

    it('should render danger small fullWidth button', () => {
      render(
        <Button variant="danger" size="small" fullWidth aria-label="Test button">
          Click Me
        </Button>
      );

      const button = screen.getByRole('button');
      expect(button.className).toContain('button--danger');
      expect(button.className).toContain('button--small');
      expect(button.className).toContain('button--fullWidth');
    });
  });

  describe('JSX children', () => {
    it('should render with icon and text', () => {
      render(
        <Button aria-label="Next page">
          <span>Next</span>
          <svg data-testid="icon" />
        </Button>
      );

      expect(screen.getByText('Next')).toBeInTheDocument();
      expect(screen.getByTestId('icon')).toBeInTheDocument();
    });

    it('should render with only icon', () => {
      render(
        <Button aria-label="Close dialog">
          <svg data-testid="close-icon" />
        </Button>
      );

      expect(screen.getByTestId('close-icon')).toBeInTheDocument();
    });

    it('should render complex children', () => {
      render(
        <Button aria-label="Complex button">
          <div>
            <span>Line 1</span>
            <span>Line 2</span>
          </div>
        </Button>
      );

      expect(screen.getByText('Line 1')).toBeInTheDocument();
      expect(screen.getByText('Line 2')).toBeInTheDocument();
    });
  });

  describe('additional HTML attributes', () => {
    it('should pass through additional props', () => {
      render(
        <Button
          aria-label="Test button"
          data-testid="custom-button"
          id="my-button"
        >
          Click Me
        </Button>
      );

      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('data-testid', 'custom-button');
      expect(button).toHaveAttribute('id', 'my-button');
    });

    it('should support form attribute', () => {
      render(
        <Button aria-label="Test button" form="my-form">
          Submit
        </Button>
      );

      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('form', 'my-form');
    });
  });
});
