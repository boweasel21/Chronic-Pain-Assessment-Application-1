/**
 * Landing Page Component
 * First page of the Primary Cell Assessment - introduces cellular pain science
 * and qualifies users based on chronic pain duration
 */

import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAssessment } from '@context/AssessmentContext';
import { usePageFocus, usePrefersReducedMotion } from '@hooks/useAccessibility';
import { Button } from '@components/common/Button';
import { HERO_VISUALS } from '@data/landingVisuals';
import styles from './LandingPage.module.css';

/**
 * Landing Page Component
 *
 * @description Entry point for the assessment flow. Educates users about cellular
 * pain science and routes based on chronic pain duration (6+ months qualification).
 *
 * Features:
 * - Hero section with compelling headline
 * - Educational content blocks explaining damage types
 * - Visual section with AI-generated image descriptions
 * - Yes/No button routing logic
 * - Framer Motion entrance animations
 * - Mobile-first responsive design
 * - WCAG 2.1 AA accessibility
 *
 * @returns {JSX.Element} Landing page component
 */
const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { updateResponse } = useAssessment();
  const [selectedAnswer, setSelectedAnswer] = useState<boolean | null>(null);

  /**
   * Accessibility: Focus management and motion preferences
   */
  usePageFocus('landing-main');
  const prefersReducedMotion = usePrefersReducedMotion();

  /**
   * Memoized hero visuals ensure stable references for rendering and animation
   */
  const heroVisuals = useMemo(() => HERO_VISUALS, []);

  /**
   * Handles answer selection and navigation
   *
   * @param hasChronicPain - Whether user has chronic pain for 6+ months
   */
  const handleAnswer = (hasChronicPain: boolean): void => {
    setSelectedAnswer(hasChronicPain);

    updateResponse({
      painDuration: hasChronicPain ? 12 : 3,
    });

    setTimeout(() => {
      if (hasChronicPain) {
        navigate('/cellular-science');
      } else {
        navigate('/waiting-list');
      }
    }, 400);
  };

  /**
   * Container animation variants - respects reduced motion
   */
  const containerVariants = prefersReducedMotion
    ? {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 0.01 } },
      }
    : {
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: 0.1,
            delayChildren: 0.2,
          },
        },
      };

  /**
   * Item animation variants - respects reduced motion
   */
  const itemVariants = prefersReducedMotion
    ? {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 0.01 } },
      }
    : {
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
   * Button animation variants - respects reduced motion
   */
  const buttonVariants = prefersReducedMotion
    ? {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 0.01 } },
      }
    : {
        hidden: { opacity: 0, scale: 0.9 },
        visible: {
          opacity: 1,
          scale: 1,
          transition: {
            duration: 0.4,
            ease: 'easeOut',
          },
        },
        hover: {
          scale: 1.05,
          transition: {
            duration: 0.2,
          },
        },
        tap: {
          scale: 0.95,
        },
      };

  /**
   * Save progress to localStorage on mount
   */
  useEffect(() => {
    try {
      localStorage.setItem('assessment_last_page', '/');
      localStorage.setItem('assessment_timestamp', new Date().toISOString());
    } catch (error) {
      // Silently fail if localStorage is not available
    }
  }, []);

  return (
    <motion.div
      id="landing-main"
      className={styles.landing}
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      tabIndex={-1}
      style={{ outline: 'none' }}
    >
      {/* Hero Section */}
      <motion.section
        className={styles.landing__intro}
        variants={itemVariants}
        role="banner"
      >
        <h1 className={styles.landing__headline}>
          Scientists Just Proved Chronic Pain Lives Inside Your Cells—And We Can Now Fix It
        </h1>

        <h2 className={styles.landing__subheadline}>
          What if your chronic pain isn&apos;t a &ldquo;pain management&rdquo; problem... but a cellular repair problem?
        </h2>

        <p className={styles.landing__supportingCopy}>
          Breakthrough peer-reviewed research has just confirmed what we've been seeing in our clinic for years: chronic pain is literally stored inside your cells as damaged genetic material—and it can be repaired.
        </p>

        <h3 className={styles.landing__scienceLead}>
          Here's the science most doctors don't know about:
        </h3>
        <p className={styles.landing__scienceCopy}>
          When you get injured, three types of damage occur simultaneously:
        </p>
      </motion.section>

      {/* Hero Visual Grid */}
      <motion.section
        className={styles.landing__heroGrid}
        variants={itemVariants}
        aria-labelledby="cellular-damage-visuals"
      >
        {/* Proposed copy: heading for the four hero visuals */}
        <h2 id="cellular-damage-visuals" className={styles.landing__heroGridTitle}>
          Cellular damage you can actually see
        </h2>
        <div className={styles.landing__heroGridContent}>
          {heroVisuals.map((visual, index) => (
            <motion.article
              key={visual.id}
              className={styles.landing__heroCard}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: {
                    duration: 0.5,
                    delay: index * 0.15,
                    ease: 'easeOut',
                  },
                },
              }}
            >
              <div
                className={styles.landing__heroIllustration}
                role="img"
                aria-label={visual.illustration.alt}
                data-illustration-key={visual.illustration.key}
                style={{
                  backgroundImage: `var(--hero-visual-${visual.illustration.key}, linear-gradient(135deg, rgba(29, 44, 73, 0.85), rgba(29, 44, 73, 0.6)))`,
                }}
              >
                <span className={styles.landing__heroIllustrationCaption}>
                  {visual.illustration.caption}
                </span>
              </div>
              <div className={styles.landing__heroCopy}>
                {visual.support ? (
                  <p className={styles.landing__heroText}>
                    <strong>{visual.lead} – </strong>
                    {visual.support}
                  </p>
                ) : (
                  <p className={styles.landing__heroText}>
                    {visual.lead}
                  </p>
                )}
              </div>
            </motion.article>
          ))}
        </div>
      </motion.section>

      {/* Narrative Flow */}
      <motion.section
        className={styles.landing__narrative}
        variants={itemVariants}
        aria-label="Assessment expectations"
      >
        <p className={styles.landing__narrativeCopy}>
          During your assessment, you will learn how chronic pain can live inside your cells and how non-invasive cellular repair works to fix it.
        </p>
        <p className={styles.landing__narrativeCopy}>
          Most importantly, by the end of your assessment, you will know if you’re a likely candidate for our process and what to do next to move forward.
        </p>
      </motion.section>

      {/* Warning Callout */}
      <motion.aside
        className={styles.landing__warning}
        variants={itemVariants}
        role="note"
        aria-labelledby="warning-heading"
      >
        <h3 id="warning-heading" className={styles.landing__warningTitle}>
          Warning!
        </h3>
        <p className={styles.landing__warningCopy}>
          Much of what you’ve been told about your chronic pain is probably an incomplete picture. This new research represents a significant breakthrough that has changed how we scientists understand chronic pain.
        </p>
      </motion.aside>

      {/* Additional Guidance */}
      <motion.section
        className={styles.landing__additional}
        variants={itemVariants}
      >
        <p className={styles.landing__additionalCopy}>
          Most of what you read today will be entirely new to you. As such, you can request these peer-reviewed studies to review for yourself following your assessment.
        </p>
      </motion.section>

      {/* Qualification Question */}
      <motion.section
        className={styles.landing__qualification}
        variants={itemVariants}
        aria-labelledby="qualification-question"
      >
        <div className={styles.landing__questionCard}>
          <h2 id="qualification-question" className={styles.landing__question}>
            Have you had chronic pain for 6+ months? Yes or No
          </h2>
          <p className={styles.landing__questionHelper}>
            This helps us determine if your chronic pain could be correlated to cellular damage.
          </p>
        </div>

        <div className={styles.landing__buttonGroup} role="group" aria-label="Chronic pain duration selection">
          <motion.div
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
          >
            <Button
              variant="primary"
              size="large"
              onClick={() => handleAnswer(true)}
              aria-label="Yes, I have had chronic pain for 6 or more months"
              className={`${styles.landing__button} ${
                selectedAnswer === true ? styles['landing__button--selected'] : ''
              }`}
            >
              <span className={styles.landing__buttonIcon}>✓</span>
              Yes
            </Button>
          </motion.div>

          <motion.div
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
          >
            <Button
              variant="secondary"
              size="large"
              onClick={() => handleAnswer(false)}
              aria-label="No, I have not had chronic pain for 6 or more months"
              className={`${styles.landing__button} ${
                selectedAnswer === false ? styles['landing__button--selected'] : ''
              }`}
            >
              <span className={styles.landing__buttonIcon}>✗</span>
              No
            </Button>
          </motion.div>
        </div>
      </motion.section>
    </motion.div>
  );
};

export default LandingPage;
