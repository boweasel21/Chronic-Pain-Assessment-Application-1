/**
 * Page 7: Additional Information
 * Final page before results - collects optional additional context
 */

import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAssessment } from '@context/AssessmentContext';
import { Button } from '@components/common/Button';
import { sanitizeText } from '../../utils/sanitizer';
import styles from './AdditionalInfo.module.css';

/**
 * Additional Information Page Component
 *
 * @description Final assessment page with optional textarea for additional context.
 * Features input sanitization, character limit, and animated processing message.
 * Routes to results page on completion.
 *
 * SECURITY: All textarea input is sanitized to prevent XSS attacks.
 *
 * @returns {JSX.Element} Additional information page
 */
const AdditionalInfo = (): JSX.Element => {
  const navigate = useNavigate();
  const { updateResponse } = useAssessment();

  const [additionalInfo, setAdditionalInfo] = useState('');
  const [charCount, setCharCount] = useState(0);

  const MAX_CHARS = 1000;

  /**
   * Load saved data from localStorage on mount
   */
  useEffect(() => {
    const saved = localStorage.getItem('assessment_additional_info');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        const loadedInfo = data.additionalInfo || '';
        const sanitized = sanitizeText(loadedInfo, MAX_CHARS);
        setAdditionalInfo(sanitized);
      } catch (error) {
        setAdditionalInfo('');
      }
    }
  }, []);

  /**
   * Update character count when text changes
   */
  useEffect(() => {
    setCharCount(additionalInfo.length);
  }, [additionalInfo]);

  /**
   * Auto-save to localStorage with debounce
   */
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const data = { additionalInfo };
      localStorage.setItem('assessment_additional_info', JSON.stringify(data));
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [additionalInfo]);

  /**
   * Handle textarea change with character limit and sanitization
   *
   * @description Sanitizes textarea input to prevent XSS attacks while preserving
   * line breaks. Enforces character limit.
   *
   * SECURITY: All input is sanitized before updating state.
   */
  const handleChange = useCallback((event: React.ChangeEvent<HTMLTextAreaElement>): void => {
    const rawValue = event.target.value;

    if (rawValue.length <= MAX_CHARS) {
      const sanitized = sanitizeText(rawValue, MAX_CHARS);
      setAdditionalInfo(sanitized);
    }
  }, []);

  /**
   * Handle navigation to results page with final sanitization
   *
   * @description Sanitizes the additional info one final time before submission.
   * SECURITY: Ensures sanitized data is submitted to context.
   */
  const handleViewResults = useCallback((): void => {
    const sanitized = sanitizeText(additionalInfo.trim(), MAX_CHARS);

    updateResponse({
      additionalInfo: sanitized || null,
      completedAt: new Date().toISOString(),
    });

    navigate('/results');
  }, [additionalInfo, updateResponse, navigate]);

  /**
   * Calculate character count color
   */
  const getCharCountColor = (): string => {
    const percentage = (charCount / MAX_CHARS) * 100;
    if (percentage >= 90) return 'rgba(239, 68, 68, 1)';
    if (percentage >= 75) return 'rgba(245, 158, 11, 1)';
    return 'rgba(107, 114, 128, 1)';
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        {/* Processing Message */}
        <motion.div
          className={styles.processingSection}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className={styles.processingCard}>
            <motion.div
              className={styles.spinner}
              animate={{ rotate: 360 }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'linear',
              }}
              aria-hidden="true"
            >
              ⚙️
            </motion.div>
            <h1 className={styles.processingTitle}>
              Your Personalized Pain Pattern Profile is being generated...
            </h1>
          </div>
        </motion.div>

        {/* Question */}
        <motion.div
          className={styles.questionSection}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <h2 className={styles.question}>Anything else we should know?</h2>
          <p className={styles.questionSubtext}>
            Share any additional context that might help us understand your situation better (optional)
          </p>
        </motion.div>

        {/* Textarea */}
        <motion.div
          className={styles.textareaSection}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <div className={styles.textareaWrapper}>
            <textarea
              id="additional-info"
              className={styles.textarea}
              value={additionalInfo}
              onChange={handleChange}
              placeholder="For example: specific symptoms, goals, concerns, or anything else that's important to you..."
              rows={8}
              aria-label="Additional information"
              aria-describedby="char-count"
            />

            {/* Character Count */}
            <div
              id="char-count"
              className={styles.charCount}
              style={{ color: getCharCountColor() }}
              aria-live="polite"
            >
              {charCount} / {MAX_CHARS} characters
            </div>
          </div>
        </motion.div>

        {/* Helper Text */}
        <motion.div
          className={styles.helperSection}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.5 }}
        >
          <p className={styles.helperText}>
            💡 <strong>Tip:</strong> The more details you provide, the more personalized your results will be
          </p>
        </motion.div>

        {/* Navigation */}
        <motion.div
          className={styles.navigation}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.5 }}
        >
          <Button
            variant="primary"
            size="large"
            onClick={handleViewResults}
            aria-label="View your personalized results"
            fullWidth
          >
            View My Results
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default AdditionalInfo;
