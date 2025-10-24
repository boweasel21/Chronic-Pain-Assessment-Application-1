/**
 * Process Explanation Page (Page 9)
 * Introduction to Cellular Repair Method with video and case study
 */

import React, { useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@components/common/Button';
import styles from './ProcessExplanation.module.css';

/**
 * Animation variants for the page
 */
const pageVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

/**
 * Animation variants for staggered children
 */
const containerVariants = {
  animate: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const itemVariants = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
};

/**
 * Video placeholder component (displays when video fails to load)
 */
interface VideoPlaceholderProps {
  onRetry: () => void;
}

/**
 * Video Placeholder Component
 * @param props - Component props
 * @returns Rendered placeholder
 */
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
        <path
          d="M26 24l16 10-16 10V24z"
          fill="currentColor"
        />
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
 * Process Explanation Page Component
 *
 * @description Educational page introducing the Cellular Repair Method.
 * Includes video embed, case study, and compelling copy to drive users
 * to the detailed process page.
 *
 * @returns Rendered process explanation page
 */
const ProcessExplanation: React.FC = () => {
  const navigate = useNavigate();
  const [videoError, setVideoError] = useState(false);
  const [videoRetryCount, setVideoRetryCount] = useState(0);

  // Get video ID from environment variable
  const videoId = import.meta.env.VITE_VIDEO_HIGHLIGHTS_ID || 'dQw4w9WgXcQ';

  // Scroll-based animation
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0.8]);

  /**
   * Handles navigation to detailed process page
   */
  const handleShowDetails = () => {
    navigate('/detailed-process');
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
          <motion.div variants={itemVariants} style={{ opacity }}>
            <h1 className={styles.headline}>
              How We Eliminate Your Chronic Pain at the Cellular Level
            </h1>
          </motion.div>

          {/* Introduction */}
          <motion.div variants={itemVariants} className={styles.introduction}>
            <p className={styles.introText}>
              For years, you've been told your pain is "just something you'll have to live
              with." That your nerves are too damaged. That you've tried everything and
              nothing works.
            </p>
            <p className={styles.introText}>
              <strong>That's not true.</strong>
            </p>
            <p className={styles.introText}>
              The problem isn't that your pain can't be fixed. The problem is that no one has
              addressed the <strong>9 types of cellular damage</strong> causing it.
            </p>
          </motion.div>

          {/* Video Section */}
          <motion.div variants={itemVariants} className={styles.videoSection}>
            <h2 className={styles.sectionTitle}>See How It Works</h2>
            <div className={styles.videoWrapper}>
              {videoError ? (
                <VideoPlaceholder onRetry={handleVideoRetry} />
              ) : (
                <iframe
                  key={`video-${videoRetryCount}`}
                  className={styles.video}
                  src={`https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`}
                  title="Cellular Repair Method Highlights"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  onError={handleVideoError}
                  onLoad={handleVideoLoad}
                  loading="lazy"
                />
              )}
            </div>
          </motion.div>

          {/* Case Study Section */}
          <motion.div variants={itemVariants} className={styles.caseStudy}>
            <div className={styles.caseStudyHeader}>
              <h2 className={styles.sectionTitle}>Chad's Case Study</h2>
              <span className={styles.caseStudyLabel}>Real Patient Results</span>
            </div>

            <div className={styles.caseStudyContent}>
              <div className={styles.caseStudyBefore}>
                <div className={styles.caseStudyTag}>Before</div>
                <ul className={styles.caseStudyList}>
                  <li>15 years of chronic back pain</li>
                  <li>Pain level: 8-9/10 daily</li>
                  <li>Unable to work or play with his kids</li>
                  <li>Tried: 3 surgeries, 50+ medications, countless therapies</li>
                  <li>Told by 7 specialists: "Nothing more we can do"</li>
                </ul>
              </div>

              <div className={styles.caseStudyArrow} aria-hidden="true">
                <svg
                  width="48"
                  height="48"
                  viewBox="0 0 48 48"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 24h24m0 0l-8-8m8 8l-8 8"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>

              <div className={styles.caseStudyAfter}>
                <div className={styles.caseStudyTag}>After 12 Weeks</div>
                <ul className={styles.caseStudyList}>
                  <li>
                    <strong>Pain level: 1-2/10</strong>
                  </li>
                  <li>
                    <strong>Back to work full-time</strong>
                  </li>
                  <li>
                    <strong>Playing basketball with his kids</strong>
                  </li>
                  <li>
                    <strong>Off all pain medications</strong>
                  </li>
                  <li>
                    <strong>Sustained results 2+ years later</strong>
                  </li>
                </ul>
              </div>
            </div>

            <blockquote className={styles.quote}>
              <p className={styles.quoteText}>
                "I thought I'd tried everything. Turns out, I'd never tried the thing that
                actually works—fixing the cellular damage that was causing my pain in the
                first place."
              </p>
              <cite className={styles.quoteCitation}>— Chad M., Former Chronic Pain Patient</cite>
            </blockquote>
          </motion.div>

          {/* Summary Section */}
          <motion.div variants={itemVariants} className={styles.summary}>
            <h2 className={styles.summaryTitle}>
              This is how we repair what's actually broken...
            </h2>
            <p className={styles.summaryText}>
              Not just masking symptoms. Not just managing pain. Actually <em>repairing</em>{' '}
              the 9 types of cellular damage at the root of your chronic pain.
            </p>
            <p className={styles.summaryText}>
              The process is systematic, personalized, and proven. Let us show you exactly how
              it works.
            </p>
          </motion.div>

          {/* Call to Action */}
          <motion.div variants={itemVariants} className={styles.cta}>
            <Button
              variant="primary"
              size="large"
              onClick={handleShowDetails}
              aria-label="View detailed process information"
              fullWidth
            >
              Show Me The Details
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ProcessExplanation;
