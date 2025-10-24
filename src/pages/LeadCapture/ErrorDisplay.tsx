/**
 * ErrorDisplay Component
 * Displays field-specific validation errors
 * @module LeadCapture/ErrorDisplay
 */

import { motion } from 'framer-motion';
import type { FormErrors, FormTouched } from './types';
import styles from './ErrorDisplay.module.css';

/**
 * Props for ErrorDisplay component
 * @interface ErrorDisplayProps
 */
export interface ErrorDisplayProps {
  /** Form field errors */
  errors: FormErrors;
  /** Form field touched state */
  touched: FormTouched;
}

/**
 * Error icon SVG component
 * @returns {JSX.Element} Error icon
 */
const ErrorIcon = (): JSX.Element => (
  <svg
    className={styles.icon}
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path
      d="M10 2C5.58 2 2 5.58 2 10C2 14.42 5.58 18 10 18C14.42 18 18 14.42 18 10C18 5.58 14.42 2 10 2ZM11 14H9V12H11V14ZM11 10H9V6H11V10Z"
      fill="#EF4444"
    />
  </svg>
);

/**
 * ErrorDisplay Component
 *
 * @description Displays a summary of all validation errors in the form.
 * Only shows errors for fields that have been touched (blurred) by the user.
 * Includes proper ARIA attributes for screen reader accessibility.
 *
 * @param {ErrorDisplayProps} props - Component props
 * @returns {JSX.Element | null} Error display or null if no errors
 */
export const ErrorDisplay = ({
  errors,
  touched,
}: ErrorDisplayProps): JSX.Element | null => {
  // Get all active errors (touched fields with errors)
  const activeErrors: string[] = [];

  if (errors.name && touched.name) {
    activeErrors.push(errors.name);
  }
  if (errors.email && touched.email) {
    activeErrors.push(errors.email);
  }
  if (errors.phone && touched.phone) {
    activeErrors.push(errors.phone);
  }

  // Don't render if no active errors
  if (activeErrors.length === 0) {
    return null;
  }

  return (
    <motion.div
      className={styles.container}
      role="alert"
      aria-live="polite"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
    >
      <div className={styles.header}>
        <ErrorIcon />
        <h3 className={styles.title}>
          Please correct the following {activeErrors.length === 1 ? 'error' : 'errors'}:
        </h3>
      </div>
      <ul className={styles.list}>
        {activeErrors.map((error, index) => (
          <motion.li
            key={`error-${index}`}
            className={styles.item}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2, delay: index * 0.1 }}
          >
            {error}
          </motion.li>
        ))}
      </ul>
    </motion.div>
  );
};
