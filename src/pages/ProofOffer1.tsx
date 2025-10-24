/**
 * Proof Offer 1 Page (Page 11)
 * First proof page offering highlights video
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAssessment } from '@context/AssessmentContext';
import { Button } from '@components/common/Button';
import styles from './ProofOffer1.module.css';

/**
 * Trust badge interface
 */
interface TrustBadge {
  icon: JSX.Element;
  title: string;
  description: string;
}

/**
 * Trust badges data
 */
const trustBadges: TrustBadge[] = [
  {
    icon: (
      <svg
        width="32"
        height="32"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          d="M16 4l4 8 8 1-6 6 1.5 8L16 23l-7.5 4L10 19l-6-6 8-1 4-8z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    title: '100+ Patient Success Stories',
    description: 'Real results from real people',
  },
  {
    icon: (
      <svg
        width="32"
        height="32"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <circle cx="16" cy="16" r="12" stroke="currentColor" strokeWidth="2" />
        <path
          d="M16 8v8l4 4"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    title: '8-Year Clinical Track Record',
    description: 'Proven methodology over time',
  },
  {
    icon: (
      <svg
        width="32"
        height="32"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          d="M16 28c6.627 0 12-5.373 12-12S22.627 4 16 4 4 9.373 4 16s5.373 12 12 12z"
          stroke="currentColor"
          strokeWidth="2"
        />
        <path
          d="M10 16l3 3 6-6"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    title: '95% Satisfaction Rate',
    description: 'Consistently high patient approval',
  },
];

/**
 * Animation variants
 */
const pageVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

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

const videoCardVariants = {
  initial: { opacity: 0, scale: 0.95, y: 30 },
  animate: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: 'easeOut',
    },
  },
};

/**
 * Video placeholder component
 * @param props - Component props
 * @returns Rendered placeholder
 */
interface VideoPlaceholderProps {
  onRetry: () => void;
}

const VideoPlaceholder: React.FC<VideoPlaceholderProps> = ({ onRetry }) => (
  <div className={styles.videoPlaceholder}>
    <div className={styles.placeholderContent}>
      <svg
        className={styles.placeholderIcon}
        width="64"
        height="64"
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <rect
          x="8"
          y="12"
          width="48"
          height="40"
          rx="4"
          stroke="currentColor"
          strokeWidth="2"
        />
        <path d="M26 24l16 10-16 10V24z" fill="currentColor" />
      </svg>
      <p className={styles.placeholderText}>Video unavailable</p>
      <button
        onClick={onRetry}
        className={styles.placeholderButton}
        aria-label="Retry loading video"
      >
        Retry
      </button>
    </div>
  </div>
);

/**
 * Proof Offer 1 Page Component
 *
 * @description First proof page offering highlights video showing patient transformations.
 * Users can choose to watch or skip, both options route to proof-offer-2.
 * Includes trust badges and compelling video description.
 *
 * @returns Rendered proof offer 1 page
 */
const ProofOffer1: React.FC = () => {
  const navigate = useNavigate();
  const { updateResponse } = useAssessment();
  const [videoError, setVideoError] = useState(false);
  const [videoRetryCount, setVideoRetryCount] = useState(0);

  // Get video ID from environment variable
  const videoId = import.meta.env.VITE_VIDEO_HIGHLIGHTS_ID || 'dQw4w9WgXcQ';

  /**
   * Handles "Yes" button click - user wants to see highlights video
   */
  const handleYes = () => {
    updateResponse({ wantsHighlightsVideo: true });
    navigate('/proof-offer-2');
  };

  /**
   * Handles "Skip" button click - user skips highlights video
   */
  const handleSkip = () => {
    updateResponse({ wantsHighlightsVideo: false });
    navigate('/proof-offer-2');
  };

  /**
   * Handles video error
   */
  const handleVideoError = () => {
    setVideoError(true);
  };

  /**
   * Handles video retry
   */
  const handleVideoRetry = () => {
    setVideoError(false);
    setVideoRetryCount((prev) => prev + 1);
  };

  /**
   * Handles video load success
   */
  const handleVideoLoad = () => {
    setVideoError(false);
  };

  return (
    <motion.div
      className={styles.page}
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.5 }}
    >
      <div className={styles.container}>
        <motion.div
          className={styles.content}
          variants={containerVariants}
          initial="initial"
          animate="animate"
        >
          {/* Main Headline */}
          <motion.div variants={itemVariants} className={styles.header}>
            <h1 className={styles.headline}>Wait... Before We Continue...</h1>
            <p className={styles.subtext}>We Want to Prove This Works</p>
          </motion.div>

          {/* Video Section */}
          <motion.div variants={videoCardVariants} className={styles.videoSection}>
            <div className={styles.videoCard}>
              <div className={styles.videoWrapper}>
                {videoError ? (
                  <VideoPlaceholder onRetry={handleVideoRetry} />
                ) : (
                  <iframe
                    key={`video-${videoRetryCount}`}
                    className={styles.video}
                    src={`https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`}
                    title="Patient Transformation Highlights"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    onError={handleVideoError}
                    onLoad={handleVideoLoad}
                    loading="lazy"
                  />
                )}
              </div>

              <div className={styles.videoDescription}>
                <p className={styles.videoDescriptionText}>
                  Watch a brief 3-minute highlights video showing real patient transformations
                </p>
              </div>
            </div>
          </motion.div>

          {/* Question */}
          <motion.div variants={itemVariants} className={styles.question}>
            <h2 className={styles.questionText}>
              Would you like to see the highlights video of our results?
            </h2>
          </motion.div>

          {/* Action Buttons */}
          <motion.div variants={itemVariants} className={styles.actions}>
            <Button
              variant="primary"
              size="large"
              onClick={handleYes}
              aria-label="Yes, show me the highlights video"
              fullWidth
            >
              Yes, Show Me the Highlights
            </Button>

            <button
              onClick={handleSkip}
              className={styles.skipButton}
              aria-label="Skip highlights video for now"
            >
              Skip for Now
            </button>
          </motion.div>

          {/* Trust Badges */}
          <motion.div variants={itemVariants} className={styles.trustBadges}>
            <div className={styles.trustBadgesGrid}>
              {trustBadges.map((badge, index) => (
                <div key={index} className={styles.trustBadge}>
                  <div className={styles.trustBadgeIcon}>{badge.icon}</div>
                  <h3 className={styles.trustBadgeTitle}>{badge.title}</h3>
                  <p className={styles.trustBadgeDescription}>{badge.description}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ProofOffer1;
