import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@components/common/Button';
import styles from './index.module.css';

const pageVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
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

const DetailedProcess: React.FC = () => {
  const navigate = useNavigate();

  const handleNext = (): void => {
    navigate('/proof-offer-1');
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
          variants={itemVariants}
          initial="initial"
          animate="animate"
        >
          <h1 className={styles.headline}>
            Repairing Your Primary Cell: The Key to Fixing Your Pain
          </h1>
          <p className={styles.lead}>
            We don&apos;t manage your pain—we eliminate it by repairing the cellular source.
          </p>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>How We Do It:</h2>
            <p className={styles.paragraph}>
              We've identified 9 different types of cellular damage that cause chronic pain. Each requires a specific repair technique. Using your pain signals as a roadmap, we:
            </p>
            <ol className={styles.list}>
              <li>Pinpoint the exact cellular damage causing your specific pain symptoms</li>
              <li>Identify which of the 9 damage types are affecting you</li>
              <li>Apply the corresponding repair technique over Zoom to fix the damaged genetic material</li>
              <li>Verify the repair by monitoring your pain signals in real-time over Zoom</li>
            </ol>
            <p className={styles.paragraph}>
              Our techniques work at the cellular level to repair stuck mRNA and damaged histone coatings.
            </p>
            <p className={styles.paragraph}>
              The process feels calm and relaxing—similar to guided meditation—but you're actually performing biological repair work.
            </p>
            <p className={styles.paragraph}>
              <strong>(Important)</strong> The cellular repair approach is brand new to most people, but the science is solid and peer-reviewed.
            </p>
            <p className={styles.paragraph}>
              We're not doing experimental work—we're applying established research about cellular memory storage to solve chronic pain.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Want Proof?</h2>
            <Button
              variant="primary"
              size="large"
              onClick={handleNext}
              aria-label="Go to the first proof offer page"
            >
              Next Page
            </Button>
          </section>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default DetailedProcess;
