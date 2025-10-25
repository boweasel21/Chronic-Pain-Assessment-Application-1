import React from 'react';
import { motion } from 'framer-motion';
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

const FinalVideoPage: React.FC = () => {
  const handleDiscoveryCall = (): void => {
    // TODO: replace with actual scheduling link or workflow
    window.location.href = 'mailto:info@primarycellrepair.com?subject=Discovery Call Request';
  };

  return (
    <motion.div
      className={styles.page}
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.4 }}
    >
      <div className={styles.container}>
        <motion.div className={styles.card} variants={itemVariants} initial="initial" animate="animate">
          <h1 className={styles.headline}>Watch Chad's 17-minute Cellular Repair Case Study</h1>
          <div
            className={styles.videoPlaceholder}
            role="img"
            aria-label="Chad's 17-minute case study video placeholder"
            data-visual-key="chad-full-case-study"
          />
          <p className={styles.paragraph}>
            {/* Proposed copy: framing the case study video */}
            In this video, you'll meet me, see exactly how I guide Chad through our process, and watch the moment his chronic pain finally released.
          </p>
          <p className={styles.paragraph}>
            {/* Proposed copy: transition to discovery call invitation */}
            After the video, I’ll invite you to book a discovery call so we can talk through whether this is the right fit for you.
          </p>
          <div className={styles.cta}>
            {/* Proposed copy: call-to-action for discovery call */}
            <Button variant="primary" size="large" onClick={handleDiscoveryCall} fullWidth>
              Schedule Your Discovery Call
            </Button>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default FinalVideoPage;
