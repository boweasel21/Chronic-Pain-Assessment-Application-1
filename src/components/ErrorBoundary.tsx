/**
 * Error Boundary Component
 * Catches React errors from child components and displays fallback UI
 *
 * Features:
 * - Catches errors during rendering, lifecycle methods, and constructors
 * - Displays user-friendly error messages
 * - Shows detailed error information in development mode
 * - Provides recovery mechanism via "Try Again" button
 * - Logs errors to monitoring service
 * - Does NOT catch async errors (use global error handler for those)
 */

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { logError } from '@/utils/errorLogger';

interface ErrorBoundaryProps {
  children: ReactNode;
  /**
   * Optional fallback UI to render when error occurs
   * If not provided, default fallback UI will be used
   */
  fallback?: ReactNode;
  /**
   * Optional callback when error is caught
   */
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  /**
   * Optional callback to reset error state
   * Called when user clicks "Try Again"
   */
  onReset?: () => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

/**
 * ErrorBoundary Class Component
 * Must be a class component as error boundaries aren't supported in function components
 */
export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  /**
   * Update state when an error is caught
   * This lifecycle method is called during the "render" phase
   */
  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    // Update state so the next render will show the fallback UI
    return {
      hasError: true,
      error,
    };
  }

  /**
   * Log error details
   * This lifecycle method is called during the "commit" phase
   */
  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log error to monitoring service
    logError(error, {
      componentStack: errorInfo.componentStack,
      errorBoundary: true,
    });

    // Update state with error info for display in development
    this.setState({
      errorInfo,
    });

    // Call optional onError callback
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  /**
   * Reset error state to allow recovery
   */
  handleReset = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });

    // Call optional onReset callback
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  /**
   * Reload the entire page
   * Use as last resort if Try Again doesn't work
   */
  handleReload = (): void => {
    window.location.reload();
  };

  render(): ReactNode {
    if (this.state.hasError) {
      // If custom fallback provided, use it
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Otherwise, render default fallback UI
      return (
        <DefaultErrorFallback
          error={this.state.error}
          errorInfo={this.state.errorInfo}
          onReset={this.handleReset}
          onReload={this.handleReload}
        />
      );
    }

    return this.props.children;
  }
}

/**
 * Default Error Fallback UI Component
 * Displays when an error is caught and no custom fallback is provided
 */
interface DefaultErrorFallbackProps {
  error: Error | null;
  errorInfo: ErrorInfo | null;
  onReset: () => void;
  onReload: () => void;
}

const DefaultErrorFallback: React.FC<DefaultErrorFallbackProps> = ({
  error,
  errorInfo,
  onReset,
  onReload,
}) => {
  const isDevelopment = import.meta.env.MODE === 'development';

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        padding: '2rem',
        backgroundColor: 'var(--color-secondary-cream, #FFF9F5)',
        fontFamily: 'var(--font-primary, system-ui, sans-serif)',
      }}
    >
      <div
        style={{
          maxWidth: '600px',
          width: '100%',
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '2.5rem',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          textAlign: 'center',
        }}
      >
        {/* Error Icon */}
        <div
          style={{
            width: '64px',
            height: '64px',
            margin: '0 auto 1.5rem',
            borderRadius: '50%',
            backgroundColor: '#FEE2E2',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#DC2626"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        </div>

        {/* Error Title */}
        <h1
          style={{
            fontSize: '1.5rem',
            fontWeight: 600,
            color: 'var(--color-primary-navy, #1E3A5F)',
            marginBottom: '1rem',
          }}
        >
          Something went wrong
        </h1>

        {/* User-friendly Error Message */}
        <p
          style={{
            fontSize: '1rem',
            color: 'var(--color-gray-700, #374151)',
            marginBottom: '2rem',
            lineHeight: '1.6',
          }}
        >
          We're sorry, but something unexpected happened. Please try again or
          reload the page. If the problem persists, please contact support.
        </p>

        {/* Action Buttons */}
        <div
          style={{
            display: 'flex',
            gap: '1rem',
            justifyContent: 'center',
            flexWrap: 'wrap',
          }}
        >
          <button
            onClick={onReset}
            style={{
              padding: '0.75rem 1.5rem',
              fontSize: '1rem',
              fontWeight: 500,
              color: 'white',
              backgroundColor: 'var(--color-primary-navy, #1E3A5F)',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              transition: 'background-color 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#2C4F7C';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor =
                'var(--color-primary-navy, #1E3A5F)';
            }}
          >
            Try Again
          </button>

          <button
            onClick={onReload}
            style={{
              padding: '0.75rem 1.5rem',
              fontSize: '1rem',
              fontWeight: 500,
              color: 'var(--color-primary-navy, #1E3A5F)',
              backgroundColor: 'white',
              border: '2px solid var(--color-primary-navy, #1E3A5F)',
              borderRadius: '8px',
              cursor: 'pointer',
              transition: 'background-color 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#F3F4F6';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'white';
            }}
          >
            Reload Page
          </button>
        </div>

        {/* Development-only Error Details */}
        {isDevelopment && error && (
          <details
            style={{
              marginTop: '2rem',
              textAlign: 'left',
              backgroundColor: '#F3F4F6',
              padding: '1rem',
              borderRadius: '8px',
              fontSize: '0.875rem',
            }}
          >
            <summary
              style={{
                cursor: 'pointer',
                fontWeight: 600,
                marginBottom: '0.5rem',
                color: '#DC2626',
              }}
            >
              Error Details (Development Only)
            </summary>

            <div style={{ marginTop: '0.5rem' }}>
              <strong style={{ color: '#DC2626' }}>Error:</strong>
              <pre
                style={{
                  marginTop: '0.5rem',
                  padding: '0.5rem',
                  backgroundColor: 'white',
                  borderRadius: '4px',
                  overflow: 'auto',
                  fontSize: '0.75rem',
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                }}
              >
                {error.toString()}
              </pre>
            </div>

            {error.stack && (
              <div style={{ marginTop: '1rem' }}>
                <strong style={{ color: '#DC2626' }}>Stack Trace:</strong>
                <pre
                  style={{
                    marginTop: '0.5rem',
                    padding: '0.5rem',
                    backgroundColor: 'white',
                    borderRadius: '4px',
                    overflow: 'auto',
                    fontSize: '0.75rem',
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                  }}
                >
                  {error.stack}
                </pre>
              </div>
            )}

            {errorInfo?.componentStack && (
              <div style={{ marginTop: '1rem' }}>
                <strong style={{ color: '#DC2626' }}>Component Stack:</strong>
                <pre
                  style={{
                    marginTop: '0.5rem',
                    padding: '0.5rem',
                    backgroundColor: 'white',
                    borderRadius: '4px',
                    overflow: 'auto',
                    fontSize: '0.75rem',
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                  }}
                >
                  {errorInfo.componentStack}
                </pre>
              </div>
            )}
          </details>
        )}

        {/* Support Contact Info */}
        <div
          style={{
            marginTop: '2rem',
            paddingTop: '1.5rem',
            borderTop: '1px solid #E5E7EB',
            fontSize: '0.875rem',
            color: 'var(--color-gray-600, #6B7280)',
          }}
        >
          <p>
            Need help?{' '}
            <a
              href={`mailto:${import.meta.env.VITE_CONTACT_EMAIL || 'support@primarycell.com'}`}
              style={{
                color: 'var(--color-primary-navy, #1E3A5F)',
                textDecoration: 'underline',
              }}
            >
              Contact Support
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ErrorBoundary;
