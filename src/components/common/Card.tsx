import { HTMLAttributes, ReactNode } from 'react';
import { motion, MotionProps } from 'framer-motion';
import styles from './Card.module.css';

/**
 * Card variant types
 */
type CardVariant = 'white' | 'primary' | 'secondary';

/**
 * Card shadow depth types
 */
type CardShadow = 'none' | 'sm' | 'md' | 'lg' | 'xl';

/**
 * Card component props interface
 */
export interface CardProps extends Omit<HTMLAttributes<HTMLDivElement>, 'style'> {
  /**
   * Card content
   */
  children: ReactNode;

  /**
   * Visual style variant of the card
   * - white: White background with border
   * - primary: Navy background with white text
   * - secondary: Cream background
   * @default 'white'
   */
  variant?: CardVariant;

  /**
   * Shadow depth for elevation
   * - none: No shadow (flat)
   * - sm: Subtle shadow
   * - md: Medium shadow (default)
   * - lg: Large shadow
   * - xl: Extra large shadow
   * @default 'md'
   */
  shadow?: CardShadow;

  /**
   * Whether to enable hover effects
   * Increases shadow on hover
   * @default false
   */
  hoverable?: boolean;

  /**
   * Custom padding size
   * - none: No padding
   * - sm: 16px
   * - md: 24px (default)
   * - lg: 32px
   * @default 'md'
   */
  padding?: 'none' | 'sm' | 'md' | 'lg';

  /**
   * Whether the card should take full width
   * @default false
   */
  fullWidth?: boolean;

  /**
   * Optional click handler (makes card interactive)
   */
  onClick?: () => void;

  /**
   * Optional CSS class name for additional styling
   */
  className?: string;

  /**
   * Optional accessible label for interactive cards
   */
  'aria-label'?: string;

  /**
   * Whether the card is disabled (for interactive cards)
   * @default false
   */
  disabled?: boolean;
}

/**
 * Card Component
 *
 * @description Premium card/modal component with multiple variants and shadow depths.
 * Features rounded corners, responsive padding, and optional hover effects.
 * Can be used for content containers, modals, or interactive elements.
 *
 * @example
 * ```tsx
 * // Basic card
 * <Card variant="white" shadow="md">
 *   <h2>Card Title</h2>
 *   <p>Card content goes here</p>
 * </Card>
 * ```
 *
 * @example
 * ```tsx
 * // Interactive card with hover
 * <Card
 *   variant="white"
 *   shadow="md"
 *   hoverable
 *   onClick={handleClick}
 *   aria-label="Click to view details"
 * >
 *   <h3>Clickable Card</h3>
 * </Card>
 * ```
 *
 * @param {CardProps} props - Component props
 * @returns {JSX.Element} Rendered card element
 */
export const Card = ({
  children,
  variant = 'white',
  shadow = 'md',
  hoverable = false,
  padding = 'md',
  fullWidth = false,
  onClick,
  className = '',
  'aria-label': ariaLabel,
  disabled = false,
  ...rest
}: CardProps): JSX.Element => {
  /**
   * Determine if card is interactive
   */
  const isInteractive = Boolean(onClick) && !disabled;

  /**
   * Combine CSS classes based on props
   */
  const cardClasses = [
    styles.card,
    styles[`card--${variant}`],
    styles[`card--shadow-${shadow}`],
    styles[`card--padding-${padding}`],
    hoverable && styles['card--hoverable'],
    isInteractive && styles['card--interactive'],
    fullWidth && styles['card--fullWidth'],
    disabled && styles['card--disabled'],
    className
  ]
    .filter(Boolean)
    .join(' ');

  /**
   * Animation props for hoverable cards
   */
  const motionProps: MotionProps = hoverable && !disabled
    ? {
        whileHover: {
          y: -4,
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
          transition: {
            duration: 0.15,
            ease: 'easeOut'
          }
        },
        whileTap: onClick
          ? {
              scale: 0.98,
              transition: {
                duration: 0.1,
                ease: 'easeOut'
              }
            }
          : undefined
      }
    : {};

  /**
   * Handle click with disabled check
   */
  const handleClick = (): void => {
    if (onClick && !disabled) {
      onClick();
    }
  };

  /**
   * Determine component role and props for accessibility
   */
  const accessibilityProps = isInteractive
    ? {
        role: 'button',
        tabIndex: 0,
        onClick: handleClick,
        onKeyDown: (event: React.KeyboardEvent<HTMLDivElement>) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            handleClick();
          }
        },
        'aria-label': ariaLabel,
        'aria-disabled': disabled
      }
    : {};

  return (
    <motion.div
      className={cardClasses}
      {...motionProps}
      {...accessibilityProps}
      {...rest}
    >
      {children}
    </motion.div>
  );
};
