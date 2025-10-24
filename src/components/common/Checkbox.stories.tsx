import type { Meta, StoryObj } from '@storybook/react';
import { Checkbox } from './Checkbox';
import React from 'react';

/**
 * Checkbox Component Stories
 *
 * Custom checkbox component with spring animations and full accessibility.
 * Features animated checkmark with scale and rotation, color transitions,
 * and 44x44px minimum touch target.
 *
 * ## Features
 * - Spring animation on check/uncheck
 * - Animated checkmark with path drawing
 * - Keyboard navigation support (Space/Enter)
 * - Optional description text
 * - Disabled state
 * - 44x44px minimum touch target (mobile-friendly)
 * - Full accessibility with ARIA attributes
 * - Respects prefers-reduced-motion
 */
const meta = {
  title: 'Components/Common/Checkbox',
  component: Checkbox,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A custom checkbox component with delightful animations and comprehensive accessibility support.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    id: {
      control: 'text',
      description: 'Unique identifier for the checkbox',
      table: {
        type: { summary: 'string' },
      },
    },
    label: {
      control: 'text',
      description: 'Label text displayed next to checkbox',
      table: {
        type: { summary: 'string' },
      },
    },
    checked: {
      control: 'boolean',
      description: 'Whether the checkbox is checked',
      table: {
        type: { summary: 'boolean' },
      },
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the checkbox is disabled',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    description: {
      control: 'text',
      description: 'Optional description text shown below label',
      table: {
        type: { summary: 'string' },
      },
    },
  },
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Unchecked
 * Default unchecked state
 */
export const Unchecked: Story = {
  render: function UncheckedCheckbox() {
    const [checked, setChecked] = React.useState(false);
    return (
      <Checkbox
        id="checkbox-unchecked"
        label="Accept terms and conditions"
        checked={checked}
        onChange={setChecked}
      />
    );
  },
};

/**
 * Checked
 * Checked state with animated checkmark
 */
export const Checked: Story = {
  render: function CheckedCheckbox() {
    const [checked, setChecked] = React.useState(true);
    return (
      <Checkbox
        id="checkbox-checked"
        label="Accept terms and conditions"
        checked={checked}
        onChange={setChecked}
      />
    );
  },
};

/**
 * With Description
 * Checkbox with additional description text
 */
export const WithDescription: Story = {
  render: function DescriptionCheckbox() {
    const [checked, setChecked] = React.useState(false);
    return (
      <Checkbox
        id="checkbox-description"
        label="Send me marketing emails"
        description="We'll send you occasional updates about new features and special offers"
        checked={checked}
        onChange={setChecked}
      />
    );
  },
};

/**
 * Disabled Unchecked
 * Disabled state when unchecked
 */
export const DisabledUnchecked: Story = {
  render: function DisabledUncheckedCheckbox() {
    const [checked, setChecked] = React.useState(false);
    return (
      <Checkbox
        id="checkbox-disabled-unchecked"
        label="This option is not available"
        checked={checked}
        onChange={setChecked}
        disabled
      />
    );
  },
};

/**
 * Disabled Checked
 * Disabled state when checked
 */
export const DisabledChecked: Story = {
  render: function DisabledCheckedCheckbox() {
    const [checked, setChecked] = React.useState(true);
    return (
      <Checkbox
        id="checkbox-disabled-checked"
        label="This option is locked"
        checked={checked}
        onChange={setChecked}
        disabled
      />
    );
  },
};

/**
 * Interactive Demo
 * Fully interactive checkbox with state display
 */
export const InteractiveDemo: Story = {
  render: function InteractiveCheckbox() {
    const [checked, setChecked] = React.useState(false);

    return (
      <div>
        <Checkbox
          id="checkbox-interactive"
          label="I agree to the terms"
          description="Click or press Space/Enter to toggle"
          checked={checked}
          onChange={setChecked}
        />
        <p style={{ marginTop: '16px', fontSize: '14px', color: '#718096' }}>
          Current state: <strong>{checked ? 'Checked' : 'Unchecked'}</strong>
        </p>
      </div>
    );
  },
};

/**
 * Multiple Checkboxes
 * Group of checkboxes for selecting multiple options
 */
export const MultipleCheckboxes: Story = {
  render: function MultipleCheckboxGroup() {
    const [selections, setSelections] = React.useState({
      option1: false,
      option2: true,
      option3: false,
      option4: false,
    });

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '8px' }}>
          Select your interests
        </h3>
        <Checkbox
          id="checkbox-option1"
          label="Pain Management"
          description="Learn about chronic pain relief methods"
          checked={selections.option1}
          onChange={(checked) => setSelections({ ...selections, option1: checked })}
        />
        <Checkbox
          id="checkbox-option2"
          label="Cellular Science"
          description="Updates on Primary Cell research"
          checked={selections.option2}
          onChange={(checked) => setSelections({ ...selections, option2: checked })}
        />
        <Checkbox
          id="checkbox-option3"
          label="Treatment Options"
          description="Information about available treatments"
          checked={selections.option3}
          onChange={(checked) => setSelections({ ...selections, option3: checked })}
        />
        <Checkbox
          id="checkbox-option4"
          label="Success Stories"
          description="Patient testimonials and case studies"
          checked={selections.option4}
          onChange={(checked) => setSelections({ ...selections, option4: checked })}
        />
      </div>
    );
  },
  parameters: {
    layout: 'padded',
  },
};

/**
 * Terms and Conditions
 * Real-world example for terms acceptance
 */
export const TermsAndConditions: Story = {
  render: function TermsCheckbox() {
    const [agreed, setAgreed] = React.useState(false);
    const [newsletter, setNewsletter] = React.useState(false);

    return (
      <div style={{ maxWidth: '500px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '16px' }}>
          Before you continue
        </h3>
        <div style={{ marginBottom: '16px' }}>
          <Checkbox
            id="terms-required"
            label="I agree to the Terms and Conditions"
            description="Required to proceed with the assessment"
            checked={agreed}
            onChange={setAgreed}
          />
        </div>
        <div style={{ marginBottom: '24px' }}>
          <Checkbox
            id="newsletter-optional"
            label="Send me health tips and updates"
            description="Optional - You can unsubscribe anytime"
            checked={newsletter}
            onChange={setNewsletter}
          />
        </div>
        <button
          style={{
            padding: '12px 24px',
            backgroundColor: agreed ? '#1A365D' : '#E2E8F0',
            color: agreed ? 'white' : '#A0AEC0',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: 600,
            cursor: agreed ? 'pointer' : 'not-allowed',
          }}
          disabled={!agreed}
        >
          Continue
        </button>
      </div>
    );
  },
  parameters: {
    layout: 'padded',
  },
};

/**
 * All States
 * Shows all possible states side by side
 */
export const AllStates: Story = {
  render: function AllStatesCheckbox() {
    const [checked1, setChecked1] = React.useState(false);
    const [checked2, setChecked2] = React.useState(true);
    const [checked3, setChecked3] = React.useState(false);
    const [checked4, setChecked4] = React.useState(true);

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div>
          <h4 style={{ marginBottom: '8px', fontSize: '14px', fontWeight: 600 }}>
            Unchecked
          </h4>
          <Checkbox
            id="state-unchecked"
            label="Unchecked checkbox"
            checked={checked1}
            onChange={setChecked1}
          />
        </div>

        <div>
          <h4 style={{ marginBottom: '8px', fontSize: '14px', fontWeight: 600 }}>
            Checked
          </h4>
          <Checkbox
            id="state-checked"
            label="Checked checkbox"
            checked={checked2}
            onChange={setChecked2}
          />
        </div>

        <div>
          <h4 style={{ marginBottom: '8px', fontSize: '14px', fontWeight: 600 }}>
            Disabled Unchecked
          </h4>
          <Checkbox
            id="state-disabled-unchecked"
            label="Disabled unchecked"
            checked={checked3}
            onChange={setChecked3}
            disabled
          />
        </div>

        <div>
          <h4 style={{ marginBottom: '8px', fontSize: '14px', fontWeight: 600 }}>
            Disabled Checked
          </h4>
          <Checkbox
            id="state-disabled-checked"
            label="Disabled checked"
            checked={checked4}
            onChange={setChecked4}
            disabled
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
 * Long Labels
 * Checkboxes with longer label text
 */
export const LongLabels: Story = {
  render: function LongLabelCheckbox() {
    const [checked1, setChecked1] = React.useState(false);
    const [checked2, setChecked2] = React.useState(false);

    return (
      <div style={{ maxWidth: '500px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <Checkbox
          id="long-label-1"
          label="I understand that this treatment may not be suitable for everyone and that individual results may vary based on my specific medical condition"
          checked={checked1}
          onChange={setChecked1}
        />
        <Checkbox
          id="long-label-2"
          label="I consent to being contacted by the medical team to discuss my assessment results and potential treatment options"
          description="This includes phone calls, emails, and text messages during business hours"
          checked={checked2}
          onChange={setChecked2}
        />
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
  render: function AccessibilityCheckbox() {
    const [checked1, setChecked1] = React.useState(false);
    const [checked2, setChecked2] = React.useState(true);
    const [checked3, setChecked3] = React.useState(false);

    return (
      <div style={{ maxWidth: '600px' }}>
        <h3 style={{ marginBottom: '16px', fontSize: '18px', fontWeight: 600 }}>
          Accessibility Features
        </h3>
        <ul style={{ marginBottom: '24px', paddingLeft: '20px', lineHeight: '1.8' }}>
          <li>Press Tab to navigate between checkboxes</li>
          <li>Press Space or Enter to toggle checked state</li>
          <li>Disabled checkboxes are skipped in tab order</li>
          <li>Labels are properly associated with inputs</li>
          <li>Descriptions linked via aria-describedby</li>
          <li>44x44px minimum touch target for mobile</li>
        </ul>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <Checkbox
            id="a11y-1"
            label="First checkbox"
            description="Tab to this checkbox and press Space to toggle"
            checked={checked1}
            onChange={setChecked1}
          />
          <Checkbox
            id="a11y-2"
            label="Second checkbox"
            description="This one starts checked"
            checked={checked2}
            onChange={setChecked2}
          />
          <Checkbox
            id="a11y-3"
            label="Disabled checkbox"
            description="This checkbox is disabled and will be skipped"
            checked={checked3}
            onChange={setChecked3}
            disabled
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
 * Form Integration
 * Checkboxes in a complete form context
 */
export const FormIntegration: Story = {
  render: function FormCheckbox() {
    const [formData, setFormData] = React.useState({
      backPain: false,
      neckPain: false,
      jointPain: false,
      musclePain: false,
      nervePain: false,
    });

    const selectedCount = Object.values(formData).filter(Boolean).length;

    return (
      <div style={{ maxWidth: '500px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '8px' }}>
          Where do you experience chronic pain?
        </h3>
        <p style={{ fontSize: '14px', color: '#718096', marginBottom: '24px' }}>
          Select all that apply ({selectedCount} selected)
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <Checkbox
            id="pain-back"
            label="Back Pain"
            description="Lower back, upper back, or spine"
            checked={formData.backPain}
            onChange={(checked) => setFormData({ ...formData, backPain: checked })}
          />
          <Checkbox
            id="pain-neck"
            label="Neck Pain"
            description="Cervical spine or shoulder area"
            checked={formData.neckPain}
            onChange={(checked) => setFormData({ ...formData, neckPain: checked })}
          />
          <Checkbox
            id="pain-joint"
            label="Joint Pain"
            description="Knees, hips, elbows, or wrists"
            checked={formData.jointPain}
            onChange={(checked) => setFormData({ ...formData, jointPain: checked })}
          />
          <Checkbox
            id="pain-muscle"
            label="Muscle Pain"
            description="Widespread muscle aches or soreness"
            checked={formData.musclePain}
            onChange={(checked) => setFormData({ ...formData, musclePain: checked })}
          />
          <Checkbox
            id="pain-nerve"
            label="Nerve Pain"
            description="Tingling, burning, or shooting pain"
            checked={formData.nervePain}
            onChange={(checked) => setFormData({ ...formData, nervePain: checked })}
          />
        </div>
        <div style={{ marginTop: '24px', padding: '16px', backgroundColor: '#F7FAFC', borderRadius: '8px' }}>
          <p style={{ fontSize: '14px', color: '#4A5568' }}>
            <strong>Selected areas:</strong> {selectedCount === 0 ? 'None' :
              Object.entries(formData)
                .filter(([_, checked]) => checked)
                .map(([key]) => key.replace(/([A-Z])/g, ' $1').trim())
                .join(', ')
            }
          </p>
        </div>
      </div>
    );
  },
  parameters: {
    layout: 'padded',
  },
};

/**
 * Animation Showcase
 * Demonstrates the spring animation
 */
export const AnimationShowcase: Story = {
  render: function AnimationCheckbox() {
    const [checked, setChecked] = React.useState(false);

    return (
      <div style={{ textAlign: 'center' }}>
        <div style={{ marginBottom: '24px' }}>
          <Checkbox
            id="animation-demo"
            label="Toggle me to see the animation"
            description="Notice the spring animation and path drawing effect"
            checked={checked}
            onChange={setChecked}
          />
        </div>
        <button
          onClick={() => setChecked(!checked)}
          style={{
            padding: '8px 16px',
            backgroundColor: '#1A365D',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            fontSize: '14px',
            cursor: 'pointer',
          }}
        >
          Toggle Programmatically
        </button>
      </div>
    );
  },
};
