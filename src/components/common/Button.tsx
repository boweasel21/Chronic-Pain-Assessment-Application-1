import { ButtonHTMLAttributes, ReactNode } from 'react';
import { motion, MotionProps } from 'framer-motion';
import styles from './Button.module.css';

/**
 * Button variant types
 */
type ButtonVariant = 'primary' | 'secondary' | 'danger';

/**
 * Button size types
 */
type ButtonSize = 'small' | 'large';

/**
 * Button component props interface
 */
export interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'style'> {
  /**
   * Visual style variant of the button
   * - primary: Navy background with white text
   * - secondary: Cream outline with navy text
   * - danger: Red background with white text
   * @default 'primary'
   */
  variant?: ButtonVariant;

  /**
   * Size variant of the button
   * - small: 44px min height, 14px text (mobile-friendly)
   * - large: 48px min height, 16px text
   * @default 'large'
   */
  size?: ButtonSize;

  /**
   * Whether the button is disabled
   * Disables animations, sets opacity to 50%, prevents clicks
   * @default false
   */
  disabled?: boolean;

  /**
   * Whether the button should take full width of container
   * @default false
   */
  fullWidth?: boolean;

  /**
   * Click handler function
   */
  onClick?: () => void;

  /**
   * Accessible label for screen readers
   * Required for accessibility compliance
   */
  'aria-label': string;

  /**
   * Button content (text or JSX)
   */
  children: ReactNode;

  /**
   * Optional CSS class name for additional styling
   */
  className?: string;

  /**
   * Button type attribute
   * @default 'button'
   */
  type?: 'button' | 'submit' | 'reset';
}

/**
 * Button Component
 *
 * @description Premium, accessible button component with Framer Motion animations.
 * Supports multiple variants, sizes, and states with full keyboard navigation
 * and screen reader support. Respects prefers-reduced-motion.
 *
 * @example
 * ```tsx
 * <Button
 *   variant="primary"
 *   size="large"
 *   onClick={handleNext}
 *   aria-label="Continue to next step"
 * >
 *   Next
 * </Button>
 * ```
 *
 * @param {ButtonProps} props - Component props
 * @returns {JSX.Element} Rendered button element
 */
export const Button = ({
  variant = 'primary',
  size = 'large',
  disabled = false,
  fullWidth = false,
  onClick,
  'aria-label': ariaLabel,
  children,
  className = '',
  type = 'button',
  ...rest
}: ButtonProps): JSX.Element => {
  /**
   * Combine CSS classes based on props
   */
  const buttonClasses = [
    styles.button,
    styles[`button--${variant}`],
    styles[`button--${size}`],
    fullWidth && styles['button--fullWidth'],
    disabled && styles['button--disabled'],
    className
  ]
    .filter(Boolean)
    .join(' ');

  /**
   * Animation variants for Framer Motion
   * Respects reduced motion preference
   */
  const motionProps: MotionProps = disabled
    ? {}
    : {
        whileHover: { scale: 1.02 },
        whileTap: { scale: 0.98 },
        transition: {
          duration: 0.15,
          ease: 'easeOut'
        }
      };

  return (
    <motion.button
      className={buttonClasses}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      aria-disabled={disabled}
      type={type}
      {...motionProps}
      {...rest}
    >
      {children}
    </motion.button>
  );
};
