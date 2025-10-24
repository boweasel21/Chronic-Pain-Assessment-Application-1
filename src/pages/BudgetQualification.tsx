/**
 * Page 6: Budget Qualification
 * Assesses current pain relief spending and routes accordingly
 */

import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAssessment } from '@context/AssessmentContext';
import { Button } from '@components/common/Button';
import styles from './BudgetQualification.module.css';

/**
 * Budget range option configuration
 */
interface BudgetOption {
  id: string;
  label: string;
  range: string;
  description: string;
}

const BUDGET_OPTIONS: readonly BudgetOption[] = [
  {
    id: 'low',
    label: '$0 - $3,000',
    range: '$0 - $3,000',
    description: 'Minimal annual out-of-pocket spending',
  },
  {
    id: 'medium',
    label: '$3,000 - $10,000',
    range: '$3,000 - $10,000',
    description: 'Moderate annual investment in pain relief',
  },
  {
    id: 'high',
    label: '$10,000 - $25,000',
    range: '$10,000 - $25,000',
    description: 'Significant annual investment in pain management',
  },
  {
    id: 'premium',
    label: '$25,000+',
    range: '$25,000+',
    description: 'Premium annual investment in comprehensive care',
  },
] as const;

/**
 * Budget Qualification Page Component
 *
 * @description Presents budget range options with conditional routing.
 * If user selects $0-$3,000, routes to affordability check page.
 * All other selections route directly to additional info page.
 *
 * @returns {JSX.Element} Budget qualification page
 */
const BudgetQualification = (): JSX.Element => {
  const navigate = useNavigate();
  const { updateResponse } = useAssessment();

  const [selectedBudget, setSelectedBudget] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  /**
   * Load saved data from localStorage on mount
   */
  useEffect(() => {
    const saved = localStorage.getItem('assessment_budget');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        setSelectedBudget(data.selectedBudget || null);
      } catch (error) {
        // Silent fail - invalid JSON
      }
    }
  }, []);

  /**
   * Auto-save to localStorage whenever selection changes
   */
  useEffect(() => {
    if (selectedBudget) {
      const data = { selectedBudget };
      localStorage.setItem('assessment_budget', JSON.stringify(data));
    }
  }, [selectedBudget]);

  /**
   * Handle budget selection
   */
  const handleSelect = useCallback((optionId: string): void => {
    setSelectedBudget(optionId);
    setValidationError(null);
  }, []);

  /**
   * Validate and navigate to appropriate next page
   */
  const handleNext = useCallback((): void => {
    if (!selectedBudget) {
      setValidationError('Please select a budget range to continue');
      return;
    }

    const selectedOption = BUDGET_OPTIONS.find((opt) => opt.id === selectedBudget);

    updateResponse({
      currentBudget: selectedOption?.range || null,
      budgetLevel: selectedBudget,
    });

    if (selectedBudget === 'low') {
      navigate('/affordability');
    } else {
      navigate('/additional-info');
    }
  }, [selectedBudget, updateResponse, navigate]);

  /**
   * Handle keyboard navigation
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
        {/* Question */}
        <motion.div
          className={styles.questionSection}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className={styles.question}>
            How much do you currently pay out of pocket annually for pain relief?
          </h1>
          <p className={styles.questionSubtext}>
            This helps us understand your current investment in pain management
          </p>
        </motion.div>

        {/* Budget Options */}
        <div className={styles.options} role="radiogroup" aria-label="Budget range">
          {BUDGET_OPTIONS.map((option, index) => {
            const isSelected = selectedBudget === option.id;

            return (
              <motion.div
                key={option.id}
                className={styles.optionWrapper}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 + index * 0.1, duration: 0.3 }}
              >
                <motion.button
                  className={`${styles.option} ${isSelected ? styles.optionSelected : ''}`}
                  onClick={() => handleSelect(option.id)}
                  onKeyDown={(e) => handleKeyDown(e, option.id)}
                  role="radio"
                  aria-checked={isSelected}
                  aria-label={`${option.label}: ${option.description}`}
                  whileHover={{ scale: 1.02, y: -2 }}
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
                    <p className={styles.optionDescription}>{option.description}</p>
                  </div>

                  {/* Checkmark for selected */}
                  {isSelected && (
                    <motion.div
                      className={styles.checkmark}
                      initial={{ scale: 0, rotate: -90 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                      aria-hidden="true"
                    >
                      ✓
                    </motion.div>
                  )}
                </motion.button>
              </motion.div>
            );
          })}
        </div>

        {/* Validation Error */}
        {validationError && (
          <motion.div
            className={styles.error}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            role="alert"
            aria-live="polite"
          >
            {validationError}
          </motion.div>
        )}

        {/* Navigation */}
        <motion.div
          className={styles.navigation}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.5 }}
        >
          <Button
            variant="primary"
            size="large"
            onClick={handleNext}
            aria-label="Continue to next step"
            fullWidth
          >
            Continue
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default BudgetQualification;
