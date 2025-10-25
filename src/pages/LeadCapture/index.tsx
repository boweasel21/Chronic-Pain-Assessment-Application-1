import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAssessment } from '@context/AssessmentContext';
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
      duration: 0.45,
      ease: 'easeOut',
    },
  },
};

const LeadCapture: React.FC = () => {
  const navigate = useNavigate();
  const { updateResponse } = useAssessment();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState<string | null>(null);

  const validateEmail = (value: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();

    if (!name.trim() || !email.trim() || !phone.trim()) {
      // Proposed copy: validation message when fields are missing
      setError('Please complete all fields so we can send your video.');
      return;
    }

    if (!validateEmail(email)) {
      // Proposed copy: email validation message
      setError('Please enter a valid email address.');
      return;
    }

    setError(null);

    updateResponse({
      leadCaptureName: name.trim(),
      leadCaptureEmail: email.trim(),
      leadCapturePhone: phone.trim(),
    });

    navigate('/final-video');
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
          <h1 className={styles.headline}>
            To see a live recorded highlights video of how we work with clients A-Z and see a live demonstration of a client doing our process and eliminating a chronic pain symptom, fill out the form below, and we’ll email you a link to that video.
          </h1>

          <form className={styles.form} onSubmit={handleSubmit} noValidate>
            <label className={styles.label} htmlFor="lead-name">
              Name
            </label>
            <input
              id="lead-name"
              type="text"
              className={styles.input}
              value={name}
              onChange={(event) => setName(event.target.value)}
              autoComplete="name"
              required
            />

            <label className={styles.label} htmlFor="lead-email">
              Email
            </label>
            <input
              id="lead-email"
              type="email"
              className={styles.input}
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="email"
              required
            />

            <label className={styles.label} htmlFor="lead-phone">
              Phone number
            </label>
            <input
              id="lead-phone"
              type="tel"
              className={styles.input}
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              autoComplete="tel"
              required
            />

            {error && (
              <p className={styles.error} role="alert">
                {error}
              </p>
            )}

            <Button
              variant="primary"
              size="large"
              type="submit"
              aria-label="Submit your details to receive the video"
              fullWidth
            >
              Next Page
            </Button>
          </form>

          <p className={styles.paragraph}>
            Once you see with your own eyes how it all works, you’ll find that most of your current questions will be answered. And you’ll know if we’re the right solution for you or not.
          </p>
          <p className={styles.paragraph}>We look forward to you seeing everything.</p>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default LeadCapture;
