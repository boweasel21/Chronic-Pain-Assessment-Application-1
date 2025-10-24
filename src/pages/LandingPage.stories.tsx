import type { Meta, StoryObj } from '@storybook/react';
import LandingPage from './LandingPage';
import { AssessmentProvider } from '@context/AssessmentContext';
import { BrowserRouter } from 'react-router-dom';
import React from 'react';

/**
 * LandingPage Component Stories
 *
 * Entry point for the assessment flow. Educates users about cellular pain science
 * and routes based on chronic pain duration (6+ months qualification).
 *
 * ## Features
 * - Hero section with compelling headline
 * - Educational content blocks explaining damage types
 * - Visual section with AI-generated image descriptions
 * - Yes/No button routing logic
 * - Framer Motion entrance animations
 * - Mobile-first responsive design
 * - WCAG 2.1 AA accessibility
 *
 * ## Navigation Flow
 * - Yes (6+ months): Routes to /cellular-science
 * - No (<6 months): Routes to /waiting-list
 */
const meta = {
  title: 'Pages/LandingPage',
  component: LandingPage,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'The landing page introduces users to cellular pain science and qualifies them based on pain duration.',
      },
    },
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <BrowserRouter>
        <AssessmentProvider>
          <Story />
        </AssessmentProvider>
      </BrowserRouter>
    ),
  ],
} satisfies Meta<typeof LandingPage>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default View
 * Standard landing page on desktop
 */
export const Default: Story = {};

/**
 * Mobile View
 * Landing page optimized for mobile devices (375px)
 */
export const Mobile: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'mobile',
    },
    docs: {
      description: {
        story: 'Mobile view with responsive typography and stacked layout.',
      },
    },
  },
};

/**
 * Tablet View
 * Landing page on tablet devices (768px)
 */
export const Tablet: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'tablet',
    },
    docs: {
      description: {
        story: 'Tablet view with optimized spacing and medium-sized typography.',
      },
    },
  },
};

/**
 * Desktop View
 * Landing page on desktop (1280px)
 */
export const Desktop: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'desktop',
    },
    docs: {
      description: {
        story: 'Desktop view with full layout and maximum content width.',
      },
    },
  },
};

/**
 * Large Desktop View
 * Landing page on large desktop screens (1920px)
 */
export const LargeDesktop: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'desktopLarge',
    },
    docs: {
      description: {
        story: 'Large desktop view maintaining readable content width.',
      },
    },
  },
};

/**
 * Mobile Landscape
 * Landing page in mobile landscape orientation
 */
export const MobileLandscape: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'mobileLandscape',
    },
    docs: {
      description: {
        story: 'Mobile landscape view optimized for horizontal display.',
      },
    },
  },
};

/**
 * Tablet Landscape
 * Landing page in tablet landscape orientation
 */
export const TabletLandscape: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'tabletLandscape',
    },
    docs: {
      description: {
        story: 'Tablet landscape view with horizontal layout optimization.',
      },
    },
  },
};

/**
 * Responsive Comparison
 * Side-by-side view of different breakpoints
 */
export const ResponsiveComparison: Story = {
  render: () => (
    <div style={{ backgroundColor: '#F7FAFC', padding: '20px' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '20px', fontSize: '24px', fontWeight: 600 }}>
        Responsive Design Comparison
      </h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
        {[
          { width: '375px', label: 'Mobile (375px)' },
          { width: '768px', label: 'Tablet (768px)' },
          { width: '1280px', label: 'Desktop (1280px)' },
        ].map(({ width, label }) => (
          <div key={width} style={{ border: '2px solid #E2E8F0', borderRadius: '8px', overflow: 'hidden', backgroundColor: 'white' }}>
            <div style={{ padding: '12px', backgroundColor: '#1A365D', color: 'white', textAlign: 'center', fontWeight: 600, fontSize: '14px' }}>
              {label}
            </div>
            <div style={{ width, height: '600px', overflow: 'auto', margin: '0 auto' }}>
              <BrowserRouter>
                <AssessmentProvider>
                  <LandingPage />
                </AssessmentProvider>
              </BrowserRouter>
            </div>
          </div>
        ))}
      </div>
    </div>
  ),
  parameters: {
    layout: 'fullscreen',
    viewport: {
      disable: true,
    },
  },
};

/**
 * Content Sections
 * Highlights different sections of the landing page
 */
export const ContentSections: Story = {
  render: () => (
    <div style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto' }}>
      <h2 style={{ fontSize: '32px', fontWeight: 700, marginBottom: '32px', textAlign: 'center' }}>
        Landing Page Sections
      </h2>

      <div style={{ marginBottom: '48px' }}>
        <h3 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '16px', color: '#1A365D' }}>
          1. Hero Section
        </h3>
        <div style={{ padding: '24px', backgroundColor: '#F7F4ED', borderRadius: '8px', border: '2px solid #E2E8F0' }}>
          <h1 style={{ fontSize: '36px', fontWeight: 700, marginBottom: '16px', color: '#1A365D', lineHeight: '1.2' }}>
            Scientists Just Proved Chronic Pain Lives Inside Your Cells—And We Can Now Fix It
          </h1>
          <p style={{ fontSize: '18px', color: '#4A5568', lineHeight: '1.6' }}>
            For decades, medicine treated pain as a symptom to manage. New research reveals
            the truth: chronic pain is stored in your Primary Cells as damaged RNA patterns.
            Instead of masking pain, we repair the cells that generate it.
          </p>
        </div>
      </div>

      <div style={{ marginBottom: '48px' }}>
        <h3 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '16px', color: '#1A365D' }}>
          2. Educational Content Blocks
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
          {[
            { icon: '🦴', title: 'Tissue & Bone Damage', desc: 'Structural damage to your body\'s physical framework' },
            { icon: '⚡', title: 'New Cellular Damage', desc: 'Current pain signals from recent injury' },
            { icon: '🧬', title: 'Prenatal Cellular Damage', desc: 'Ancient pain patterns encoded before birth' },
          ].map((block) => (
            <div key={block.title} style={{ padding: '20px', backgroundColor: 'white', borderRadius: '8px', border: '2px solid #E2E8F0', textAlign: 'center' }}>
              <div style={{ fontSize: '48px', marginBottom: '12px' }}>{block.icon}</div>
              <h4 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '8px' }}>{block.title}</h4>
              <p style={{ fontSize: '14px', color: '#718096' }}>{block.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div style={{ marginBottom: '48px' }}>
        <h3 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '16px', color: '#1A365D' }}>
          3. Qualification Question
        </h3>
        <div style={{ padding: '24px', backgroundColor: 'white', borderRadius: '8px', border: '2px solid #E2E8F0', textAlign: 'center' }}>
          <h2 style={{ fontSize: '28px', fontWeight: 600, marginBottom: '12px' }}>
            Have you had chronic pain for 6+ months?
          </h2>
          <p style={{ fontSize: '16px', color: '#718096', marginBottom: '24px' }}>
            This helps us determine if cellular repair therapy is right for you.
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button style={{
              padding: '16px 48px',
              backgroundColor: '#1A365D',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '18px',
              fontWeight: 600,
              cursor: 'pointer',
            }}>
              ✓ Yes
            </button>
            <button style={{
              padding: '16px 48px',
              backgroundColor: 'transparent',
              color: '#1A365D',
              border: '2px solid #E2D3A3',
              borderRadius: '8px',
              fontSize: '18px',
              fontWeight: 600,
              cursor: 'pointer',
            }}>
              ✗ No
            </button>
          </div>
        </div>
      </div>

      <div>
        <h3 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '16px', color: '#1A365D' }}>
          4. Trust Indicators
        </h3>
        <div style={{ padding: '16px', backgroundColor: '#F7FAFC', borderRadius: '8px', border: '2px solid #E2E8F0', textAlign: 'center' }}>
          <p style={{ fontSize: '14px', color: '#718096' }}>
            Based on peer-reviewed research from Johns Hopkins, MIT, and Stanford University
          </p>
        </div>
      </div>
    </div>
  ),
  parameters: {
    layout: 'fullscreen',
  },
};

/**
 * Animation States
 * Shows the page with different animation states
 */
export const AnimationStates: Story = {
  render: () => (
    <div style={{ padding: '40px' }}>
      <h2 style={{ fontSize: '24px', fontWeight: 600, marginBottom: '24px', textAlign: 'center' }}>
        Animation Features
      </h2>
      <div style={{ maxWidth: '600px', margin: '0 auto', padding: '24px', backgroundColor: '#F7FAFC', borderRadius: '8px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '16px' }}>Entrance Animations</h3>
        <ul style={{ paddingLeft: '20px', lineHeight: '2', color: '#4A5568' }}>
          <li>Container fades in with stagger effect</li>
          <li>Hero section animates first with opacity and Y-axis slide</li>
          <li>Educational blocks stagger in sequence (0.15s delay each)</li>
          <li>Buttons have scale animation on hover and tap</li>
          <li>Respects <code>prefers-reduced-motion</code> setting</li>
        </ul>
        <h3 style={{ fontSize: '18px', fontWeight: 600, marginTop: '24px', marginBottom: '16px' }}>Interactive Elements</h3>
        <ul style={{ paddingLeft: '20px', lineHeight: '2', color: '#4A5568' }}>
          <li>Buttons: <code>scale: 1.05</code> on hover, <code>0.95</code> on tap</li>
          <li>Selection state shows with visual indicator</li>
          <li>400ms delay before navigation (smooth transition)</li>
        </ul>
      </div>
    </div>
  ),
  parameters: {
    layout: 'padded',
  },
};

/**
 * Accessibility Features
 * Demonstrates accessibility implementation
 */
export const AccessibilityFeatures: Story = {
  render: () => (
    <div style={{ padding: '40px', maxWidth: '800px', margin: '0 auto' }}>
      <h2 style={{ fontSize: '24px', fontWeight: 600, marginBottom: '24px', textAlign: 'center' }}>
        Accessibility Features (WCAG 2.1 AA)
      </h2>

      <div style={{ marginBottom: '32px', padding: '24px', backgroundColor: '#F7FAFC', borderRadius: '8px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '16px', color: '#1A365D' }}>
          Semantic HTML
        </h3>
        <ul style={{ paddingLeft: '20px', lineHeight: '2', color: '#4A5568' }}>
          <li><code>&lt;section&gt;</code> elements with proper ARIA labels</li>
          <li><code>&lt;article&gt;</code> for content blocks</li>
          <li><code>&lt;h1&gt;</code>-<code>&lt;h3&gt;</code> heading hierarchy</li>
          <li>Landmark roles: <code>banner</code>, <code>group</code></li>
        </ul>
      </div>

      <div style={{ marginBottom: '32px', padding: '24px', backgroundColor: '#F7FAFC', borderRadius: '8px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '16px', color: '#1A365D' }}>
          ARIA Attributes
        </h3>
        <ul style={{ paddingLeft: '20px', lineHeight: '2', color: '#4A5568' }}>
          <li>All buttons have descriptive <code>aria-label</code></li>
          <li>Sections have <code>aria-labelledby</code> for headings</li>
          <li>Image placeholder has detailed <code>aria-label</code></li>
          <li>Button group has <code>role="group"</code></li>
        </ul>
      </div>

      <div style={{ marginBottom: '32px', padding: '24px', backgroundColor: '#F7FAFC', borderRadius: '8px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '16px', color: '#1A365D' }}>
          Keyboard Navigation
        </h3>
        <ul style={{ paddingLeft: '20px', lineHeight: '2', color: '#4A5568' }}>
          <li>Tab through all interactive elements</li>
          <li>Enter/Space to activate buttons</li>
          <li>Focus indicators on all focusable elements</li>
          <li>Logical tab order following visual flow</li>
        </ul>
      </div>

      <div style={{ padding: '24px', backgroundColor: '#F7FAFC', borderRadius: '8px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '16px', color: '#1A365D' }}>
          Color & Contrast
        </h3>
        <ul style={{ paddingLeft: '20px', lineHeight: '2', color: '#4A5568' }}>
          <li>Primary text: 4.5:1 contrast ratio minimum</li>
          <li>Button text: White on navy (#1A365D) - high contrast</li>
          <li>No color-only information conveyance</li>
          <li>Icons used as supplementary, not primary indicators</li>
        </ul>
      </div>
    </div>
  ),
  parameters: {
    layout: 'fullscreen',
  },
};

/**
 * Dark Mode Considerations
 * Shows what the page would look like on dark backgrounds
 */
export const DarkModeConsiderations: Story = {
  render: () => (
    <div style={{ backgroundColor: '#1A202C', minHeight: '100vh', padding: '40px' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '32px', backgroundColor: '#2D3748', borderRadius: '12px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 600, marginBottom: '16px', color: 'white', textAlign: 'center' }}>
          Dark Mode Consideration
        </h2>
        <p style={{ color: '#E2E8F0', textAlign: 'center', marginBottom: '32px' }}>
          The current design uses a light theme. For dark mode implementation, consider:
        </p>
        <ul style={{ color: '#E2E8F0', paddingLeft: '20px', lineHeight: '2' }}>
          <li>Invert background colors (dark navy to light cream)</li>
          <li>Adjust text colors for contrast on dark backgrounds</li>
          <li>Use CSS custom properties for theme switching</li>
          <li>Test all color combinations for WCAG AA compliance</li>
          <li>Consider <code>prefers-color-scheme</code> media query</li>
        </ul>
      </div>
    </div>
  ),
  parameters: {
    layout: 'fullscreen',
    backgrounds: { default: 'dark' },
  },
};

/**
 * Print View
 * How the page appears when printed
 */
export const PrintView: Story = {
  render: () => (
    <div style={{ padding: '40px', maxWidth: '800px', margin: '0 auto' }}>
      <h2 style={{ fontSize: '24px', fontWeight: 600, marginBottom: '24px', textAlign: 'center' }}>
        Print Styles
      </h2>
      <div style={{ padding: '24px', backgroundColor: '#F7FAFC', borderRadius: '8px' }}>
        <p style={{ marginBottom: '16px', lineHeight: '1.8' }}>
          The global CSS includes print styles that:
        </p>
        <ul style={{ paddingLeft: '20px', lineHeight: '2' }}>
          <li>Remove background colors and shadows</li>
          <li>Convert colors to black for better print contrast</li>
          <li>Add URLs after links for reference</li>
          <li>Prevent page breaks inside headings and images</li>
          <li>Optimize orphans and widows for text flow</li>
        </ul>
        <p style={{ marginTop: '16px', padding: '12px', backgroundColor: '#BEE3F8', borderRadius: '4px', fontSize: '14px' }}>
          💡 Tip: Use your browser's print preview to see the optimized print layout
        </p>
      </div>
    </div>
  ),
  parameters: {
    layout: 'padded',
  },
};

/**
 * User Flow
 * Demonstrates the user journey through the landing page
 */
export const UserFlow: Story = {
  render: () => (
    <div style={{ padding: '40px', maxWidth: '900px', margin: '0 auto' }}>
      <h2 style={{ fontSize: '28px', fontWeight: 700, marginBottom: '32px', textAlign: 'center' }}>
        User Journey Flow
      </h2>

      <div style={{ position: 'relative', paddingLeft: '40px' }}>
        {[
          {
            step: '1',
            title: 'Landing',
            desc: 'User arrives and reads headline about cellular pain science',
            color: '#BEE3F8',
          },
          {
            step: '2',
            title: 'Education',
            desc: 'User scrolls through content blocks learning about damage types',
            color: '#C6F6D5',
          },
          {
            step: '3',
            title: 'Decision',
            desc: 'User answers qualification question about pain duration',
            color: '#FEEBC8',
          },
          {
            step: '4',
            title: 'Route A: Qualified',
            desc: 'If YES (6+ months) → Navigate to Cellular Science page',
            color: '#C6F6D5',
          },
          {
            step: '4',
            title: 'Route B: Not Yet Qualified',
            desc: 'If NO (<6 months) → Navigate to Waiting List page',
            color: '#FED7D7',
          },
        ].map((item, index) => (
          <div key={index} style={{ marginBottom: '24px', position: 'relative' }}>
            <div style={{
              position: 'absolute',
              left: '-40px',
              top: '0',
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              backgroundColor: item.color,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: '14px',
            }}>
              {item.step}
            </div>
            {index < 4 && (
              <div style={{
                position: 'absolute',
                left: '-24px',
                top: '32px',
                width: '2px',
                height: '24px',
                backgroundColor: '#E2E8F0',
              }} />
            )}
            <div style={{ padding: '16px', backgroundColor: item.color, borderRadius: '8px' }}>
              <h4 style={{ fontWeight: 600, marginBottom: '4px' }}>{item.title}</h4>
              <p style={{ fontSize: '14px', color: '#4A5568' }}>{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  ),
  parameters: {
    layout: 'fullscreen',
  },
};
