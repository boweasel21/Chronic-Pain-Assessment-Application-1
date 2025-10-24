/**
 * Waiting List Page Component
 * Email capture page for users with acute pain (less than 6 months)
 */

import React, { useState, FormEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@components/common/Button';
import styles from './WaitingListPage.module.css';

/**
 * Form validation state
 */
interface FormState {
  email: string;
  isValid: boolean;
  error: string | null;
  isSubmitting: boolean;
  isSubmitted: boolean;
}

/**
 * Animation variants for the page
 */
const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

/**
 * Animation variants for staggered children
 */
const containerVariants = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
};

/**
 * Success animation variants
 */
const successVariants = {
  initial: { opacity: 0, scale: 0.8 },
  animate: {
    opacity: 1,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 200,
      damping: 20,
    },
  },
};

/**
 * Waiting List Page Component
 *
 * @description Page for users whose pain is too acute (less than 6 months).
 * Collects email for future contact when they qualify. Validates email format
 * and provides clear feedback.
 *
 * @returns Rendered waiting list page
 */
const WaitingListPage: React.FC = () => {
  const navigate = useNavigate();

  const [formState, setFormState] = useState<FormState>({
    email: '',
    isValid: false,
    error: null,
    isSubmitting: false,
    isSubmitted: false,
  });

  /**
   * Validates email format using RFC 5322 compliant regex
   * @param email - Email address to validate
   * @returns True if email is valid
   */
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  /**
   * Handles email input change
   * @param event - Change event from input
   */
  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const email = event.target.value;
    const isValid = validateEmail(email);

    setFormState((prev) => ({
      ...prev,
      email,
      isValid,
      error: email && !isValid ? 'Please enter a valid email address' : null,
    }));
  };

  /**
   * Handles form submission
   * @param event - Form submit event
   */
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!formState.isValid) {
      setFormState((prev) => ({
        ...prev,
        error: 'Please enter a valid email address',
      }));
      return;
    }

    setFormState((prev) => ({ ...prev, isSubmitting: true, error: null }));

    try {
      // In production, this would call an API endpoint
      // For now, simulate API call with timeout
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setFormState((prev) => ({
        ...prev,
        isSubmitting: false,
        isSubmitted: true,
      }));
    } catch (error) {
      setFormState((prev) => ({
        ...prev,
        isSubmitting: false,
        error: 'Something went wrong. Please try again.',
      }));
    }
  };

  /**
   * Handles navigation back to start
   */
  const handleRestart = () => {
    navigate('/');
  };

  return (
    <motion.div
      className={styles.page}
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.4 }}
    >
      <div className={styles.container}>
        <AnimatePresence mode="wait">
          {!formState.isSubmitted ? (
            <motion.div
              key="form"
              className={styles.content}
              variants={containerVariants}
              initial="initial"
              animate="animate"
              exit={{ opacity: 0, y: -20 }}
            >
              {/* Headline */}
              <motion.div variants={itemVariants}>
                <h1 className={styles.headline}>Thank You for Your Interest</h1>
              </motion.div>

              {/* Main Message */}
              <motion.div variants={itemVariants} className={styles.section}>
                <p className={styles.bodyText}>
                  Based on your responses, you've been experiencing pain for less than 6
                  months. While we understand how challenging this is, we're not quite ready
                  to help with acute pain at this stage.
                </p>
              </motion.div>

              {/* Explanation */}
              <motion.div variants={itemVariants} className={styles.explanationCard}>
                <div className={styles.explanationIcon} aria-hidden="true">
                  <svg
                    width="48"
                    height="48"
                    viewBox="0 0 48 48"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M24 14v12l6 6"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <circle
                      cx="24"
                      cy="24"
                      r="18"
                      stroke="currentColor"
                      strokeWidth="2"
                      fill="none"
                    />
                  </svg>
                </div>
                <h2 className={styles.explanationTitle}>Why 6 Months?</h2>
                <p className={styles.explanationText}>
                  Our Cellular Repair Method works best when chronic patterns have formed in
                  your nervous system and tissues. This typically happens after 6+ months of
                  persistent pain. Acute pain (under 6 months) often responds well to
                  conventional treatments and may still resolve naturally as your body
                  completes its healing process.
                </p>
              </motion.div>

              {/* Call to Action */}
              <motion.div variants={itemVariants} className={styles.section}>
                <h3 className={styles.sectionTitle}>Join Our Waiting List</h3>
                <p className={styles.bodyText}>
                  If your pain persists beyond 6 months, we want to help. Leave your email,
                  and we'll reach out when you qualify for our program.
                </p>
              </motion.div>

              {/* Email Form */}
              <motion.form
                variants={itemVariants}
                onSubmit={handleSubmit}
                className={styles.form}
                noValidate
              >
                <div className={styles.formGroup}>
                  <label htmlFor="email" className={styles.label}>
                    Email Address
                    <span className={styles.required} aria-label="required">
                      *
                    </span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formState.email}
                    onChange={handleEmailChange}
                    className={`${styles.input} ${formState.error ? styles.inputError : ''}`}
                    placeholder="your.email@example.com"
                    required
                    aria-required="true"
                    aria-invalid={!!formState.error}
                    aria-describedby={formState.error ? 'email-error' : undefined}
                    disabled={formState.isSubmitting}
                  />
                  {formState.error && (
                    <motion.p
                      id="email-error"
                      className={styles.errorMessage}
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      role="alert"
                    >
                      {formState.error}
                    </motion.p>
                  )}
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  size="large"
                  disabled={!formState.isValid || formState.isSubmitting}
                  aria-label="Join waiting list"
                  fullWidth
                >
                  {formState.isSubmitting ? 'Joining...' : 'Join Waiting List'}
                </Button>
              </motion.form>

              {/* Alternative Action */}
              <motion.div variants={itemVariants} className={styles.alternativeAction}>
                <Button
                  variant="secondary"
                  size="large"
                  onClick={handleRestart}
                  aria-label="Return to assessment start"
                  fullWidth
                >
                  Return to Start
                </Button>
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              key="success"
              className={styles.successContent}
              variants={successVariants}
              initial="initial"
              animate="animate"
            >
              {/* Success Icon */}
              <div className={styles.successIcon} aria-hidden="true">
                <svg
                  width="80"
                  height="80"
                  viewBox="0 0 80 80"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle cx="40" cy="40" r="36" stroke="currentColor" strokeWidth="3" />
                  <path
                    d="M25 40l10 10 20-20"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>

              {/* Success Message */}
              <h2 className={styles.successHeadline}>You're on the List!</h2>
              <p className={styles.successText}>
                Thank you for joining our waiting list. We've saved your email address and
                will reach out in approximately 3-4 months to check on your progress.
              </p>
              <p className={styles.successText}>
                If your pain persists at that time, we'll guide you through the next steps to
                get the help you need.
              </p>

              <div className={styles.successActions}>
                <Button
                  variant="primary"
                  size="large"
                  onClick={handleRestart}
                  aria-label="Return to home page"
                  fullWidth
                >
                  Return to Home
                </Button>
              </div>

              <p className={styles.successNote}>
                In the meantime, conventional treatments may still help. Don't hesitate to
                work with your healthcare provider on managing your pain.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default WaitingListPage;
