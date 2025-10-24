/**
 * ConfirmationCard Component
 * Booking details with add to calendar functionality
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '@components/common/Card';
import styles from './ConfirmationCard.module.css';

/**
 * Props for ConfirmationCard component
 */
interface ConfirmationCardProps {
  /** Calendly URL for adding to calendar */
  calendlyUrl: string;
}

/**
 * ConfirmationCard Component
 *
 * @description Displays appointment details and provides add to calendar functionality.
 * Shows date/time placeholder and format information.
 *
 * @param {ConfirmationCardProps} props - Component props
 * @returns {JSX.Element} Rendered confirmation card
 */
export const ConfirmationCard: React.FC<ConfirmationCardProps> = ({ calendlyUrl }) => {
  /**
   * Handle "Add to Calendar" click
   */
  const handleAddToCalendar = (): void => {
    window.open(calendlyUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <motion.section
      className={styles.bookingSection}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
    >
      <Card variant="white" shadow="lg" padding="lg">
        <h2 className={styles.cardHeading}>Your Appointment Details</h2>

        <div className={styles.detailsGrid}>
          <div className={styles.detailItem}>
            <svg
              className={styles.detailIcon}
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <div>
              <p className={styles.detailLabel}>Date & Time</p>
              <p className={styles.detailValue}>You'll receive confirmation via email</p>
            </div>
          </div>

          <div className={styles.detailItem}>
            <svg
              className={styles.detailIcon}
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                d="M15 10l-4 4 6 6 4-16-18 7 4 2 2 6 3-4z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <div>
              <p className={styles.detailLabel}>Format</p>
              <p className={styles.detailValue}>Video call via Zoom</p>
            </div>
          </div>
        </div>

        <button
          onClick={handleAddToCalendar}
          className={styles.calendarButton}
          type="button"
          aria-label="Add appointment to calendar"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              d="M6 2V6M14 2V6M3 10H17M5 4H15C16.1046 4 17 4.89543 17 6V16C17 17.1046 16.1046 18 15 18H5C3.89543 18 3 17.1046 3 16V6C3 4.89543 3.89543 4 5 4Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Add to Calendar
        </button>
      </Card>
    </motion.section>
  );
};
