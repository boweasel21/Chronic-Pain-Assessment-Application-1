import type { Preview } from '@storybook/react';
import '../src/styles/global.css';

/**
 * Storybook Preview Configuration
 *
 * Global configuration for all stories including:
 * - Theme setup with design system colors
 * - Viewport configuration for responsive testing
 * - Controls configuration
 * - Accessibility settings
 */
const preview: Preview = {
  /**
   * Global parameters applied to all stories
   */
  parameters: {
    /**
     * Controls configuration
     * Automatically infers control types based on prop types
     */
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
      expanded: true,
    },

    /**
     * Actions configuration
     * Automatically creates actions for event handlers
     */
    actions: {
      argTypesRegex: '^on[A-Z].*',
    },

    /**
     * Backgrounds configuration
     * Provides background color options for testing components
     */
    backgrounds: {
      default: 'white',
      values: [
        {
          name: 'white',
          value: '#FFFFFF',
        },
        {
          name: 'cream',
          value: '#F7F4ED',
        },
        {
          name: 'navy',
          value: '#1A365D',
        },
        {
          name: 'gray',
          value: '#F7FAFC',
        },
      ],
    },

    /**
     * Viewport configuration
     * Provides preset viewports for responsive testing
     */
    viewport: {
      viewports: {
        mobile: {
          name: 'Mobile',
          styles: {
            width: '375px',
            height: '667px',
          },
        },
        mobileLandscape: {
          name: 'Mobile Landscape',
          styles: {
            width: '667px',
            height: '375px',
          },
        },
        tablet: {
          name: 'Tablet',
          styles: {
            width: '768px',
            height: '1024px',
          },
        },
        tabletLandscape: {
          name: 'Tablet Landscape',
          styles: {
            width: '1024px',
            height: '768px',
          },
        },
        desktop: {
          name: 'Desktop',
          styles: {
            width: '1280px',
            height: '800px',
          },
        },
        desktopLarge: {
          name: 'Desktop Large',
          styles: {
            width: '1920px',
            height: '1080px',
          },
        },
      },
    },

    /**
     * Layout configuration
     * Default layout for stories
     */
    layout: 'centered',

    /**
     * Documentation configuration
     */
    docs: {
      toc: true,
      source: {
        state: 'open',
      },
    },

    /**
     * Accessibility addon configuration
     */
    a11y: {
      config: {
        rules: [
          {
            id: 'color-contrast',
            enabled: true,
          },
          {
            id: 'label',
            enabled: true,
          },
          {
            id: 'button-name',
            enabled: true,
          },
        ],
      },
    },
  },

  /**
   * Global decorators
   * Wrap all stories with these components/logic
   */
  decorators: [
    (Story) => (
      <div style={{ fontFamily: 'var(--font-sans)' }}>
        <Story />
      </div>
    ),
  ],

  /**
   * Global arg types
   * Configure controls for common props across all components
   */
  argTypes: {
    className: {
      control: 'text',
      description: 'Additional CSS class names',
      table: {
        category: 'Styling',
      },
    },
  },

  /**
   * Tags for filtering and organization
   */
  tags: ['autodocs'],
};

export default preview;