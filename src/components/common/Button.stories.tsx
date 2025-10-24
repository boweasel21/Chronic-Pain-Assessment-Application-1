import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { Button } from './Button';

/**
 * Button Component Stories
 *
 * Premium, accessible button component with Framer Motion animations.
 * Supports multiple variants, sizes, and states with full keyboard navigation
 * and screen reader support.
 *
 * ## Features
 * - Three variants: primary (navy), secondary (cream outline), danger (red)
 * - Two sizes: small (44px mobile-friendly), large (48px)
 * - Disabled state with 50% opacity
 * - Full width option
 * - Framer Motion hover and tap animations
 * - Respects prefers-reduced-motion
 * - WCAG 2.1 AA accessible
 */
const meta = {
  title: 'Components/Common/Button',
  component: Button,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A premium button component with multiple variants and full accessibility support.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'danger'],
      description: 'Visual style variant of the button',
      table: {
        type: { summary: "'primary' | 'secondary' | 'danger'" },
        defaultValue: { summary: 'primary' },
      },
    },
    size: {
      control: 'select',
      options: ['small', 'large'],
      description: 'Size variant of the button',
      table: {
        type: { summary: "'small' | 'large'" },
        defaultValue: { summary: 'large' },
      },
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the button is disabled',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    fullWidth: {
      control: 'boolean',
      description: 'Whether the button should take full width',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    children: {
      control: 'text',
      description: 'Button content (text or JSX)',
    },
    'aria-label': {
      control: 'text',
      description: 'Accessible label for screen readers (required)',
    },
    onClick: {
      description: 'Click handler function',
      action: 'clicked',
    },
  },
  args: {
    onClick: fn(),
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Primary Button
 * Navy background with white text - used for primary actions
 */
export const Primary: Story = {
  args: {
    variant: 'primary',
    size: 'large',
    children: 'Primary Button',
    'aria-label': 'Primary action button',
  },
};

/**
 * Secondary Button
 * Cream outline with navy text - used for secondary actions
 */
export const Secondary: Story = {
  args: {
    variant: 'secondary',
    size: 'large',
    children: 'Secondary Button',
    'aria-label': 'Secondary action button',
  },
};

/**
 * Danger Button
 * Red background with white text - used for destructive actions
 */
export const Danger: Story = {
  args: {
    variant: 'danger',
    size: 'large',
    children: 'Delete',
    'aria-label': 'Delete item',
  },
};

/**
 * Small Size
 * 44px min height - mobile-friendly touch target
 */
export const Small: Story = {
  args: {
    variant: 'primary',
    size: 'small',
    children: 'Small Button',
    'aria-label': 'Small button',
  },
};

/**
 * Large Size
 * 48px min height - default size
 */
export const Large: Story = {
  args: {
    variant: 'primary',
    size: 'large',
    children: 'Large Button',
    'aria-label': 'Large button',
  },
};

/**
 * Disabled State
 * Reduced opacity, no animations, prevents clicks
 */
export const Disabled: Story = {
  args: {
    variant: 'primary',
    size: 'large',
    disabled: true,
    children: 'Disabled Button',
    'aria-label': 'Disabled button',
  },
};

/**
 * Full Width
 * Takes 100% width of parent container
 */
export const FullWidth: Story = {
  args: {
    variant: 'primary',
    size: 'large',
    fullWidth: true,
    children: 'Full Width Button',
    'aria-label': 'Full width button',
  },
  parameters: {
    layout: 'padded',
  },
};

/**
 * Submit Button
 * Form submit button with type="submit"
 */
export const SubmitButton: Story = {
  args: {
    variant: 'primary',
    size: 'large',
    type: 'submit',
    children: 'Submit Form',
    'aria-label': 'Submit form',
  },
};

/**
 * Long Text
 * Button with longer text content
 */
export const LongText: Story = {
  args: {
    variant: 'primary',
    size: 'large',
    children: 'Continue to Next Step',
    'aria-label': 'Continue to next step of the assessment',
  },
};

/**
 * All Variants Comparison
 * Shows all three variants side by side
 */
export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
      <Button variant="primary" aria-label="Primary button">
        Primary
      </Button>
      <Button variant="secondary" aria-label="Secondary button">
        Secondary
      </Button>
      <Button variant="danger" aria-label="Danger button">
        Danger
      </Button>
    </div>
  ),
};

/**
 * All Sizes Comparison
 * Shows both sizes side by side
 */
export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
      <Button variant="primary" size="small" aria-label="Small button">
        Small (44px)
      </Button>
      <Button variant="primary" size="large" aria-label="Large button">
        Large (48px)
      </Button>
    </div>
  ),
};

/**
 * Disabled States
 * Shows disabled state for all variants
 */
export const DisabledStates: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
      <Button variant="primary" disabled aria-label="Disabled primary button">
        Primary
      </Button>
      <Button variant="secondary" disabled aria-label="Disabled secondary button">
        Secondary
      </Button>
      <Button variant="danger" disabled aria-label="Disabled danger button">
        Danger
      </Button>
    </div>
  ),
};

/**
 * Interactive Demo
 * Fully interactive button with click counter
 */
export const InteractiveDemo: Story = {
  render: function InteractiveButton() {
    const [count, setCount] = React.useState(0);

    return (
      <div style={{ textAlign: 'center' }}>
        <Button
          variant="primary"
          size="large"
          onClick={() => setCount(count + 1)}
          aria-label={`Button clicked ${count} times`}
        >
          Clicked {count} times
        </Button>
        <p style={{ marginTop: '16px', color: '#718096', fontSize: '14px' }}>
          Click the button to increment the counter
        </p>
      </div>
    );
  },
};

/**
 * With Icons
 * Buttons with icon content
 */
export const WithIcons: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
      <Button variant="primary" aria-label="Next step">
        <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          Next
          <span>→</span>
        </span>
      </Button>
      <Button variant="secondary" aria-label="Previous step">
        <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span>←</span>
          Back
        </span>
      </Button>
      <Button variant="primary" aria-label="Check mark">
        <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span>✓</span>
          Confirm
        </span>
      </Button>
    </div>
  ),
};

/**
 * Dark Background
 * Buttons on dark navy background
 */
export const OnDarkBackground: Story = {
  render: () => (
    <div style={{
      background: '#1A365D',
      padding: '32px',
      display: 'flex',
      gap: '16px',
      flexWrap: 'wrap',
    }}>
      <Button variant="secondary" aria-label="Secondary on dark">
        Secondary Works Best
      </Button>
      <Button variant="primary" aria-label="Primary on dark">
        Primary (Less Visible)
      </Button>
    </div>
  ),
  parameters: {
    backgrounds: { default: 'navy' },
  },
};

/**
 * Accessibility Test
 * Demonstrates keyboard navigation and screen reader support
 */
export const AccessibilityTest: Story = {
  render: () => (
    <div style={{ maxWidth: '600px' }}>
      <h3 style={{ marginBottom: '16px', fontSize: '18px', fontWeight: 600 }}>
        Accessibility Features
      </h3>
      <ul style={{ marginBottom: '24px', paddingLeft: '20px', lineHeight: '1.8' }}>
        <li>Press Tab to navigate between buttons</li>
        <li>Press Enter or Space to activate</li>
        <li>Disabled buttons are skipped in tab order</li>
        <li>All buttons have aria-label for screen readers</li>
        <li>Animations respect prefers-reduced-motion</li>
      </ul>
      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
        <Button variant="primary" aria-label="First accessible button">
          Button 1
        </Button>
        <Button variant="secondary" aria-label="Second accessible button">
          Button 2
        </Button>
        <Button variant="primary" disabled aria-label="Disabled button (not focusable)">
          Disabled
        </Button>
        <Button variant="danger" aria-label="Third accessible button">
          Button 3
        </Button>
      </div>
    </div>
  ),
  parameters: {
    layout: 'padded',
  },
};

// Import React for interactive demo
import React from 'react';
