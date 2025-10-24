/**
 * SuccessAnimation Component
 * Animated checkmark with success message and redirect countdown
 * @module LeadCapture/SuccessAnimation
 */

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import styles from './SuccessAnimation.module.css';

/**
 * Props for SuccessAnimation component
 * @interface SuccessAnimationProps
 */
export interface SuccessAnimationProps {
  /** Success message to display */
  message?: string;
  /** Time in seconds before redirect (default: 2) */
  redirectTime?: number;
  /** Callback when countdown completes */
  onComplete?: () => void;
}

/**
 * SuccessAnimation Component
 *
 * @description Displays an animated checkmark icon with a success message
 * and optional countdown timer. The checkmark animates with a drawing effect,
 * and the countdown shows the time remaining before redirect.
 *
 * @param {SuccessAnimationProps} props - Component props
 * @returns {JSX.Element} Success animation
 */
export const SuccessAnimation = ({
  message = 'Success! Redirecting...',
  redirectTime = 2,
  onComplete,
}: SuccessAnimationProps): JSX.Element => {
  const [countdown, setCountdown] = useState(redirectTime);

  /**
   * Countdown effect
   */
  useEffect(() => {
    if (countdown <= 0) {
      onComplete?.();
      return;
    }

    const timer = setTimeout(() => {
      setCountdown(countdown - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [countdown, onComplete]);

  return (
    <motion.div
      className={styles.container}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      role="status"
      aria-live="polite"
    >
      {/* Checkmark Icon */}
      <motion.svg
        className={styles.icon}
        width="64"
        height="64"
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        {/* Circle */}
        <motion.circle
          cx="32"
          cy="32"
          r="28"
          stroke="#10B981"
          strokeWidth="4"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
        />
        {/* Checkmark */}
        <motion.path
          d="M20 32L28 40L44 24"
          stroke="#10B981"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.4, delay: 0.4, ease: 'easeInOut' }}
        />
      </motion.svg>

      {/* Success Message */}
      <motion.p
        className={styles.message}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.6 }}
      >
        {message}
      </motion.p>

      {/* Countdown */}
      {redirectTime > 0 && countdown > 0 && (
        <motion.p
          className={styles.countdown}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.8 }}
          aria-label={`Redirecting in ${countdown} ${countdown === 1 ? 'second' : 'seconds'}`}
        >
          Redirecting in {countdown}...
        </motion.p>
      )}
    </motion.div>
  );
};
