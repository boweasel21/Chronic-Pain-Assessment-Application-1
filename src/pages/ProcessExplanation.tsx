import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@components/common/Button';
import styles from './ProcessExplanation.module.css';

const pageVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

const containerVariants = {
  initial: { opacity: 0, y: 24 },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: 'easeOut',
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  initial: { opacity: 0, y: 24 },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: 'easeOut',
    },
  },
};

const ProcessExplanation: React.FC = () => {
  const navigate = useNavigate();

  const handleNext = (): void => {
    navigate('/detailed-process');
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
          <motion.section className={styles.section} variants={itemVariants}>
            <p className={styles.paragraph}>
              Our process targets and repairs the specific damaged genetic material inside your Primary Cell using gentle, non-invasive techniques.
            </p>
            <p className={styles.paragraph}>
              When we fix this genetic material inside your Primary Cell, the pain sensations are released and leave, and this repair automatically echoes out to every relevant cell in your body.
            </p>
          </motion.section>

          <motion.section className={styles.section} variants={itemVariants}>
            <h2 className={styles.sectionHeadline}>Real Results From Real People:</h2>
            <div className={styles.caseStudyCard}>
              <div
                className={styles.caseStudyImage}
                role="img"
                aria-label="Chad's case study placeholder"
                data-visual-key="chad-case-study"
              />
              <p className={styles.paragraph}>
                Chad's Picture: 5 years of degenerative bone-on-bone pain that ruled his life. Doctors offered only expensive injections and eventual spinal fusion surgery once his vertebrae became brittle enough. We eliminated his pain completely in just 5 sessions. He's been 100% pain-free since December 18th, 2024. You can watch his case study—from his initial skepticism about our methods to the moment his last pain symptom disappeared in session 5.
              </p>
            </div>
          </motion.section>

          <motion.section className={styles.section} variants={itemVariants}>
            <h2 className={styles.sectionHeadline}>How Do We Do It – What’s our Process?</h2>
            <Button
              variant="primary"
              size="large"
              onClick={handleNext}
              aria-label="Go to the detailed process page"
            >
              Next Page
            </Button>
          </motion.section>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ProcessExplanation;
