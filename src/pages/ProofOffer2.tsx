/**
 * Proof Offer 2 Page (Page 12)
 * Second proof page offering demonstration video
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAssessment } from '@context/AssessmentContext';
import { Button } from '@components/common/Button';
import styles from './ProofOffer2.module.css';

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

const urgencyVariants = {
  initial: { opacity: 0, scale: 0.9 },
  animate: {
    opacity: 1,
    scale: 1,
    transition: {
      delay: 0.5,
      duration: 0.3,
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
 * Proof Offer 2 Page Component
 *
 * @description Second proof page offering demonstration video of the cellular repair process.
 * Users can choose to watch or skip, both options route to lead-capture.
 * Includes urgency notice about limited availability.
 *
 * @returns Rendered proof offer 2 page
 */
const ProofOffer2: React.FC = () => {
  const navigate = useNavigate();
  const { updateResponse } = useAssessment();
  const [videoError, setVideoError] = useState(false);
  const [videoRetryCount, setVideoRetryCount] = useState(0);

  // Get video ID from environment variable
  const videoId = import.meta.env.VITE_VIDEO_DEMO_ID || 'dQw4w9WgXcQ';

  /**
   * Handles "Yes" button click - user wants to see demo video
   */
  const handleYes = () => {
    updateResponse({ wantsDemoVideo: true });
    navigate('/lead-capture');
  };

  /**
   * Handles "Skip" button click - user skips demo video
   */
  const handleSkip = () => {
    updateResponse({ wantsDemoVideo: false });
    navigate('/lead-capture');
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
            <h1 className={styles.headline}>One More Thing...</h1>
            <p className={styles.subtext}>See It In Action</p>
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
                    title="Cellular Repair Process Demonstration"
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
                  Watch a 5-minute demonstration of our cellular repair process in action
                </p>
              </div>
            </div>
          </motion.div>

          {/* Question */}
          <motion.div variants={itemVariants} className={styles.question}>
            <h2 className={styles.questionText}>
              Would you like to see a demonstration of our actual process?
            </h2>
          </motion.div>

          {/* Action Buttons */}
          <motion.div variants={itemVariants} className={styles.actions}>
            <Button
              variant="primary"
              size="large"
              onClick={handleYes}
              aria-label="Yes, show me how the cellular repair process works"
              fullWidth
            >
              Yes, Show Me How It Works
            </Button>

            <button
              onClick={handleSkip}
              className={styles.skipButton}
              aria-label="Skip demonstration video and proceed to next step"
            >
              Skip to Next Step
            </button>
          </motion.div>

          {/* Urgency Notice */}
          <motion.div variants={urgencyVariants} className={styles.urgencyNotice}>
            <div className={styles.urgencyIcon} aria-hidden="true">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                <path
                  d="M12 6v6l4 4"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div className={styles.urgencyContent}>
              <h3 className={styles.urgencyTitle}>Limited Spots Available</h3>
              <p className={styles.urgencyText}>Only 8 sessions available this month</p>
            </div>
          </motion.div>

          {/* Additional Context */}
          <motion.div variants={itemVariants} className={styles.context}>
            <p className={styles.contextText}>
              This demonstration walks through the exact techniques we use to identify and repair
              the 9 types of cellular damage causing chronic pain. You'll see real examples of how
              we've helped patients restore their cells to proper function.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ProofOffer2;
