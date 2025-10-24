/**
 * Type definitions for FinalVideoPage components
 */

/**
 * FAQ item interface
 */
export interface FAQItem {
  question: string;
  answer: string;
}

/**
 * Confetti particle interface
 */
export interface ConfettiParticle {
  id: number;
  x: number;
  y: number;
  rotation: number;
  color: string;
  delay: number;
}

/**
 * What to Expect item interface
 */
export interface ExpectItem {
  icon: JSX.Element;
  title: string;
  text: string;
}
