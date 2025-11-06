/**
 * Environment Variable Validator
 * Validates required environment variables at application startup
 *
 * Features:
 * - Validates presence of required environment variables
 * - Validates format of URLs and other structured data
 * - Provides clear error messages for missing/invalid variables
 * - Prevents application from starting with invalid configuration
 * - Development vs Production validation rules
 */

/**
 * Environment validation error class
 */
export class EnvironmentValidationError extends Error {
  constructor(
    message: string,
    public readonly missingVariables: string[] = [],
    public readonly invalidVariables: Array<{ name: string; reason: string }> = []
  ) {
    super(message);
    this.name = 'EnvironmentValidationError';
  }
}

/**
 * Required environment variables for all environments
 */
const REQUIRED_VARIABLES = [
  'VITE_API_BASE_URL',
  'VITE_VIDEO_HIGHLIGHTS_ID',
  'VITE_VIDEO_DEMO_ID',
] as const;

/**
 * Required environment variables for production only
 */
const REQUIRED_PRODUCTION_VARIABLES = [
  'VITE_CONTACT_EMAIL',
  'VITE_CALENDLY_URL',
] as const;

/**
 * Optional but recommended environment variables
 */
const RECOMMENDED_VARIABLES = [
  'VITE_APP_VERSION',
  'VITE_SENTRY_DSN',
  'VITE_PRIVACY_POLICY_URL',
] as const;

/**
 * Check if environment variable exists and is not empty
 * Special case: VITE_API_BASE_URL can be empty for same-origin requests
 */
const hasValue = (value: string | undefined, key?: string): boolean => {
  // Allow empty string for API_BASE_URL (means same-origin)
  if (key === 'VITE_API_BASE_URL' && value === '') {
    return true;
  }
  return value !== undefined && value !== '' && value !== 'undefined' && value !== 'null';
};

/**
 * Validate URL format (allows both absolute URLs and relative paths)
 */
const isValidUrl = (url: string): boolean => {
  // Allow relative paths for Kubernetes ingress routing
  if (url.startsWith('/')) {
    return true;
  }
  
  try {
    const urlObj = new URL(url);
    // Ensure it has a valid protocol
    return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
  } catch {
    return false;
  }
};

/**
 * Validate email format (basic check)
 */
const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate YouTube video ID format
 */
const isValidYouTubeId = (id: string): boolean => {
  // YouTube IDs are 11 characters long and contain alphanumeric characters, hyphens, and underscores
  const youtubeIdRegex = /^[a-zA-Z0-9_-]{11}$/;
  return youtubeIdRegex.test(id);
};

/**
 * Validate Calendly URL format
 */
const isValidCalendlyUrl = (url: string): boolean => {
  if (!isValidUrl(url)) {
    return false;
  }
  // Calendly URLs should contain 'calendly.com'
  return url.includes('calendly.com');
};

/**
 * Validate number value
 */
const isValidNumber = (value: string): boolean => {
  const num = Number(value);
  return !isNaN(num) && isFinite(num);
};

/**
 * Validate boolean value
 */
const isValidBoolean = (value: string): boolean => {
  return value === 'true' || value === 'false';
};

/**
 * Validate all environment variables
 */
export const validateEnvironment = (): void => {
  const missing: string[] = [];
  const invalid: Array<{ name: string; reason: string }> = [];
  const warnings: string[] = [];
  const env = import.meta.env;
  const isDevelopment = env.MODE === 'development';
  const isProduction = env.MODE === 'production';

  // Check required variables
  REQUIRED_VARIABLES.forEach((key) => {
    const value = env[key];

    if (!hasValue(value)) {
      missing.push(key);
      return;
    }

    // Validate specific formats
    switch (key) {
      case 'VITE_API_BASE_URL':
        if (!isValidUrl(value)) {
          invalid.push({
            name: key,
            reason: `Invalid URL format: "${value}". Must be a valid HTTP(S) URL.`,
          });
        }
        break;

      case 'VITE_VIDEO_HIGHLIGHTS_ID':
      case 'VITE_VIDEO_DEMO_ID':
        if (!isValidYouTubeId(value)) {
          invalid.push({
            name: key,
            reason: `Invalid YouTube video ID: "${value}". Must be 11 characters (alphanumeric, hyphens, underscores).`,
          });
        }
        break;
    }
  });

  // Check production-only required variables
  if (isProduction) {
    REQUIRED_PRODUCTION_VARIABLES.forEach((key) => {
      const value = env[key];

      if (!hasValue(value)) {
        missing.push(key);
        return;
      }

      // Validate specific formats
      switch (key) {
        case 'VITE_CONTACT_EMAIL':
          if (!isValidEmail(value)) {
            invalid.push({
              name: key,
              reason: `Invalid email format: "${value}".`,
            });
          }
          break;

        case 'VITE_CALENDLY_URL':
          if (!isValidCalendlyUrl(value)) {
            invalid.push({
              name: key,
              reason: `Invalid Calendly URL: "${value}". Must be a valid Calendly URL.`,
            });
          }
          break;
      }
    });
  }

  // Check recommended variables
  RECOMMENDED_VARIABLES.forEach((key) => {
    const value = env[key];

    if (!hasValue(value)) {
      warnings.push(`Recommended variable "${key}" is not set.`);
      return;
    }

    // Validate specific formats
    switch (key) {
      case 'VITE_SENTRY_DSN':
        if (!isValidUrl(value)) {
          warnings.push(
            `Variable "${key}" has invalid URL format: "${value}". Error monitoring may not work.`
          );
        }
        break;

      case 'VITE_PRIVACY_POLICY_URL':
        if (!isValidUrl(value)) {
          warnings.push(
            `Variable "${key}" has invalid URL format: "${value}".`
          );
        }
        break;
    }
  });

  // Validate optional variables if they exist
  if (hasValue(env.VITE_API_TIMEOUT)) {
    if (!isValidNumber(env.VITE_API_TIMEOUT)) {
      invalid.push({
        name: 'VITE_API_TIMEOUT',
        reason: `Invalid number format: "${env.VITE_API_TIMEOUT}".`,
      });
    } else {
      const timeout = Number(env.VITE_API_TIMEOUT);
      if (timeout < 1000 || timeout > 120000) {
        warnings.push(
          `VITE_API_TIMEOUT (${timeout}ms) is outside recommended range (1000-120000ms).`
        );
      }
    }
  }

  if (hasValue(env.VITE_SESSION_TIMEOUT)) {
    if (!isValidNumber(env.VITE_SESSION_TIMEOUT)) {
      invalid.push({
        name: 'VITE_SESSION_TIMEOUT',
        reason: `Invalid number format: "${env.VITE_SESSION_TIMEOUT}".`,
      });
    }
  }

  // Validate boolean flags
  const booleanFlags = [
    'VITE_ENABLE_ANALYTICS',
    'VITE_ENABLE_DEBUG_MODE',
    'VITE_ENABLE_AUTO_SAVE',
    'VITE_ENABLE_EMAIL_RESULTS',
    'VITE_ENABLE_WAITING_LIST',
    'VITE_ENABLE_SESSION_PERSISTENCE',
  ];

  booleanFlags.forEach((key) => {
    const value = env[key];
    if (hasValue(value) && !isValidBoolean(value)) {
      invalid.push({
        name: key,
        reason: `Invalid boolean value: "${value}". Must be "true" or "false".`,
      });
    }
  });

  // Log warnings in development
  if (isDevelopment && warnings.length > 0) {
    console.group('⚠️ Environment Configuration Warnings');
    warnings.forEach((warning) => console.warn(warning));
    console.groupEnd();
  }

  // Throw error if there are missing or invalid variables
  if (missing.length > 0 || invalid.length > 0) {
    let errorMessage = 'Environment validation failed:\n\n';

    if (missing.length > 0) {
      errorMessage += `Missing required variables:\n`;
      missing.forEach((name) => {
        errorMessage += `  - ${name}\n`;
      });
      errorMessage += '\n';
    }

    if (invalid.length > 0) {
      errorMessage += `Invalid variable values:\n`;
      invalid.forEach(({ name, reason }) => {
        errorMessage += `  - ${name}: ${reason}\n`;
      });
      errorMessage += '\n';
    }

    errorMessage += `Please check your .env file and ensure all required variables are set correctly.\n`;
    errorMessage += `See .env.example for reference.`;

    throw new EnvironmentValidationError(errorMessage, missing, invalid);
  }

  // Log success in development
  if (isDevelopment) {
    console.info('✅ Environment validation passed');
  }
};

/**
 * Get environment configuration summary
 * Useful for debugging
 */
export const getEnvironmentSummary = (): Record<string, unknown> => {
  const env = import.meta.env;

  return {
    mode: env.MODE,
    apiBaseUrl: env.VITE_API_BASE_URL,
    appVersion: env.VITE_APP_VERSION || 'unknown',
    enableAnalytics: env.VITE_ENABLE_ANALYTICS === 'true',
    enableDebugMode: env.VITE_ENABLE_DEBUG_MODE === 'true',
    enableAutoSave: env.VITE_ENABLE_AUTO_SAVE === 'true',
    sentryConfigured: hasValue(env.VITE_SENTRY_DSN),
    calendlyConfigured: hasValue(env.VITE_CALENDLY_URL),
  };
};

/**
 * Display environment validation error to user
 * Creates a full-page error screen with helpful information
 */
export const displayValidationError = (
  error: EnvironmentValidationError
): void => {
  // Clear the page
  document.body.innerHTML = '';

  // Create error display
  const errorContainer = document.createElement('div');
  errorContainer.innerHTML = `
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
        max-width: 700px;
        width: 100%;
        background-color: white;
        border-radius: 12px;
        padding: 2.5rem;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
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
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
            <line x1="12" y1="9" x2="12" y2="13"/>
            <line x1="12" y1="17" x2="12.01" y2="17"/>
          </svg>
        </div>

        <h1 style="
          font-size: 1.5rem;
          font-weight: 600;
          color: #1E3A5F;
          margin-bottom: 1rem;
          text-align: center;
        ">
          Configuration Error
        </h1>

        <p style="
          font-size: 1rem;
          color: #374151;
          margin-bottom: 2rem;
          text-align: center;
        ">
          The application is missing required environment configuration.
        </p>

        <div style="
          background-color: #FEF2F2;
          border-left: 4px solid #DC2626;
          padding: 1rem 1.5rem;
          border-radius: 4px;
          margin-bottom: 2rem;
        ">
          <pre style="
            font-family: 'Courier New', monospace;
            font-size: 0.875rem;
            color: #7F1D1D;
            margin: 0;
            white-space: pre-wrap;
            word-break: break-word;
          ">${error.message}</pre>
        </div>

        <div style="
          padding-top: 1.5rem;
          border-top: 1px solid #E5E7EB;
          font-size: 0.875rem;
          color: #6B7280;
          text-align: center;
        ">
          <p style="margin: 0;">
            If you're a developer, check your <code style="
              background-color: #F3F4F6;
              padding: 2px 6px;
              border-radius: 3px;
              font-family: 'Courier New', monospace;
            ">.env</code> file.
          </p>
          <p style="margin: 0.5rem 0 0 0;">
            If you're a user, please contact the system administrator.
          </p>
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(errorContainer);
};

export default {
  validateEnvironment,
  getEnvironmentSummary,
  displayValidationError,
  EnvironmentValidationError,
};
