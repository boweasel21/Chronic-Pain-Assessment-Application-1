/**
 * Page 6B: Affordability Check
 * Follow-up page for users in the $0-$3,000 budget range
 */

import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAssessment } from '@context/AssessmentContext';
import { Button } from '@components/common/Button';
import styles from './AffordabilityCheck.module.css';

/**
 * Affordability response options
 */
interface AffordabilityOption {
  id: string;
  label: string;
  description: string;
  variant: 'primary' | 'secondary';
}

const AFFORDABILITY_OPTIONS: readonly AffordabilityOption[] = [
  {
    id: 'affordable',
    label: "That's affordable for me",
    description: 'I can budget $3,000 per area for this process',
    variant: 'primary',
  },
  {
    id: 'need_to_think',
    label: 'I need to think about it',
    description: "I'd like to consider this investment further",
    variant: 'secondary',
  },
] as const;

/**
 * Affordability Check Page Component
 *
 * @description Presents affordability assessment for the $3,000 per area cost.
 * Both options proceed to additional info page - no hard disqualification.
 *
 * @returns {JSX.Element} Affordability check page
 */
const AffordabilityCheck = (): JSX.Element => {
  const navigate = useNavigate();
  const { updateResponse } = useAssessment();

  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  /**
   * Load saved data from localStorage on mount
   */
  useEffect(() => {
    const saved = localStorage.getItem('assessment_affordability');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        setSelectedOption(data.selectedOption || null);
      } catch (error) {
        // Silent fail - invalid JSON
      }
    }
  }, []);

  /**
   * Handle option selection and navigate
   */
  const handleSelect = useCallback((optionId: string): void => {
    setSelectedOption(optionId);

    const data = { selectedOption: optionId };
    localStorage.setItem('assessment_affordability', JSON.stringify(data));

    updateResponse({
      affordabilityResponse: optionId,
      affordabilityConfirmed: optionId === 'affordable',
    });

    setTimeout(() => {
      navigate('/additional-info');
    }, 300);
  }, [updateResponse, navigate]);

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        {/* Header */}
        <motion.div
          className={styles.header}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className={styles.title}>Just One More Quick Question</h1>
        </motion.div>

        {/* Message */}
        <motion.div
          className={styles.messageSection}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <div className={styles.messageCard}>
            <p className={styles.message}>
              Our process is <strong className={styles.price}>$3,000 per area</strong>.
              How does that feel?
            </p>
          </div>
        </motion.div>

        {/* Options */}
        <div className={styles.options}>
          {AFFORDABILITY_OPTIONS.map((option, index) => {
            const isSelected = selectedOption === option.id;

            return (
              <motion.div
                key={option.id}
                className={styles.optionWrapper}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 + index * 0.15, duration: 0.3 }}
              >
                <motion.div
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ duration: 0.15 }}
                >
                  <Button
                    variant={option.variant}
                    size="large"
                    onClick={() => handleSelect(option.id)}
                    aria-label={`${option.label}: ${option.description}`}
                    fullWidth
                  >
                    <div className={styles.buttonContent}>
                      <span className={styles.buttonLabel}>{option.label}</span>
                      <span className={styles.buttonDescription}>{option.description}</span>
                    </div>
                  </Button>
                </motion.div>
              </motion.div>
            );
          })}
        </div>

        {/* Info Note */}
        <motion.div
          className={styles.infoNote}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          <p className={styles.infoText}>
            Either way, we'll continue with your personalized assessment results
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default AffordabilityCheck;
