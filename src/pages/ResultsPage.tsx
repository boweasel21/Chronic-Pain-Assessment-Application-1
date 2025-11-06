import React, { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAssessment } from '@context/AssessmentContext';
import { generatePersonalizedResults, PersonalizationResult } from '../../utils/personalization';
import { Button } from '@components/common/Button';
import styles from './ResultsPage.module.css';

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

const treatmentVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.45,
      ease: 'easeOut',
    },
  },
};

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

const ResultsPage = (): JSX.Element => {
  const navigate = useNavigate();
  const { state } = useAssessment();

  const personalizationResult: PersonalizationResult = useMemo(() => {
    let conditions: string[] = [];
    let sensations: string[] = [];
    let previousTreatments: string[] = [];

    try {
      const savedConditions = localStorage.getItem('selected_conditions');
      if (savedConditions) {
        conditions = JSON.parse(savedConditions);
      }
    } catch (error) {
      console.error('Error loading conditions from localStorage:', error);
    }

    try {
      const savedSensations = localStorage.getItem('selected_sensations');
      if (savedSensations) {
        sensations = JSON.parse(savedSensations);
      }
    } catch (error) {
      console.error('Error loading sensations from localStorage:', error);
    }

    try {
      const savedTreatments = localStorage.getItem('assessment_treatment_history');
      if (savedTreatments) {
        const data = JSON.parse(savedTreatments);
        previousTreatments = data.selectedTreatments || [];
      }
    } catch (error) {
      console.error('Error loading treatments from localStorage:', error);
    }

    const responses = {
      conditions: conditions.length > 0 ? conditions : state.response.conditionType ? [state.response.conditionType] : [],
      sensations: sensations.length > 0 ? sensations : state.response.sensations || [],
      duration: undefined,
      intensity: state.response.painLevel || undefined,
      previousTreatments: previousTreatments.length > 0 ? previousTreatments : state.response.currentTreatments || [],
      activityImpact: state.response.dailyImpact || undefined,
      goals: state.response.educationalInterests?.join(', ') || undefined,
    };

    return generatePersonalizedResults(responses);
  }, [state]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const treatableConditions = personalizationResult.conditions.filter(
    (condition) => condition.category === 'treatable'
  );
  const nonTreatableConditions = personalizationResult.conditions.filter(
    (condition) => condition.category === 'non-treatable'
  );

  const hasTreatable = treatableConditions.length > 0;
  const conditionNames = hasTreatable
    ? treatableConditions.map((condition) => condition.name)
    : personalizationResult.conditions.map((condition) => condition.name);
  const conditionListText = conditionNames.length > 0
    ? formatList(conditionNames)
    : 'the information you provided';
  const treatableVerb = conditionNames.length === 1 ? 'is' : 'are';

  const nonTreatableNames = nonTreatableConditions.map((condition) => condition.name);
  const nonTreatableVerb = nonTreatableNames.length === 1 ? 'is' : 'are';
  const nonTreatableListText = nonTreatableNames.length > 0 ? formatList(nonTreatableNames) : '';

  const sensationNames = personalizationResult.sensations.map((sensation) => sensation.name);
  const sensationListText =
    sensationNames.length > 0 ? sensationNames.join(', ') : 'the pain signals you described';

  const treatmentCards = personalizationResult.treatmentCards;

  const handleNext = (): void => {
    navigate('/process-explanation');
  };

  return (
    <div className={styles.pageContainer}>
      <motion.div
        className={styles.contentWrapper}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.section className={styles.headerSection} variants={itemVariants}>
          <h1 className={styles.mainHeadline}>Congratulations! You Qualified!</h1>
          <p className={styles.sectionLabel}>Your Personalized Pain Pattern Profile</p>

          <div className={styles.profileCard}>
            <p className={styles.profileLine}>
              <span className={styles.profileLabel}>Issue causing chronic pain:</span> {conditionListText}
            </p>
            <p className={styles.profileLine}>
              <span className={styles.profileLabel}>Symptoms associated with pain:</span> {sensationListText}.
            </p>
            {hasTreatable && (
              <p className={styles.profileLine}>
                These symptoms associated with your condition(s) make you a strong candidate for our Cellular Repair Process.
              </p>
            )}
            {nonTreatableNames.length > 0 && (
              <>
                <p className={styles.profileLine}>
                  Unfortunately, {nonTreatableListText} {nonTreatableVerb} not good candidates for our process. These chronic pain conditions are associated with diseases and infections caused by pathogens that are beyond our reach.
                </p>
                {hasTreatable && (
                  <p className={styles.profileLine}>
                    We apologize for that. But, {conditionListText} {treatableVerb} good {conditionNames.length === 1 ? 'candidate' : 'candidates'}.
                  </p>
                )}
              </>
            )}
          </div>

          <p className={styles.paragraph}>
            After we teach you how we repair your Primary Cell on the following pages, we’ll give you access to connect with us.
          </p>
          <p className={styles.paragraph}>First, a quick question…</p>
        </motion.section>

        <motion.section className={styles.breakdownSection} variants={itemVariants}>
          <h2 className={styles.sectionHeadline}>
            Curious Why Pain Relief Methods and Approaches Have Failed to Fix Your Pain?
          </h2>
          <h3 className={styles.sectionSubheadline}>We Now Know Why</h3>
          <p className={styles.sectionIntro}>
            Your Personalized Breakdown (based on your checked treatments).
          </p>

          {treatmentCards.length > 0 ? (
            <div className={styles.treatmentGrid}>
              {treatmentCards.map((card) => (
                <motion.article
                  key={card.id}
                  className={styles.treatmentCard}
                  variants={treatmentVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <h4 className={styles.treatmentName}>{card.name}</h4>
                  <ul className={styles.treatmentList}>
                    <li className={styles.treatmentItem}>
                      <span aria-hidden="true">✅</span>{' '}
                      <strong>What it fixed:</strong> {card.whatItFixed}
                    </li>
                    <li className={styles.treatmentItem}>
                      <span aria-hidden="true">❌</span>{' '}
                      <strong>What it missed:</strong> {card.whatItMissed}.
                    </li>
                    <li className={styles.treatmentItem}>
                      <span aria-hidden="true">📊</span>{' '}
                      <strong>Result:</strong> {card.result}
                    </li>
                  </ul>
                </motion.article>
              ))}
            </div>
          ) : (
            <p className={styles.paragraph}>
              {/* Proposed copy: fallback when no treatments are listed */}
              You didn’t list any previous pain relief approaches. That means every aspect of your Primary Cell damage is still waiting to be repaired.
            </p>
          )}
        </motion.section>

        <motion.section className={styles.summarySection} variants={itemVariants}>
          <h3 className={styles.summaryHeading}>In Summary…</h3>
          <p className={styles.paragraph}>
            Pain medication masks your pain signals. And traditional medicine and alternative approaches treat symptoms, not cellular causes.
          </p>
          <p className={styles.paragraph}>
            None of these approaches repairs the cellular damage in the Primary Cell, so your cells keep recreating your pain pattern.
          </p>
          <p className={styles.paragraph}>That's why you can have “successful" surgery but still hurt.</p>
          <p className={styles.paragraph}>That's why you've tried "everything", but nothing lasts.</p>
          <p className={styles.paragraph}>Because the cellular damage was never addressed.</p>
          <p className={styles.note}>
            <strong>Note:</strong> Currently, no other service, product, therapy, or treatment on the market focuses on the Primary Cell to eliminate cellular damage.
          </p>
        </motion.section>

        <motion.section className={styles.summaryFooter} variants={itemVariants}>
          <p className={styles.paragraph}>Take a screenshot of this page. (We can also email it to you if you like.)</p>
          <p className={styles.paragraph}>Now for the good stuff…</p>
        </motion.section>

        <motion.section className={styles.nextSection} variants={itemVariants}>
          <h2 className={styles.nextHeadline}>
            Here’s how we address these pain sensations at the cellular level to free you of your pain
          </h2>
          <Button
            variant="primary"
            size="large"
            onClick={handleNext}
            aria-label="Go to the process explanation page"
          >
            Next Page
          </Button>
        </motion.section>
      </motion.div>
    </div>
  );
};

export default ResultsPage;
