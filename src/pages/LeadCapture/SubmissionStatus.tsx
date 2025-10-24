/**
 * SubmissionStatus Component
 * Displays different submission states: idle, loading, success, error
 * @module LeadCapture/SubmissionStatus
 */

import { motion, AnimatePresence } from 'framer-motion';
import { LoadingSpinner } from '@components/common/LoadingSpinner';
import { Button } from '@components/common/Button';
import { SuccessAnimation } from './SuccessAnimation';
import type { SubmissionState } from './types';
import styles from './SubmissionStatus.module.css';

/**
 * Props for SubmissionStatus component
 * @interface SubmissionStatusProps
 */
export interface SubmissionStatusProps {
  /** Current submission state */
  state: SubmissionState;
  /** Custom message for success/error states */
  message?: string;
  /** Loading message */
  loadingMessage?: string;
  /** Success message */
  successMessage?: string;
  /** Error message */
  errorMessage?: string;
  /** Callback for retry action on error */
  onRetry?: () => void;
  /** Whether form can be submitted */
  canSubmit?: boolean;
  /** Submit button label */
  submitLabel?: string;
  /** Redirect time for success state (in seconds) */
  redirectTime?: number;
  /** Callback when success animation completes */
  onSuccessComplete?: () => void;
}

/**
 * SubmissionStatus Component
 *
 * @description Manages and displays different form submission states:
 * - idle: Shows submit button
 * - loading: Shows spinner with loading message
 * - success: Shows animated checkmark with success message
 * - error: Shows error message with retry button
 *
 * @param {SubmissionStatusProps} props - Component props
 * @returns {JSX.Element} Submission status display
 */
export const SubmissionStatus = ({
  state,
  loadingMessage = 'Scheduling your call...',
  successMessage = 'Success! Redirecting...',
  errorMessage = 'Something went wrong. Please try again.',
  onRetry,
  canSubmit = false,
  submitLabel = 'Schedule My Discovery Call',
  redirectTime = 2,
  onSuccessComplete,
}: SubmissionStatusProps): JSX.Element => {
  return (
    <div className={styles.container}>
      <AnimatePresence mode="wait">
        {/* Loading State */}
        {state === 'loading' && (
          <motion.div
            key="loading"
            className={styles.loadingContainer}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <LoadingSpinner size="large" label={loadingMessage} />
          </motion.div>
        )}

        {/* Success State */}
        {state === 'success' && (
          <motion.div
            key="success"
            className={styles.successContainer}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <SuccessAnimation
              message={successMessage}
              redirectTime={redirectTime}
              onComplete={onSuccessComplete}
            />
          </motion.div>
        )}

        {/* Error State */}
        {state === 'error' && (
          <motion.div
            key="error"
            className={styles.errorContainer}
            role="alert"
            aria-live="assertive"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className={styles.errorContent}>
              <svg
                className={styles.errorIcon}
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM13 17H11V15H13V17ZM13 13H11V7H13V13Z"
                  fill="#EF4444"
                />
              </svg>
              <p className={styles.errorText}>{errorMessage}</p>
            </div>
            {onRetry && (
              <Button
                type="button"
                variant="secondary"
                size="medium"
                onClick={onRetry}
                aria-label="Retry submission"
              >
                Try Again
              </Button>
            )}
          </motion.div>
        )}

        {/* Idle State - Submit Button */}
        {state === 'idle' && (
          <motion.div
            key="button"
            className={styles.buttonContainer}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Button
              type="submit"
              variant="primary"
              size="large"
              fullWidth
              disabled={!canSubmit}
              aria-label={submitLabel}
            >
              {submitLabel}
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
