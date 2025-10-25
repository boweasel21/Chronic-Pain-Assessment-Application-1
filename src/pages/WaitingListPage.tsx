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
interface FormData {
  name: string;
  email: string;
  phone: string;
  sixMonthDate: string;
}

type FormErrors = Partial<Record<keyof FormData, string>>;

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

  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    sixMonthDate: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitState, setSubmitState] = useState({
    isSubmitting: false,
    isSubmitted: false,
    submissionError: null as string | null,
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
   * Handles field changes and clears existing errors
   */
  const handleFieldChange =
    (field: keyof FormData) => (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;

      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));

      setErrors((prev) => ({
        ...prev,
        [field]: undefined,
      }));
    };

  /**
   * Validates form data and returns field errors
   */
  const validateForm = (): FormErrors => {
    const fieldErrors: FormErrors = {};

    if (!formData.name.trim()) {
      fieldErrors.name = 'Please enter your name.';
    }

    if (!formData.email.trim() || !validateEmail(formData.email)) {
      fieldErrors.email = 'Please enter a valid email address.';
    }

    if (!formData.phone.trim()) {
      fieldErrors.phone = 'Please enter your phone number.';
    }

    if (!formData.sixMonthDate) {
      fieldErrors.sixMonthDate =
        'Please tell us when it will be 6 months since your injury or surgery.';
    }

    return fieldErrors;
  };

  /**
   * Handles form submission
   * @param event - Form submit event
   */
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setSubmitState({
      isSubmitting: true,
      isSubmitted: false,
      submissionError: null,
    });

    try {
      // In production, this would call an API endpoint
      // For now, simulate API call with timeout
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setErrors({});
      setSubmitState({
        isSubmitting: false,
        isSubmitted: true,
        submissionError: null,
      });
    } catch (error) {
      setSubmitState({
        isSubmitting: false,
        isSubmitted: false,
        submissionError: 'Something went wrong. Please try again.',
      });
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
          {!submitState.isSubmitted ? (
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
                <h1 className={styles.headline}>
                  If you’d like to be put on our waiting list, we can contact you once your chronic pain has been bothering you for a total of 6 months.
                </h1>
              </motion.div>

              {/* Main Message */}
              <motion.div variants={itemVariants} className={styles.section}>
                <p className={styles.bodyText}>
                  Please let us know below when it will be 6 months since your injury or surgery, and give us your name, email address, and number, and we’ll text you and let you know we emailed you with a link to this assessment. Thank you.
                </p>
              </motion.div>

              {/* Submission Error */}
              {submitState.submissionError && (
                <motion.div
                  variants={itemVariants}
                  className={styles.errorBanner}
                  role="alert"
                  aria-live="assertive"
                >
                  {submitState.submissionError}
                </motion.div>
              )}

              {/* Waiting List Form */}
              <motion.form
                variants={itemVariants}
                onSubmit={handleSubmit}
                className={styles.form}
                noValidate
              >
                <div className={styles.formGroup}>
                  <label htmlFor="six-month-date" className={styles.label}>
                    When will it be 6 months since your injury or surgery?
                    <span className={styles.required} aria-label="required">
                      *
                    </span>
                  </label>
                  <input
                    id="six-month-date"
                    name="six-month-date"
                    type="date"
                    className={`${styles.input} ${
                      errors.sixMonthDate ? styles.inputError : ''
                    }`}
                    value={formData.sixMonthDate}
                    onChange={handleFieldChange('sixMonthDate')}
                    disabled={submitState.isSubmitting}
                    required
                  />
                  {errors.sixMonthDate && (
                    <p className={styles.errorMessage} role="alert">
                      {errors.sixMonthDate}
                    </p>
                  )}
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="name" className={styles.label}>
                    Name
                    <span className={styles.required} aria-label="required">
                      *
                    </span>
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    className={`${styles.input} ${errors.name ? styles.inputError : ''}`}
                    value={formData.name}
                    onChange={handleFieldChange('name')}
                    placeholder="First and last name"
                    disabled={submitState.isSubmitting}
                    autoComplete="name"
                    required
                  />
                  {errors.name && (
                    <p className={styles.errorMessage} role="alert">
                      {errors.name}
                    </p>
                  )}
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="email" className={styles.label}>
                    Email address
                    <span className={styles.required} aria-label="required">
                      *
                    </span>
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    className={`${styles.input} ${errors.email ? styles.inputError : ''}`}
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={handleFieldChange('email')}
                    autoComplete="email"
                    disabled={submitState.isSubmitting}
                    required
                  />
                  {errors.email && (
                    <p id="email-error" className={styles.errorMessage} role="alert">
                      {errors.email}
                    </p>
                  )}
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="phone" className={styles.label}>
                    Phone number
                    <span className={styles.required} aria-label="required">
                      *
                    </span>
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    className={`${styles.input} ${errors.phone ? styles.inputError : ''}`}
                    placeholder="We’ll text you when it’s time"
                    value={formData.phone}
                    onChange={handleFieldChange('phone')}
                    autoComplete="tel"
                    disabled={submitState.isSubmitting}
                    required
                  />
                  {errors.phone && (
                    <p className={styles.errorMessage} role="alert">
                      {errors.phone}
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  size="large"
                  disabled={submitState.isSubmitting}
                  aria-label="Submit waiting list details"
                  fullWidth
                >
                  {/* Proposed copy: Submit waiting list details */}
                  {submitState.isSubmitting ? 'Submitting…' : 'Submit'}
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
                  {/* Proposed copy: Return to the assessment start */}
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
              <h2 className={styles.successHeadline}>
                {/* Proposed copy: Confirmation heading for waiting list */}
                You’re on the waiting list.
              </h2>
              <p className={styles.successText}>
                We’ll text you and let you know we emailed you with a link to this assessment once you reach your 6-month mark.
              </p>

              <div className={styles.successActions}>
                <Button
                  variant="primary"
                  size="large"
                  onClick={handleRestart}
                  aria-label="Return to home page"
                  fullWidth
                >
                  {/* Proposed copy: Return to assessment start after confirmation */}
                  Return to Home
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default WaitingListPage;
