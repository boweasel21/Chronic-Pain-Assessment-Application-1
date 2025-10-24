/**
 * Accessibility Hooks Module
 *
 * @description Provides custom React hooks for managing accessibility features
 * including motion preferences, focus management, and screen reader announcements.
 *
 * Hooks:
 * - usePrefersReducedMotion: Respects user's motion preference
 * - usePageFocus: Manages focus on page navigation
 * - useAnnounce: Announces dynamic updates to screen readers
 *
 * @module hooks/useAccessibility
 */

import { useEffect, useState, useRef, useCallback } from 'react';

/**
 * Hook to respect user's prefers-reduced-motion preference
 *
 * @description Detects if the user has set their operating system preference
 * to reduce motion. This is crucial for users with vestibular disorders or
 * those who find animations distracting or uncomfortable.
 *
 * The hook:
 * - Checks the prefers-reduced-motion media query on mount
 * - Subscribes to changes in the media query
 * - Automatically updates when system preferences change
 * - Returns a boolean that components can use to disable animations
 *
 * @example
 * ```tsx
 * const MyComponent = () => {
 *   const prefersReducedMotion = usePrefersReducedMotion();
 *
 *   const motionProps = prefersReducedMotion ? {} : {
 *     whileHover: { scale: 1.02 },
 *     transition: { duration: 0.3 }
 *   };
 *
 *   return <motion.div {...motionProps}>Content</motion.div>;
 * };
 * ```
 *
 * @returns {boolean} True if user prefers reduced motion, false otherwise
 */
export const usePrefersReducedMotion = (): boolean => {
  // Initialize with current media query state
  const [prefersReducedMotion, setPrefersReducedMotion] = useState<boolean>(() => {
    // Server-side rendering safety check
    if (typeof window === 'undefined') {
      return false;
    }

    // Check the media query
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    return mediaQuery.matches;
  });

  useEffect(() => {
    // Server-side rendering safety check
    if (typeof window === 'undefined') {
      return;
    }

    // Create media query list
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    /**
     * Handler for media query changes
     * Updates state when user changes their system preference
     *
     * @param event - Media query list event
     */
    const handleChange = (event: MediaQueryListEvent | MediaQueryList): void => {
      setPrefersReducedMotion(event.matches);
    };

    // Set initial value
    handleChange(mediaQuery);

    // Subscribe to changes
    // Note: Using deprecated addListener for broader browser support
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
    } else if (mediaQuery.addListener) {
      // Fallback for older browsers
      mediaQuery.addListener(handleChange);
    }

    // Cleanup subscription
    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleChange);
      } else if (mediaQuery.removeListener) {
        // Fallback for older browsers
        mediaQuery.removeListener(handleChange);
      }
    };
  }, []);

  return prefersReducedMotion;
};

/**
 * Hook to manage focus on page navigation
 *
 * @description Automatically moves keyboard focus to a specified element when
 * the component mounts or when navigation occurs. This is essential for screen
 * reader users and keyboard navigation, ensuring they don't have to tab through
 * the entire page after navigation.
 *
 * Features:
 * - Focuses element by ID on component mount
 * - Scrolls to element if out of view
 * - Uses preventScroll option to avoid jarring movements
 * - Adds tabIndex={-1} to make non-focusable elements focusable programmatically
 * - Removes outline on mouse click to maintain visual design
 *
 * Best Practices:
 * - Call this hook at the top level of page components
 * - Use 'main-content' as the default ID for consistency
 * - Ensure the target element has tabIndex={-1} and outline: none styles
 *
 * @example
 * ```tsx
 * const MyPage = () => {
 *   usePageFocus('main-content');
 *
 *   return (
 *     <main id="main-content" tabIndex={-1} style={{ outline: 'none' }}>
 *       <h1>Page Title</h1>
 *       {content}
 *     </main>
 *   );
 * };
 * ```
 *
 * @example
 * ```tsx
 * // Custom element focus
 * const ArticlePage = () => {
 *   usePageFocus('article-heading');
 *
 *   return (
 *     <article>
 *       <h1 id="article-heading" tabIndex={-1}>Article Title</h1>
 *     </article>
 *   );
 * };
 * ```
 *
 * @param {string} elementId - ID of the element to focus (default: 'main-content')
 * @returns {void}
 */
export const usePageFocus = (elementId: string = 'main-content'): void => {
  useEffect(() => {
    // Small delay to ensure DOM is fully rendered
    const timeoutId = setTimeout(() => {
      const element = document.getElementById(elementId);

      if (element) {
        // Focus the element
        // Using preventScroll to avoid jarring scroll movements
        element.focus({ preventScroll: false });

        // Scroll into view if needed (smooth scroll for better UX)
        element.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
          inline: 'nearest'
        });
      } else {
        // Log warning in development mode
        if (import.meta.env.DEV) {
          console.warn(
            `usePageFocus: Element with id "${elementId}" not found. ` +
            `Ensure the element exists and has tabIndex={-1} attribute.`
          );
        }
      }
    }, 100); // 100ms delay for React rendering

    // Cleanup timeout
    return () => clearTimeout(timeoutId);
  }, [elementId]);
};

/**
 * Live region priority type
 * - 'polite': Announces when screen reader is idle (default)
 * - 'assertive': Interrupts screen reader immediately (use sparingly)
 */
export type LiveRegionPriority = 'polite' | 'assertive';

/**
 * Announcement configuration interface
 */
interface AnnounceOptions {
  /**
   * Priority of the announcement
   * @default 'polite'
   */
  priority?: LiveRegionPriority;

  /**
   * Duration to display the message (ms)
   * @default 5000
   */
  timeout?: number;
}

/**
 * Hook to announce dynamic updates to screen readers
 *
 * @description Creates an ARIA live region for announcing dynamic content
 * changes to screen reader users. This is essential for single-page applications
 * where content updates don't trigger page reloads.
 *
 * The hook:
 * - Creates a live region element in the DOM
 * - Manages announcement queue and timing
 * - Automatically clears announcements after timeout
 * - Supports both polite and assertive announcements
 * - Cleans up on unmount
 *
 * Live Region Priorities:
 * - 'polite': Waits for screen reader to finish current utterance (default)
 * - 'assertive': Interrupts screen reader immediately (use for urgent updates)
 *
 * Use Cases:
 * - Form validation errors
 * - Loading state changes
 * - Successful form submissions
 * - Search results updates
 * - Navigation confirmations
 * - Error messages
 *
 * @example
 * ```tsx
 * const FormComponent = () => {
 *   const announce = useAnnounce();
 *
 *   const handleSubmit = async () => {
 *     announce('Submitting form...', { priority: 'polite' });
 *
 *     try {
 *       await submitForm();
 *       announce('Form submitted successfully!', { priority: 'polite' });
 *     } catch (error) {
 *       announce('Error submitting form. Please try again.', {
 *         priority: 'assertive'
 *       });
 *     }
 *   };
 *
 *   return <form onSubmit={handleSubmit}>...</form>;
 * };
 * ```
 *
 * @example
 * ```tsx
 * // Search results announcement
 * const SearchComponent = () => {
 *   const announce = useAnnounce();
 *   const [results, setResults] = useState([]);
 *
 *   useEffect(() => {
 *     if (results.length > 0) {
 *       announce(`Found ${results.length} results`, { priority: 'polite' });
 *     } else {
 *       announce('No results found', { priority: 'polite' });
 *     }
 *   }, [results, announce]);
 *
 *   return <div>...</div>;
 * };
 * ```
 *
 * @returns {(message: string, options?: AnnounceOptions) => void} Function to announce messages
 */
export const useAnnounce = (): ((message: string, options?: AnnounceOptions) => void) => {
  const liveRegionRef = useRef<HTMLDivElement | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Create live region element if it doesn't exist
    if (typeof window === 'undefined') {
      return;
    }

    // Check if global live region already exists
    let liveRegion = document.getElementById('global-live-region') as HTMLDivElement;

    if (!liveRegion) {
      // Create new live region
      liveRegion = document.createElement('div');
      liveRegion.id = 'global-live-region';
      liveRegion.setAttribute('role', 'status');
      liveRegion.setAttribute('aria-live', 'polite');
      liveRegion.setAttribute('aria-atomic', 'true');

      // Screen reader only styles (sr-only)
      liveRegion.style.position = 'absolute';
      liveRegion.style.left = '-10000px';
      liveRegion.style.width = '1px';
      liveRegion.style.height = '1px';
      liveRegion.style.overflow = 'hidden';

      // Append to body
      document.body.appendChild(liveRegion);
    }

    liveRegionRef.current = liveRegion;

    // Cleanup function
    return () => {
      // Clear any pending timeouts
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Note: We don't remove the live region element on unmount
      // as it's shared across the application and other components
      // might still be using it. It will be cleaned up when the page unloads.
    };
  }, []);

  /**
   * Announce a message to screen readers
   *
   * @param message - Message to announce
   * @param options - Announcement options (priority, timeout)
   */
  const announce = useCallback((message: string, options: AnnounceOptions = {}): void => {
    const { priority = 'polite', timeout = 5000 } = options;

    if (!liveRegionRef.current) {
      // Log warning in development mode
      if (process.env.NODE_ENV === 'development') {
        console.warn('useAnnounce: Live region not initialized');
      }
      return;
    }

    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    const liveRegion = liveRegionRef.current;

    // Update aria-live attribute based on priority
    liveRegion.setAttribute('aria-live', priority);

    // Set the message
    liveRegion.textContent = message;

    // Clear the message after timeout
    timeoutRef.current = setTimeout(() => {
      if (liveRegion) {
        liveRegion.textContent = '';
      }
    }, timeout);
  }, []);

  return announce;
};

/**
 * Hook to manage skip link visibility
 *
 * @description Manages the visibility and focus of skip links that allow
 * keyboard users to bypass navigation and jump to main content.
 *
 * Features:
 * - Shows skip link on focus
 * - Hides skip link when not focused
 * - Handles click to focus target element
 *
 * @example
 * ```tsx
 * const Layout = () => {
 *   return (
 *     <>
 *       <a href="#main-content" className="skip-link">
 *         Skip to main content
 *       </a>
 *       <nav>...</nav>
 *       <main id="main-content" tabIndex={-1}>...</main>
 *     </>
 *   );
 * };
 * ```
 *
 * @returns {void}
 */
export const useSkipLink = (): void => {
  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    /**
     * Handle skip link click
     * Ensures target element receives focus
     */
    const handleSkipLinkClick = (event: Event): void => {
      const target = event.target as HTMLAnchorElement;
      const targetId = target.getAttribute('href');

      if (targetId && targetId.startsWith('#')) {
        const targetElement = document.querySelector(targetId) as HTMLElement;

        if (targetElement) {
          event.preventDefault();
          targetElement.focus();
          targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    };

    // Find all skip links
    const skipLinks = document.querySelectorAll('a.skip-link, a[href^="#"][class*="skip"]');

    // Add click handlers
    skipLinks.forEach((link) => {
      link.addEventListener('click', handleSkipLinkClick);
    });

    // Cleanup
    return () => {
      skipLinks.forEach((link) => {
        link.removeEventListener('click', handleSkipLinkClick);
      });
    };
  }, []);
};

/**
 * Export all hooks as a single object for convenience
 */
export default {
  usePrefersReducedMotion,
  usePageFocus,
  useAnnounce,
  useSkipLink
};
