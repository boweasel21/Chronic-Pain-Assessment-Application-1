/**
 * Cellular Science Page Component
 * Educates users about RNA storage and Primary Cell concept
 * Collects condition data with treatable/non-treatable categorization
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAssessment } from '@context/AssessmentContext';
import { Checkbox } from '@components/common/Checkbox';
import { Button } from '@components/common/Button';
import ProgressBar from '@components/layout/ProgressBar';
import {
  CONDITIONS,
  getTreatableConditions,
  getNonTreatableConditions,
  isConditionTreatable,
  type Condition,
} from '../../../data/conditions';
import styles from './CellularSciencePage.module.css';

/**
 * Cellular Science Page Component
 *
 * @description Second page of assessment flow. Explains scientific basis for
 * cellular pain treatment and collects condition information with smart routing.
 *
 * Features:
 * - RNA storage explanation section
 * - Primary Cell concept education
 * - Two collapsible checkbox sections (treatable/non-treatable)
 * - Textarea for unlisted conditions
 * - Smart validation and routing logic
 * - Progress bar integration
 * - Framer Motion animations
 * - Mobile-responsive layout
 * - WCAG 2.1 AA accessibility
 *
 * Routing Logic:
 * - ONLY non-treatable → /disqualified
 * - At least one treatable → /condition-confirmation
 * - Only textarea filled → /condition-confirmation with review note
 *
 * @returns {JSX.Element} Cellular science page component
 */
const CellularSciencePage: React.FC = () => {
  const navigate = useNavigate();
  const { updateResponse, state } = useAssessment();

  const [selectedConditions, setSelectedConditions] = useState<string[]>([]);
  const [otherConditions, setOtherConditions] = useState<string>('');
  const [treatableExpanded, setTreatableExpanded] = useState<boolean>(true);
  const [nonTreatableExpanded, setNonTreatableExpanded] = useState<boolean>(true);
  const [validationError, setValidationError] = useState<string>('');

  const treatableConditions = getTreatableConditions();
  const nonTreatableConditions = getNonTreatableConditions();

  /**
   * Handles condition checkbox toggle
   *
   * @param conditionId - ID of the condition to toggle
   */
  const handleConditionToggle = (conditionId: string): void => {
    setSelectedConditions((prev) => {
      if (prev.includes(conditionId)) {
        return prev.filter((id) => id !== conditionId);
      } else {
        return [...prev, conditionId];
      }
    });
    setValidationError('');
  };

  /**
   * Handles textarea input for other conditions
   *
   * @param event - Input change event
   */
  const handleOtherConditionsChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ): void => {
    setOtherConditions(event.target.value);
    setValidationError('');
  };

  /**
   * Validates form submission
   *
   * @returns True if validation passes, false otherwise
   */
  const validateSubmission = (): boolean => {
    const hasSelectedConditions = selectedConditions.length > 0;
    const hasOtherConditions = otherConditions.trim().length > 0;

    if (!hasSelectedConditions && !hasOtherConditions) {
      setValidationError('Please select at least one condition or describe your condition in the text area.');
      return false;
    }

    return true;
  };

  /**
   * Determines routing based on selected conditions
   *
   * @returns Route path to navigate to
   */
  const determineRoute = (): string => {
    const hasSelectedConditions = selectedConditions.length > 0;
    const hasOtherConditions = otherConditions.trim().length > 0;

    if (hasSelectedConditions) {
      const hasTreatable = selectedConditions.some((id) => isConditionTreatable(id));
      const hasNonTreatable = selectedConditions.some((id) => !isConditionTreatable(id));

      if (hasNonTreatable && !hasTreatable) {
        return '/disqualified';
      }

      if (hasTreatable) {
        return '/condition-confirmation';
      }
    }

    if (hasOtherConditions && !hasSelectedConditions) {
      return '/condition-confirmation';
    }

    return '/disqualified';
  };

  /**
   * Handles form submission and navigation
   */
  const handleSubmit = (): void => {
    if (!validateSubmission()) {
      return;
    }

    const route = determineRoute();

    updateResponse({
      conditionType: selectedConditions[0] as any || 'other',
    });

    try {
      localStorage.setItem('selected_conditions', JSON.stringify(selectedConditions));
      localStorage.setItem('other_conditions', otherConditions);
      localStorage.setItem('assessment_last_page', '/cellular-science');
    } catch (error) {
      // Silently fail if localStorage is not available
    }

    navigate(route);
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
   * Collapsible section animation variants
   */
  const collapseVariants = {
    collapsed: {
      height: 0,
      opacity: 0,
      transition: {
        duration: 0.3,
        ease: 'easeInOut',
      },
    },
    expanded: {
      height: 'auto',
      opacity: 1,
      transition: {
        duration: 0.3,
        ease: 'easeInOut',
      },
    },
  };

  /**
   * Save progress on mount
   */
  useEffect(() => {
    try {
      const savedConditions = localStorage.getItem('selected_conditions');
      const savedOther = localStorage.getItem('other_conditions');

      if (savedConditions) {
        setSelectedConditions(JSON.parse(savedConditions));
      }
      if (savedOther) {
        setOtherConditions(savedOther);
      }
    } catch (error) {
      // Silently fail if localStorage is not available
    }
  }, []);

  return (
    <div className={styles.cellular}>
      {/* Progress Bar */}
      <div className={styles.cellular__progress}>
        <ProgressBar current={2} total={10} />
      </div>

      <motion.div
        className={styles.cellular__container}
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {/* Header */}
        <motion.header className={styles.cellular__header} variants={itemVariants}>
          <h1 className={styles.cellular__title}>
            Here's What Scientists Discovered
          </h1>
        </motion.header>

        {/* RNA Storage Explanation */}
        <motion.section
          className={styles.cellular__science}
          variants={itemVariants}
          aria-labelledby="rna-storage-heading"
        >
          <h2 id="rna-storage-heading" className={styles.cellular__scienceTitle}>
            How Pain Gets Stored in RNA
          </h2>
          <div className={styles.cellular__scienceContent}>
            <p className={styles.cellular__scienceText}>
              Every time you experience pain, your cells don't just react—they remember.
              Scientists discovered that pain signals alter RNA patterns in your Primary Cells,
              creating a molecular memory of injury. This is why pain persists long after
              tissues heal.
            </p>
            <p className={styles.cellular__scienceText}>
              Traditional treatments target symptoms. We target the source: the corrupted
              RNA patterns that keep generating pain signals. By repairing these cellular
              instructions, we can eliminate chronic pain at its origin.
            </p>
          </div>
        </motion.section>

        {/* Primary Cell Explanation */}
        <motion.section
          className={styles.cellular__primary}
          variants={itemVariants}
          aria-labelledby="primary-cell-heading"
        >
          <h2 id="primary-cell-heading" className={styles.cellular__primaryTitle}>
            What Are Primary Cells?
          </h2>
          <div className={styles.cellular__primaryContent}>
            <p className={styles.cellular__primaryText}>
              Primary Cells are the first responders to injury in your body. They detect
              damage, coordinate healing, and store information about past injuries in
              their RNA. When these cells malfunction, they create chronic pain loops
              that conventional medicine cannot break.
            </p>
          </div>
        </motion.section>

        {/* Condition Selection */}
        <motion.section
          className={styles.cellular__conditions}
          variants={itemVariants}
          aria-labelledby="conditions-heading"
        >
          <h2 id="conditions-heading" className={styles.cellular__conditionsTitle}>
            Does This Apply to Your Condition?
          </h2>

          {/* Treatable Conditions Section */}
          <div className={styles.cellular__section}>
            <button
              className={styles.cellular__sectionHeader}
              onClick={() => setTreatableExpanded(!treatableExpanded)}
              aria-expanded={treatableExpanded}
              aria-controls="treatable-conditions-list"
              type="button"
            >
              <h3 className={styles.cellular__sectionTitle}>
                Here's Who We Can Help
              </h3>
              <span
                className={`${styles.cellular__expandIcon} ${
                  treatableExpanded ? styles['cellular__expandIcon--expanded'] : ''
                }`}
                aria-hidden="true"
              >
                ▼
              </span>
            </button>

            <AnimatePresence initial={false}>
              {treatableExpanded && (
                <motion.div
                  id="treatable-conditions-list"
                  className={styles.cellular__sectionContent}
                  initial="collapsed"
                  animate="expanded"
                  exit="collapsed"
                  variants={collapseVariants}
                >
                  <div className={styles.cellular__checkboxGrid}>
                    {treatableConditions.map((condition) => (
                      <Checkbox
                        key={condition.id}
                        id={`condition-${condition.id}`}
                        label={condition.name}
                        checked={selectedConditions.includes(condition.id)}
                        onChange={() => handleConditionToggle(condition.id)}
                        aria-label={`Select ${condition.name} as a treatable condition`}
                      />
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Non-Treatable Conditions Section */}
          <div className={styles.cellular__section}>
            <button
              className={styles.cellular__sectionHeader}
              onClick={() => setNonTreatableExpanded(!nonTreatableExpanded)}
              aria-expanded={nonTreatableExpanded}
              aria-controls="non-treatable-conditions-list"
              type="button"
            >
              <h3 className={styles.cellular__sectionTitle}>
                Here's Who We Can NOT Help
              </h3>
              <span
                className={`${styles.cellular__expandIcon} ${
                  nonTreatableExpanded ? styles['cellular__expandIcon--expanded'] : ''
                }`}
                aria-hidden="true"
              >
                ▼
              </span>
            </button>

            <AnimatePresence initial={false}>
              {nonTreatableExpanded && (
                <motion.div
                  id="non-treatable-conditions-list"
                  className={styles.cellular__sectionContent}
                  initial="collapsed"
                  animate="expanded"
                  exit="collapsed"
                  variants={collapseVariants}
                >
                  <div className={styles.cellular__checkboxGrid}>
                    {nonTreatableConditions.map((condition) => (
                      <Checkbox
                        key={condition.id}
                        id={`condition-${condition.id}`}
                        label={condition.name}
                        checked={selectedConditions.includes(condition.id)}
                        onChange={() => handleConditionToggle(condition.id)}
                        aria-label={`Select ${condition.name} as a non-treatable condition`}
                      />
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Other Conditions Textarea */}
          <div className={styles.cellular__other}>
            <label
              htmlFor="other-conditions"
              className={styles.cellular__otherLabel}
            >
              List any conditions we missed:
            </label>
            <textarea
              id="other-conditions"
              className={styles.cellular__otherTextarea}
              value={otherConditions}
              onChange={handleOtherConditionsChange}
              placeholder="Describe your condition(s) here..."
              rows={4}
              aria-describedby="other-conditions-help"
            />
            <p
              id="other-conditions-help"
              className={styles.cellular__otherHelp}
            >
              If your condition isn't listed above, please describe it here. A practitioner
              will review your submission.
            </p>
          </div>

          {/* Validation Error */}
          {validationError && (
            <motion.div
              className={styles.cellular__error}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              role="alert"
              aria-live="polite"
            >
              {validationError}
            </motion.div>
          )}
        </motion.section>

        {/* Submit Button */}
        <motion.div
          className={styles.cellular__actions}
          variants={itemVariants}
        >
          <Button
            variant="primary"
            size="large"
            onClick={handleSubmit}
            aria-label="Continue to next step"
            fullWidth
          >
            Continue
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default CellularSciencePage;
