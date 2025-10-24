/**
 * Assessment Layout Component
 * Provides consistent layout structure for all assessment pages
 * with accessibility improvements including focus management and live regions
 */

import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAssessmentResponse } from '@context/AssessmentContext';
import { useSkipLink } from '@hooks/useAccessibility';
import ProgressBar from './ProgressBar';
import MainContent from './MainContent';
import LiveRegion from '@components/common/LiveRegion';

/**
 * Layout props
 */
interface AssessmentLayoutProps {
  children: React.ReactNode;
}

/**
 * Route to page number mapping
 * Used for progress calculation
 */
const ROUTE_PAGE_MAP: Record<string, number> = {
  '/': 1,
  '/diagnosis': 2,
  '/duration': 3,
  '/age': 4,
  '/condition': 5,
  '/location': 6,
  '/sensations': 7,
  '/pain-level': 8,
  '/triggers': 9,
  '/impact': 10,
  '/treatments': 11,
  '/effectiveness': 12,
  '/lifestyle': 13,
  '/wellness': 14,
  '/support': 15,
  '/education': 16,
  '/results': 17,
};

/**
 * Assessment Layout Component
 * Wraps all assessment pages with consistent header, progress, and footer
 *
 * @param props - Component props
 * @returns Layout component with children
 */
const AssessmentLayout: React.FC<AssessmentLayoutProps> = ({ children }) => {
  const location = useLocation();
  const response = useAssessmentResponse();
  const [liveMessage, setLiveMessage] = useState<string>('');

  // Initialize skip link functionality
  useSkipLink();

  // Determine current page based on route
  const currentPage = ROUTE_PAGE_MAP[location.pathname] ?? 1;
  const totalPages = response.totalPages;

  // Don't show progress bar on disqualified or results pages
  const showProgress =
    location.pathname !== '/disqualified' && location.pathname !== '/results';

  /**
   * Announce page changes to screen readers
   */
  useEffect(() => {
    if (showProgress) {
      setLiveMessage(`Step ${currentPage} of ${totalPages}`);
    } else {
      setLiveMessage('');
    }
  }, [currentPage, totalPages, showProgress]);

  return (
    <div style={styles.container}>
      {/* Skip to main content link for accessibility */}
      <a href="#main-content" style={styles.skipLink} className="skip-link">
        Skip to main content
      </a>

      {/* Header */}
      <header style={styles.header} role="banner">
        <div style={styles.headerContent}>
          <h1 style={styles.logo}>
            <span style={styles.logoText}>Primary Cell</span>
            <span style={styles.logoSubtext}>Pain Assessment</span>
          </h1>
          {showProgress && (
            <div style={styles.pageIndicator} aria-live="polite">
              <span style={styles.pageText}>
                Step {currentPage} of {totalPages}
              </span>
            </div>
          )}
        </div>
        {showProgress && (
          <ProgressBar current={currentPage} total={totalPages} />
        )}
      </header>

      {/* Main Content - Using MainContent component for accessibility */}
      <MainContent id="main-content" style={styles.main}>
        <div style={styles.content}>{children}</div>
      </MainContent>

      {/* Live Region for screen reader announcements */}
      <LiveRegion message={liveMessage} priority="polite" clearDelay={3000} />

      {/* Footer */}
      <footer style={styles.footer} role="contentinfo">
        <div style={styles.footerContent}>
          <p style={styles.footerText}>
            Your privacy is important to us. All information is confidential.
          </p>
          <nav style={styles.footerNav} aria-label="Footer navigation">
            <a href="#privacy" style={styles.footerLink}>
              Privacy Policy
            </a>
            <span style={styles.footerDivider}>|</span>
            <a href="#terms" style={styles.footerLink}>
              Terms of Use
            </a>
            <span style={styles.footerDivider}>|</span>
            <a href="#contact" style={styles.footerLink}>
              Contact Us
            </a>
          </nav>
          <p style={styles.copyright}>
            &copy; {new Date().getFullYear()} Primary Cell. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

/**
 * Component styles
 * Mobile-first responsive design
 */
const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    backgroundColor: 'var(--color-secondary-cream)',
  },

  skipLink: {
    position: 'absolute',
    top: '-40px',
    left: 0,
    padding: 'var(--spacing-sm) var(--spacing-md)',
    backgroundColor: 'var(--color-primary-navy)',
    color: 'var(--color-white)',
    textDecoration: 'none',
    zIndex: 10000,
    fontWeight: 600,
  },

  header: {
    backgroundColor: 'var(--color-white)',
    borderBottom: '1px solid var(--color-gray-200)',
    boxShadow: 'var(--shadow-sm)',
    position: 'sticky',
    top: 0,
    zIndex: 'var(--z-sticky)',
  },

  headerContent: {
    maxWidth: '1280px',
    margin: '0 auto',
    padding: 'var(--spacing-md)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 'var(--spacing-md)',
  },

  logo: {
    margin: 0,
    padding: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--spacing-xs)',
  },

  logoText: {
    fontSize: '1.5rem',
    fontWeight: 700,
    color: 'var(--color-primary-navy)',
    lineHeight: 1,
  },

  logoSubtext: {
    fontSize: '0.875rem',
    fontWeight: 500,
    color: 'var(--color-gray-600)',
    lineHeight: 1,
  },

  pageIndicator: {
    padding: 'var(--spacing-xs) var(--spacing-md)',
    backgroundColor: 'var(--color-secondary-cream)',
    borderRadius: 'var(--radius-full)',
    border: '1px solid var(--color-gray-300)',
  },

  pageText: {
    fontSize: '0.875rem',
    fontWeight: 600,
    color: 'var(--color-primary-navy)',
  },

  main: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    maxWidth: '1280px',
    margin: '0 auto',
    padding: 'var(--spacing-xl) var(--spacing-md)',
  },

  content: {
    width: '100%',
    maxWidth: '800px',
    margin: '0 auto',
  },

  footer: {
    backgroundColor: 'var(--color-primary-navy)',
    color: 'var(--color-white)',
    marginTop: 'auto',
  },

  footerContent: {
    maxWidth: '1280px',
    margin: '0 auto',
    padding: 'var(--spacing-xl) var(--spacing-md)',
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--spacing-md)',
    alignItems: 'center',
    textAlign: 'center',
  },

  footerText: {
    fontSize: '0.875rem',
    color: 'var(--color-gray-300)',
    margin: 0,
  },

  footerNav: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 'var(--spacing-sm)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  footerLink: {
    color: 'var(--color-white)',
    fontSize: '0.875rem',
    textDecoration: 'none',
    transition: 'color var(--transition-fast) var(--transition-timing)',
  },

  footerDivider: {
    color: 'var(--color-gray-500)',
    fontSize: '0.875rem',
  },

  copyright: {
    fontSize: '0.75rem',
    color: 'var(--color-gray-400)',
    margin: 0,
  },
};

/**
 * Media query styles for responsive design
 * Applied via inline styles for simplicity
 */
if (typeof window !== 'undefined') {
  const mediaQuery = window.matchMedia('(max-width: 768px)');

  if (mediaQuery.matches) {
    // Mobile adjustments
    styles.headerContent = {
      ...styles.headerContent,
      flexDirection: 'column',
      alignItems: 'flex-start',
      gap: 'var(--spacing-sm)',
    };

    styles.main = {
      ...styles.main,
      padding: 'var(--spacing-lg) var(--spacing-md)',
    };

    styles.footerContent = {
      ...styles.footerContent,
      padding: 'var(--spacing-lg) var(--spacing-md)',
      gap: 'var(--spacing-sm)',
    };
  }
}

export default AssessmentLayout;
