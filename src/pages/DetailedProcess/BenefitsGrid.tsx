/**
 * BenefitsGrid Component
 * Grid of benefit cards with responsive layout
 */

import React from 'react';
import { Benefit } from './types';
import styles from './BenefitsGrid.module.css';

/**
 * Props for BenefitsGrid component
 */
interface BenefitsGridProps {
  /** Array of benefits to display */
  benefits: Benefit[];
}

/**
 * BenefitsGrid Component
 *
 * @description Displays a responsive grid of benefit cards.
 * Layout: 1 column on mobile, 2 on tablet, 3 on desktop, 5 on large desktop.
 *
 * @param {BenefitsGridProps} props - Component props
 * @returns {JSX.Element} Rendered benefits grid
 */
export const BenefitsGrid: React.FC<BenefitsGridProps> = ({ benefits }) => {
  return (
    <section className={styles.benefitsSection}>
      <h2 className={styles.sectionTitle}>What You'll Experience</h2>
      <p className={styles.sectionDescription}>
        These aren't promises—they're the natural results of repairing cellular damage:
      </p>

      <div className={styles.benefitsGrid}>
        {benefits.map((benefit, index) => (
          <div key={index} className={styles.benefitCard}>
            <div className={styles.benefitIcon}>{benefit.icon}</div>
            <h3 className={styles.benefitTitle}>{benefit.title}</h3>
            <p className={styles.benefitDescription}>{benefit.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};
