/**
 * Test Utilities
 * Helper functions and mocks for testing
 */

import { ReactElement } from 'react';
import { render, RenderOptions, RenderResult } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AssessmentProvider } from '@context/AssessmentContext';
import {
  AssessmentResponse,
  AssessmentState,
  PersonalizationResult,
  QualificationStatus,
} from '@types/index';

/**
 * Custom render options with providers
 */
interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  initialState?: Partial<AssessmentState>;
  route?: string;
}

/**
 * Creates a mock assessment response with default values
 * @param overrides - Partial overrides for the response
 * @returns Complete assessment response
 */
export const createMockAssessmentResponse = (
  overrides?: Partial<AssessmentResponse>
): AssessmentResponse => {
  const defaultResponse: AssessmentResponse = {
    // Qualification
    hasClinicalDiagnosis: null,
    painDuration: null,
    ageRange: null,

    // Personalization
    conditionType: null,
    primaryLocation: null,
    sensations: [],
    painLevel: null,
    symptomTriggers: [],
    dailyImpact: null,
    currentTreatments: [],
    treatmentEffectiveness: null,
    sideEffects: null,
    lifestyleModifications: [],
    exerciseFrequency: null,
    sleepQuality: null,
    stressLevel: null,
    supportSystems: [],
    educationalInterests: [],
    contactPreferences: [],

    // New Pages 4-7 Fields
    treatmentHistory: [],
    otherTreatments: null,
    urgencyLevel: null,
    urgencySelection: null,
    currentBudget: null,
    budgetLevel: null,
    affordabilityResponse: null,
    affordabilityConfirmed: false,
    additionalInfo: null,

    // Proof Offer Pages 11-12 Fields
    wantsHighlightsVideo: false,
    wantsDemoVideo: false,

    // Metadata
    startedAt: new Date().toISOString(),
    completedAt: null,
    currentPage: 1,
    totalPages: 17,
    qualificationStatus: 'pending' as QualificationStatus,
  };

  return {
    ...defaultResponse,
    ...overrides,
  };
};

/**
 * Creates a mock assessment state
 * @param overrides - Partial overrides for the state
 * @returns Complete assessment state
 */
export const createMockAssessmentState = (
  overrides?: Partial<AssessmentState>
): AssessmentState => {
  const defaultState: AssessmentState = {
    response: createMockAssessmentResponse(),
    isLoading: false,
    error: null,
    personalizationResult: null,
  };

  return {
    ...defaultState,
    ...overrides,
    response: {
      ...defaultState.response,
      ...(overrides?.response || {}),
    },
  };
};

/**
 * Creates a mock personalization result
 * @param overrides - Partial overrides for the result
 * @returns Complete personalization result
 */
export const createMockPersonalizationResult = (
  overrides?: Partial<PersonalizationResult>
): PersonalizationResult => {
  const defaultResult: PersonalizationResult = {
    conditionCategory: 'Chronic Pain',
    painProfile: {
      severity: 'moderate',
      duration: 'chronic',
      characteristics: [],
      primaryImpact: ['Daily activities'],
      triggers: ['Movement'],
    },
    treatmentInsights: {
      currentApproach: 'Multimodal',
      effectivenessRating: 'fair',
      gaps: ['Cellular-level treatment'],
      opportunities: ['Primary Cell therapy'],
      considerations: ['Budget', 'Timeline'],
    },
    lifestyleRecommendations: [],
    educationalResources: [],
    supportOptions: [],
    nextSteps: ['Contact specialist', 'Schedule consultation'],
  };

  return {
    ...defaultResult,
    ...overrides,
  };
};

/**
 * Wrapper component with all providers
 */
interface AllProvidersProps {
  children: React.ReactNode;
  initialState?: Partial<AssessmentState>;
  route?: string;
}

const AllProviders: React.FC<AllProvidersProps> = ({
  children,
  initialState,
  route = '/',
}) => {
  // If we need to set initial state, we'd need to create a custom provider
  // For now, we'll use the default provider
  if (route !== '/') {
    window.history.pushState({}, 'Test page', route);
  }

  return (
    <BrowserRouter>
      <AssessmentProvider>{children}</AssessmentProvider>
    </BrowserRouter>
  );
};

/**
 * Custom render function with all providers
 * @param ui - Component to render
 * @param options - Render options
 * @returns Render result with all testing library utilities
 */
export const renderWithProviders = (
  ui: ReactElement,
  options?: CustomRenderOptions
): RenderResult => {
  const { initialState, route, ...renderOptions } = options || {};

  return render(ui, {
    wrapper: ({ children }) => (
      <AllProviders initialState={initialState} route={route}>
        {children}
      </AllProviders>
    ),
    ...renderOptions,
  });
};

/**
 * Mock API responses
 */
export const mockApiResponses = {
  /**
   * Successful assessment submission
   */
  submitSuccess: {
    success: true,
    assessmentId: 'test-assessment-123',
    message: 'Assessment submitted successfully',
  },

  /**
   * Successful lead capture
   */
  leadCaptureSuccess: {
    success: true,
    leadId: 'test-lead-456',
    message: 'Lead captured successfully',
  },

  /**
   * Server error response
   */
  serverError: {
    success: false,
    error: 'Internal server error',
    message: 'Something went wrong',
  },

  /**
   * Validation error response
   */
  validationError: {
    success: false,
    error: 'Validation failed',
    errors: {
      email: 'Invalid email format',
      name: 'Name is required',
    },
  },

  /**
   * Rate limit error
   */
  rateLimitError: {
    success: false,
    error: 'Rate limit exceeded',
    message: 'Too many requests',
    retryAfter: 60,
  },

  /**
   * CSRF token response
   */
  csrfToken: {
    token: 'mock-csrf-token-xyz',
  },
};

/**
 * Creates a mock fetch function
 * @param response - Response to return
 * @param status - HTTP status code
 * @param delay - Delay in milliseconds before resolving
 * @returns Mock fetch function
 */
export const createMockFetch = (
  response: any,
  status = 200,
  delay = 0
): jest.Mock => {
  return jest.fn(() =>
    new Promise((resolve) =>
      setTimeout(
        () =>
          resolve({
            ok: status >= 200 && status < 300,
            status,
            statusText: status === 200 ? 'OK' : 'Error',
            json: async () => response,
            text: async () => JSON.stringify(response),
            headers: new Headers(),
            redirected: false,
            type: 'basic',
            url: 'http://localhost/api/test',
          } as Response),
        delay
      )
    )
  ) as jest.Mock;
};

/**
 * Waits for a condition to be true
 * @param condition - Function that returns true when condition is met
 * @param timeout - Maximum time to wait in milliseconds
 * @returns Promise that resolves when condition is met
 */
export const waitFor = async (
  condition: () => boolean,
  timeout = 5000
): Promise<void> => {
  const startTime = Date.now();

  while (!condition()) {
    if (Date.now() - startTime > timeout) {
      throw new Error('Timeout waiting for condition');
    }
    await new Promise((resolve) => setTimeout(resolve, 50));
  }
};

/**
 * Simulates user input delay
 * @param ms - Milliseconds to delay
 */
export const delay = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Creates a mock navigation event
 * @param direction - Navigation direction
 * @returns Mock event object
 */
export const createMockNavigationEvent = (
  direction: 'forward' | 'back'
): Event => {
  const event = new Event('popstate');
  Object.defineProperty(event, 'state', {
    value: { direction },
  });
  return event;
};

/**
 * Type-safe assertion helpers
 */
export const assertions = {
  /**
   * Asserts that an element has the expected text
   */
  hasText: (element: HTMLElement, expectedText: string): void => {
    expect(element.textContent).toContain(expectedText);
  },

  /**
   * Asserts that an element is visible
   */
  isVisible: (element: HTMLElement): void => {
    expect(element).toBeVisible();
  },

  /**
   * Asserts that an element is not visible
   */
  isHidden: (element: HTMLElement): void => {
    expect(element).not.toBeVisible();
  },

  /**
   * Asserts that a form field has an error
   */
  hasError: (container: HTMLElement, fieldName: string): void => {
    const errorElement = container.querySelector(
      `[data-testid="${fieldName}-error"]`
    );
    expect(errorElement).toBeInTheDocument();
  },

  /**
   * Asserts that a form field has no error
   */
  hasNoError: (container: HTMLElement, fieldName: string): void => {
    const errorElement = container.querySelector(
      `[data-testid="${fieldName}-error"]`
    );
    expect(errorElement).not.toBeInTheDocument();
  },

  /**
   * Asserts that navigation occurred
   */
  navigationOccurred: (expectedPath: string): void => {
    expect(window.location.pathname).toBe(expectedPath);
  },
};

/**
 * Mock routing utilities
 */
export const mockRouter = {
  /**
   * Pushes a new route
   */
  push: (path: string): void => {
    window.history.pushState({}, '', path);
  },

  /**
   * Goes back in history
   */
  back: (): void => {
    window.history.back();
  },

  /**
   * Gets current path
   */
  getCurrentPath: (): string => {
    return window.location.pathname;
  },
};

/**
 * Mock localStorage utilities
 */
export const mockStorage = {
  /**
   * Gets all stored items
   */
  getAll: (): Record<string, any> => {
    const items: Record<string, any> = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        const value = localStorage.getItem(key);
        items[key] = value ? JSON.parse(value) : null;
      }
    }
    return items;
  },

  /**
   * Clears all storage
   */
  clear: (): void => {
    localStorage.clear();
    sessionStorage.clear();
  },
};

/**
 * Test data generators
 */
export const generators = {
  /**
   * Generates a random email
   */
  email: (): string => {
    const random = Math.random().toString(36).substring(7);
    return `test-${random}@example.com`;
  },

  /**
   * Generates a random phone number
   */
  phone: (): string => {
    const areaCode = Math.floor(Math.random() * 900) + 100;
    const prefix = Math.floor(Math.random() * 900) + 100;
    const lineNumber = Math.floor(Math.random() * 9000) + 1000;
    return `(${areaCode}) ${prefix}-${lineNumber}`;
  },

  /**
   * Generates a random name
   */
  name: (): string => {
    const firstNames = ['John', 'Jane', 'Alice', 'Bob', 'Charlie'];
    const lastNames = ['Smith', 'Doe', 'Johnson', 'Williams', 'Brown'];
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    return `${firstName} ${lastName}`;
  },
};

// Re-export everything from @testing-library/react for convenience
export * from '@testing-library/react';
export { default as userEvent } from '@testing-library/user-event';
