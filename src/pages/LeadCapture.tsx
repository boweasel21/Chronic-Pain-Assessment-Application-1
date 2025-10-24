/**
 * Page 13: Lead Capture
 * Contact information form with validation and API submission
 */

import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAssessment } from '@context/AssessmentContext';
import { Button } from '@components/common/Button';
import { LoadingSpinner } from '@components/common/LoadingSpinner';
import { submitAssessment, AssessmentData } from '../../utils/api';
import styles from './LeadCapture.module.css';

/**
 * RFC 5322 compliant email validation regex
 */
const RFC5322_EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

/**
 * Phone validation regex - minimum 10 digits
 */
const PHONE_REGEX = /^\d{10,}$/;

/**
 * Name validation regex - letters, spaces, hyphens, apostrophes only
 */
const NAME_REGEX = /^[a-zA-Z\s-']+$/;

/**
 * Form field errors interface
 */
interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
}

/**
 * Form submission states
 */
type SubmissionState = 'idle' | 'loading' | 'success' | 'error';

/**
 * LeadCapture Page Component
 *
 * @description Final conversion page capturing contact information.
 * Features real-time validation, localStorage auto-save, loading states,
 * success animation, and API submission. Routes to final video page on success.
 *
 * @returns {JSX.Element} Lead capture page
 */
const LeadCapture = (): JSX.Element => {
  const navigate = useNavigate();
  const { state, updateResponse } = useAssessment();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState({
    name: false,
    email: false,
    phone: false,
  });
  const [submissionState, setSubmissionState] = useState<SubmissionState>('idle');

  /**
   * Load saved contact info from localStorage on mount
   */
  useEffect(() => {
    const saved = localStorage.getItem('assessment_contact_info');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        setName(data.name || '');
        setEmail(data.email || '');
        setPhone(data.phone || '');
      } catch (error) {
        // Silent fail - invalid JSON
      }
    }

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  /**
   * Auto-save to localStorage with debounce
   */
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const data = { name, email, phone };
      localStorage.setItem('assessment_contact_info', JSON.stringify(data));
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [name, email, phone]);

  /**
   * Validate name field
   * @param value - Name value to validate
   * @returns Error message or empty string
   */
  const validateName = useCallback((value: string): string => {
    if (!value.trim()) {
      return 'Please enter your name';
    }
    if (value.trim().length > 100) {
      return 'Name must be 100 characters or less';
    }
    if (!NAME_REGEX.test(value.trim())) {
      return 'Name can only contain letters, spaces, hyphens, and apostrophes';
    }
    return '';
  }, []);

  /**
   * Validate email field
   * @param value - Email value to validate
   * @returns Error message or empty string
   */
  const validateEmail = useCallback((value: string): string => {
    if (!value.trim()) {
      return 'Please enter your email address';
    }
    if (!RFC5322_EMAIL_REGEX.test(value.trim())) {
      return 'Please enter a valid email address';
    }
    return '';
  }, []);

  /**
   * Validate phone field
   * @param value - Phone value to validate
   * @returns Error message or empty string
   */
  const validatePhone = useCallback((value: string): string => {
    const digitsOnly = value.replace(/\D/g, '');
    if (!digitsOnly) {
      return 'Please enter your phone number';
    }
    if (!PHONE_REGEX.test(digitsOnly)) {
      return 'Please enter a valid phone number (at least 10 digits)';
    }
    return '';
  }, []);

  /**
   * Validate all fields
   * @returns True if form is valid
   */
  const validateForm = useCallback((): boolean => {
    const newErrors: FormErrors = {
      name: validateName(name),
      email: validateEmail(email),
      phone: validatePhone(phone),
    };

    setErrors(newErrors);
    return !newErrors.name && !newErrors.email && !newErrors.phone;
  }, [name, email, phone, validateName, validateEmail, validatePhone]);

  /**
   * Handle name input change
   */
  const handleNameChange = useCallback((e: React.ChangeEvent<HTMLInputElement>): void => {
    const value = e.target.value;
    setName(value);

    if (touched.name) {
      const error = validateName(value);
      setErrors((prev) => ({ ...prev, name: error }));
    }
  }, [touched.name, validateName]);

  /**
   * Handle email input change
   */
  const handleEmailChange = useCallback((e: React.ChangeEvent<HTMLInputElement>): void => {
    const value = e.target.value;
    setEmail(value);

    if (touched.email) {
      const error = validateEmail(value);
      setErrors((prev) => ({ ...prev, email: error }));
    }
  }, [touched.email, validateEmail]);

  /**
   * Handle phone input change
   */
  const handlePhoneChange = useCallback((e: React.ChangeEvent<HTMLInputElement>): void => {
    const value = e.target.value;
    setPhone(value);

    if (touched.phone) {
      const error = validatePhone(value);
      setErrors((prev) => ({ ...prev, phone: error }));
    }
  }, [touched.phone, validatePhone]);

  /**
   * Handle field blur - mark as touched and validate
   */
  const handleBlur = useCallback((field: 'name' | 'email' | 'phone'): void => {
    setTouched((prev) => ({ ...prev, [field]: true }));

    // Validate on blur
    let error = '';
    if (field === 'name') error = validateName(name);
    if (field === 'email') error = validateEmail(email);
    if (field === 'phone') error = validatePhone(phone);

    setErrors((prev) => ({ ...prev, [field]: error }));
  }, [name, email, phone, validateName, validateEmail, validatePhone]);

  /**
   * Build assessment data from context and form
   * @returns Complete assessment data for API submission
   */
  const buildAssessmentData = useCallback((): AssessmentData => {
    // Load data from localStorage
    let conditions: string[] = [];
    let sensations: string[] = [];
    let previousTreatments: string[] = [];

    try {
      const savedConditions = localStorage.getItem('selected_conditions');
      if (savedConditions) conditions = JSON.parse(savedConditions);
    } catch (error) {
      // Silent fail
    }

    try {
      const savedSensations = localStorage.getItem('selected_sensations');
      if (savedSensations) sensations = JSON.parse(savedSensations);
    } catch (error) {
      // Silent fail
    }

    try {
      const savedTreatments = localStorage.getItem('assessment_treatment_history');
      if (savedTreatments) {
        const data = JSON.parse(savedTreatments);
        previousTreatments = data.selectedTreatments || [];
      }
    } catch (error) {
      // Silent fail
    }

    return {
      conditions: conditions.length > 0 ? conditions : [],
      sensations: sensations.length > 0 ? sensations : [],
      duration: undefined,
      intensity: state.response.painLevel || undefined,
      previousTreatments: previousTreatments.length > 0 ? previousTreatments : [],
      hasBudget: state.response.budgetLevel ? true : undefined,
      budgetRange: state.response.budgetLevel || undefined,
      urgency: state.response.urgencyLevel || undefined,
      activityImpact: state.response.dailyImpact || undefined,
      goals: state.response.additionalInfo || undefined,
      name: name.trim(),
      email: email.trim(),
      phone: phone.replace(/\D/g, ''),
      completedAt: new Date().toISOString(),
    };
  }, [state.response, name, email, phone]);

  /**
   * Handle form submission
   */
  const handleSubmit = useCallback(async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();

    // Mark all fields as touched
    setTouched({ name: true, email: true, phone: true });

    // Validate form
    if (!validateForm()) {
      // Announce errors to screen readers
      const errorMessage = Object.values(errors).filter(Boolean).join(', ');
      if (errorMessage) {
        const announcement = document.createElement('div');
        announcement.setAttribute('role', 'alert');
        announcement.setAttribute('aria-live', 'assertive');
        announcement.className = 'sr-only';
        announcement.textContent = `Form errors: ${errorMessage}`;
        document.body.appendChild(announcement);
        setTimeout(() => document.body.removeChild(announcement), 3000);
      }
      return;
    }

    // Update context with contact info
    updateResponse({
      completedAt: new Date().toISOString(),
    });

    // Set loading state
    setSubmissionState('loading');

    try {
      // Build assessment data
      const assessmentData = buildAssessmentData();

      // Submit to API
      const response = await submitAssessment(assessmentData);

      if (response.success) {
        // Success state with animation
        setSubmissionState('success');

        // Navigate after animation
        setTimeout(() => {
          navigate('/final-video');
        }, 2000);
      } else {
        // Error state
        setSubmissionState('error');

        // Reset after delay
        setTimeout(() => {
          setSubmissionState('idle');
        }, 3000);
      }
    } catch (error) {
      setSubmissionState('error');

      // Reset after delay
      setTimeout(() => {
        setSubmissionState('idle');
      }, 3000);
    }
  }, [validateForm, errors, updateResponse, buildAssessmentData, navigate]);

  /**
   * Check if form can be submitted
   */
  const canSubmit = name.trim() && email.trim() && phone.trim() && !errors.name && !errors.email && !errors.phone;

  return (
    <div className={styles.container}>
      <motion.div
        className={styles.content}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <motion.div
          className={styles.header}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <h1 className={styles.headline}>You're Almost There!</h1>
          <p className={styles.subtext}>Let's Schedule Your Discovery Call</p>
        </motion.div>

        {/* Introduction */}
        <motion.p
          className={styles.introduction}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          To get started with your personalized Cellular Repair plan, we just need a bit of info
        </motion.p>

        {/* Form */}
        <motion.form
          className={styles.form}
          onSubmit={handleSubmit}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          noValidate
        >
          {/* Name Field */}
          <div className={styles.formField}>
            <label htmlFor="name" className={styles.label}>
              Name <span className={styles.required} aria-label="required">*</span>
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={handleNameChange}
              onBlur={() => handleBlur('name')}
              className={`${styles.input} ${errors.name && touched.name ? styles.inputError : ''}`}
              placeholder="John Doe"
              aria-required="true"
              aria-invalid={errors.name && touched.name ? 'true' : 'false'}
              aria-describedby={errors.name && touched.name ? 'name-error' : undefined}
              disabled={submissionState === 'loading'}
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
              value={email}
              onChange={handleEmailChange}
              onBlur={() => handleBlur('email')}
              className={`${styles.input} ${errors.email && touched.email ? styles.inputError : ''}`}
              placeholder="john@example.com"
              aria-required="true"
              aria-invalid={errors.email && touched.email ? 'true' : 'false'}
              aria-describedby={errors.email && touched.email ? 'email-error' : undefined}
              disabled={submissionState === 'loading'}
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
              value={phone}
              onChange={handlePhoneChange}
              onBlur={() => handleBlur('phone')}
              className={`${styles.input} ${errors.phone && touched.phone ? styles.inputError : ''}`}
              placeholder="(555) 123-4567"
              aria-required="true"
              aria-invalid={errors.phone && touched.phone ? 'true' : 'false'}
              aria-describedby={errors.phone && touched.phone ? 'phone-error' : undefined}
              disabled={submissionState === 'loading'}
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
                  {errors.phone}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Privacy Notice */}
          <motion.div
            className={styles.privacyNotice}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <svg
              className={styles.lockIcon}
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                d="M10 2C7.79086 2 6 3.79086 6 6V8H5C3.89543 8 3 8.89543 3 10V16C3 17.1046 3.89543 18 5 18H15C16.1046 18 17 17.1046 17 16V10C17 8.89543 16.1046 8 15 8H14V6C14 3.79086 12.2091 2 10 2ZM12 8V6C12 4.89543 11.1046 4 10 4C8.89543 4 8 4.89543 8 6V8H12Z"
                fill="currentColor"
              />
            </svg>
            <p className={styles.privacyText}>
              We respect your privacy. Your information is secure.{' '}
              <a href="/privacy" className={styles.privacyLink} target="_blank" rel="noopener noreferrer">
                Privacy Policy
              </a>
            </p>
          </motion.div>

          {/* Submit Button */}
          <div className={styles.submitSection}>
            <AnimatePresence mode="wait">
              {submissionState === 'loading' && (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className={styles.loadingContainer}
                >
                  <LoadingSpinner size="large" label="Scheduling your call..." />
                </motion.div>
              )}

              {submissionState === 'success' && (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className={styles.successContainer}
                >
                  <motion.svg
                    className={styles.successIcon}
                    width="64"
                    height="64"
                    viewBox="0 0 64 64"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.8, ease: 'easeInOut' }}
                  >
                    <circle
                      cx="32"
                      cy="32"
                      r="28"
                      stroke="#10B981"
                      strokeWidth="4"
                      fill="none"
                    />
                    <motion.path
                      d="M20 32L28 40L44 24"
                      stroke="#10B981"
                      strokeWidth="4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      fill="none"
                    />
                  </motion.svg>
                  <p className={styles.successText}>Success! Redirecting...</p>
                </motion.div>
              )}

              {submissionState === 'error' && (
                <motion.div
                  key="error"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className={styles.errorContainer}
                  role="alert"
                >
                  <p className={styles.errorText}>
                    Something went wrong. Please try again.
                  </p>
                </motion.div>
              )}

              {submissionState === 'idle' && (
                <motion.div
                  key="button"
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
                    aria-label="Schedule my discovery call"
                  >
                    Schedule My Discovery Call
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.form>
      </motion.div>
    </div>
  );
};

export default LeadCapture;
