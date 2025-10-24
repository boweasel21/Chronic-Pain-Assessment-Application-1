/**
 * ProcessStep Component
 * Reusable step card component with smooth expand/collapse animation
 */

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ProcessStep as ProcessStepType } from './types';
import styles from './ProcessStep.module.css';

/**
 * Props for ProcessStep component
 */
interface ProcessStepProps {
  /** Step data */
  step: ProcessStepType;
  /** Whether this step is expanded */
  isExpanded: boolean;
  /** Callback when step is toggled */
  onToggle: () => void;
}

/**
 * ProcessStep Component
 *
 * @description Individual process step card with expandable content.
 * Features smooth animations, accessibility support, and detailed step information.
 *
 * @param {ProcessStepProps} props - Component props
 * @returns {JSX.Element} Rendered process step card
 */
export const ProcessStep: React.FC<ProcessStepProps> = ({ step, isExpanded, onToggle }) => {
  return (
    <div className={styles.stepCard}>
      <button
        onClick={onToggle}
        className={styles.stepHeader}
        aria-expanded={isExpanded}
        aria-controls={`step-${step.id}-content`}
      >
        <div className={styles.stepNumber}>Step {step.id}</div>
        <div className={styles.stepIcon}>{step.icon}</div>
        <div className={styles.stepHeaderContent}>
          <h2 className={styles.stepTitle}>{step.title}</h2>
          <p className={styles.stepSubtitle}>{step.subtitle}</p>
        </div>
        <div
          className={`${styles.stepToggle} ${isExpanded ? styles.stepToggleExpanded : ''}`}
          aria-hidden="true"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M6 9l6 6 6-6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </button>

      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            id={`step-${step.id}-content`}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className={styles.stepContent}
          >
            <div className={styles.stepContentInner}>
              <p className={styles.stepDescription}>{step.description}</p>

              <div className={styles.stepDetails}>
                <h3 className={styles.stepDetailsTitle}>What We Assess & Repair:</h3>
                <ul className={styles.stepDetailsList}>
                  {step.details.map((detail, idx) => (
                    <li key={idx}>{detail}</li>
                  ))}
                </ul>
              </div>

              <div className={styles.stepExamples}>
                <h3 className={styles.stepDetailsTitle}>Real Examples:</h3>
                <ul className={styles.stepExamplesList}>
                  {step.examples.map((example, idx) => (
                    <li key={idx}>{example}</li>
                  ))}
                </ul>
              </div>

              <div className={styles.stepTimeline}>
                <strong>Timeline:</strong> {step.timeline}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
