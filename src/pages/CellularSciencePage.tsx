import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAssessment } from '@context/AssessmentContext';
import { usePageFocus } from '@hooks/useAccessibility';
import { Checkbox } from '@components/common/Checkbox';
import { Button } from '@components/common/Button';
import {
  CONDITIONS,
  getTreatableConditions,
  getNonTreatableConditions,
  isConditionTreatable,
  type Condition,
} from '@data/conditions';
import { type ConditionType } from '@types';
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
const TREATABLE_GROUP_ORDER: string[] = [
  'Injury-Related Pain',
  'Chronic Pain Conditions',
  'Neuropathic Pain',
  'Unknown Origin of Pain',
  'Pelvic Pain',
];

const CellularSciencePage: React.FC = () => {
  const navigate = useNavigate();
  const { updateResponse, disqualify } = useAssessment();

  /**
   * Accessibility: Focus management on page load
   */
  usePageFocus();

  const [selectedConditions, setSelectedConditions] = useState<string[]>([]);
  const [otherConditions, setOtherConditions] = useState<string>('');
  const [treatableExpanded, setTreatableExpanded] = useState<boolean>(false);
  const [nonTreatableExpanded, setNonTreatableExpanded] = useState<boolean>(false);
  const [validationError, setValidationError] = useState<string>('');

  const treatableConditions = getTreatableConditions();
  const nonTreatableConditions = getNonTreatableConditions();
  const treatableGroups = useMemo(() => {
    return treatableConditions.reduce<Record<string, Condition[]>>((acc, condition) => {
      const group = condition.group ?? 'Other Categories';
      if (!acc[group]) {
        acc[group] = [];
      }
      acc[group].push(condition);
      return acc;
    }, {});
  }, [treatableConditions]);

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

    // Find the first selected condition or default to 'other'
    const firstConditionId = selectedConditions[0];
    const firstCondition: Condition | undefined = firstConditionId
      ? CONDITIONS.find((c: Condition) => c.id === firstConditionId)
      : undefined;

    const conditionTypeValue: string = firstCondition?.id || 'other';

    updateResponse({
      conditionType: conditionTypeValue as ConditionType,
    });

    try {
      localStorage.setItem('selected_conditions', JSON.stringify(selectedConditions));
      localStorage.setItem('other_conditions', otherConditions);
      localStorage.setItem('assessment_last_page', '/cellular-science');
    } catch (error) {
      // Silently fail if localStorage is not available
    }

    if (route === '/disqualified') {
      disqualify('non-treatable');
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
      <motion.div
        className={styles.cellular__container}
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {/* Header */}
        <motion.header className={styles.cellular__header} variants={itemVariants}>
          <h1 className={styles.cellular__title}>
            This discovery reveals how chronic pain is a cellular issue.
          </h1>
        </motion.header>

        {/* Headline Callout */}
        <motion.section
          className={styles.cellular__science}
          variants={itemVariants}
        >
          <h2 className={styles.cellular__scienceTitle}>
            Recent studies published in a major scientific journal prove that bodily memories from injuries are stored in RNA inside cells.
          </h2>
          <div className={styles.cellular__scienceContent}>
            <p className={styles.cellular__scienceText}>
              <strong>But here&apos;s what&apos;s revolutionary:</strong> scientists discovered these damaged cellular memories are stored in your &ldquo;Primary Cell&rdquo;—a master template cell that controls every other cell in your body.
            </p>
            <p className={styles.cellular__scienceText}>
              While your regular body cells die and regenerate every few months, your Primary Cell remains constant throughout your entire life.
            </p>
          </div>
        </motion.section>

        {/* Primary Cell Explanation */}
        <motion.section
          className={styles.cellular__primary}
          variants={itemVariants}
        >
          <div className={styles.cellular__primaryContent}>
            <p className={styles.cellular__primaryText}>
              This is why your chronic pain persists even as your body&apos;s tissues regenerate—because the cellular damage in your Primary Cell keeps creating new damaged cells that match the original injury pattern.
            </p>
            <p className={styles.cellular__primaryText}>
              Next, let&apos;s determine if your chronic pain type can be related to Primary Cell damage we can repair…
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
            What chronic pain conditions do you suffer from?
          </h2>
          <p className={styles.cellular__conditionsIntro}>
            (Please check all the boxes that apply over the next 2 pages.)
          </p>

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
                  <div className={styles.cellular__groupContainer}>
                    {TREATABLE_GROUP_ORDER.map((group) => {
                      const groupConditions = treatableGroups[group];
                      if (!groupConditions || groupConditions.length === 0) {
                        return null;
                      }
                      return (
                        <div key={group} className={styles.cellular__group}>
                          <h4 className={styles.cellular__groupTitle}>{group}</h4>
                          <div className={styles.cellular__checkboxGrid}>
                            {groupConditions.map((condition: Condition) => (
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
                        </div>
                      );
                    })}

                    {Object.entries(treatableGroups)
                      .filter(([group]) => !TREATABLE_GROUP_ORDER.includes(group))
                      .map(([group, groupConditions]) => (
                        <div key={group} className={styles.cellular__group}>
                          <h4 className={styles.cellular__groupTitle}>{group}</h4>
                          <div className={styles.cellular__checkboxGrid}>
                            {groupConditions.map((condition: Condition) => (
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
                        </div>
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
                    {nonTreatableConditions.map((condition: Condition) => (
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
            aria-label="Go to the next page of the assessment"
            fullWidth
          >
            Next Page
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default CellularSciencePage;
