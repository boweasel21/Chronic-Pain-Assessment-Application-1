/**
 * ProcessSteps Component
 * Container for all process steps with state management
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ProcessStep as ProcessStepComponent } from './ProcessStep';
import { ProcessStep as ProcessStepType } from './types';
import styles from './ProcessSteps.module.css';

/**
 * Props for ProcessSteps component
 */
interface ProcessStepsProps {
  /** Array of process steps */
  steps: ProcessStepType[];
}

/**
 * Animation variants for container
 */
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
 * ProcessSteps Component
 *
 * @description Container component that manages the expansion state of process steps.
 * Only one step can be expanded at a time. Includes animated entrance.
 *
 * @param {ProcessStepsProps} props - Component props
 * @returns {JSX.Element} Rendered process steps container
 */
export const ProcessSteps: React.FC<ProcessStepsProps> = ({ steps }) => {
  const [expandedStep, setExpandedStep] = useState<number | null>(1);

  /**
   * Toggles expansion state of a process step
   * @param stepId - ID of step to toggle
   */
  const toggleStep = (stepId: number) => {
    setExpandedStep((prev) => (prev === stepId ? null : stepId));
  };

  return (
    <motion.div
      variants={itemVariants}
      className={styles.stepsSection}
    >
      <motion.div
        variants={containerVariants}
        initial="initial"
        animate="animate"
      >
        {steps.map((step) => (
          <ProcessStepComponent
            key={step.id}
            step={step}
            isExpanded={expandedStep === step.id}
            onToggle={() => toggleStep(step.id)}
          />
        ))}
      </motion.div>
    </motion.div>
  );
};
