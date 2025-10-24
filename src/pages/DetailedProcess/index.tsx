/**
 * Detailed Process Page (Page 10)
 * Comprehensive explanation of 4-step Cellular Repair Process
 */

import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@components/common/Button';
import { ProcessSteps } from './ProcessSteps';
import { BenefitsGrid } from './BenefitsGrid';
import { processSteps, benefits } from './data';
import styles from './index.module.css';

/**
 * Animation variants
 */
const pageVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

const containerVariants = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

/**
 * Detailed Process Page Component
 *
 * @description Comprehensive page explaining the 4-step Cellular Repair Process
 * with expandable sections, benefits, and call-to-action. Now refactored into
 * smaller, maintainable components.
 *
 * @returns {JSX.Element} Rendered detailed process page
 */
const DetailedProcess: React.FC = () => {
  const navigate = useNavigate();

  /**
   * Handles navigation to proof/offer page
   */
  const handleGetStarted = () => {
    navigate('/proof-offer-1');
  };

  return (
    <motion.div
      className={styles.page}
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.5 }}
    >
      <div className={styles.container}>
        <motion.div
          className={styles.content}
          variants={containerVariants}
          initial="initial"
          animate="animate"
        >
          {/* Main Headline */}
          <motion.div variants={itemVariants}>
            <h1 className={styles.headline}>Your 4-Step Cellular Repair Process</h1>
            <p className={styles.subtitle}>
              This isn't guesswork. This is systematic cellular repair based on proven science.
            </p>
          </motion.div>

          {/* Process Steps */}
          <ProcessSteps steps={processSteps} />

          {/* Benefits Section */}
          <motion.div variants={itemVariants}>
            <BenefitsGrid benefits={benefits} />
          </motion.div>

          {/* Final Message */}
          <motion.div variants={itemVariants} className={styles.finalMessage}>
            <h2 className={styles.finalMessageTitle}>
              This Is How We Get Results When Nothing Else Works
            </h2>
            <p className={styles.finalMessageText}>
              Standard medicine treats symptoms. Surgery removes structures. Medications mask
              signals.
            </p>
            <p className={styles.finalMessageText}>
              <strong>We repair the cellular damage causing your pain.</strong>
            </p>
            <p className={styles.finalMessageText}>
              That's why our patients see results after years—sometimes decades—of failed
              treatments.
            </p>
          </motion.div>

          {/* Call to Action */}
          <motion.div variants={itemVariants} className={styles.cta}>
            <Button
              variant="primary"
              size="large"
              onClick={handleGetStarted}
              aria-label="Start your cellular repair journey"
              fullWidth
            >
              I Want to Get Started
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default DetailedProcess;
