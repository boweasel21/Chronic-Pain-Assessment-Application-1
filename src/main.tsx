/**
 * Application Entry Point
 * Initializes React application and mounts to DOM
 *
 * Startup sequence:
 * 1. Validate environment variables
 * 2. Initialize error monitoring
 * 3. Setup global error handlers
 * 4. Render application with error boundary
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ErrorBoundary } from './components/ErrorBoundary';
import {
  validateEnvironment,
  displayValidationError,
  EnvironmentValidationError,
} from './utils/environmentValidator';
import { initializeErrorMonitoring } from './utils/errorLogger';
import { setupGlobalErrorHandlers } from './utils/errorHandler';
import '@styles/global.css';

/**
 * Initialize application
 * Performs all startup validation and configuration
 */
const initializeApplication = (): void => {
  try {
    // Step 1: Validate environment variables
    // This must happen first to ensure all configuration is valid
    validateEnvironment();

    // Step 2: Initialize error monitoring service (Sentry, etc.)
    initializeErrorMonitoring();

    // Step 3: Setup global error handlers for async errors
    setupGlobalErrorHandlers();

    // Log successful initialization in development
    if (import.meta.env.MODE === 'development') {
      console.info('[App] Application initialized successfully');
      console.info('[App] Environment:', import.meta.env.MODE);
      console.info('[App] API Base URL:', import.meta.env.VITE_API_BASE_URL);
    }
  } catch (error) {
    // If environment validation fails, display error and stop
    if (error instanceof EnvironmentValidationError) {
      displayValidationError(error);
      throw error; // Prevent app from rendering
    }

    // For other initialization errors, log and re-throw
    console.error('[App] Initialization failed:', error);
    throw error;
  }
};

/**
 * Render application
 */
const renderApplication = (): void => {
  /**
   * Get root element from DOM
   */
  const rootElement = document.getElementById('root');

  if (!rootElement) {
    throw new Error(
      'Failed to find the root element. ' +
        'Make sure your index.html contains a <div id="root"></div> element.'
    );
  }

  /**
   * Create React root and render application
   * Wrapped in ErrorBoundary to catch React rendering errors
   */
  const root = ReactDOM.createRoot(rootElement);

  root.render(
    <React.StrictMode>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </React.StrictMode>
  );
};

/**
 * Application entry point
 */
try {
  // Initialize application (validation, error monitoring, etc.)
  initializeApplication();

  // Render application
  renderApplication();
} catch (error) {
  // Critical startup error - application cannot start
  console.error('[App] Failed to start application:', error);

  // If not already handled by environment validator, show generic error
  if (!(error instanceof EnvironmentValidationError)) {
    document.body.innerHTML = `
      <div style="
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        min-height: 100vh;
        padding: 2rem;
        background-color: #FFF9F5;
        font-family: system-ui, -apple-system, sans-serif;
      ">
        <div style="
          max-width: 600px;
          width: 100%;
          background-color: white;
          border-radius: 12px;
          padding: 2.5rem;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          text-align: center;
        ">
          <div style="
            width: 64px;
            height: 64px;
            margin: 0 auto 1.5rem;
            border-radius: 50%;
            background-color: #FEE2E2;
            display: flex;
            align-items: center;
            justify-content: center;
          ">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#DC2626" stroke-width="2">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
          </div>
          <h1 style="
            font-size: 1.5rem;
            font-weight: 600;
            color: #1E3A5F;
            margin-bottom: 1rem;
          ">
            Application Startup Failed
          </h1>
          <p style="
            font-size: 1rem;
            color: #374151;
            margin-bottom: 2rem;
            line-height: 1.6;
          ">
            The application failed to start due to a critical error.
            Please contact support if this problem persists.
          </p>
          <button
            onclick="window.location.reload()"
            style="
              padding: 0.75rem 1.5rem;
              font-size: 1rem;
              font-weight: 500;
              color: white;
              background-color: #1E3A5F;
              border: none;
              border-radius: 8px;
              cursor: pointer;
            "
          >
            Reload Page
          </button>
        </div>
      </div>
    `;
  }
}
