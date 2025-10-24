/**
 * Page 14: Final Video Page
 * Congratulations page with booking confirmation and bonus content
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@components/common/Card';
import { Button } from '@components/common/Button';
import styles from './FinalVideoPage.module.css';

/**
 * FAQ item interface
 */
interface FAQItem {
  question: string;
  answer: string;
}

/**
 * Confetti particle interface
 */
interface ConfettiParticle {
  id: number;
  x: number;
  y: number;
  rotation: number;
  color: string;
  delay: number;
}

/**
 * FAQ data
 */
const FAQ_ITEMS: FAQItem[] = [
  {
    question: 'What should I prepare for the discovery call?',
    answer: 'Come prepared with a list of your current symptoms, any relevant medical records, and questions about the Cellular Repair Process. We\'ll guide you through everything else.',
  },
  {
    question: 'How long is the discovery call?',
    answer: 'The discovery call typically lasts 30 minutes. We\'ll assess your specific situation, answer your questions, and determine if our Cellular Repair Process is right for you.',
  },
  {
    question: 'What happens after the discovery call?',
    answer: 'If we\'re a good fit, we\'ll create a personalized treatment plan tailored to your specific pain pattern and cellular damage. You\'ll receive a detailed roadmap for your recovery journey.',
  },
  {
    question: 'Is there any cost for the discovery call?',
    answer: 'No, the discovery call is completely free. It\'s an opportunity for us to understand your needs and for you to learn more about how we can help address your chronic pain at the cellular level.',
  },
];

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
 * FinalVideoPage Component
 *
 * @description Congratulations page with animated confetti, booking confirmation,
 * bonus video content, FAQ section, and final CTA. Features Framer Motion animations
 * and full accessibility support.
 *
 * @returns {JSX.Element} Final video page
 */
const FinalVideoPage = (): JSX.Element => {
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);
  const [showConfetti, setShowConfetti] = useState(true);
  const [confettiParticles] = useState<ConfettiParticle[]>(() => generateConfetti(50));

  /**
   * Environment variables
   */
  const videoId = import.meta.env.VITE_VIDEO_FINAL_ID || 'dQw4w9WgXcQ';
  const calendlyUrl = import.meta.env.VITE_CALENDLY_URL || 'https://calendly.com/primarycell';

  /**
   * Hide confetti after animation completes
   */
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowConfetti(false);
    }, 4000);

    return () => clearTimeout(timer);
  }, []);

  /**
   * Scroll to top on mount
   */
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  /**
   * Toggle FAQ item expansion
   * @param index - Index of FAQ item to toggle
   */
  const toggleFAQ = (index: number): void => {
    setExpandedFAQ((prev) => (prev === index ? null : index));
  };

  /**
   * Handle "Add to Calendar" click
   */
  const handleAddToCalendar = (): void => {
    // Future implementation: Generate calendar event
    window.open(calendlyUrl, '_blank', 'noopener,noreferrer');
  };

  /**
   * Handle "Book Another Session" click
   */
  const handleBookAnother = (): void => {
    window.open(calendlyUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className={styles.container}>
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

      <div className={styles.content}>
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

        {/* Booking Confirmation Card */}
        <motion.section
          className={styles.bookingSection}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Card variant="white" shadow="lg" padding="lg">
            <h2 className={styles.cardHeading}>Your Appointment Details</h2>

            <div className={styles.detailsGrid}>
              <div className={styles.detailItem}>
                <svg
                  className={styles.detailIcon}
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <div>
                  <p className={styles.detailLabel}>Date & Time</p>
                  <p className={styles.detailValue}>You'll receive confirmation via email</p>
                </div>
              </div>

              <div className={styles.detailItem}>
                <svg
                  className={styles.detailIcon}
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path
                    d="M15 10l-4 4 6 6 4-16-18 7 4 2 2 6 3-4z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <div>
                  <p className={styles.detailLabel}>Format</p>
                  <p className={styles.detailValue}>Video call via Zoom</p>
                </div>
              </div>
            </div>

            <button
              onClick={handleAddToCalendar}
              className={styles.calendarButton}
              type="button"
              aria-label="Add appointment to calendar"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  d="M6 2V6M14 2V6M3 10H17M5 4H15C16.1046 4 17 4.89543 17 6V16C17 17.1046 16.1046 18 15 18H5C3.89543 18 3 17.1046 3 16V6C3 4.89543 3.89543 4 5 4Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Add to Calendar
            </button>
          </Card>
        </motion.section>

        {/* Bonus Content Section */}
        <motion.section
          className={styles.bonusSection}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <h2 className={styles.sectionHeading}>While You Wait, Check This Out...</h2>

          <Card variant="white" shadow="md" padding="lg">
            <div className={styles.videoWrapper}>
              <iframe
                className={styles.videoEmbed}
                src={`https://www.youtube.com/embed/${videoId}?rel=0`}
                title="7-minute deep dive on cellular pain mechanisms"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                loading="lazy"
              />
            </div>
            <p className={styles.videoDescription}>
              7-minute deep dive on cellular pain mechanisms and why traditional treatments often fall short
            </p>
          </Card>
        </motion.section>

        {/* What to Expect Section */}
        <motion.section
          className={styles.expectSection}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <h2 className={styles.sectionHeading}>What to Expect on Your Discovery Call</h2>

          <div className={styles.expectGrid}>
            <Card variant="secondary" shadow="sm" padding="md" className={styles.expectCard}>
              <div className={styles.expectIcon}>
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <h3 className={styles.expectTitle}>30-Minute Discovery Call</h3>
              <p className={styles.expectText}>
                A focused conversation about your specific pain challenges and health goals
              </p>
            </Card>

            <Card variant="secondary" shadow="sm" padding="md" className={styles.expectCard}>
              <div className={styles.expectIcon}>
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <h3 className={styles.expectTitle}>Personalized Assessment</h3>
              <p className={styles.expectText}>
                In-depth analysis of your pain patterns and cellular damage indicators
              </p>
            </Card>

            <Card variant="secondary" shadow="sm" padding="md" className={styles.expectCard}>
              <div className={styles.expectIcon}>
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <h3 className={styles.expectTitle}>Custom Treatment Plan</h3>
              <p className={styles.expectText}>
                Detailed recommendations tailored to your unique cellular repair needs
              </p>
            </Card>

            <Card variant="secondary" shadow="sm" padding="md" className={styles.expectCard}>
              <div className={styles.expectIcon}>
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <h3 className={styles.expectTitle}>Next Steps Discussion</h3>
              <p className={styles.expectText}>
                Clear roadmap for moving forward with your cellular pain relief journey
              </p>
            </Card>
          </div>
        </motion.section>

        {/* FAQ Section */}
        <motion.section
          className={styles.faqSection}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.0 }}
        >
          <h2 className={styles.sectionHeading}>Frequently Asked Questions</h2>

          <div className={styles.faqList}>
            {FAQ_ITEMS.map((item, index) => (
              <Card
                key={index}
                variant="white"
                shadow="sm"
                padding="md"
                className={styles.faqCard}
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className={styles.faqButton}
                  type="button"
                  aria-expanded={expandedFAQ === index}
                  aria-controls={`faq-answer-${index}`}
                >
                  <span className={styles.faqQuestion}>{item.question}</span>
                  <motion.svg
                    className={styles.faqIcon}
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    animate={{ rotate: expandedFAQ === index ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    aria-hidden="true"
                  >
                    <path
                      d="M19 9l-7 7-7-7"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </motion.svg>
                </button>

                <AnimatePresence>
                  {expandedFAQ === index && (
                    <motion.div
                      id={`faq-answer-${index}`}
                      className={styles.faqAnswer}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <p className={styles.faqAnswerText}>{item.answer}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Card>
            ))}
          </div>
        </motion.section>

        {/* Final CTA */}
        <motion.section
          className={styles.ctaSection}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.2 }}
        >
          <Card variant="primary" shadow="lg" padding="lg" className={styles.ctaCard}>
            <h2 className={styles.ctaHeading}>Ready for More Support?</h2>
            <p className={styles.ctaText}>
              Need to schedule an additional session or have questions? We're here to help.
            </p>
            <Button
              variant="secondary"
              size="large"
              onClick={handleBookAnother}
              aria-label="Book another session"
            >
              Book Another Session
            </Button>
          </Card>
        </motion.section>
      </div>
    </div>
  );
};

export default FinalVideoPage;
