/**
 * Page 14: Final Video Page
 * Congratulations page with booking confirmation and bonus content
 */

import { useEffect } from 'react';
import { SuccessBadge } from './SuccessBadge';
import { ConfirmationCard } from './ConfirmationCard';
import { BonusVideo } from './BonusVideo';
import { WhatToExpect } from './WhatToExpect';
import { FAQAccordion } from './FAQAccordion';
import { FinalCTA } from './FinalCTA';
import { faqItems, expectItems } from './data';
import styles from './index.module.css';

/**
 * FinalVideoPage Component
 *
 * @description Congratulations page with animated confetti, booking confirmation,
 * bonus video content, FAQ section, and final CTA. Features Framer Motion animations
 * and full accessibility support. Now refactored into smaller, maintainable components.
 *
 * @returns {JSX.Element} Final video page
 */
const FinalVideoPage = (): JSX.Element => {
  /**
   * Environment variables
   */
  const videoId = import.meta.env.VITE_VIDEO_FINAL_ID || 'dQw4w9WgXcQ';
  const calendlyUrl = import.meta.env.VITE_CALENDLY_URL || 'https://calendly.com/primarycell';

  /**
   * Scroll to top on mount
   */
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        {/* Success Badge with Confetti */}
        <SuccessBadge />

        {/* Booking Confirmation Card */}
        <ConfirmationCard calendlyUrl={calendlyUrl} />

        {/* Bonus Content Section */}
        <BonusVideo videoId={videoId} />

        {/* What to Expect Section */}
        <WhatToExpect items={expectItems} />

        {/* FAQ Section */}
        <FAQAccordion faqs={faqItems} />

        {/* Final CTA */}
        <FinalCTA calendlyUrl={calendlyUrl} />
      </div>
    </div>
  );
};

export default FinalVideoPage;
