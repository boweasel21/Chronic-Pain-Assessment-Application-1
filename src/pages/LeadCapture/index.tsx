import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAssessment } from '@context/AssessmentContext';
import { Button } from '@components/common/Button';
import { sanitizeEmail, sanitizeName, sanitizePhone } from '@utils/sanitizer';
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

    const sanitizedName = sanitizeName(name.trim());
    const sanitizedEmail = sanitizeEmail(email.trim());
    const sanitizedPhone = sanitizePhone(phone.trim());

    if (!sanitizedName || !sanitizedEmail || !sanitizedPhone) {
      setError('Please complete every field so we can send your video.');
      return;
    }

    if (!validateEmail(sanitizedEmail)) {
      setError('Please enter a valid email address.');
      return;
    }

    setError(null);

    updateResponse({
      leadCaptureName: sanitizedName,
      leadCaptureEmail: sanitizedEmail,
      leadCapturePhone: sanitizedPhone,
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
            You&apos;re almost there. Fill out the form below and we&apos;ll email you a live, recorded highlights video that walks through our process A–Z—plus a real-time demonstration of a client eliminating a chronic pain symptom.
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
              aria-describedby="lead-phone-help"
              required
            />
            <p id="lead-phone-help" className={styles.helper}>
              We&apos;ll text you if you have questions after the video and alert you when we send anything important.
            </p>

            {error && (
              <p className={styles.error} role="alert">
                {error}
              </p>
            )}

            <Button
              variant="primary"
              size="large"
              type="submit"
              aria-label="Submit your details to receive the highlights video"
              fullWidth
            >
              Email Me the Highlights Video
            </Button>
          </form>

          <p className={styles.paragraph}>
            Once you watch it, most of your questions will already be answered—and you’ll know if we’re the right solution for you.
          </p>
          <p className={styles.paragraph}>
            You&apos;ll also receive a link to watch again later, plus an invitation to book a discovery call if you&apos;re ready.
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default LeadCapture;
