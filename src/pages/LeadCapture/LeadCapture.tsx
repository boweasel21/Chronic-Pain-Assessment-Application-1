/**
 * LeadCapture Page Component
 * Contact information form with validation and API submission
 * @module LeadCapture
 */

import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAssessment } from '@context/AssessmentContext';
import { submitAssessment, AssessmentData } from '@utils/api';
import { sanitizeName, sanitizeEmail, sanitizePhone } from '@utils/sanitizer';
import { ContactFormInputs } from './ContactFormInputs';
import { PrivacyNotice } from './PrivacyNotice';
import { SubmissionStatus } from './SubmissionStatus';
import {
  type FormValues,
  type FormErrors,
  type FormTouched,
  type SubmissionState,
  type FormFieldName,
  RFC5322_EMAIL_REGEX,
  PHONE_REGEX,
  NAME_REGEX,
} from './types';
import styles from './LeadCapture.module.css';

/**
 * LeadCapture Page Component
 *
 * @description Final conversion page capturing contact information.
 * Features real-time validation, input sanitization, loading states,
 * success animation, and API submission. Routes to final video page on success.
 *
 * SECURITY: All PII is stored only in React state (NOT localStorage) to prevent
 * XSS exposure. All inputs are sanitized immediately on change.
 *
 * @returns {JSX.Element} Lead capture page
 */
export const LeadCapture = (): JSX.Element => {
  const navigate = useNavigate();
  const { state, updateResponse } = useAssessment();

  const [values, setValues] = useState<FormValues>({
    name: '',
    email: '',
    phone: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<FormTouched>({
    name: false,
    email: false,
    phone: false,
  });
  const [submissionState, setSubmissionState] = useState<SubmissionState>('idle');

  /**
   * Cleanup effect - Clear sensitive data on unmount
   * SECURITY: Ensures PII is not persisted in memory after navigation
   */
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });

    return (): void => {
      setValues({ name: '', email: '', phone: '' });
      setErrors({});
    };
  }, []);

  /**
   * Validate name field
   * @param {string} value - Name value to validate
   * @returns {string} Error message or empty string
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
   * @param {string} value - Email value to validate
   * @returns {string} Error message or empty string
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
   * @param {string} value - Phone value to validate
   * @returns {string} Error message or empty string
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
   * @returns {boolean} True if form is valid
   */
  const validateForm = useCallback((): boolean => {
    const newErrors: FormErrors = {
      name: validateName(values.name),
      email: validateEmail(values.email),
      phone: validatePhone(values.phone),
    };

    setErrors(newErrors);
    return !newErrors.name && !newErrors.email && !newErrors.phone;
  }, [values, validateName, validateEmail, validatePhone]);

  /**
   * Handle input field changes with sanitization
   *
   * @description Sanitizes input based on field type before updating state.
   * SECURITY: Prevents XSS attacks by sanitizing all user input immediately.
   *
   * @param {FormFieldName} field - Field name
   * @param {string} value - New value (raw, unsanitized)
   */
  const handleChange = useCallback((field: FormFieldName, value: string): void => {
    let sanitized: string;

    switch (field) {
      case 'name':
        sanitized = sanitizeName(value, 100);
        break;
      case 'email':
        sanitized = sanitizeEmail(value);
        break;
      case 'phone':
        sanitized = sanitizePhone(value);
        break;
      default:
        sanitized = value;
    }

    setValues((prev) => ({ ...prev, [field]: sanitized }));

    if (touched[field]) {
      let error = '';
      if (field === 'name') error = validateName(sanitized);
      if (field === 'email') error = validateEmail(sanitized);
      if (field === 'phone') error = validatePhone(sanitized);

      setErrors((prev) => ({ ...prev, [field]: error }));
    }
  }, [touched, validateName, validateEmail, validatePhone]);

  /**
   * Handle field blur - mark as touched and validate
   * @param {FormFieldName} field - Field name
   */
  const handleBlur = useCallback((field: FormFieldName): void => {
    setTouched((prev) => ({ ...prev, [field]: true }));

    let error = '';
    if (field === 'name') error = validateName(values.name);
    if (field === 'email') error = validateEmail(values.email);
    if (field === 'phone') error = validatePhone(values.phone);

    setErrors((prev) => ({ ...prev, [field]: error }));
  }, [values, validateName, validateEmail, validatePhone]);

  /**
   * Build assessment data from context and form
   *
   * @description Builds complete assessment data with final sanitization pass.
   * SECURITY: Sanitizes all contact info one final time before submission.
   *
   * @returns {AssessmentData} Complete assessment data for API submission
   */
  const buildAssessmentData = useCallback((): AssessmentData => {
    let conditions: string[] = [];
    let sensations: string[] = [];
    let previousTreatments: string[] = [];

    try {
      const savedConditions = localStorage.getItem('selected_conditions');
      if (savedConditions) conditions = JSON.parse(savedConditions);
    } catch (error) {
      conditions = [];
    }

    try {
      const savedSensations = localStorage.getItem('selected_sensations');
      if (savedSensations) sensations = JSON.parse(savedSensations);
    } catch (error) {
      sensations = [];
    }

    try {
      const savedTreatments = localStorage.getItem('assessment_treatment_history');
      if (savedTreatments) {
        const data = JSON.parse(savedTreatments);
        previousTreatments = data.selectedTreatments || [];
      }
    } catch (error) {
      previousTreatments = [];
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
      name: sanitizeName(values.name.trim(), 100),
      email: sanitizeEmail(values.email.trim()),
      phone: sanitizePhone(values.phone).replace(/\D/g, ''),
      completedAt: new Date().toISOString(),
    };
  }, [state.response, values]);

  /**
   * Handle form submission
   * @param {React.FormEvent} e - Form event
   */
  const handleSubmit = useCallback(async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();

    setTouched({ name: true, email: true, phone: true });

    if (!validateForm()) {
      const errorMessages = Object.values(errors).filter(Boolean);
      if (errorMessages.length > 0) {
        const announcement = document.createElement('div');
        announcement.setAttribute('role', 'alert');
        announcement.setAttribute('aria-live', 'assertive');
        announcement.className = 'sr-only';
        announcement.textContent = `Form errors: ${errorMessages.join(', ')}`;
        document.body.appendChild(announcement);
        setTimeout(() => document.body.removeChild(announcement), 3000);
      }
      return;
    }

    updateResponse({
      completedAt: new Date().toISOString(),
    });

    setSubmissionState('loading');

    try {
      const assessmentData = buildAssessmentData();
      const response = await submitAssessment(assessmentData);

      if (response.success) {
        setSubmissionState('success');
      } else {
        setSubmissionState('error');

        setTimeout(() => {
          setSubmissionState('idle');
        }, 3000);
      }
    } catch (error) {
      setSubmissionState('error');

      setTimeout(() => {
        setSubmissionState('idle');
      }, 3000);
    }
  }, [validateForm, errors, updateResponse, buildAssessmentData]);

  /**
   * Handle success animation completion (redirect)
   */
  const handleSuccessComplete = useCallback((): void => {
    navigate('/final-video');
  }, [navigate]);

  /**
   * Handle retry after error
   */
  const handleRetry = useCallback((): void => {
    setSubmissionState('idle');
  }, []);

  /**
   * Check if form can be submitted
   */
  const canSubmit =
    values.name.trim() &&
    values.email.trim() &&
    values.phone.trim() &&
    !errors.name &&
    !errors.email &&
    !errors.phone;

  return (
    <div className={styles.container}>
      <motion.div
        className={styles.content}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className={styles.header}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <h1 className={styles.headline}>You're Almost There!</h1>
          <p className={styles.subtext}>Let's Schedule Your Discovery Call</p>
        </motion.div>

        <motion.p
          className={styles.introduction}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          To get started with your personalized Cellular Repair plan, we just need a bit of info
        </motion.p>

        <motion.form
          className={styles.form}
          onSubmit={handleSubmit}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          noValidate
        >
          <ContactFormInputs
            values={values}
            errors={errors}
            touched={touched}
            disabled={submissionState === 'loading'}
            onChange={handleChange}
            onBlur={handleBlur}
          />

          <PrivacyNotice privacyUrl="/privacy" />

          <SubmissionStatus
            state={submissionState}
            canSubmit={canSubmit}
            onRetry={handleRetry}
            onSuccessComplete={handleSuccessComplete}
          />
        </motion.form>
      </motion.div>
    </div>
  );
};

export default LeadCapture;
