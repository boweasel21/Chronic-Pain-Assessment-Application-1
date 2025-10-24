import type { StorybookConfig } from '@storybook/react-vite';
import path from 'path';

/**
 * Storybook Configuration
 *
 * Main configuration file for Storybook 8.x with Vite builder
 * Configures stories location, addons, framework, and build settings
 */
const config: StorybookConfig = {
  /**
   * Story file patterns
   * Matches all .stories.tsx files in src directory
   */
  stories: [
    '../src/**/*.stories.@(js|jsx|ts|tsx)',
    '../src/**/*.mdx',
  ],

  /**
   * Storybook addons
   * - essentials: Core addons (docs, controls, actions, viewport, backgrounds, etc.)
   * - interactions: Interactive testing and debugging
   * - links: Navigation between stories
   * - a11y: Accessibility testing
   */
  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
    '@storybook/addon-links',
    '@storybook/addon-a11y',
  ],

  /**
   * Framework configuration
   * Using React with Vite builder for fast HMR
   */
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },

  /**
   * TypeScript configuration
   * Enable type checking in stories
   */
  typescript: {
    check: true,
    reactDocgen: 'react-docgen-typescript',
    reactDocgenTypescriptOptions: {
      shouldExtractLiteralValuesFromEnum: true,
      propFilter: (prop) => {
        // Filter out props from node_modules except specific ones
        if (prop.parent) {
          return !prop.parent.fileName.includes('node_modules');
        }
        return true;
      },
    },
  },

  /**
   * Vite configuration customization
   * Merge with project's vite.config.ts settings
   */
  async viteFinal(config) {
    return {
      ...config,
      resolve: {
        ...config.resolve,
        alias: {
          ...config.resolve?.alias,
          '@': path.resolve(__dirname, '../src'),
          '@components': path.resolve(__dirname, '../src/components'),
          '@pages': path.resolve(__dirname, '../src/pages'),
          '@context': path.resolve(__dirname, '../src/context'),
          '@types': path.resolve(__dirname, '../src/types'),
          '@styles': path.resolve(__dirname, '../src/styles'),
          '@utils': path.resolve(__dirname, '../src/utils'),
          '@hooks': path.resolve(__dirname, '../src/hooks'),
          '@data': path.resolve(__dirname, '../data'),
        },
      },
    };
  },

  /**
   * Documentation settings
   */
  docs: {
    autodocs: 'tag',
  },

  /**
   * Static directories for assets
   * Serves files from public directory
   */
  staticDirs: ['../public'],

  /**
   * Core settings
   */
  core: {
    disableTelemetry: true,
  },
};

export default config;