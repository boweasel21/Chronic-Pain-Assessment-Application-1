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
 * Formats an array of strings into a human-readable list with commas and "and"
 */
const formatList = (items: string[]): string => {
  if (items.length === 0) {
    return '';
  }
  if (items.length === 1) {
    return items[0];
  }
  if (items.length === 2) {
    return `${items[0]} and ${items[1]}`;
  }
  const allButLast = items.slice(0, -1).join(', ');
  const last = items[items.length - 1];
  return `${allButLast}, and ${last}`;
};

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
  const [nonTreatableConditionNames, setNonTreatableConditionNames] = useState<string[]>([]);
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

        const nonTreatableIds = conditions.filter((id) => !isConditionTreatable(id));
        const nonTreatableNames = nonTreatableIds
          .map((id) => getConditionById(id)?.name)
          .filter((name): name is string => name !== undefined);

        setNonTreatableConditionNames(nonTreatableNames);
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
  const needsPractitionerReview =
    otherConditions.trim().length > 0 && selectedConditions.length === 0;

  const hasTreatable = treatableConditionNames.length > 0;
  const hasNonTreatable = nonTreatableConditionNames.length > 0;
  const treatableListText = formatList(treatableConditionNames);
  const nonTreatableListText = formatList(nonTreatableConditionNames);
  const treatableVerb = treatableConditionNames.length === 1 ? 'is' : 'are';
  const nonTreatableVerb = nonTreatableConditionNames.length === 1 ? 'is' : 'are';
  const questionConditionLabel = hasTreatable ? treatableListText : 'your condition';

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
        {/* Introductory Copy */}
        <motion.header
          className={styles.confirmation__header}
          variants={itemVariants}
        >
          <h1 className={styles.confirmation__title}>
            If you have landed on this page, it’s good news. It means you’re headed in the right direction.
          </h1>
          <p className={styles.confirmation__subtitle}>
            Roughly half of the selections you saw are chronic pain related to disease or pathogens, conditions we cannot remedy.
          </p>
        </motion.header>

        <motion.section
          className={styles.confirmation__intro}
          variants={itemVariants}
        >
          {hasTreatable && (
            <p className={styles.confirmation__introText}>
              {treatableListText} {treatableVerb} good {treatableConditionNames.length === 1 ? 'candidate' : 'candidates'} for effectively repairing Primary Cell damage.
            </p>
          )}

          {hasTreatable && hasNonTreatable && (
            <>
              <p className={styles.confirmation__introText}>
                Unfortunately, {nonTreatableListText} {nonTreatableVerb} not good candidates for our process. These chronic pain conditions are associated with diseases and infections caused by pathogens that are beyond our reach.
              </p>
              <p className={styles.confirmation__introText}>
                We apologize for that. But, {treatableListText} {treatableVerb} good {treatableConditionNames.length === 1 ? 'candidate' : 'candidates'}.
              </p>
            </>
          )}

          {!hasTreatable && needsPractitionerReview && (
            <p className={styles.confirmation__introText}>
              A practitioner will review what you shared to determine if it’s related to Primary Cell damage.
            </p>
          )}

          <p className={styles.confirmation__introText}>
            However, we’re not out of the woods...
          </p>
          <p className={styles.confirmation__introText}>
            Below is a list of physical pain sensations associated with cellular damage.
          </p>
        </motion.section>

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
              A practitioner will review what you shared to determine if it’s related to Primary Cell damage. If you provide your contact information later in the assessment, we will contact you and let you know if you are a good candidate for our process.
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
            What physical sensation(s) are associated with your {questionConditionLabel}?
          </h2>
          <p className={styles.confirmation__sensationsHelp}>
            Please, check the boxes that apply:
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
            aria-label="Go to the next page of the assessment"
            fullWidth
          >
            Next Page
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
