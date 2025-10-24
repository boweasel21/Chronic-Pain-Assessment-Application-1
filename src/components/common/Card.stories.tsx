import type { Meta, StoryObj } from '@storybook/react';
import { Card } from './Card';
import React from 'react';

/**
 * Card Component Stories
 *
 * Premium card/modal component with multiple variants and shadow depths.
 * Features rounded corners, responsive padding, and optional hover effects.
 *
 * ## Features
 * - Three variants: white, primary (navy), secondary (cream)
 * - Five shadow depths: none, sm, md, lg, xl
 * - Hover effects with elevation change
 * - Four padding sizes: none, sm, md, lg
 * - Full width option
 * - Interactive support with onClick
 * - Keyboard navigation for interactive cards
 * - Respects prefers-reduced-motion
 */
const meta = {
  title: 'Components/Common/Card',
  component: Card,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A flexible card component for content containers, modals, or interactive elements.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['white', 'primary', 'secondary'],
      description: 'Visual style variant of the card',
      table: {
        type: { summary: "'white' | 'primary' | 'secondary'" },
        defaultValue: { summary: 'white' },
      },
    },
    shadow: {
      control: 'select',
      options: ['none', 'sm', 'md', 'lg', 'xl'],
      description: 'Shadow depth for elevation',
      table: {
        type: { summary: "'none' | 'sm' | 'md' | 'lg' | 'xl'" },
        defaultValue: { summary: 'md' },
      },
    },
    hoverable: {
      control: 'boolean',
      description: 'Whether to enable hover effects',
      table: {
        defaultValue: { summary: 'false' },
      },
    },
    padding: {
      control: 'select',
      options: ['none', 'sm', 'md', 'lg'],
      description: 'Padding size',
      table: {
        type: { summary: "'none' | 'sm' | 'md' | 'lg'" },
        defaultValue: { summary: 'md' },
      },
    },
    fullWidth: {
      control: 'boolean',
      description: 'Whether the card should take full width',
      table: {
        defaultValue: { summary: 'false' },
      },
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the card is disabled (for interactive cards)',
      table: {
        defaultValue: { summary: 'false' },
      },
    },
  },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default Card
 * White background with medium shadow
 */
export const Default: Story = {
  args: {
    children: (
      <div>
        <h3 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '8px' }}>
          Card Title
        </h3>
        <p style={{ color: '#718096', lineHeight: '1.6' }}>
          This is a default card with white background and medium shadow.
          Perfect for content containers and information blocks.
        </p>
      </div>
    ),
  },
};

/**
 * White Variant
 * Clean white card with border
 */
export const WhiteVariant: Story = {
  args: {
    variant: 'white',
    shadow: 'md',
    children: (
      <div>
        <h3 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '8px' }}>
          White Card
        </h3>
        <p style={{ color: '#718096' }}>
          White background with subtle border and medium shadow.
        </p>
      </div>
    ),
  },
};

/**
 * Primary Variant
 * Navy background with white text
 */
export const PrimaryVariant: Story = {
  args: {
    variant: 'primary',
    shadow: 'md',
    children: (
      <div>
        <h3 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '8px', color: 'white' }}>
          Primary Card
        </h3>
        <p style={{ color: '#E2E8F0' }}>
          Navy background with white text for emphasis and important content.
        </p>
      </div>
    ),
  },
};

/**
 * Secondary Variant
 * Cream background
 */
export const SecondaryVariant: Story = {
  args: {
    variant: 'secondary',
    shadow: 'md',
    children: (
      <div>
        <h3 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '8px' }}>
          Secondary Card
        </h3>
        <p style={{ color: '#718096' }}>
          Cream background for subtle differentiation and soft appearance.
        </p>
      </div>
    ),
  },
};

/**
 * Shadow None
 * Flat card with no shadow
 */
export const ShadowNone: Story = {
  args: {
    shadow: 'none',
    children: (
      <div>
        <h3 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '8px' }}>
          No Shadow
        </h3>
        <p style={{ color: '#718096' }}>Flat card with no elevation.</p>
      </div>
    ),
  },
};

/**
 * Shadow Small
 * Subtle shadow elevation
 */
export const ShadowSmall: Story = {
  args: {
    shadow: 'sm',
    children: (
      <div>
        <h3 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '8px' }}>
          Small Shadow
        </h3>
        <p style={{ color: '#718096' }}>Subtle elevation for gentle depth.</p>
      </div>
    ),
  },
};

/**
 * Shadow Medium
 * Standard shadow (default)
 */
export const ShadowMedium: Story = {
  args: {
    shadow: 'md',
    children: (
      <div>
        <h3 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '8px' }}>
          Medium Shadow
        </h3>
        <p style={{ color: '#718096' }}>Standard elevation for most use cases.</p>
      </div>
    ),
  },
};

/**
 * Shadow Large
 * Prominent shadow
 */
export const ShadowLarge: Story = {
  args: {
    shadow: 'lg',
    children: (
      <div>
        <h3 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '8px' }}>
          Large Shadow
        </h3>
        <p style={{ color: '#718096' }}>Prominent elevation for modal-like cards.</p>
      </div>
    ),
  },
};

/**
 * Shadow Extra Large
 * Maximum elevation
 */
export const ShadowXL: Story = {
  args: {
    shadow: 'xl',
    children: (
      <div>
        <h3 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '8px' }}>
          Extra Large Shadow
        </h3>
        <p style={{ color: '#718096' }}>Maximum elevation for floating modals.</p>
      </div>
    ),
  },
};

/**
 * Hoverable Card
 * Card with hover animation
 */
export const Hoverable: Story = {
  args: {
    hoverable: true,
    shadow: 'md',
    children: (
      <div>
        <h3 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '8px' }}>
          Hover Me
        </h3>
        <p style={{ color: '#718096' }}>
          Hover over this card to see it lift with increased shadow.
        </p>
      </div>
    ),
  },
};

/**
 * Interactive Card
 * Clickable card with hover and tap effects
 */
export const Interactive: Story = {
  render: function InteractiveCard() {
    const [clicked, setClicked] = React.useState(false);

    return (
      <Card
        hoverable
        shadow="md"
        onClick={() => setClicked(!clicked)}
        aria-label="Click to toggle state"
      >
        <div style={{ textAlign: 'center' }}>
          <h3 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '8px' }}>
            Click Me
          </h3>
          <p style={{ color: '#718096', marginBottom: '16px' }}>
            This card is interactive and responds to clicks.
          </p>
          <p style={{ fontSize: '14px', fontWeight: 600, color: clicked ? '#38A169' : '#718096' }}>
            {clicked ? 'Clicked!' : 'Not clicked yet'}
          </p>
        </div>
      </Card>
    );
  },
};

/**
 * Padding Sizes
 * Shows all padding size options
 */
export const PaddingSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '400px' }}>
      <Card padding="none" shadow="md">
        <div style={{ padding: '16px', backgroundColor: '#FED7D7' }}>
          <strong>No Padding</strong> (content has its own padding shown in pink)
        </div>
      </Card>
      <Card padding="sm" shadow="md">
        <strong>Small Padding</strong> (16px)
      </Card>
      <Card padding="md" shadow="md">
        <strong>Medium Padding</strong> (24px - default)
      </Card>
      <Card padding="lg" shadow="md">
        <strong>Large Padding</strong> (32px)
      </Card>
    </div>
  ),
  parameters: {
    layout: 'padded',
  },
};

/**
 * All Variants
 * Comparison of all three variants
 */
export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
      <Card variant="white" shadow="md" style={{ width: '250px' }}>
        <h4 style={{ fontWeight: 600, marginBottom: '8px' }}>White</h4>
        <p style={{ fontSize: '14px', color: '#718096' }}>
          Clean and minimal
        </p>
      </Card>
      <Card variant="primary" shadow="md" style={{ width: '250px' }}>
        <h4 style={{ fontWeight: 600, marginBottom: '8px', color: 'white' }}>Primary</h4>
        <p style={{ fontSize: '14px', color: '#E2E8F0' }}>
          Navy background
        </p>
      </Card>
      <Card variant="secondary" shadow="md" style={{ width: '250px' }}>
        <h4 style={{ fontWeight: 600, marginBottom: '8px' }}>Secondary</h4>
        <p style={{ fontSize: '14px', color: '#718096' }}>
          Cream background
        </p>
      </Card>
    </div>
  ),
};

/**
 * All Shadows
 * Comparison of all shadow depths
 */
export const AllShadows: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'flex-start' }}>
      {['none', 'sm', 'md', 'lg', 'xl'].map((shadow) => (
        <Card key={shadow} shadow={shadow as any} style={{ width: '150px' }}>
          <p style={{ fontWeight: 600, textAlign: 'center' }}>
            {shadow.toUpperCase()}
          </p>
        </Card>
      ))}
    </div>
  ),
};

/**
 * Content Card
 * Real-world example with rich content
 */
export const ContentCard: Story = {
  args: {
    variant: 'white',
    shadow: 'md',
    children: (
      <div>
        <div style={{ marginBottom: '16px' }}>
          <span style={{
            display: 'inline-block',
            padding: '4px 12px',
            backgroundColor: '#BEE3F8',
            color: '#2A4365',
            borderRadius: '16px',
            fontSize: '12px',
            fontWeight: 600,
          }}>
            NEW
          </span>
        </div>
        <h3 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '8px' }}>
          Cellular Pain Relief
        </h3>
        <p style={{ color: '#718096', marginBottom: '16px', lineHeight: '1.6' }}>
          Revolutionary treatment targeting pain at the cellular level.
          Based on cutting-edge research from leading universities.
        </p>
        <div style={{ display: 'flex', gap: '8px', fontSize: '14px', color: '#A0AEC0' }}>
          <span>Read time: 5 min</span>
          <span>•</span>
          <span>Updated today</span>
        </div>
      </div>
    ),
  },
};

/**
 * Feature Card
 * Card highlighting a feature or benefit
 */
export const FeatureCard: Story = {
  render: () => (
    <Card variant="secondary" shadow="lg" hoverable style={{ maxWidth: '350px' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{
          fontSize: '48px',
          marginBottom: '16px',
        }}>
          🧬
        </div>
        <h3 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '8px' }}>
          Primary Cell Technology
        </h3>
        <p style={{ color: '#718096', lineHeight: '1.6' }}>
          Repairs damaged cells at the molecular level, addressing the root cause
          of chronic pain rather than just masking symptoms.
        </p>
      </div>
    </Card>
  ),
};

/**
 * Pricing Card
 * Card for pricing information
 */
export const PricingCard: Story = {
  render: () => (
    <Card variant="white" shadow="xl" style={{ maxWidth: '300px' }}>
      <div style={{ textAlign: 'center' }}>
        <h4 style={{ fontSize: '14px', fontWeight: 600, color: '#718096', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Premium Plan
        </h4>
        <div style={{ marginBottom: '16px' }}>
          <span style={{ fontSize: '48px', fontWeight: 700, color: '#1A365D' }}>
            $199
          </span>
          <span style={{ fontSize: '16px', color: '#A0AEC0' }}>/month</span>
        </div>
        <ul style={{ textAlign: 'left', marginBottom: '24px', lineHeight: '2' }}>
          <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ color: '#38A169' }}>✓</span>
            <span>Personalized treatment plan</span>
          </li>
          <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ color: '#38A169' }}>✓</span>
            <span>Monthly consultations</span>
          </li>
          <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ color: '#38A169' }}>✓</span>
            <span>Progress tracking</span>
          </li>
          <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ color: '#38A169' }}>✓</span>
            <span>24/7 support</span>
          </li>
        </ul>
        <button style={{
          width: '100%',
          padding: '12px',
          backgroundColor: '#1A365D',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          fontSize: '16px',
          fontWeight: 600,
          cursor: 'pointer',
        }}>
          Get Started
        </button>
      </div>
    </Card>
  ),
};

/**
 * Notification Card
 * Card for notifications or alerts
 */
export const NotificationCard: Story = {
  render: () => (
    <Card variant="white" shadow="md" padding="sm" style={{ maxWidth: '400px' }}>
      <div style={{ display: 'flex', gap: '12px' }}>
        <div style={{
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          backgroundColor: '#BEE3F8',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}>
          <span style={{ fontSize: '20px' }}>📧</span>
        </div>
        <div style={{ flex: 1 }}>
          <h4 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '4px' }}>
            Assessment Complete
          </h4>
          <p style={{ fontSize: '14px', color: '#718096', marginBottom: '8px' }}>
            Your chronic pain assessment results are ready to view.
          </p>
          <p style={{ fontSize: '12px', color: '#A0AEC0' }}>
            2 minutes ago
          </p>
        </div>
      </div>
    </Card>
  ),
};

/**
 * Dashboard Cards
 * Multiple cards in a dashboard layout
 */
export const DashboardCards: Story = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', maxWidth: '800px' }}>
      <Card variant="white" shadow="md">
        <div>
          <p style={{ fontSize: '14px', color: '#718096', marginBottom: '4px' }}>Total Assessments</p>
          <p style={{ fontSize: '32px', fontWeight: 700, color: '#1A365D' }}>1,234</p>
          <p style={{ fontSize: '12px', color: '#38A169' }}>↑ 12% this month</p>
        </div>
      </Card>
      <Card variant="white" shadow="md">
        <div>
          <p style={{ fontSize: '14px', color: '#718096', marginBottom: '4px' }}>Qualified Patients</p>
          <p style={{ fontSize: '32px', fontWeight: 700, color: '#1A365D' }}>892</p>
          <p style={{ fontSize: '12px', color: '#38A169' }}>↑ 8% this month</p>
        </div>
      </Card>
      <Card variant="white" shadow="md">
        <div>
          <p style={{ fontSize: '14px', color: '#718096', marginBottom: '4px' }}>Avg Pain Level</p>
          <p style={{ fontSize: '32px', fontWeight: 700, color: '#1A365D' }}>7.2</p>
          <p style={{ fontSize: '12px', color: '#E53E3E' }}>↓ 3% this month</p>
        </div>
      </Card>
      <Card variant="white" shadow="md">
        <div>
          <p style={{ fontSize: '14px', color: '#718096', marginBottom: '4px' }}>Success Rate</p>
          <p style={{ fontSize: '32px', fontWeight: 700, color: '#1A365D' }}>94%</p>
          <p style={{ fontSize: '12px', color: '#38A169' }}>↑ 2% this month</p>
        </div>
      </Card>
    </div>
  ),
  parameters: {
    layout: 'padded',
  },
};

/**
 * Disabled State
 * Interactive card in disabled state
 */
export const DisabledState: Story = {
  args: {
    hoverable: true,
    disabled: true,
    onClick: () => alert('This should not fire'),
    'aria-label': 'Disabled card',
    children: (
      <div>
        <h3 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '8px' }}>
          Disabled Card
        </h3>
        <p style={{ color: '#718096' }}>
          This card is disabled and cannot be interacted with.
        </p>
      </div>
    ),
  },
};

/**
 * Accessibility Test
 * Demonstrates keyboard navigation for interactive cards
 */
export const AccessibilityTest: Story = {
  render: function AccessibilityCard() {
    const [selected, setSelected] = React.useState<number | null>(null);

    return (
      <div style={{ maxWidth: '600px' }}>
        <h3 style={{ marginBottom: '16px', fontSize: '18px', fontWeight: 600 }}>
          Accessibility Features
        </h3>
        <ul style={{ marginBottom: '24px', paddingLeft: '20px', lineHeight: '1.8' }}>
          <li>Press Tab to navigate between cards</li>
          <li>Press Enter or Space to select a card</li>
          <li>Interactive cards have role="button"</li>
          <li>Disabled cards are not focusable</li>
        </ul>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {[1, 2, 3].map((num) => (
            <Card
              key={num}
              hoverable
              shadow="md"
              onClick={() => setSelected(num)}
              aria-label={`Select option ${num}`}
              style={{
                border: selected === num ? '2px solid #1A365D' : '2px solid transparent',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h4 style={{ fontWeight: 600, marginBottom: '4px' }}>
                    Option {num}
                  </h4>
                  <p style={{ fontSize: '14px', color: '#718096' }}>
                    Click or press Enter/Space to select
                  </p>
                </div>
                {selected === num && (
                  <span style={{ fontSize: '24px', color: '#38A169' }}>✓</span>
                )}
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  },
  parameters: {
    layout: 'padded',
  },
};
