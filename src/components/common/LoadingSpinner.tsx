/**
 * LoadingSpinner Component
 * Animated loading spinner with accessibility support
 */

import { motion } from 'framer-motion';
import styles from './LoadingSpinner.module.css';

/**
 * LoadingSpinner component props
 */
export interface LoadingSpinnerProps {
  /**
   * Size of the spinner
   * @default 'medium'
   */
  size?: 'small' | 'medium' | 'large';

  /**
   * Optional accessible label
   * @default 'Loading...'
   */
  label?: string;

  /**
   * Optional CSS class name
   */
  className?: string;
}

/**
 * LoadingSpinner Component
 *
 * @description Accessible animated loading spinner with size variants.
 * Uses Framer Motion for smooth rotation animation.
 * Includes proper ARIA attributes for screen readers.
 *
 * @example
 * ```tsx
 * <LoadingSpinner size="large" label="Submitting assessment..." />
 * ```
 *
 * @param {LoadingSpinnerProps} props - Component props
 * @returns {JSX.Element} Rendered loading spinner
 */
export const LoadingSpinner = ({
  size = 'medium',
  label = 'Loading...',
  className = '',
}: LoadingSpinnerProps): JSX.Element => {
  /**
   * Combine CSS classes based on props
   */
  const spinnerClasses = [
    styles.spinner,
    styles[`spinner--${size}`],
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div
      className={styles.spinnerContainer}
      role="status"
      aria-live="polite"
      aria-label={label}
    >
      <motion.div
        className={spinnerClasses}
        animate={{ rotate: 360 }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: 'linear',
        }}
      >
        <svg
          className={styles.spinnerSvg}
          viewBox="0 0 50 50"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle
            className={styles.spinnerCircle}
            cx="25"
            cy="25"
            r="20"
            fill="none"
            strokeWidth="4"
          />
        </svg>
      </motion.div>
      <span className={styles.spinnerLabel}>{label}</span>
    </div>
  );
};
