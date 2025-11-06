/**
 * Test Helper Utilities
 * Provides mock data generators, custom render functions, and test utilities
 */

import { ReactElement, ReactNode } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import type { AssessmentResponse } from '../../../types';

/**
 * Mock localStorage for testing
 */
export class MockLocalStorage {
  private store: Record<string, string> = {};

  clear() {
    this.store = {};
  }

  getItem(key: string): string | null {
    return this.store[key] || null;
  }

  setItem(key: string, value: string): void {
    this.store[key] = value.toString();
  }

  removeItem(key: string): void {
    delete this.store[key];
  }

  get length(): number {
    return Object.keys(this.store).length;
  }

  key(index: number): string | null {
    const keys = Object.keys(this.store);
    return keys[index] || null;
  }
}

/**
 * Creates a mock localStorage instance
 */
export const createMockLocalStorage = (): MockLocalStorage => {
  return new MockLocalStorage();
};

/**
 * Mock assessment data generator
 */
export const createMockAssessment = (
  overrides: Partial<AssessmentResponse> = {}
): AssessmentResponse => {
  return {
    conditions: ['chronic-back-neck', 'tendon-ligament-pain'],
    sensations: ['sharp', 'dull', 'burning'],
    duration: '2-to-5-years',
    intensity: 7,
    previousTreatments: ['physical-therapy', 'medication', 'surgery'],
    hasBudget: true,
    budgetRange: '15k-30k',
    urgency: 'within-month',
    futureSpendOutlook: 'yes',
    suicidalRiskAnswer: 'no',
    activityImpact: 'significant',
    goals: 'I want to be able to play with my grandchildren without pain.',
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '(555) 123-4567',
    currentPage: '/page-1',
    completedPages: ['/page-1', '/page-2', '/page-3'],
    startedAt: '2024-01-15T10:00:00.000Z',
    completedAt: '2024-01-15T10:30:00.000Z',
    assessmentId: 'test-assessment-123',
    ...overrides,
  };
};

/**
 * Mock minimal assessment (for early pages)
 */
export const createMinimalAssessment = (): AssessmentResponse => {
  return {
    conditions: [],
    sensations: [],
    currentPage: '/page-1',
    completedPages: [],
    startedAt: new Date().toISOString(),
  };
};

/**
 * Mock API response generators
 */
export const mockApiResponse = {
  success: function<T>(data: T) {
    return {
      success: true as const,
      data,
    };
  },

  error: (error: string, code: string = 'UNKNOWN_ERROR') => ({
    success: false as const,
    error,
    code,
  }),

  submitAssessment: () => ({
    success: true as const,
    data: {
      assessmentId: 'mock-assessment-123',
      leadId: 'mock-lead-456',
      success: true,
    },
  }),

  emailResults: () => ({
    success: true as const,
    data: {
      success: true,
      messageId: 'mock-message-789',
    },
  }),

  saveProgress: () => ({
    success: true as const,
    data: {
      success: true,
      assessmentId: 'mock-assessment-123',
    },
  }),
};

/**
 * Mock fetch responses
 */
export const createMockFetchResponse = (
  body: unknown,
  status: number = 200,
  ok: boolean = true
): Response => {
  return {
    ok,
    status,
    statusText: ok ? 'OK' : 'Error',
    headers: new Headers({ 'Content-Type': 'application/json' }),
    json: async () => body,
    text: async () => JSON.stringify(body),
    blob: async () => new Blob([JSON.stringify(body)]),
    arrayBuffer: async () => new ArrayBuffer(0),
    formData: async () => new FormData(),
    clone: function () {
      return this;
    },
    body: null,
    bodyUsed: false,
    redirected: false,
    type: 'basic',
    url: '',
  } as Response;
};

/**
 * Mock fetch error (network error)
 */
export const createMockFetchError = (message: string = 'Network error'): TypeError => {
  return new TypeError(message);
};

/**
 * Mock fetch abort error (timeout)
 */
export const createMockAbortError = (): DOMException => {
  const error = new DOMException('The operation was aborted', 'AbortError');
  return error;
};

/**
 * Wait for a specified time (useful for async tests)
 */
export const wait = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

/**
 * Wait for next tick (for microtask queue)
 */
export const waitForNextTick = (): Promise<void> => {
  return new Promise((resolve) => setImmediate(resolve));
};

/**
 * Custom render function with providers
 */
interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  initialRoute?: string;
}

const AllTheProviders = ({ children, initialRoute = '/' }: { children: ReactNode; initialRoute?: string }) => {
  // Set initial route if provided
  if (initialRoute !== '/') {
    window.history.pushState({}, 'Test page', initialRoute);
  }

  return <BrowserRouter>{children}</BrowserRouter>;
};

export const renderWithProviders = (
  ui: ReactElement,
  options?: CustomRenderOptions
) => {
  const { initialRoute, ...renderOptions } = options || {};

  return render(ui, {
    wrapper: ({ children }) => (
      <AllTheProviders initialRoute={initialRoute}>{children}</AllTheProviders>
    ),
    ...renderOptions,
  });
};

/**
 * Create spy on console methods
 */
export const createConsoleSpy = (method: 'log' | 'warn' | 'error' | 'debug' = 'error') => {
  const originalMethod = console[method];
  const spy = vi.fn();
  console[method] = spy;

  return {
    spy,
    restore: () => {
      console[method] = originalMethod;
    },
  };
};

/**
 * Mock validation test data
 */
export const validationTestData = {
  validEmails: [
    'test@example.com',
    'user.name@example.com',
    'user+tag@example.co.uk',
    'test123@test-domain.com',
  ],
  invalidEmails: [
    '',
    'notanemail',
    '@example.com',
    'test@',
    'test @example.com',
    'test@.com',
    'test..test@example.com',
  ],
  validPhones: [
    '(555) 123-4567',
    '555-123-4567',
    '5551234567',
    '+1 555 123 4567',
    '555 123 4567',
    '1-555-123-4567',
  ],
  invalidPhones: [
    '',
    '123',
    'abc-def-ghij',
    '555-12',
    '12345',
  ],
  validNames: [
    'John Doe',
    'Jane',
    'Mary-Ann Smith',
    "O'Brien",
    'José García',
    'Li Wei',
  ],
  invalidNames: [
    '',
    'A', // too short
    'A'.repeat(101), // too long
  ],
};

/**
 * Mock environment variables
 */
export const mockEnv = (overrides: Record<string, string> = {}) => {
  const original = import.meta.env;

  Object.assign(import.meta.env, {
    VITE_API_BASE_URL: 'http://localhost:3000',
    VITE_API_TIMEOUT: '30000',
    DEV: true,
    ...overrides,
  });

  return {
    restore: () => {
      Object.assign(import.meta.env, original);
    },
  };
};

/**
 * Re-export everything from testing library
 */
export * from '@testing-library/react';
export { default as userEvent } from '@testing-library/user-event';
export { vi } from 'vitest';
