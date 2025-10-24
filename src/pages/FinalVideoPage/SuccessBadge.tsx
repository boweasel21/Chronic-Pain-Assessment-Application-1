/**
 * SuccessBadge Component
 * Animated congratulations section with confetti
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ConfettiParticle } from './types';
import styles from './SuccessBadge.module.css';

/**
 * Generate random confetti particles
 * @param count - Number of particles to generate
 * @returns Array of confetti particles
 */
const generateConfetti = (count: number): ConfettiParticle[] => {
  const colors = ['#E2D3A3', '#1D2C49', '#10B981', '#F59E0B', '#EF4444'];
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: -10,
    rotation: Math.random() * 360,
    color: colors[Math.floor(Math.random() * colors.length)],
    delay: Math.random() * 0.5,
  }));
};

/**
 * SuccessBadge Component
 *
 * @description Displays animated success message with confetti animation.
 * Confetti automatically disappears after 4 seconds.
 *
 * @returns {JSX.Element} Rendered success badge with confetti
 */
export const SuccessBadge: React.FC = () => {
  const [showConfetti, setShowConfetti] = useState(true);
  const [confettiParticles] = useState<ConfettiParticle[]>(() => generateConfetti(50));

  /**
   * Hide confetti after animation completes
   */
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowConfetti(false);
    }, 4000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {/* Confetti Animation */}
      <AnimatePresence>
        {showConfetti && (
          <div className={styles.confettiContainer} aria-hidden="true">
            {confettiParticles.map((particle) => (
              <motion.div
                key={particle.id}
                className={styles.confettiParticle}
                style={{
                  left: `${particle.x}%`,
                  backgroundColor: particle.color,
                }}
                initial={{
                  y: -20,
                  opacity: 1,
                  rotate: 0,
                }}
                animate={{
                  y: window.innerHeight + 20,
                  opacity: 0,
                  rotate: particle.rotation + 720,
                }}
                transition={{
                  duration: 3 + Math.random(),
                  delay: particle.delay,
                  ease: 'easeIn',
                }}
              />
            ))}
          </div>
        )}
      </AnimatePresence>

      {/* Congratulations Section */}
      <motion.section
        className={styles.congratsSection}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <motion.div
          className={styles.successBadge}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.4, type: 'spring', stiffness: 200 }}
        >
          <svg
            className={styles.successIcon}
            width="48"
            height="48"
            viewBox="0 0 48 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <circle cx="24" cy="24" r="22" stroke="#10B981" strokeWidth="3" fill="none" />
            <path
              d="M14 24L20 30L34 16"
              stroke="#10B981"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </motion.div>

        <h1 className={styles.headline}>Your Discovery Call is Scheduled!</h1>
        <p className={styles.message}>Check your email for confirmation details</p>
      </motion.section>
    </>
  );
};
