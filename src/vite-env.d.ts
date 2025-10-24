/// <reference types="vite/client" />

/**
 * Environment Variable Type Definitions
 * Extends ImportMetaEnv with application-specific variables
 */
interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string;
  readonly VITE_APP_VERSION: string;
  readonly VITE_API_BASE_URL: string;
  readonly VITE_API_TIMEOUT: string;
  readonly VITE_ENABLE_ANALYTICS: string;
  readonly VITE_ENABLE_DEBUG_MODE: string;
  readonly VITE_ENVIRONMENT: string;
  readonly VITE_DEPLOY_URL?: string;
  readonly VITE_DEPLOY_BRANCH?: string;
  readonly VITE_CONTACT_EMAIL: string;
  readonly VITE_CONTACT_PHONE: string;
  readonly VITE_SESSION_TIMEOUT: string;
  readonly VITE_ENABLE_SESSION_PERSISTENCE: string;
  readonly VITE_VIDEO_HIGHLIGHTS_ID: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
