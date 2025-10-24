/**
 * Design System Theme Configuration
 *
 * @description Central source of truth for all design tokens including colors,
 * typography, spacing, breakpoints, and animation settings. All components
 * must reference these values instead of hardcoding.
 *
 * @module theme
 */

export const theme = {
  /**
   * Color palette
   * Primary: Navy for headers and CTAs
   * Secondary: Cream for accents and highlights
   * Neutrals: Grays for text and backgrounds
   * Semantic: Status colors for feedback
   */
  colors: {
    primary: 'rgba(29, 44, 73, 1)',
    primaryLight: 'rgba(29, 44, 73, 0.8)',
    primaryDark: 'rgba(20, 30, 50, 1)',

    secondary: 'rgba(226, 211, 163, 1)',
    secondaryLight: 'rgba(226, 211, 163, 0.2)',
    secondaryMedium: 'rgba(226, 211, 163, 0.5)',

    white: '#FFFFFF',
    offWhite: '#FAFAFA',

    gray100: '#F5F5F5',
    gray200: '#E5E5E5',
    gray300: '#D4D4D4',
    gray400: '#A3A3A3',
    gray500: '#737373',
    gray600: '#525252',
    gray700: '#404040',
    gray800: '#262626',

    success: '#10B981',
    warning: '#F59E0B',
    danger: '#EF4444',
    dangerLight: 'rgba(239, 68, 68, 0.1)',
    info: '#3B82F6',

    text: {
      primary: 'rgba(29, 44, 73, 1)',
      secondary: '#525252',
      muted: '#737373',
      inverse: '#FFFFFF'
    },

    border: {
      default: 'rgba(226, 211, 163, 1)',
      focus: 'rgba(29, 44, 73, 1)',
      error: '#EF4444',
      light: '#E5E5E5'
    },

    background: {
      primary: '#FFFFFF',
      secondary: '#FAFAFA',
      cream: 'rgba(226, 211, 163, 0.1)',
      navy: 'rgba(29, 44, 73, 1)'
    }
  },

  /**
   * Typography scale using fluid responsive sizing with clamp()
   * All sizes scale smoothly between mobile and desktop
   */
  typography: {
    fontFamily: {
      primary: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      mono: '"SF Mono", "Monaco", "Inconsolata", "Fira Code", "Droid Sans Mono", "Source Code Pro", monospace'
    },

    fontSize: {
      h1: 'clamp(2rem, 5vw, 3.052rem)',
      h2: 'clamp(1.5rem, 4vw, 2.441rem)',
      h3: 'clamp(1.25rem, 3vw, 1.953rem)',
      h4: 'clamp(1.125rem, 2.5vw, 1.563rem)',
      h5: 'clamp(1rem, 2vw, 1.25rem)',
      body: 'clamp(1rem, 2vw, 1.125rem)',
      small: 'clamp(0.875rem, 1.5vw, 1rem)',
      xsmall: 'clamp(0.75rem, 1.25vw, 0.875rem)',
      large: 'clamp(1.125rem, 2.5vw, 1.25rem)'
    },

    fontWeight: {
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700
    },

    lineHeight: {
      tight: 1.2,
      normal: 1.5,
      relaxed: 1.75,
      loose: 2
    },

    letterSpacing: {
      tight: '-0.02em',
      normal: '0',
      wide: '0.02em'
    }
  },

  /**
   * Spacing scale based on 8px grid system
   * All spacing must be multiples of 8px for consistency
   */
  spacing: {
    xs: '8px',
    sm: '16px',
    md: '24px',
    lg: '32px',
    xl: '48px',
    xxl: '64px',
    xxxl: '96px',

    component: {
      tight: '8px',
      comfortable: '16px',
      generous: '24px'
    },

    section: {
      small: '48px',
      large: '64px'
    }
  },

  /**
   * Responsive breakpoints for media queries
   * Mobile-first approach: start with mobile, add complexity up
   */
  breakpoints: {
    xs: '320px',
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    xxl: '1536px'
  },

  /**
   * Layout constraints
   */
  layout: {
    maxWidth: '1200px',
    contentWidth: '800px',
    sidebarWidth: '280px',
    headerHeight: '64px'
  },

  /**
   * Border radius scale
   */
  borderRadius: {
    none: '0',
    sm: '4px',
    md: '8px',
    lg: '12px',
    xl: '16px',
    full: '9999px'
  },

  /**
   * Shadow depths for elevation
   */
  shadows: {
    none: 'none',
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    xxl: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',

    focus: '0 0 0 3px rgba(226, 211, 163, 1)',
    focusRing: '0 0 0 3px rgba(226, 211, 163, 1)'
  },

  /**
   * Animation settings
   * Consistent timing and easing for all transitions
   */
  animation: {
    duration: {
      instant: '100ms',
      fast: '150ms',
      normal: '300ms',
      slow: '500ms'
    },

    easing: {
      linear: 'linear',
      ease: 'ease',
      easeIn: 'ease-in',
      easeOut: 'ease-out',
      easeInOut: 'ease-in-out',
      spring: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)'
    },

    transition: {
      page: {
        duration: 0.3,
        ease: 'easeInOut'
      },
      button: {
        duration: 0.15,
        ease: 'easeOut'
      },
      checkbox: {
        stiffness: 300,
        damping: 20
      }
    }
  },

  /**
   * Accessibility settings
   */
  a11y: {
    minTouchTarget: '44px',
    minTouchTargetMobile: '48px',
    focusOutlineWidth: '3px',
    focusOutlineOffset: '2px',

    motion: {
      respectsReducedMotion: true,
      reducedMotionDuration: '0.01ms'
    }
  },

  /**
   * Z-index scale for layering
   */
  zIndex: {
    base: 0,
    dropdown: 1000,
    sticky: 1100,
    fixed: 1200,
    modalBackdrop: 1300,
    modal: 1400,
    popover: 1500,
    tooltip: 1600
  }
};

/**
 * Media query helpers
 * Usage: `@media ${mediaQueries.md} { ... }`
 */
export const mediaQueries = {
  xs: `(min-width: ${theme.breakpoints.xs})`,
  sm: `(min-width: ${theme.breakpoints.sm})`,
  md: `(min-width: ${theme.breakpoints.md})`,
  lg: `(min-width: ${theme.breakpoints.lg})`,
  xl: `(min-width: ${theme.breakpoints.xl})`,
  xxl: `(min-width: ${theme.breakpoints.xxl})`,

  reducedMotion: '(prefers-reduced-motion: reduce)',
  darkMode: '(prefers-color-scheme: dark)',
  highContrast: '(prefers-contrast: high)'
};

/**
 * CSS custom property generator
 * Converts theme object to CSS variables
 *
 * @returns {string} CSS custom properties string
 */
export const generateCSSVariables = () => {
  const flattenObject = (obj, prefix = '') => {
    return Object.keys(obj).reduce((acc, key) => {
      const value = obj[key];
      const newKey = prefix ? `${prefix}-${key}` : key;

      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        Object.assign(acc, flattenObject(value, newKey));
      } else {
        acc[`--${newKey}`] = value;
      }

      return acc;
    }, {});
  };

  return flattenObject(theme);
};
