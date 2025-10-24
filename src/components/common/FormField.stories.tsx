import type { Meta, StoryObj } from '@storybook/react';
import { FormField } from './FormField';
import React from 'react';

/**
 * FormField Component Stories
 *
 * Premium form input field with animated label, focus states, and error handling.
 * Features floating label animation, border transitions, and full accessibility support.
 *
 * ## Features
 * - Floating label animation (moves up when focused or filled)
 * - Multiple input types: text, email, tel, password, number, url
 * - Error state with icon and message
 * - Helper text for guidance
 * - Disabled state
 * - Required field indicator
 * - Full accessibility with ARIA attributes
 * - Respects prefers-reduced-motion
 */
const meta = {
  title: 'Components/Common/FormField',
  component: FormField,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A premium form field with floating label animation and comprehensive validation support.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    label: {
      control: 'text',
      description: 'Label text for the input field',
      table: {
        type: { summary: 'string' },
      },
    },
    type: {
      control: 'select',
      options: ['text', 'email', 'tel', 'password', 'number', 'url'],
      description: 'Input field type',
      table: {
        type: { summary: "'text' | 'email' | 'tel' | 'password' | 'number' | 'url'" },
        defaultValue: { summary: 'text' },
      },
    },
    value: {
      control: 'text',
      description: 'Current value of the input',
    },
    error: {
      control: 'text',
      description: 'Error message to display',
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder text (shown only when focused)',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the input is disabled',
      table: {
        defaultValue: { summary: 'false' },
      },
    },
    helperText: {
      control: 'text',
      description: 'Helper text shown below input',
    },
    required: {
      control: 'boolean',
      description: 'Whether the field is required',
      table: {
        defaultValue: { summary: 'false' },
      },
    },
  },
} satisfies Meta<typeof FormField>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default State
 * Basic text input with label
 */
export const Default: Story = {
  render: function DefaultFormField() {
    const [value, setValue] = React.useState('');
    return (
      <div style={{ width: '400px' }}>
        <FormField
          label="Full Name"
          type="text"
          value={value}
          onChange={setValue}
          placeholder="Enter your name"
          aria-label="Enter your full name"
        />
      </div>
    );
  },
};

/**
 * With Value
 * Input field with pre-filled value (label floats up)
 */
export const WithValue: Story = {
  render: function FilledFormField() {
    const [value, setValue] = React.useState('John Doe');
    return (
      <div style={{ width: '400px' }}>
        <FormField
          label="Full Name"
          type="text"
          value={value}
          onChange={setValue}
          placeholder="Enter your name"
          aria-label="Enter your full name"
        />
      </div>
    );
  },
};

/**
 * With Error
 * Input field showing validation error
 */
export const WithError: Story = {
  render: function ErrorFormField() {
    const [value, setValue] = React.useState('invalid-email');
    return (
      <div style={{ width: '400px' }}>
        <FormField
          label="Email Address"
          type="email"
          value={value}
          onChange={setValue}
          error="Please enter a valid email address"
          placeholder="your@email.com"
          aria-label="Enter your email address"
        />
      </div>
    );
  },
};

/**
 * With Helper Text
 * Input field with helpful guidance text
 */
export const WithHelperText: Story = {
  render: function HelperTextFormField() {
    const [value, setValue] = React.useState('');
    return (
      <div style={{ width: '400px' }}>
        <FormField
          label="Password"
          type="password"
          value={value}
          onChange={setValue}
          helperText="Must be at least 8 characters with 1 number and 1 special character"
          placeholder="Enter password"
          aria-label="Enter your password"
        />
      </div>
    );
  },
};

/**
 * Required Field
 * Input field marked as required with asterisk
 */
export const Required: Story = {
  render: function RequiredFormField() {
    const [value, setValue] = React.useState('');
    return (
      <div style={{ width: '400px' }}>
        <FormField
          label="Email Address"
          type="email"
          value={value}
          onChange={setValue}
          required
          placeholder="your@email.com"
          aria-label="Enter your email address (required)"
        />
      </div>
    );
  },
};

/**
 * Disabled State
 * Non-interactive disabled input
 */
export const Disabled: Story = {
  render: function DisabledFormField() {
    const [value, setValue] = React.useState('Disabled value');
    return (
      <div style={{ width: '400px' }}>
        <FormField
          label="Disabled Field"
          type="text"
          value={value}
          onChange={setValue}
          disabled
          aria-label="Disabled input field"
        />
      </div>
    );
  },
};

/**
 * Email Input
 * Email type with appropriate keyboard on mobile
 */
export const EmailInput: Story = {
  render: function EmailFormField() {
    const [value, setValue] = React.useState('');
    return (
      <div style={{ width: '400px' }}>
        <FormField
          label="Email Address"
          type="email"
          value={value}
          onChange={setValue}
          placeholder="your@email.com"
          helperText="We'll never share your email with anyone"
          required
          aria-label="Enter your email address"
        />
      </div>
    );
  },
};

/**
 * Phone Input
 * Tel type with phone keyboard on mobile
 */
export const PhoneInput: Story = {
  render: function PhoneFormField() {
    const [value, setValue] = React.useState('');
    return (
      <div style={{ width: '400px' }}>
        <FormField
          label="Phone Number"
          type="tel"
          value={value}
          onChange={setValue}
          placeholder="(555) 123-4567"
          helperText="Format: (555) 123-4567"
          aria-label="Enter your phone number"
        />
      </div>
    );
  },
};

/**
 * Password Input
 * Password type with obscured characters
 */
export const PasswordInput: Story = {
  render: function PasswordFormField() {
    const [value, setValue] = React.useState('');
    return (
      <div style={{ width: '400px' }}>
        <FormField
          label="Password"
          type="password"
          value={value}
          onChange={setValue}
          placeholder="Enter secure password"
          helperText="Minimum 8 characters"
          required
          aria-label="Enter your password"
        />
      </div>
    );
  },
};

/**
 * Number Input
 * Number type with numeric keyboard on mobile
 */
export const NumberInput: Story = {
  render: function NumberFormField() {
    const [value, setValue] = React.useState('');
    return (
      <div style={{ width: '400px' }}>
        <FormField
          label="Age"
          type="number"
          value={value}
          onChange={setValue}
          placeholder="18"
          helperText="Must be 18 or older"
          aria-label="Enter your age"
        />
      </div>
    );
  },
};

/**
 * URL Input
 * URL type with URL keyboard on mobile
 */
export const URLInput: Story = {
  render: function URLFormField() {
    const [value, setValue] = React.useState('');
    return (
      <div style={{ width: '400px' }}>
        <FormField
          label="Website"
          type="url"
          value={value}
          onChange={setValue}
          placeholder="https://example.com"
          helperText="Include https://"
          aria-label="Enter your website URL"
        />
      </div>
    );
  },
};

/**
 * Validation Flow
 * Interactive demo showing error validation
 */
export const ValidationFlow: Story = {
  render: function ValidationFormField() {
    const [email, setEmail] = React.useState('');
    const [error, setError] = React.useState('');

    const handleChange = (value: string) => {
      setEmail(value);

      // Simple email validation
      if (value.length > 0 && !value.includes('@')) {
        setError('Email must contain @ symbol');
      } else if (value.length > 0 && !value.includes('.')) {
        setError('Email must contain a domain');
      } else {
        setError('');
      }
    };

    return (
      <div style={{ width: '400px' }}>
        <FormField
          label="Email Address"
          type="email"
          value={email}
          onChange={handleChange}
          error={error}
          placeholder="your@email.com"
          required
          aria-label="Enter your email address"
        />
        <p style={{ marginTop: '16px', fontSize: '14px', color: '#718096' }}>
          Type to see live validation (must include @ and .)
        </p>
      </div>
    );
  },
};

/**
 * Form Example
 * Multiple fields in a form layout
 */
export const FormExample: Story = {
  render: function CompleteForm() {
    const [formData, setFormData] = React.useState({
      name: '',
      email: '',
      phone: '',
      password: '',
    });
    const [errors, setErrors] = React.useState({
      email: '',
      password: '',
    });

    const handleEmailChange = (value: string) => {
      setFormData({ ...formData, email: value });
      if (value && !value.includes('@')) {
        setErrors({ ...errors, email: 'Please enter a valid email' });
      } else {
        setErrors({ ...errors, email: '' });
      }
    };

    const handlePasswordChange = (value: string) => {
      setFormData({ ...formData, password: value });
      if (value && value.length < 8) {
        setErrors({ ...errors, password: 'Password must be at least 8 characters' });
      } else {
        setErrors({ ...errors, password: '' });
      }
    };

    return (
      <div style={{ width: '400px' }}>
        <div style={{ marginBottom: '24px' }}>
          <FormField
            label="Full Name"
            type="text"
            value={formData.name}
            onChange={(value) => setFormData({ ...formData, name: value })}
            placeholder="John Doe"
            required
            aria-label="Enter your full name"
          />
        </div>

        <div style={{ marginBottom: '24px' }}>
          <FormField
            label="Email Address"
            type="email"
            value={formData.email}
            onChange={handleEmailChange}
            error={errors.email}
            placeholder="your@email.com"
            required
            aria-label="Enter your email address"
          />
        </div>

        <div style={{ marginBottom: '24px' }}>
          <FormField
            label="Phone Number"
            type="tel"
            value={formData.phone}
            onChange={(value) => setFormData({ ...formData, phone: value })}
            placeholder="(555) 123-4567"
            helperText="Optional - for account recovery"
            aria-label="Enter your phone number"
          />
        </div>

        <div>
          <FormField
            label="Password"
            type="password"
            value={formData.password}
            onChange={handlePasswordChange}
            error={errors.password}
            placeholder="Enter secure password"
            helperText="Minimum 8 characters"
            required
            aria-label="Enter your password"
          />
        </div>
      </div>
    );
  },
  parameters: {
    layout: 'padded',
  },
};

/**
 * All States
 * Shows all possible states
 */
export const AllStates: Story = {
  render: function AllStatesFormField() {
    const [value1, setValue1] = React.useState('');
    const [value2, setValue2] = React.useState('Filled value');
    const [value3, setValue3] = React.useState('invalid@');
    const [value4, setValue4] = React.useState('');
    const [value5, setValue5] = React.useState('Disabled value');

    return (
      <div style={{ width: '400px' }}>
        <div style={{ marginBottom: '24px' }}>
          <h4 style={{ marginBottom: '8px', fontSize: '14px', fontWeight: 600 }}>Empty</h4>
          <FormField
            label="Email Address"
            type="email"
            value={value1}
            onChange={setValue1}
            placeholder="your@email.com"
            aria-label="Empty email field"
          />
        </div>

        <div style={{ marginBottom: '24px' }}>
          <h4 style={{ marginBottom: '8px', fontSize: '14px', fontWeight: 600 }}>Filled</h4>
          <FormField
            label="Email Address"
            type="email"
            value={value2}
            onChange={setValue2}
            aria-label="Filled email field"
          />
        </div>

        <div style={{ marginBottom: '24px' }}>
          <h4 style={{ marginBottom: '8px', fontSize: '14px', fontWeight: 600 }}>Error</h4>
          <FormField
            label="Email Address"
            type="email"
            value={value3}
            onChange={setValue3}
            error="Please enter a valid email address"
            aria-label="Email field with error"
          />
        </div>

        <div style={{ marginBottom: '24px' }}>
          <h4 style={{ marginBottom: '8px', fontSize: '14px', fontWeight: 600 }}>Helper Text</h4>
          <FormField
            label="Email Address"
            type="email"
            value={value4}
            onChange={setValue4}
            helperText="We'll send you a confirmation email"
            aria-label="Email field with helper text"
          />
        </div>

        <div>
          <h4 style={{ marginBottom: '8px', fontSize: '14px', fontWeight: 600 }}>Disabled</h4>
          <FormField
            label="Email Address"
            type="email"
            value={value5}
            onChange={setValue5}
            disabled
            aria-label="Disabled email field"
          />
        </div>
      </div>
    );
  },
  parameters: {
    layout: 'padded',
  },
};

/**
 * Accessibility Test
 * Demonstrates keyboard navigation and screen reader support
 */
export const AccessibilityTest: Story = {
  render: function AccessibilityFormField() {
    const [value1, setValue1] = React.useState('');
    const [value2, setValue2] = React.useState('');
    const [value3, setValue3] = React.useState('invalid');

    return (
      <div style={{ width: '400px' }}>
        <h3 style={{ marginBottom: '16px', fontSize: '18px', fontWeight: 600 }}>
          Accessibility Features
        </h3>
        <ul style={{ marginBottom: '24px', paddingLeft: '20px', lineHeight: '1.8' }}>
          <li>Press Tab to navigate between fields</li>
          <li>Labels are properly associated with inputs</li>
          <li>Error messages have role="alert"</li>
          <li>Helper text linked via aria-describedby</li>
          <li>Required fields indicated with aria-required</li>
        </ul>

        <div style={{ marginBottom: '24px' }}>
          <FormField
            label="Name"
            type="text"
            value={value1}
            onChange={setValue1}
            required
            aria-label="Enter your name (required field)"
          />
        </div>

        <div style={{ marginBottom: '24px' }}>
          <FormField
            label="Email"
            type="email"
            value={value2}
            onChange={setValue2}
            helperText="We'll never share your email"
            aria-label="Enter your email address"
          />
        </div>

        <div>
          <FormField
            label="Phone"
            type="tel"
            value={value3}
            onChange={setValue3}
            error="Please enter a valid phone number"
            aria-label="Enter your phone number"
          />
        </div>
      </div>
    );
  },
  parameters: {
    layout: 'padded',
  },
};
