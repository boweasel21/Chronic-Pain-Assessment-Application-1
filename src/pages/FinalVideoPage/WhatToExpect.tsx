/**
 * WhatToExpect Component
 * Grid of expectation cards for the discovery call
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '@components/common/Card';
import { ExpectItem } from './types';
import styles from './WhatToExpect.module.css';

/**
 * Props for WhatToExpect component
 */
interface WhatToExpectProps {
  /** Array of expectation items to display */
  items: ExpectItem[];
}

/**
 * WhatToExpect Component
 *
 * @description Displays a responsive grid of what to expect on the discovery call.
 * Shows 4 expectation cards with icons, titles, and descriptions.
 *
 * @param {WhatToExpectProps} props - Component props
 * @returns {JSX.Element} Rendered what to expect section
 */
export const WhatToExpect: React.FC<WhatToExpectProps> = ({ items }) => {
  return (
    <motion.section
      className={styles.expectSection}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.8 }}
    >
      <h2 className={styles.sectionHeading}>What to Expect on Your Discovery Call</h2>

      <div className={styles.expectGrid}>
        {items.map((item, index) => (
          <Card
            key={index}
            variant="secondary"
            shadow="sm"
            padding="md"
            className={styles.expectCard}
          >
            <div className={styles.expectIcon}>{item.icon}</div>
            <h3 className={styles.expectTitle}>{item.title}</h3>
            <p className={styles.expectText}>{item.text}</p>
          </Card>
        ))}
      </div>
    </motion.section>
  );
};
