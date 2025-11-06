/**
 * Page 5: Urgency Assessment
 * Evaluates the user's urgency level for pain relief
 */

import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAssessment } from '@context/AssessmentContext';
import styles from './UrgencyAssessment.module.css';

/**
 * Urgency option configuration
 */
interface UrgencyOption {
  id: string;
  label: string;
  description: string;
  level: 'high' | 'moderate' | 'low';
}

const URGENCY_OPTIONS: readonly UrgencyOption[] = [
  {
    id: 'urgent',
    label:
      'Are you sick and tired of being sick and tired of your pain and ready to do something now, so long as it promotes good health, has no side effects, is non-invasive, and works?',
    description: '',
    level: 'high',
  },
  {
    id: 'moderate',
    label: 'Frustrated by your pain, but not urgent--now is not the time.',
    description: '',
    level: 'moderate',
  },
  {
    id: 'exploring',
    label: 'It would be nice to get rid of it, but it’s manageable; you can live with it.',
    description: '',
    level: 'low',
  },
] as const;

/**
 * Urgency Assessment Page Component
 *
 * @description Presents urgency level options with animated radio buttons.
 * Validation required - user must select one option before proceeding.
 *
 * @returns {JSX.Element} Urgency assessment page
 */
const UrgencyAssessment = (): JSX.Element => {
  const navigate = useNavigate();
  const { updateResponse } = useAssessment();

  const [selectedUrgency, setSelectedUrgency] = useState<string | null>(null);

  /**
   * Load saved data from localStorage on mount
   */
  useEffect(() => {
    const saved = localStorage.getItem('assessment_urgency');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        setSelectedUrgency(data.selectedUrgency || null);
      } catch (error) {
        // Silent fail - invalid JSON
      }
    }
  }, []);

  /**
   * Auto-save to localStorage whenever selection changes
   */
  useEffect(() => {
    if (selectedUrgency) {
      const data = { selectedUrgency };
      localStorage.setItem('assessment_urgency', JSON.stringify(data));
    }
  }, [selectedUrgency]);

  /**
   * Handle urgency selection
   */
  const handleSelect = useCallback(
    (optionId: string): void => {
      setSelectedUrgency(optionId);

      const selectedOption = URGENCY_OPTIONS.find((opt) => opt.id === optionId);

      updateResponse({
        urgencyLevel: selectedOption?.level || null,
        urgencySelection: optionId,
      });

      setTimeout(() => {
        navigate('/budget-qualification');
      }, 250);
    },
    [updateResponse, navigate]
  );

  /**
   * Handle keyboard navigation (Arrow keys)
   */
  const handleKeyDown = useCallback((event: React.KeyboardEvent, optionId: string): void => {
    if (event.key === ' ' || event.key === 'Enter') {
      event.preventDefault();
      handleSelect(optionId);
    }
  }, [handleSelect]);

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <motion.div
          className={styles.card}
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          {/* Question */}
          <motion.div
            className={styles.questionSection}
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <h1 className={styles.question}>
              How urgent is your need to resolve your chronic pain issue?
            </h1>
          </motion.div>

          {/* Options */}
          <div className={styles.options} role="radiogroup" aria-label="Urgency level">
            {URGENCY_OPTIONS.map((option, index) => {
              const isSelected = selectedUrgency === option.id;

              return (
                <motion.div
                  key={option.id}
                  className={styles.optionWrapper}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + index * 0.1, duration: 0.4 }}
                >
                  <motion.button
                    className={`${styles.option} ${isSelected ? styles.optionSelected : ''}`}
                    onClick={() => handleSelect(option.id)}
                    onKeyDown={(e) => handleKeyDown(e, option.id)}
                    role="radio"
                    aria-checked={isSelected}
                    aria-label={option.label}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ duration: 0.15 }}
                  >
                    {/* Radio Button */}
                    <div className={styles.radioContainer}>
                      <motion.div
                        className={styles.radioOuter}
                        animate={{
                          borderColor: isSelected
                            ? 'rgba(29, 44, 73, 1)'
                            : 'rgba(226, 211, 163, 1)',
                        }}
                        transition={{ duration: 0.2 }}
                      >
                        <motion.div
                          className={styles.radioInner}
                          initial={{ scale: 0 }}
                          animate={{ scale: isSelected ? 1 : 0 }}
                          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                        />
                      </motion.div>
                    </div>

                    {/* Content */}
                    <div className={styles.optionContent}>
                      <h3 className={styles.optionLabel}>{option.label}</h3>
                      {option.description && (
                        <p className={styles.optionDescription}>{option.description}</p>
                      )}
                    </div>
                  </motion.button>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default UrgencyAssessment;
