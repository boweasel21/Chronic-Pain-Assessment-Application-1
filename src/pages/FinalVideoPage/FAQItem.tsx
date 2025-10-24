/**
 * FAQItem Component
 * Single expandable FAQ item
 */

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@components/common/Card';
import { FAQItem as FAQItemType } from './types';
import styles from './FAQItem.module.css';

/**
 * Props for FAQItem component
 */
interface FAQItemProps {
  /** FAQ data */
  faq: FAQItemType;
  /** Index of this FAQ item */
  index: number;
  /** Whether this FAQ is currently open */
  isOpen: boolean;
  /** Callback when FAQ is toggled */
  onToggle: () => void;
}

/**
 * FAQItem Component
 *
 * @description Single FAQ item with expandable answer. Includes smooth
 * animation and accessibility support.
 *
 * @param {FAQItemProps} props - Component props
 * @returns {JSX.Element} Rendered FAQ item
 */
export const FAQItem: React.FC<FAQItemProps> = ({ faq, index, isOpen, onToggle }) => {
  return (
    <Card variant="white" shadow="sm" padding="md" className={styles.faqCard}>
      <button
        onClick={onToggle}
        className={styles.faqButton}
        type="button"
        aria-expanded={isOpen}
        aria-controls={`faq-answer-${index}`}
      >
        <span className={styles.faqQuestion}>{faq.question}</span>
        <motion.svg
          className={styles.faqIcon}
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          aria-hidden="true"
        >
          <path
            d="M19 9l-7 7-7-7"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </motion.svg>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            id={`faq-answer-${index}`}
            className={styles.faqAnswer}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <p className={styles.faqAnswerText}>{faq.answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
};
