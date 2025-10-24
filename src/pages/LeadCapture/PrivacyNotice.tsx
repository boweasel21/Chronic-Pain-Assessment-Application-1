/**
 * PrivacyNotice Component
 * Displays privacy message with lock icon and link to privacy policy
 * @module LeadCapture/PrivacyNotice
 */

import { motion } from 'framer-motion';
import styles from './PrivacyNotice.module.css';

/**
 * Props for PrivacyNotice component
 * @interface PrivacyNoticeProps
 */
export interface PrivacyNoticeProps {
  /** URL to privacy policy page */
  privacyUrl?: string;
}

/**
 * Lock icon SVG component
 * @returns {JSX.Element} Lock icon
 */
const LockIcon = (): JSX.Element => (
  <svg
    className={styles.lockIcon}
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path
      d="M10 2C7.79086 2 6 3.79086 6 6V8H5C3.89543 8 3 8.89543 3 10V16C3 17.1046 3.89543 18 5 18H15C16.1046 18 17 17.1046 17 16V10C17 8.89543 16.1046 8 15 8H14V6C14 3.79086 12.2091 2 10 2ZM12 8V6C12 4.89543 11.1046 4 10 4C8.89543 4 8 4.89543 8 6V8H12Z"
      fill="currentColor"
    />
  </svg>
);

/**
 * PrivacyNotice Component
 *
 * @description Displays a privacy assurance message with a lock icon and
 * a link to the privacy policy. Helps build trust with users by emphasizing
 * data security and privacy commitment.
 *
 * @param {PrivacyNoticeProps} props - Component props
 * @returns {JSX.Element} Privacy notice
 */
export const PrivacyNotice = ({
  privacyUrl = '/privacy',
}: PrivacyNoticeProps): JSX.Element => {
  return (
    <motion.div
      className={styles.container}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.4 }}
    >
      <LockIcon />
      <p className={styles.text}>
        We respect your privacy. Your information is secure.{' '}
        <a
          href={privacyUrl}
          className={styles.link}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Read our privacy policy (opens in new tab)"
        >
          Privacy Policy
        </a>
      </p>
    </motion.div>
  );
};
