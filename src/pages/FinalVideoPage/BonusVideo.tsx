/**
 * BonusVideo Component
 * YouTube video embed with description
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '@components/common/Card';
import styles from './BonusVideo.module.css';

/**
 * Props for BonusVideo component
 */
interface BonusVideoProps {
  /** YouTube video ID */
  videoId: string;
}

/**
 * BonusVideo Component
 *
 * @description Displays embedded YouTube video with responsive aspect ratio
 * and descriptive text. Video loads lazily for performance.
 *
 * @param {BonusVideoProps} props - Component props
 * @returns {JSX.Element} Rendered bonus video section
 */
export const BonusVideo: React.FC<BonusVideoProps> = ({ videoId }) => {
  return (
    <motion.section
      className={styles.bonusSection}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.6 }}
    >
      <h2 className={styles.sectionHeading}>While You Wait, Check This Out...</h2>

      <Card variant="white" shadow="md" padding="lg">
        <div className={styles.videoWrapper}>
          <iframe
            className={styles.videoEmbed}
            src={`https://www.youtube.com/embed/${videoId}?rel=0`}
            title="7-minute deep dive on cellular pain mechanisms"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            loading="lazy"
          />
        </div>
        <p className={styles.videoDescription}>
          7-minute deep dive on cellular pain mechanisms and why traditional treatments often fall short
        </p>
      </Card>
    </motion.section>
  );
};
