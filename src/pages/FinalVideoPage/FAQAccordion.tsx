/**
 * FAQAccordion Component
 * Container for FAQ items with state management
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FAQItem as FAQItemComponent } from './FAQItem';
import { FAQItem } from './types';
import styles from './FAQAccordion.module.css';

/**
 * Props for FAQAccordion component
 */
interface FAQAccordionProps {
  /** Array of FAQ items */
  faqs: FAQItem[];
}

/**
 * FAQAccordion Component
 *
 * @description Manages the expansion state of FAQ items. Only one FAQ
 * can be expanded at a time. Includes animated entrance.
 *
 * @param {FAQAccordionProps} props - Component props
 * @returns {JSX.Element} Rendered FAQ accordion
 */
export const FAQAccordion: React.FC<FAQAccordionProps> = ({ faqs }) => {
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);

  /**
   * Toggle FAQ item expansion
   * @param index - Index of FAQ item to toggle
   */
  const toggleFAQ = (index: number): void => {
    setExpandedFAQ((prev) => (prev === index ? null : index));
  };

  return (
    <motion.section
      className={styles.faqSection}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 1.0 }}
    >
      <h2 className={styles.sectionHeading}>Frequently Asked Questions</h2>

      <div className={styles.faqList}>
        {faqs.map((faq, index) => (
          <FAQItemComponent
            key={index}
            faq={faq}
            index={index}
            isOpen={expandedFAQ === index}
            onToggle={() => toggleFAQ(index)}
          />
        ))}
      </div>
    </motion.section>
  );
};
