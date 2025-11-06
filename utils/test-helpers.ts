/**
 * Test helper utilities for Primary Cell Assessment
 * Mock data and utility functions for testing
 */

import type { AssessmentResponse } from '../types';

/**
 * Creates a mock assessment response with default values
 * @param overrides - Partial response to override defaults
 * @returns Complete mock assessment response
 */
export const createMockAssessment = (
  overrides: Partial<AssessmentResponse> = {}
): AssessmentResponse => {
  return {
    conditions: ['chronic-back-neck'],
    sensations: ['burning'],
    duration: '2-to-5-years',
    intensity: 7,
    previousTreatments: ['prescription-painkillers-oxycodone', 'physical-therapy'],
    hasBudget: true,
    budgetRange: '5k-15k',
    urgency: 'within-month',
    futureSpendOutlook: 'yes',
    suicidalRiskAnswer: 'no',
    activityImpact: 'significant',
    goals: 'Reduce pain and improve daily function',
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '555-123-4567',
    currentPage: '/page-1',
    completedPages: [],
    startedAt: new Date().toISOString(),
    ...overrides,
  };
};

/**
 * Creates a mock assessment with only treatable conditions
 */
export const createMockQualifiedAssessment = (): AssessmentResponse => {
  return createMockAssessment({
    conditions: ['chronic-back-neck', 'sciatica', 'tendon-ligament-pain'],
  });
};

/**
 * Creates a mock assessment with only non-treatable conditions
 */
export const createMockDisqualifiedAssessment = (): AssessmentResponse => {
  return createMockAssessment({
    conditions: ['autoimmune-disease', 'chronic-fatigue'],
  });
};

/**
 * Creates a mock assessment with mixed conditions
 */
export const createMockMixedConditionsAssessment = (): AssessmentResponse => {
  return createMockAssessment({
    conditions: ['chronic-back-neck', 'autoimmune-disease'],
  });
};

/**
 * Creates a mock assessment with no previous treatments
 */
export const createMockNoTreatmentsAssessment = (): AssessmentResponse => {
  return createMockAssessment({
    previousTreatments: [],
  });
};

/**
 * Creates a mock assessment with many treatments
 */
export const createMockManyTreatmentsAssessment = (): AssessmentResponse => {
  return createMockAssessment({
    previousTreatments: [
      'prescription-painkillers-hydrocodone',
      'otc-painkillers',
      'nerve-pain-medicines-gabapentin',
      'physical-therapy',
      'chiropractic-care',
      'acupuncture',
      'mindfulness',
      'tens-unit',
    ],
  });
};

/**
 * Creates a mock assessment with budget constraints
 */
export const createMockNoBudgetAssessment = (): AssessmentResponse => {
  return createMockAssessment({
    hasBudget: false,
    budgetRange: undefined,
  });
};

/**
 * Creates an incomplete mock assessment (for validation testing)
 */
export const createMockIncompleteAssessment = (): Partial<AssessmentResponse> => {
  return {
    conditions: ['chronic-back-neck'],
    // Missing required fields
  };
};

/**
 * Creates a mock assessment with invalid data (for validation testing)
 */
export const createMockInvalidAssessment = (): Partial<AssessmentResponse> => {
  return {
    conditions: [], // Empty array (invalid)
    sensations: [], // Empty array (invalid)
    email: 'invalid-email', // Invalid email
    phone: '123', // Too short
    name: 'A', // Too short
    intensity: 15, // Out of range
  };
};

/**
 * Mock API response generator
 */
export const createMockApiResponse = <T>(
  data: T,
  success = true,
  error?: string
) => {
  return {
    success,
    data: success ? data : undefined,
    error: error || undefined,
  };
};

/**
 * Mock API error response
 */
export const createMockApiError = (
  message = 'Mock API Error',
  statusCode = 500
) => {
  return {
    success: false,
    error: message,
    statusCode,
  };
};

/**
 * Delays execution (for testing async operations)
 */
export const delay = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

/**
 * Creates a mock fetch function for API testing
 */
export const createMockFetch = (
  mockResponse: unknown,
  shouldFail = false,
  statusCode = 200
): jest.Mock => {
  if (typeof jest === 'undefined') {
    // Return a simple mock if Jest is not available
    return (() => {
      if (shouldFail) {
        return Promise.reject(new Error('Mock fetch error'));
      }
      return Promise.resolve({
        ok: statusCode >= 200 && statusCode < 300,
        status: statusCode,
        json: () => Promise.resolve(mockResponse),
      });
    }) as jest.Mock;
  }

  return jest.fn(() => {
    if (shouldFail) {
      return Promise.reject(new Error('Mock fetch error'));
    }
    return Promise.resolve({
      ok: statusCode >= 200 && statusCode < 300,
      status: statusCode,
      json: () => Promise.resolve(mockResponse),
    });
  });
};

/**
 * Validates if a date string is in ISO format
 */
export const isISODateString = (dateString: string): boolean => {
  const isoRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/;
  return isoRegex.test(dateString);
};

/**
 * Mock localStorage for testing
 */
export class MockStorage implements Storage {
  private store: Record<string, string> = {};

  get length(): number {
    return Object.keys(this.store).length;
  }

  clear(): void {
    this.store = {};
  }

  getItem(key: string): string | null {
    return this.store[key] || null;
  }

  key(index: number): string | null {
    const keys = Object.keys(this.store);
    return keys[index] || null;
  }

  removeItem(key: string): void {
    delete this.store[key];
  }

  setItem(key: string, value: string): void {
    this.store[key] = value;
  }
}

/**
 * Creates a mock logger for testing
 */
export const createMockLogger = () => {
  return {
    debug: jest?.fn() || (() => {}),
    info: jest?.fn() || (() => {}),
    warn: jest?.fn() || (() => {}),
    error: jest?.fn() || (() => {}),
  };
};

/**
 * Test data generators
 */
export const testData = {
  validEmails: [
    'test@example.com',
    'user.name@example.com',
    'user+tag@example.co.uk',
    'test123@test-domain.com',
  ],
  invalidEmails: [
    'invalid',
    '@example.com',
    'user@',
    'user @example.com',
    'user@example',
  ],
  validPhones: [
    '555-123-4567',
    '(555) 123-4567',
    '+1 555 123 4567',
    '5551234567',
  ],
  invalidPhones: ['123', '555', 'abc-def-ghij', '555-12-345'],
  validNames: ['John Doe', 'Jane Smith', 'Dr. Robert Johnson', 'Mary-Anne'],
  invalidNames: ['A', '', ' ', 'X'.repeat(101)],
};

/**
 * Assertion helpers
 */
export const assertions = {
  /**
   * Checks if object has all required properties
   */
  hasRequiredProperties<T extends object>(
    obj: unknown,
    requiredProps: (keyof T)[]
  ): obj is T {
    if (typeof obj !== 'object' || obj === null) {
      return false;
    }

    return requiredProps.every((prop) => prop in obj);
  },

  /**
   * Checks if array is non-empty
   */
  isNonEmptyArray(value: unknown): value is unknown[] {
    return Array.isArray(value) && value.length > 0;
  },

  /**
   * Checks if value is a valid page path
   */
  isValidPagePath(value: unknown): value is string {
    if (typeof value !== 'string') return false;
    return value.startsWith('/') && (value.includes('page-') || value === '/');
  },
};

/**
 * Randomizes array order (for testing)
 */
export const shuffleArray = <T>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

/**
 * Generates random integer in range
 */
export const randomInt = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

/**
 * Picks random item from array
 */
export const randomItem = <T>(array: T[]): T => {
  return array[randomInt(0, array.length - 1)];
};

/**
 * Generates random email
 */
export const randomEmail = (): string => {
  const domains = ['example.com', 'test.com', 'demo.com'];
  const names = ['john', 'jane', 'test', 'user'];
  return `${randomItem(names)}${randomInt(1, 999)}@${randomItem(domains)}`;
};

/**
 * Generates random phone
 */
export const randomPhone = (): string => {
  return `${randomInt(200, 999)}-${randomInt(100, 999)}-${randomInt(1000, 9999)}`;
};
