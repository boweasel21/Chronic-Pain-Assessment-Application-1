import { ReactNode } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';

/**
 * PageTransition component props interface
 */
export interface PageTransitionProps {
  /**
   * Child elements to animate
   */
  children: ReactNode;

  /**
   * Optional key for AnimatePresence
   * Used to trigger exit animations on route changes
   */
  transitionKey?: string | number;

  /**
   * Custom entry animation duration in seconds
   * @default 0.3
   */
  entryDuration?: number;

  /**
   * Custom exit animation duration in seconds
   * @default 0.2
   */
  exitDuration?: number;

  /**
   * Custom Y offset for slide animation in pixels
   * @default 20
   */
  slideOffset?: number;

  /**
   * Whether to use exit animations
   * @default true
   */
  enableExit?: boolean;

  /**
   * Optional CSS class name for the container
   */
  className?: string;
}

/**
 * PageTransition Component
 *
 * @description Wrapper component for page-level animations using Framer Motion.
 * Provides consistent fade + slide transitions for all page components.
 * Automatically respects prefers-reduced-motion user preference.
 *
 * Entry Animation:
 * - Opacity: 0 → 1
 * - Y position: 20px → 0px
 * - Duration: 300ms
 *
 * Exit Animation:
 * - Opacity: 1 → 0
 * - Y position: 0px → -20px
 * - Duration: 200ms
 *
 * @example
 * ```tsx
 * <PageTransition transitionKey={location.pathname}>
 *   <YourPageComponent />
 * </PageTransition>
 * ```
 *
 * @example
 * ```tsx
 * // Custom animation settings
 * <PageTransition
 *   transitionKey="page-1"
 *   entryDuration={0.5}
 *   exitDuration={0.3}
 *   slideOffset={30}
 * >
 *   <YourPageComponent />
 * </PageTransition>
 * ```
 *
 * @param {PageTransitionProps} props - Component props
 * @returns {JSX.Element} Animated wrapper element
 */
export const PageTransition = ({
  children,
  transitionKey,
  entryDuration = 0.3,
  exitDuration = 0.2,
  slideOffset = 20,
  enableExit = true,
  className = ''
}: PageTransitionProps): JSX.Element => {
  /**
   * Animation variants for page transitions
   * Respects reduced motion preference
   */
  const pageVariants: Variants = {
    initial: {
      opacity: 0,
      y: slideOffset
    },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        duration: entryDuration,
        ease: 'easeOut'
      }
    },
    exit: enableExit
      ? {
          opacity: 0,
          y: -slideOffset,
          transition: {
            duration: exitDuration,
            ease: 'easeIn'
          }
        }
      : undefined
  };

  /**
   * Reduced motion variants (no movement, just fade)
   */
  const reducedMotionVariants: Variants = {
    initial: {
      opacity: 0
    },
    animate: {
      opacity: 1,
      transition: {
        duration: 0.01
      }
    },
    exit: enableExit
      ? {
          opacity: 0,
          transition: {
            duration: 0.01
          }
        }
      : undefined
  };

  /**
   * Detect if user prefers reduced motion
   * Note: This is a basic implementation. In production, you might want to
   * use a hook that subscribes to media query changes.
   */
  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /**
   * Select appropriate variants based on motion preference
   */
  const selectedVariants = prefersReducedMotion
    ? reducedMotionVariants
    : pageVariants;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={transitionKey}
        variants={selectedVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        className={className}
        style={{
          width: '100%',
          height: '100%'
        }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};
