/**
 * FinalCTA Component
 * Final call-to-action section
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '@components/common/Card';
import { Button } from '@components/common/Button';
import styles from './FinalCTA.module.css';

/**
 * Props for FinalCTA component
 */
interface FinalCTAProps {
  /** Calendly URL for booking another session */
  calendlyUrl: string;
}

/**
 * FinalCTA Component
 *
 * @description Final call-to-action section for booking additional sessions.
 * Features prominent button with accessible design.
 *
 * @param {FinalCTAProps} props - Component props
 * @returns {JSX.Element} Rendered final CTA section
 */
export const FinalCTA: React.FC<FinalCTAProps> = ({ calendlyUrl }) => {
  /**
   * Handle "Book Another Session" click
   */
  const handleBookAnother = (): void => {
    window.open(calendlyUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <motion.section
      className={styles.ctaSection}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 1.2 }}
    >
      <Card variant="primary" shadow="lg" padding="lg" className={styles.ctaCard}>
        <h2 className={styles.ctaHeading}>Ready for More Support?</h2>
        <p className={styles.ctaText}>
          Need to schedule an additional session or have questions? We're here to help.
        </p>
        <Button
          variant="secondary"
          size="large"
          onClick={handleBookAnother}
          aria-label="Book another session"
        >
          Book Another Session
        </Button>
      </Card>
    </motion.section>
  );
};
