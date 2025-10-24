/// <reference types="vite/client" />

/**
 * Environment Variable Type Definitions
 * Extends ImportMetaEnv with application-specific variables
 */
interface ImportMetaEnv {
  // Application Configuration
  readonly VITE_APP_TITLE: string;
  readonly VITE_APP_VERSION: string;
  readonly VITE_ENVIRONMENT: string;

  // API Configuration (Required)
  readonly VITE_API_BASE_URL: string;
  readonly VITE_API_TIMEOUT: string;

  // Video Configuration (Required)
  readonly VITE_VIDEO_HIGHLIGHTS_ID: string;
  readonly VITE_VIDEO_DEMO_ID: string;
  readonly VITE_VIDEO_FINAL_ID?: string;

  // External Links (Required for Production)
  readonly VITE_CALENDLY_URL: string;
  readonly VITE_PRIVACY_POLICY_URL?: string;
  readonly VITE_TERMS_OF_SERVICE_URL?: string;

  // Feature Flags
  readonly VITE_ENABLE_ANALYTICS: string;
  readonly VITE_ENABLE_DEBUG_MODE: string;
  readonly VITE_ENABLE_AUTO_SAVE: string;
  readonly VITE_AUTO_SAVE_INTERVAL?: string;
  readonly VITE_ENABLE_EMAIL_RESULTS: string;
  readonly VITE_ENABLE_WAITING_LIST: string;

  // Session Configuration
  readonly VITE_SESSION_TIMEOUT: string;
  readonly VITE_ENABLE_SESSION_PERSISTENCE: string;
  readonly VITE_MAX_ASSESSMENT_DURATION?: string;

  // Contact Information
  readonly VITE_CONTACT_EMAIL: string;
  readonly VITE_CONTACT_PHONE: string;

  // Deployment (Auto-populated by Emergent.sh)
  readonly VITE_DEPLOY_URL?: string;
  readonly VITE_DEPLOY_BRANCH?: string;
  readonly VITE_DEPLOY_COMMIT_SHA?: string;

  // Third-Party Integrations (Optional)
  readonly VITE_GA_MEASUREMENT_ID?: string;
  readonly VITE_SENTRY_DSN?: string;
  readonly VITE_SENTRY_ENVIRONMENT?: string;

  // Development Only
  readonly VITE_USE_MOCK_API?: string;
  readonly VITE_SHOW_DEV_TOOLS?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
