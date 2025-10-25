import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAssessment } from '@context/AssessmentContext';
import { Button } from '@components/common/Button';
import styles from './ProofOffer1.module.css';

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
      duration: 0.45,
      ease: 'easeOut',
    },
  },
};

const ProofOffer1: React.FC = () => {
  const navigate = useNavigate();
  const { updateResponse } = useAssessment();

  const handleAnswer = (wantsHighlights: boolean): void => {
    updateResponse({ wantsHighlightsVideo: wantsHighlights });
    navigate('/proof-offer-2');
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
          <h1 className={styles.headline}>Want Proof?</h1>
          <p className={styles.paragraph}>
            Want to see a short, recorded live highlights video to see with your own eyes how we work with a client A-Z, so you have a better sense of what we do? Yes or No
          </p>
          <div className={styles.buttonGroup}>
            <Button
              variant="primary"
              size="large"
              onClick={() => handleAnswer(true)}
              aria-label="Yes, show me the highlights video"
            >
              Yes
            </Button>
            <Button
              variant="secondary"
              size="large"
              onClick={() => handleAnswer(false)}
              aria-label="No, skip the highlights video"
            >
              No
            </Button>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ProofOffer1;
