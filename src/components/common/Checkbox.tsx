import { InputHTMLAttributes, ReactNode } from 'react';
import { motion, Variants } from 'framer-motion';
import styles from './Checkbox.module.css';

/**
 * Checkbox component props interface
 */
export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'id'> {
  /**
   * Unique identifier for the checkbox
   * Links the input with its label for accessibility
   */
  id: string;

  /**
   * Label text displayed next to checkbox
   */
  label: string;

  /**
   * Whether the checkbox is checked
   */
  checked: boolean;

  /**
   * Change handler called when checkbox state changes
   * @param checked - New checked state
   */
  onChange: (checked: boolean) => void;

  /**
   * Whether the checkbox is disabled
   * @default false
   */
  disabled?: boolean;

  /**
   * Optional description text shown below label
   * Provides additional context in smaller, muted text
   */
  description?: string;

  /**
   * Optional CSS class name for additional styling
   */
  className?: string;

  /**
   * Accessible label for screen readers
   * Falls back to label prop if not provided
   */
  'aria-label'?: string;
}

/**
 * Checkbox Component
 *
 * @description Custom checkbox component with spring animations and full accessibility.
 * Features animated checkmark with scale and rotation, color transitions, and
 * 44x44px minimum touch target. Respects prefers-reduced-motion.
 *
 * @example
 * ```tsx
 * <Checkbox
 *   id="agree-terms"
 *   label="I agree to the terms"
 *   checked={agreedToTerms}
 *   onChange={setAgreedToTerms}
 *   description="You must agree to continue"
 * />
 * ```
 *
 * @param {CheckboxProps} props - Component props
 * @returns {JSX.Element} Rendered checkbox element
 */
export const Checkbox = ({
  id,
  label,
  checked,
  onChange,
  disabled = false,
  description,
  className = '',
  'aria-label': ariaLabel,
  ...rest
}: CheckboxProps): JSX.Element => {
  /**
   * Handle checkbox state change
   */
  const handleChange = (): void => {
    if (!disabled) {
      onChange(!checked);
    }
  };

  /**
   * Handle keyboard interaction (Space/Enter)
   */
  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>): void => {
    if (disabled) return;

    if (event.key === ' ' || event.key === 'Enter') {
      event.preventDefault();
      onChange(!checked);
    }
  };

  /**
   * Animation variants for checkmark
   * Spring animation: scale 0→1, rotate -180→0
   */
  const checkmarkVariants: Variants = {
    unchecked: {
      scale: 0,
      rotate: -180,
      opacity: 0
    },
    checked: {
      scale: 1,
      rotate: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 20
      }
    }
  };

  /**
   * Animation variants for checkbox border
   */
  const boxVariants: Variants = {
    unchecked: {
      borderColor: 'rgba(226, 211, 163, 1)',
      backgroundColor: 'transparent'
    },
    checked: {
      borderColor: 'rgba(29, 44, 73, 1)',
      backgroundColor: 'rgba(29, 44, 73, 1)',
      transition: {
        duration: 0.15,
        ease: 'easeOut'
      }
    }
  };

  /**
   * Combine CSS classes
   */
  const containerClasses = [
    styles.checkbox,
    disabled && styles['checkbox--disabled'],
    className
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={containerClasses}>
      <div className={styles.checkbox__wrapper}>
        {/* Hidden native input for form integration and accessibility */}
        <input
          type="checkbox"
          id={id}
          checked={checked}
          onChange={handleChange}
          disabled={disabled}
          className={styles.checkbox__input}
          aria-label={ariaLabel || label}
          aria-describedby={description ? `${id}-description` : undefined}
          {...rest}
        />

        {/* Custom checkbox visual */}
        <motion.div
          className={styles.checkbox__box}
          onClick={handleChange}
          onKeyDown={handleKeyDown}
          role="checkbox"
          aria-checked={checked}
          aria-disabled={disabled}
          tabIndex={disabled ? -1 : 0}
          variants={boxVariants}
          initial="unchecked"
          animate={checked ? 'checked' : 'unchecked'}
        >
          {/* Checkmark icon with animation */}
          <motion.svg
            className={styles.checkbox__checkmark}
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            variants={checkmarkVariants}
            initial="unchecked"
            animate={checked ? 'checked' : 'unchecked'}
            aria-hidden="true"
          >
            <motion.path
              d="M5 12.5L10 17.5L19 8"
              stroke="white"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: checked ? 1 : 0 }}
              transition={{
                duration: 0.2,
                ease: 'easeOut'
              }}
            />
          </motion.svg>
        </motion.div>

        {/* Label and description */}
        <div className={styles.checkbox__content}>
          <label htmlFor={id} className={styles.checkbox__label}>
            {label}
          </label>

          {description && (
            <p
              id={`${id}-description`}
              className={styles.checkbox__description}
            >
              {description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
