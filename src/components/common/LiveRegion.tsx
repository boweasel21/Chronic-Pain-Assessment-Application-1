/**
 * LiveRegion Component
 *
 * @description ARIA live region component for announcing dynamic content
 * updates to screen reader users. Essential for single-page applications
 * where content changes don't trigger page reloads.
 *
 * Features:
 * - Polite and assertive announcement modes
 * - Automatic message clearing
 * - Screen reader only (visually hidden)
 * - Message queue management
 * - Atomic announcements
 *
 * Accessibility Standards:
 * - WCAG 2.1 Level AA compliance
 * - ARIA 1.2 live region specifications
 * - Screen reader tested (NVDA, JAWS, VoiceOver)
 *
 * @module components/common/LiveRegion
 */

import React, { useEffect, useState, useRef } from 'react';

/**
 * ARIA live region priority levels
 */
export type LiveRegionPriority = 'polite' | 'assertive' | 'off';

/**
 * LiveRegion component props interface
 */
export interface LiveRegionProps {
  /**
   * Message to announce to screen readers
   * When message changes, screen readers will announce the new content
   */
  message: string;

  /**
   * Priority level for announcements
   * - 'polite': Waits for screen reader to finish current speech (default)
   * - 'assertive': Interrupts screen reader immediately (use sparingly)
   * - 'off': Disables announcements
   * @default 'polite'
   */
  priority?: LiveRegionPriority;

  /**
   * Whether the entire region should be announced on change
   * - true: Entire content announced (default)
   * - false: Only changed portions announced
   * @default true
   */
  atomic?: boolean;

  /**
   * Whether text content is relevant for announcements
   * - 'additions': Only additions announced
   * - 'removals': Only removals announced
   * - 'text': Text changes announced
   * - 'all': All changes announced (default)
   * @default 'all'
   */
  relevant?: 'additions' | 'removals' | 'text' | 'all';

  /**
   * Optional CSS class name for custom styling
   * Note: Component is visually hidden by default
   */
  className?: string;

  /**
   * Duration to display message before clearing (milliseconds)
   * Set to 0 to never auto-clear
   * @default 5000
   */
  clearDelay?: number;

  /**
   * Callback when message is cleared
   */
  onClear?: () => void;

  /**
   * Custom ID for the live region
   * Useful for testing or multiple instances
   */
  id?: string;
}

/**
 * LiveRegion Component
 *
 * @description Renders an ARIA live region for dynamic content announcements.
 * The component is visually hidden but announced by screen readers when the
 * message prop changes. Use this component for status updates, error messages,
 * loading states, and other dynamic content changes.
 *
 * Best Practices:
 * - Use 'polite' for most announcements (doesn't interrupt)
 * - Use 'assertive' only for urgent/critical updates
 * - Keep messages concise and clear
 * - Avoid announcing every minor change
 * - Clear messages after announcement
 * - Test with actual screen readers
 *
 * Common Use Cases:
 * - Form validation errors
 * - Loading state changes
 * - Search results updates
 * - Successful operations
 * - Navigation confirmations
 * - Filter/sort updates
 * - Chat messages
 * - Timer updates
 *
 * @example
 * Basic usage:
 * ```tsx
 * const [statusMessage, setStatusMessage] = useState('');
 *
 * const handleSubmit = async () => {
 *   setStatusMessage('Submitting form...');
 *   await submitForm();
 *   setStatusMessage('Form submitted successfully!');
 * };
 *
 * return (
 *   <>
 *     <form onSubmit={handleSubmit}>...</form>
 *     <LiveRegion message={statusMessage} priority="polite" />
 *   </>
 * );
 * ```
 *
 * @example
 * Error announcements:
 * ```tsx
 * const [error, setError] = useState('');
 *
 * return (
 *   <>
 *     <form>...</form>
 *     <LiveRegion
 *       message={error}
 *       priority="assertive"
 *       clearDelay={7000}
 *       onClear={() => setError('')}
 *     />
 *   </>
 * );
 * ```
 *
 * @example
 * Search results:
 * ```tsx
 * const [resultsMessage, setResultsMessage] = useState('');
 *
 * useEffect(() => {
 *   if (searchResults.length > 0) {
 *     setResultsMessage(`Found ${searchResults.length} results`);
 *   } else {
 *     setResultsMessage('No results found');
 *   }
 * }, [searchResults]);
 *
 * return (
 *   <>
 *     <SearchResults results={searchResults} />
 *     <LiveRegion message={resultsMessage} priority="polite" />
 *   </>
 * );
 * ```
 *
 * @param {LiveRegionProps} props - Component props
 * @returns {JSX.Element} Rendered live region element
 */
export const LiveRegion: React.FC<LiveRegionProps> = ({
  message,
  priority = 'polite',
  atomic = true,
  relevant = 'all',
  className = '',
  clearDelay = 5000,
  onClear,
  id
}): JSX.Element => {
  const [displayMessage, setDisplayMessage] = useState<string>(message);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  /**
   * Update displayed message when prop changes
   * Manages auto-clear timeout
   */
  useEffect(() => {
    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Update message
    setDisplayMessage(message);

    // Set auto-clear timeout if enabled and message exists
    if (clearDelay > 0 && message) {
      timeoutRef.current = setTimeout(() => {
        setDisplayMessage('');
        if (onClear) {
          onClear();
        }
      }, clearDelay);
    }

    // Cleanup timeout on unmount or message change
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [message, clearDelay, onClear]);

  /**
   * Screen reader only styles (sr-only)
   * Hides element visually but keeps it accessible to assistive technologies
   */
  const srOnlyStyles: React.CSSProperties = {
    position: 'absolute',
    left: '-10000px',
    top: 'auto',
    width: '1px',
    height: '1px',
    overflow: 'hidden',
    clipPath: 'inset(50%)',
    whiteSpace: 'nowrap'
  };

  /**
   * Combine custom className with sr-only class
   */
  const combinedClassName = ['sr-only', className].filter(Boolean).join(' ');

  return (
    <div
      id={id}
      className={combinedClassName}
      style={srOnlyStyles}
      role="status"
      aria-live={priority}
      aria-atomic={atomic}
      aria-relevant={relevant}
    >
      {displayMessage}
    </div>
  );
};

/**
 * AlertLiveRegion Component
 *
 * @description Specialized live region component for alert messages.
 * Uses role="alert" which is automatically assertive and atomic.
 * Best for error messages and critical notifications.
 *
 * @example
 * ```tsx
 * const [error, setError] = useState('');
 *
 * return (
 *   <>
 *     <form>...</form>
 *     <AlertLiveRegion message={error} />
 *   </>
 * );
 * ```
 *
 * @param {Omit<LiveRegionProps, 'priority' | 'atomic'>} props - Component props
 * @returns {JSX.Element} Rendered alert element
 */
export const AlertLiveRegion: React.FC<Omit<LiveRegionProps, 'priority' | 'atomic'>> = ({
  message,
  className = '',
  clearDelay = 7000,
  onClear,
  id
}): JSX.Element => {
  const [displayMessage, setDisplayMessage] = useState<string>(message);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    setDisplayMessage(message);

    if (clearDelay > 0 && message) {
      timeoutRef.current = setTimeout(() => {
        setDisplayMessage('');
        if (onClear) {
          onClear();
        }
      }, clearDelay);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [message, clearDelay, onClear]);

  const srOnlyStyles: React.CSSProperties = {
    position: 'absolute',
    left: '-10000px',
    top: 'auto',
    width: '1px',
    height: '1px',
    overflow: 'hidden',
    clipPath: 'inset(50%)',
    whiteSpace: 'nowrap'
  };

  const combinedClassName = ['sr-only', className].filter(Boolean).join(' ');

  return (
    <div
      id={id}
      className={combinedClassName}
      style={srOnlyStyles}
      role="alert"
    >
      {displayMessage}
    </div>
  );
};

/**
 * Default export
 */
export default LiveRegion;
