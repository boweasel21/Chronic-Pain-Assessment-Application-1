import { HTMLAttributes } from 'react';
import { motion } from 'framer-motion';
import styles from './ProgressBar.module.css';

/**
 * ProgressBar component props interface
 */
export interface ProgressBarProps extends Omit<HTMLAttributes<HTMLDivElement>, 'role'> {
  /**
   * Current step number (1-indexed)
   */
  current: number;

  /**
   * Total number of steps
   */
  total: number;

  /**
   * Optional label prefix
   * @default 'Step'
   */
  labelPrefix?: string;

  /**
   * Whether to show step text
   * @default true
   */
  showLabel?: boolean;

  /**
   * Whether to show percentage
   * @default false
   */
  showPercentage?: boolean;

  /**
   * Optional CSS class name for additional styling
   */
  className?: string;

  /**
   * Accessible label for screen readers
   */
  'aria-label'?: string;
}

/**
 * ProgressBar Component
 *
 * @description Accessible progress bar with animated width transitions.
 * Displays current step and progress percentage with full ARIA support.
 * Width changes animate smoothly with 300ms ease-out transition.
 *
 * @example
 * ```tsx
 * <ProgressBar
 *   current={3}
 *   total={10}
 *   showLabel
 *   showPercentage
 *   aria-label="Assessment progress"
 * />
 * ```
 *
 * @param {ProgressBarProps} props - Component props
 * @returns {JSX.Element} Rendered progress bar element
 */
export const ProgressBar = ({
  current,
  total,
  labelPrefix = 'Step',
  showLabel = true,
  showPercentage = false,
  className = '',
  'aria-label': ariaLabel,
  ...rest
}: ProgressBarProps): JSX.Element => {
  /**
   * Calculate progress percentage
   * Clamp between 0 and 100
   */
  const percentage = Math.min(Math.max((current / total) * 100, 0), 100);

  /**
   * Format percentage for display
   */
  const formattedPercentage = `${Math.round(percentage)}%`;

  /**
   * Generate step text
   */
  const stepText = `${labelPrefix} ${current} of ${total}`;

  /**
   * Combine CSS classes
   */
  const containerClasses = [styles.progressBar, className]
    .filter(Boolean)
    .join(' ');

  /**
   * Generate accessible label
   */
  const progressAriaLabel =
    ariaLabel || `Progress: ${stepText}${showPercentage ? `, ${formattedPercentage}` : ''}`;

  return (
    <div className={containerClasses} {...rest}>
      {/* Label and percentage container */}
      {(showLabel || showPercentage) && (
        <div className={styles.progressBar__header}>
          {showLabel && (
            <span className={styles.progressBar__label} aria-live="polite">
              {stepText}
            </span>
          )}

          {showPercentage && (
            <span className={styles.progressBar__percentage} aria-live="polite">
              {formattedPercentage}
            </span>
          )}
        </div>
      )}

      {/* Progress bar track */}
      <div
        className={styles.progressBar__track}
        role="progressbar"
        aria-label={progressAriaLabel}
        aria-valuenow={current}
        aria-valuemin={0}
        aria-valuemax={total}
        aria-valuetext={`${stepText}. ${formattedPercentage} complete.`}
      >
        {/* Animated progress bar fill */}
        <motion.div
          className={styles.progressBar__fill}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{
            duration: 0.3,
            ease: 'easeOut'
          }}
        >
          {/* Inner highlight for depth effect */}
          <div className={styles.progressBar__highlight} />
        </motion.div>
      </div>
    </div>
  );
};
