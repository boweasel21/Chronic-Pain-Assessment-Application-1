/**
 * Condition Confirmation Page Component
 * Confirms selected conditions and collects associated physical sensations
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAssessment } from '@context/AssessmentContext';
import { Checkbox } from '@components/common/Checkbox';
import { Button } from '@components/common/Button';
import ProgressBar from '@components/layout/ProgressBar';
import {
  SENSATIONS,
  getSensationsByIds,
  type Sensation,
} from '@data/sensations';
import {
  getConditionById,
  isConditionTreatable,
  type Condition,
} from '@data/conditions';
import { type SensationType } from '@types';
import styles from './ConditionConfirmationPage.module.css';

/**
 * Condition Confirmation Page Component
 *
 * @description Third page of assessment flow. Provides positive reinforcement
 * for treatable conditions and collects detailed sensation information.
 *
 * Features:
 * - Positive reinforcement message
 * - Dynamic display of selected treatable conditions
 * - Personalized question based on condition
 * - 9 sensation checkboxes with descriptions
 * - Minimum 1 sensation validation with toast notification
 * - Framer Motion entrance animations
 * - Progress bar updates
 * - Mobile-responsive layout
 * - WCAG 2.1 AA accessibility
 *
 * @returns {JSX.Element} Condition confirmation page component
 */
const ConditionConfirmationPage: React.FC = () => {
  const navigate = useNavigate();
  const { updateResponse } = useAssessment();

  const [selectedConditions, setSelectedConditions] = useState<string[]>([]);
  const [treatableConditionNames, setTreatableConditionNames] = useState<string[]>([]);
  const [primaryCondition, setPrimaryCondition] = useState<string>('your condition');
  const [selectedSensations, setSelectedSensations] = useState<string[]>([]);
  const [showError, setShowError] = useState<boolean>(false);
  const [otherConditions, setOtherConditions] = useState<string>('');

  /**
   * Load saved conditions from localStorage on mount
   */
  useEffect(() => {
    try {
      const savedConditions = localStorage.getItem('selected_conditions');
      const savedOther = localStorage.getItem('other_conditions');

      if (savedConditions) {
        const conditions = JSON.parse(savedConditions) as string[];
        setSelectedConditions(conditions);

        const treatableIds = conditions.filter((id) => isConditionTreatable(id));
        const treatableNames = treatableIds
          .map((id) => getConditionById(id)?.name)
          .filter((name): name is string => name !== undefined);

        setTreatableConditionNames(treatableNames);

        if (treatableNames.length > 0 && treatableNames[0]) {
          setPrimaryCondition(treatableNames[0]);
        }
      }

      if (savedOther) {
        setOtherConditions(savedOther);
      }
    } catch (error) {
      // Silently fail if localStorage is not available
    }
  }, []);

  /**
   * Handles sensation checkbox toggle
   *
   * @param sensationId - ID of the sensation to toggle
   */
  const handleSensationToggle = (sensationId: string): void => {
    setSelectedSensations((prev) => {
      if (prev.includes(sensationId)) {
        return prev.filter((id) => id !== sensationId);
      } else {
        return [...prev, sensationId];
      }
    });
    setShowError(false);
  };

  /**
   * Validates form submission
   *
   * @returns True if validation passes, false otherwise
   */
  const validateSubmission = (): boolean => {
    if (selectedSensations.length === 0) {
      setShowError(true);
      return false;
    }

    return true;
  };

  /**
   * Handles form submission and navigation
   */
  const handleSubmit = (): void => {
    if (!validateSubmission()) {
      return;
    }

    // Map sensation IDs to Sensation objects and filter out any undefined values
    const sensationObjects: Sensation[] = getSensationsByIds(selectedSensations);

    // Convert to SensationType array (the IDs)
    const sensationTypes: string[] = sensationObjects.map(s => s.id);

    updateResponse({
      sensations: sensationTypes as SensationType[],
    });

    try {
      localStorage.setItem('selected_sensations', JSON.stringify(selectedSensations));
      localStorage.setItem('assessment_last_page', '/condition-confirmation');
    } catch (error) {
      // Silently fail if localStorage is not available
    }

    navigate('/treatment-history');
  };

  /**
   * Container animation variants
   */
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  };

  /**
   * Item animation variants
   */
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: 'easeOut',
      },
    },
  };

  /**
   * Toast animation variants
   */
  const toastVariants = {
    hidden: {
      opacity: 0,
      y: 50,
      scale: 0.9,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 25,
      },
    },
    exit: {
      opacity: 0,
      y: 50,
      scale: 0.9,
      transition: {
        duration: 0.2,
      },
    },
  };

  /**
   * Determine if user needs practitioner review
   */
  const needsPractitionerReview = otherConditions.trim().length > 0 && selectedConditions.length === 0;

  return (
    <div className={styles.confirmation}>
      {/* Progress Bar */}
      <div className={styles.confirmation__progress}>
        <ProgressBar current={3} total={10} />
      </div>

      <motion.div
        className={styles.confirmation__container}
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {/* Positive Reinforcement Header */}
        <motion.header
          className={styles.confirmation__header}
          variants={itemVariants}
        >
          <div className={styles.confirmation__badge} aria-hidden="true">
            ✓
          </div>
          <h1 className={styles.confirmation__title}>
            Great News! We Can Help You
          </h1>
          <p className={styles.confirmation__subtitle}>
            Based on your selections, cellular repair therapy may be an effective
            treatment option for you.
          </p>
        </motion.header>

        {/* Selected Conditions Display */}
        {treatableConditionNames.length > 0 && (
          <motion.section
            className={styles.confirmation__conditions}
            variants={itemVariants}
            aria-labelledby="selected-conditions-heading"
          >
            <h2 id="selected-conditions-heading" className={styles.confirmation__conditionsTitle}>
              Your Selected Conditions:
            </h2>
            <ul className={styles.confirmation__conditionsList}>
              {treatableConditionNames.map((name, index) => (
                <motion.li
                  key={index}
                  className={styles.confirmation__conditionItem}
                  variants={{
                    hidden: { opacity: 0, x: -20 },
                    visible: {
                      opacity: 1,
                      x: 0,
                      transition: {
                        duration: 0.4,
                        delay: index * 0.1,
                        ease: 'easeOut',
                      },
                    },
                  }}
                >
                  <span className={styles.confirmation__conditionIcon} aria-hidden="true">
                    •
                  </span>
                  <span className={styles.confirmation__conditionName}>{name}</span>
                </motion.li>
              ))}
            </ul>
          </motion.section>
        )}

        {/* Practitioner Review Notice */}
        {needsPractitionerReview && (
          <motion.aside
            className={styles.confirmation__review}
            variants={itemVariants}
            role="status"
            aria-live="polite"
          >
            <div className={styles.confirmation__reviewIcon} aria-hidden="true">
              ℹ️
            </div>
            <p className={styles.confirmation__reviewText}>
              Your condition will be reviewed by a practitioner to determine if cellular
              repair therapy is appropriate for you.
            </p>
          </motion.aside>
        )}

        {/* Sensations Question */}
        <motion.section
          className={styles.confirmation__sensations}
          variants={itemVariants}
          aria-labelledby="sensations-heading"
        >
          <h2 id="sensations-heading" className={styles.confirmation__sensationsTitle}>
            What physical sensations are associated with {primaryCondition}?
          </h2>
          <p className={styles.confirmation__sensationsHelp}>
            Select all that apply. This helps us understand your specific pain profile.
          </p>

          <div className={styles.confirmation__sensationsGrid}>
            {SENSATIONS.map((sensation: Sensation) => (
              <div key={sensation.id} className={styles.confirmation__sensationItem}>
                <Checkbox
                  id={`sensation-${sensation.id}`}
                  label={sensation.name}
                  description={sensation.description}
                  checked={selectedSensations.includes(sensation.id)}
                  onChange={() => handleSensationToggle(sensation.id)}
                  aria-label={`Select ${sensation.name}: ${sensation.description}`}
                />
              </div>
            ))}
          </div>

          {/* Minimum Selection Helper */}
          <p className={styles.confirmation__minimumHelper}>
            <strong>Required:</strong> Select at least 1 sensation to continue
          </p>
        </motion.section>

        {/* Submit Button */}
        <motion.div
          className={styles.confirmation__actions}
          variants={itemVariants}
        >
          <Button
            variant="primary"
            size="large"
            onClick={handleSubmit}
            aria-label="Continue to treatment history"
            fullWidth
          >
            Continue
          </Button>
        </motion.div>
      </motion.div>

      {/* Error Toast Notification */}
      {showError && (
        <motion.div
          className={styles.confirmation__toast}
          variants={toastVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          role="alert"
          aria-live="assertive"
        >
          <div className={styles.confirmation__toastIcon} aria-hidden="true">
            ⚠️
          </div>
          <div className={styles.confirmation__toastContent}>
            <p className={styles.confirmation__toastTitle}>Selection Required</p>
            <p className={styles.confirmation__toastMessage}>
              Please select at least one sensation to continue.
            </p>
          </div>
          <button
            className={styles.confirmation__toastClose}
            onClick={() => setShowError(false)}
            aria-label="Dismiss error notification"
            type="button"
          >
            ✕
          </button>
        </motion.div>
      )}
    </div>
  );
};

export default ConditionConfirmationPage;
