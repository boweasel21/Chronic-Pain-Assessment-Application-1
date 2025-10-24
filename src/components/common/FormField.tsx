import { InputHTMLAttributes, useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import styles from './FormField.module.css';

/**
 * FormField input types
 */
type FormFieldType = 'text' | 'email' | 'tel' | 'password' | 'number' | 'url';

/**
 * FormField component props interface
 */
export interface FormFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  /**
   * Label text for the input field
   */
  label: string;

  /**
   * Input field type
   * @default 'text'
   */
  type?: FormFieldType;

  /**
   * Current value of the input
   */
  value: string;

  /**
   * Change handler called when input value changes
   * @param value - New input value
   */
  onChange: (value: string) => void;

  /**
   * Error message to display below input
   * When present, input shows error state
   */
  error?: string;

  /**
   * Placeholder text shown when input is empty
   */
  placeholder?: string;

  /**
   * Whether the input is disabled
   * @default false
   */
  disabled?: boolean;

  /**
   * Helper text shown below input (when no error)
   * Provides guidance or additional context
   */
  helperText?: string;

  /**
   * Whether the field is required
   * Adds asterisk to label
   * @default false
   */
  required?: boolean;

  /**
   * Optional CSS class name for additional styling
   */
  className?: string;

  /**
   * Accessible label for screen readers
   * Falls back to label prop if not provided
   */
  'aria-label'?: string;

  /**
   * Unique identifier for the input field
   * Auto-generated if not provided
   */
  id?: string;
}

/**
 * FormField Component
 *
 * @description Premium form input field with animated label, focus states, and
 * error handling. Features floating label animation, border transitions, and
 * full accessibility support. Label moves up when focused or filled.
 *
 * @example
 * ```tsx
 * <FormField
 *   label="Email Address"
 *   type="email"
 *   value={email}
 *   onChange={setEmail}
 *   error={emailError}
 *   placeholder="your@email.com"
 *   required
 *   aria-label="Enter your email address"
 * />
 * ```
 *
 * @param {FormFieldProps} props - Component props
 * @returns {JSX.Element} Rendered form field element
 */
export const FormField = ({
  label,
  type = 'text',
  value,
  onChange,
  error,
  placeholder,
  disabled = false,
  helperText,
  required = false,
  className = '',
  'aria-label': ariaLabel,
  id,
  ...rest
}: FormFieldProps): JSX.Element => {
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);

  /**
   * Generate unique ID if not provided
   */
  const fieldId = id || `form-field-${label.toLowerCase().replace(/\s+/g, '-')}`;
  const errorId = `${fieldId}-error`;
  const helperId = `${fieldId}-helper`;

  /**
   * Determine if label should be in "floating" (raised) position
   */
  const isFloating = isFocused || value.length > 0;

  /**
   * Handle input value change
   */
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    onChange(event.target.value);
  };

  /**
   * Handle focus state
   */
  const handleFocus = (): void => {
    setIsFocused(true);
  };

  /**
   * Handle blur state
   */
  const handleBlur = (): void => {
    setIsFocused(false);
  };

  /**
   * Combine CSS classes
   */
  const containerClasses = [
    styles.formField,
    error && styles['formField--error'],
    disabled && styles['formField--disabled'],
    isFocused && styles['formField--focused'],
    className
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={containerClasses}>
      {/* Input wrapper with border animations */}
      <div className={styles.formField__inputWrapper}>
        {/* Animated label */}
        <motion.label
          htmlFor={fieldId}
          className={styles.formField__label}
          animate={{
            y: isFloating ? -24 : 0,
            scale: isFloating ? 0.85 : 1,
            color: error
              ? '#EF4444'
              : isFocused
              ? 'rgba(29, 44, 73, 1)'
              : '#737373'
          }}
          transition={{
            duration: 0.15,
            ease: 'easeOut'
          }}
        >
          {label}
          {required && <span className={styles.formField__required} aria-label="required">*</span>}
        </motion.label>

        {/* Input field */}
        <input
          ref={inputRef}
          id={fieldId}
          type={type}
          value={value}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          disabled={disabled}
          placeholder={isFocused ? placeholder : ''}
          className={styles.formField__input}
          aria-label={ariaLabel || label}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={
            error ? errorId : helperText ? helperId : undefined
          }
          aria-required={required}
          {...rest}
        />

        {/* Animated border bottom - appears on focus */}
        <motion.div
          className={styles.formField__borderBottom}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: isFocused ? 1 : 0 }}
          transition={{
            duration: 0.3,
            ease: 'easeOut'
          }}
        />
      </div>

      {/* Error message with icon */}
      {error && (
        <motion.div
          className={styles.formField__error}
          id={errorId}
          role="alert"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
        >
          <svg
            className={styles.formField__errorIcon}
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              d="M8 1.5C4.41 1.5 1.5 4.41 1.5 8C1.5 11.59 4.41 14.5 8 14.5C11.59 14.5 14.5 11.59 14.5 8C14.5 4.41 11.59 1.5 8 1.5ZM8.75 11.25H7.25V9.75H8.75V11.25ZM8.75 8.25H7.25V4.75H8.75V8.25Z"
              fill="#EF4444"
            />
          </svg>
          <span>{error}</span>
        </motion.div>
      )}

      {/* Helper text (shown when no error) */}
      {!error && helperText && (
        <p className={styles.formField__helper} id={helperId}>
          {helperText}
        </p>
      )}
    </div>
  );
};
