/**
 * ContactFormInputs Component
 * Renders name, email, and phone input fields with validation
 * @module LeadCapture/ContactFormInputs
 */

import { motion, AnimatePresence } from 'framer-motion';
import type { FormValues, FormErrors, FormTouched, FormFieldName } from './types';
import styles from './ContactFormInputs.module.css';

/**
 * Props for ContactFormInputs component
 * @interface ContactFormInputsProps
 */
export interface ContactFormInputsProps {
  /** Current form values */
  values: FormValues;
  /** Form field errors */
  errors: FormErrors;
  /** Form field touched state */
  touched: FormTouched;
  /** Whether form is disabled (e.g., during submission) */
  disabled?: boolean;
  /** Handler for input value changes */
  onChange: (field: FormFieldName, value: string) => void;
  /** Handler for input blur events */
  onBlur: (field: FormFieldName) => void;
}

/**
 * Error icon SVG component
 * @returns {JSX.Element} Error icon
 */
const ErrorIcon = (): JSX.Element => (
  <svg
    className={styles.errorIcon}
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
);

/**
 * ContactFormInputs Component
 *
 * @description Renders form inputs for name, email, and phone with real-time
 * validation feedback and accessibility features. Input sanitization is handled
 * by the parent component to centralize security logic.
 *
 * @param {ContactFormInputsProps} props - Component props
 * @returns {JSX.Element} Contact form inputs
 */
export const ContactFormInputs = ({
  values,
  errors,
  touched,
  disabled = false,
  onChange,
  onBlur,
}: ContactFormInputsProps): JSX.Element => {
  /**
   * Handle input change
   * @param {FormFieldName} field - Field name
   * @param {string} value - Input value
   */
  const handleChange = (field: FormFieldName, value: string): void => {
    onChange(field, value);
  };

  return (
    <div className={styles.container}>
      {/* Name Field */}
      <div className={styles.formField}>
        <label htmlFor="name" className={styles.label}>
          Name <span className={styles.required} aria-label="required">*</span>
        </label>
        <input
          id="name"
          type="text"
          value={values.name}
          onChange={(e) => handleChange('name', e.target.value)}
          onBlur={() => onBlur('name')}
          className={`${styles.input} ${errors.name && touched.name ? styles.inputError : ''}`}
          placeholder="John Doe"
          aria-required="true"
          aria-invalid={errors.name && touched.name ? 'true' : 'false'}
          aria-describedby={errors.name && touched.name ? 'name-error' : undefined}
          disabled={disabled}
          maxLength={100}
          autoComplete="name"
        />
        <AnimatePresence>
          {errors.name && touched.name && (
            <motion.div
              id="name-error"
              className={styles.errorMessage}
              role="alert"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <ErrorIcon />
              {errors.name}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Email Field */}
      <div className={styles.formField}>
        <label htmlFor="email" className={styles.label}>
          Email <span className={styles.required} aria-label="required">*</span>
        </label>
        <input
          id="email"
          type="email"
          value={values.email}
          onChange={(e) => handleChange('email', e.target.value)}
          onBlur={() => onBlur('email')}
          className={`${styles.input} ${errors.email && touched.email ? styles.inputError : ''}`}
          placeholder="john@example.com"
          aria-required="true"
          aria-invalid={errors.email && touched.email ? 'true' : 'false'}
          aria-describedby={errors.email && touched.email ? 'email-error' : undefined}
          disabled={disabled}
          autoComplete="email"
        />
        <AnimatePresence>
          {errors.email && touched.email && (
            <motion.div
              id="email-error"
              className={styles.errorMessage}
              role="alert"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <ErrorIcon />
              {errors.email}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Phone Field */}
      <div className={styles.formField}>
        <label htmlFor="phone" className={styles.label}>
          Phone <span className={styles.required} aria-label="required">*</span>
        </label>
        <input
          id="phone"
          type="tel"
          value={values.phone}
          onChange={(e) => handleChange('phone', e.target.value)}
          onBlur={() => onBlur('phone')}
          className={`${styles.input} ${errors.phone && touched.phone ? styles.inputError : ''}`}
          placeholder="(555) 123-4567"
          aria-required="true"
          aria-invalid={errors.phone && touched.phone ? 'true' : 'false'}
          aria-describedby={errors.phone && touched.phone ? 'phone-error' : undefined}
          disabled={disabled}
          autoComplete="tel"
        />
        <AnimatePresence>
          {errors.phone && touched.phone && (
            <motion.div
              id="phone-error"
              className={styles.errorMessage}
              role="alert"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <ErrorIcon />
              {errors.phone}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
