/**
 * Results Page Component
 *
 * The most critical page - 100% personalized based on user input
 * Shows comprehensive pain pattern profile and treatment analysis
 */

import { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAssessment } from '@context/AssessmentContext';
import { generatePersonalizedResults, PersonalizationResult } from '../../utils/personalization';
import { Card } from '@components/common/Card';
import { Button } from '@components/common/Button';
import styles from './ResultsPage.module.css';

/**
 * Container animation variants
 */
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
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
 * Treatment card stagger variants
 */
const treatmentCardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (index: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      delay: index * 0.1,
      ease: 'easeOut',
    },
  }),
};

/**
 * Results Page Component
 */
export const ResultsPage = (): JSX.Element => {
  const navigate = useNavigate();
  const { state } = useAssessment();

  // Generate personalized results from assessment responses
  const personalizationResult: PersonalizationResult = useMemo(() => {
    // Extract conditions from localStorage (where they're actually stored)
    let conditions: string[] = [];
    try {
      const savedConditions = localStorage.getItem('selected_conditions');
      if (savedConditions) {
        conditions = JSON.parse(savedConditions);
      }
    } catch (error) {
      console.error('Error loading conditions from localStorage:', error);
    }

    // Extract sensations from localStorage
    let sensations: string[] = [];
    try {
      const savedSensations = localStorage.getItem('selected_sensations');
      if (savedSensations) {
        sensations = JSON.parse(savedSensations);
      }
    } catch (error) {
      console.error('Error loading sensations from localStorage:', error);
    }

    // Extract treatments from localStorage
    let previousTreatments: string[] = [];
    try {
      const savedTreatments = localStorage.getItem('assessment_treatment_history');
      if (savedTreatments) {
        const data = JSON.parse(savedTreatments);
        previousTreatments = data.selectedTreatments || [];
      }
    } catch (error) {
      console.error('Error loading treatments from localStorage:', error);
    }

    // Build responses object from state and localStorage
    const responses = {
      conditions: conditions.length > 0 ? conditions : (state.response.conditionType ? [state.response.conditionType] : []),
      sensations: sensations.length > 0 ? sensations : (state.response.sensations || []),
      duration: undefined, // Add if available in state
      intensity: state.response.painLevel || undefined,
      previousTreatments: previousTreatments.length > 0 ? previousTreatments : (state.response.currentTreatments || []),
      activityImpact: state.response.dailyImpact || undefined,
      goals: state.response.educationalInterests?.join(', ') || undefined,
    };

    return generatePersonalizedResults(responses);
  }, [state]);

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  /**
   * Handle navigation to process explanation page
   */
  const handleLearnMore = (): void => {
    navigate('/process-explanation');
  };

  /**
   * Handle screenshot functionality
   */
  const handleScreenshot = (): void => {
    // Future implementation: trigger screenshot or download
    console.log('Screenshot functionality');
  };

  /**
   * Handle email results
   */
  const handleEmailResults = (): void => {
    // Future implementation: email results
    console.log('Email results functionality');
  };

  return (
    <div className={styles.pageContainer}>
      <motion.div
        className={styles.contentWrapper}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* SECTION 1: CONGRATULATIONS HEADER */}
        <motion.section
          className={styles.headerSection}
          variants={itemVariants}
        >
          <div className={styles.congratsBadge}>
            <svg
              className={styles.checkIcon}
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span>Qualified</span>
          </div>
          <h1 className={styles.mainHeadline}>
            Congratulations! You Qualified!
          </h1>
          <p className={styles.subHeadline}>
            Your Personalized Pain Pattern Profile
          </p>
        </motion.section>

        {/* SECTION 2: CONDITIONS & SENSATIONS */}
        {personalizationResult.conditionsWithSensations.length > 0 && (
          <motion.section
            className={styles.conditionsSection}
            variants={itemVariants}
          >
            <h2 className={styles.sectionTitle}>Your Pain Profile</h2>
            <div className={styles.conditionsGrid}>
              {personalizationResult.conditionsWithSensations.map(({ condition, sensations }, index) => (
                <Card
                  key={condition.id}
                  variant="white"
                  shadow="md"
                  padding="md"
                  className={styles.conditionCard}
                >
                  <div className={styles.conditionIcon}>
                    <svg
                      width="32"
                      height="32"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden="true"
                    >
                      <path
                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <h3 className={styles.conditionName}>{condition.name}</h3>
                  <div className={styles.sensationsList}>
                    <p className={styles.sensationsLabel}>Pain sensations:</p>
                    <ul className={styles.sensationsItems}>
                      {sensations.map((sensation) => (
                        <li key={sensation.id}>{sensation.name}</li>
                      ))}
                    </ul>
                  </div>
                </Card>
              ))}
            </div>
          </motion.section>
        )}

        {/* SECTION 3: QUALIFICATION STATEMENT */}
        {personalizationResult.isQualified && (
          <motion.section
            className={styles.qualificationSection}
            variants={itemVariants}
          >
            <Card variant="secondary" shadow="sm" padding="lg">
              <p className={styles.qualificationText}>
                These symptoms make you a strong candidate for our Cellular Repair Process
              </p>
            </Card>
          </motion.section>
        )}

        {/* SECTION 4: TREATMENT BREAKDOWN */}
        <motion.section
          className={styles.treatmentSection}
          variants={itemVariants}
        >
          <div className={styles.treatmentHeader}>
            <h2 className={styles.treatmentHeadline}>
              Curious Why Your Pain Relief Methods Have Failed?
            </h2>
            <p className={styles.treatmentSubheadline}>We Now Know Why</p>
          </div>

          {personalizationResult.treatmentCards.length > 0 ? (
            <div className={styles.treatmentCardsContainer}>
              {personalizationResult.treatmentCards.map((treatment, index) => (
                <motion.div
                  key={treatment.id}
                  custom={index}
                  variants={treatmentCardVariants}
                  initial="hidden"
                  animate="visible"
                  className={styles.treatmentCardWrapper}
                >
                  <Card variant="white" shadow="md" padding="lg" className={styles.treatmentCard}>
                    <h4 className={styles.treatmentName}>{treatment.name}</h4>

                    {/* What it Fixed */}
                    <div className={styles.treatmentSection_fixed}>
                      <div className={styles.sectionBadge}>
                        <svg
                          className={styles.badgeIcon}
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          aria-hidden="true"
                        >
                          <path
                            d="M5 13l4 4L19 7"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        <span>What it Fixed</span>
                      </div>
                      <p className={styles.sectionText}>{treatment.whatItFixed}</p>
                    </div>

                    {/* What it Missed */}
                    <div className={styles.treatmentSection_missed}>
                      <div className={styles.sectionBadge}>
                        <svg
                          className={styles.badgeIcon}
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          aria-hidden="true"
                        >
                          <path
                            d="M6 18L18 6M6 6l12 12"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        <span>What it Missed</span>
                      </div>
                      <p className={styles.sectionText}>{treatment.whatItMissed}</p>
                    </div>

                    {/* Result */}
                    <div className={styles.treatmentSection_result}>
                      <div className={styles.sectionBadge}>
                        <svg
                          className={styles.badgeIcon}
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          aria-hidden="true"
                        >
                          <path
                            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        <span>Result</span>
                      </div>
                      <p className={styles.sectionText}>{treatment.result}</p>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          ) : (
            <Card variant="white" shadow="md" padding="lg">
              <p className={styles.noTreatmentsText}>
                While you haven't tried specific treatments yet, it's important to understand that
                most conventional approaches address symptoms rather than the underlying cellular
                damage causing chronic pain. This is why so many people continue to suffer despite
                medical intervention.
              </p>
            </Card>
          )}
        </motion.section>

        {/* SECTION 5: EDUCATION SUMMARY */}
        <motion.section
          className={styles.educationSection}
          variants={itemVariants}
        >
          <Card variant="secondary" shadow="sm" padding="lg">
            <p className={styles.educationParagraph}>
              {personalizationResult.summaryParagraph}
            </p>
            <blockquote className={styles.educationQuote}>
              "That's why you can have successful surgery but still hurt"
            </blockquote>
            <p className={styles.educationItalic}>
              Because the cellular damage was never addressed
            </p>
            <p className={styles.disclaimer}>
              *Currently, no service treats the Primary Cell
            </p>
          </Card>
        </motion.section>

        {/* SECTION 6: CALL TO ACTION */}
        <motion.section
          className={styles.ctaSection}
          variants={itemVariants}
        >
          <div className={styles.screenshotPrompt}>
            <svg
              className={styles.screenshotIcon}
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <h3 className={styles.screenshotHeading}>Take a screenshot of this page</h3>
            <button
              onClick={handleEmailResults}
              className={styles.emailLink}
              type="button"
            >
              (We can also email it to you if you like)
            </button>
          </div>

          <div className={styles.transitionMessage}>
            <p>Now for the good stuff...</p>
          </div>

          <p className={styles.processPrompt}>
            Here's how we address these pain sensations at the cellular level
          </p>
        </motion.section>

        {/* SECTION 7: ACTION BUTTON */}
        <motion.section
          className={styles.actionSection}
          variants={itemVariants}
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <Button
              variant="primary"
              size="lg"
              onClick={handleLearnMore}
              className={styles.actionButton}
              aria-label="Learn about our cellular repair process"
            >
              Learn About Our Process
            </Button>
          </motion.div>
        </motion.section>
      </motion.div>
    </div>
  );
};

export default ResultsPage;
