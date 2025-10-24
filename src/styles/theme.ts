/**
 * Design System Theme
 * Centralized design tokens for consistent styling across the application
 */

/**
 * Color palette
 */
export const colors = {
  // Primary brand colors
  primary: {
    navy: '#1A365D',
    navyLight: '#2C5282',
    navyDark: '#0F1E36',
  },

  // Secondary brand colors
  secondary: {
    cream: '#F7F4ED',
    creamLight: '#FDFCF9',
    creamDark: '#EBE7DB',
  },

  // Neutral colors
  neutral: {
    white: '#FFFFFF',
    gray100: '#F7FAFC',
    gray200: '#EDF2F7',
    gray300: '#E2E8F0',
    gray400: '#CBD5E0',
    gray500: '#A0AEC0',
    gray600: '#718096',
    gray700: '#4A5568',
    gray800: '#2D3748',
    gray900: '#1A202C',
    black: '#000000',
  },

  // Semantic colors
  success: {
    50: '#F0FFF4',
    100: '#C6F6D5',
    500: '#38A169',
    600: '#2F855A',
    700: '#276749',
  },

  warning: {
    50: '#FFFAF0',
    100: '#FEEBC8',
    500: '#ED8936',
    600: '#DD6B20',
    700: '#C05621',
  },

  error: {
    50: '#FFF5F5',
    100: '#FED7D7',
    500: '#E53E3E',
    600: '#C53030',
    700: '#9B2C2C',
  },

  info: {
    50: '#EBF8FF',
    100: '#BEE3F8',
    500: '#3182CE',
    600: '#2C5282',
    700: '#2A4365',
  },
} as const;

/**
 * Typography scale
 */
export const typography = {
  // Font families
  fontFamily: {
    sans: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', sans-serif",
    mono: "'Fira Code', 'Consolas', 'Monaco', 'Courier New', monospace",
  },

  // Font sizes
  fontSize: {
    xs: '0.75rem',      // 12px
    sm: '0.875rem',     // 14px
    base: '1rem',       // 16px
    lg: '1.125rem',     // 18px
    xl: '1.25rem',      // 20px
    '2xl': '1.5rem',    // 24px
    '3xl': '1.875rem',  // 30px
    '4xl': '2.25rem',   // 36px
    '5xl': '3rem',      // 48px
    '6xl': '3.75rem',   // 60px
  },

  // Font weights
  fontWeight: {
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
  },

  // Line heights
  lineHeight: {
    none: 1,
    tight: 1.25,
    snug: 1.375,
    normal: 1.5,
    relaxed: 1.625,
    loose: 2,
  },

  // Letter spacing
  letterSpacing: {
    tighter: '-0.05em',
    tight: '-0.025em',
    normal: '0',
    wide: '0.025em',
    wider: '0.05em',
    widest: '0.1em',
  },
} as const;

/**
 * Spacing scale (8px grid system)
 */
export const spacing = {
  0: '0',
  xs: '0.25rem',   // 4px
  sm: '0.5rem',    // 8px
  md: '1rem',      // 16px
  lg: '1.5rem',    // 24px
  xl: '2rem',      // 32px
  '2xl': '3rem',   // 48px
  '3xl': '4rem',   // 64px
  '4xl': '6rem',   // 96px
  '5xl': '8rem',   // 128px
} as const;

/**
 * Border radius
 */
export const borderRadius = {
  none: '0',
  sm: '0.25rem',   // 4px
  base: '0.5rem',  // 8px
  md: '0.75rem',   // 12px
  lg: '1rem',      // 16px
  xl: '1.5rem',    // 24px
  '2xl': '2rem',   // 32px
  full: '9999px',
} as const;

/**
 * Shadows
 */
export const shadows = {
  none: 'none',
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  base: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
  outline: '0 0 0 3px rgba(66, 153, 225, 0.5)',
} as const;

/**
 * Transitions
 */
export const transitions = {
  duration: {
    fast: '150ms',
    base: '200ms',
    slow: '300ms',
    slower: '500ms',
  },
  timing: {
    ease: 'ease',
    easeIn: 'ease-in',
    easeOut: 'ease-out',
    easeInOut: 'ease-in-out',
    linear: 'linear',
  },
} as const;

/**
 * Breakpoints for responsive design
 */
export const breakpoints = {
  xs: '320px',
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const;

/**
 * Z-index scale
 */
export const zIndex = {
  hide: -1,
  base: 0,
  dropdown: 1000,
  sticky: 1100,
  fixed: 1200,
  overlay: 1300,
  modal: 1400,
  popover: 1500,
  toast: 1600,
  tooltip: 1700,
} as const;

/**
 * Complete theme object
 */
export const theme = {
  colors,
  typography,
  spacing,
  borderRadius,
  shadows,
  transitions,
  breakpoints,
  zIndex,
} as const;

/**
 * Theme type for TypeScript
 */
export type Theme = typeof theme;

/**
 * CSS custom properties generator
 * Converts theme values to CSS variables
 */
export const generateCSSVariables = (): string => {
  return `
    /* Colors - Primary */
    --color-primary-navy: ${colors.primary.navy};
    --color-primary-navy-light: ${colors.primary.navyLight};
    --color-primary-navy-dark: ${colors.primary.navyDark};

    /* Colors - Secondary */
    --color-secondary-cream: ${colors.secondary.cream};
    --color-secondary-cream-light: ${colors.secondary.creamLight};
    --color-secondary-cream-dark: ${colors.secondary.creamDark};

    /* Colors - Neutral */
    --color-white: ${colors.neutral.white};
    --color-black: ${colors.neutral.black};
    --color-gray-100: ${colors.neutral.gray100};
    --color-gray-200: ${colors.neutral.gray200};
    --color-gray-300: ${colors.neutral.gray300};
    --color-gray-400: ${colors.neutral.gray400};
    --color-gray-500: ${colors.neutral.gray500};
    --color-gray-600: ${colors.neutral.gray600};
    --color-gray-700: ${colors.neutral.gray700};
    --color-gray-800: ${colors.neutral.gray800};
    --color-gray-900: ${colors.neutral.gray900};

    /* Colors - Semantic */
    --color-success: ${colors.success[500]};
    --color-warning: ${colors.warning[500]};
    --color-error: ${colors.error[500]};
    --color-info: ${colors.info[500]};

    /* Typography */
    --font-sans: ${typography.fontFamily.sans};
    --font-mono: ${typography.fontFamily.mono};

    /* Spacing */
    --spacing-xs: ${spacing.xs};
    --spacing-sm: ${spacing.sm};
    --spacing-md: ${spacing.md};
    --spacing-lg: ${spacing.lg};
    --spacing-xl: ${spacing.xl};
    --spacing-2xl: ${spacing['2xl']};
    --spacing-3xl: ${spacing['3xl']};

    /* Border Radius */
    --radius-sm: ${borderRadius.sm};
    --radius-base: ${borderRadius.base};
    --radius-md: ${borderRadius.md};
    --radius-lg: ${borderRadius.lg};
    --radius-xl: ${borderRadius.xl};
    --radius-full: ${borderRadius.full};

    /* Transitions */
    --transition-fast: ${transitions.duration.fast};
    --transition-base: ${transitions.duration.base};
    --transition-slow: ${transitions.duration.slow};
  `;
};

export default theme;
