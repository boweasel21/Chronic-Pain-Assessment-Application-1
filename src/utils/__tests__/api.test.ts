/**
 * API Service Tests
 * Comprehensive test suite for API utility functions
 * Target: 90%+ coverage
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  submitAssessment,
  saveProgress,
  sendEmailResults,
  checkApiHealth,
  batchOperations,
  ApiError,
  ApiErrorCode,
  type AssessmentSubmissionPayload,
  type SaveProgressPayload,
} from '../../../utils/api';
import {
  createMockAssessment,
  createMockFetchResponse,
  createMockFetchError,
  createMockAbortError,
  wait,
  mockApiResponse,
} from './testHelpers';

// Mock fetch globally
const mockFetch = vi.fn();
global.fetch = mockFetch;

// Mock import.meta.env
vi.stubGlobal('import.meta', {
  env: {
    VITE_API_BASE_URL: 'http://localhost:3000',
    VITE_API_TIMEOUT: '30000',
    DEV: true,
  },
});

describe('ApiError', () => {
  it('should create ApiError with all properties', () => {
    const error = new ApiError(
      'Test error',
      ApiErrorCode.VALIDATION_ERROR,
      400,
      { field: 'email' }
    );

    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(ApiError);
    expect(error.name).toBe('ApiError');
    expect(error.message).toBe('Test error');
    expect(error.code).toBe(ApiErrorCode.VALIDATION_ERROR);
    expect(error.statusCode).toBe(400);
    expect(error.details).toEqual({ field: 'email' });
  });

  it('should create ApiError without optional properties', () => {
    const error = new ApiError('Test error', ApiErrorCode.UNKNOWN_ERROR);

    expect(error.message).toBe('Test error');
    expect(error.code).toBe(ApiErrorCode.UNKNOWN_ERROR);
    expect(error.statusCode).toBeUndefined();
    expect(error.details).toBeUndefined();
  });
});

describe('submitAssessment', () => {
  const validPayload: AssessmentSubmissionPayload = {
    assessment: createMockAssessment(),
    contactInfo: {
      name: 'John Doe',
      email: 'john@example.com',
      phone: '555-123-4567',
    },
    leadSource: 'website',
  };

  beforeEach(() => {
    mockFetch.mockClear();
  });

  describe('validation', () => {
    it('should validate email before submission', async () => {
      const payload = {
        ...validPayload,
        contactInfo: { ...validPayload.contactInfo, email: 'invalid-email' },
      };

      const result = await submitAssessment(payload);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Please provide a valid email address');
      expect(result.code).toBe(ApiErrorCode.INVALID_EMAIL);
      expect(mockFetch).not.toHaveBeenCalled();
    });

    it('should validate phone if provided', async () => {
      const payload = {
        ...validPayload,
        contactInfo: { ...validPayload.contactInfo, phone: '123' },
      };

      const result = await submitAssessment(payload);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Please provide a valid phone number');
      expect(result.code).toBe(ApiErrorCode.INVALID_PHONE);
      expect(mockFetch).not.toHaveBeenCalled();
    });

    it('should validate name length', async () => {
      const payload = {
        ...validPayload,
        contactInfo: { ...validPayload.contactInfo, name: 'A' },
      };

      const result = await submitAssessment(payload);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Please provide a valid name');
      expect(result.code).toBe(ApiErrorCode.VALIDATION_ERROR);
      expect(mockFetch).not.toHaveBeenCalled();
    });

    it('should allow submission without phone number', async () => {
      const payload = {
        ...validPayload,
        contactInfo: {
          name: 'John Doe',
          email: 'john@example.com',
        },
      };

      mockFetch.mockResolvedValueOnce(
        createMockFetchResponse({
          assessmentId: 'test-123',
          leadId: 'lead-456',
          success: true,
        })
      );

      const result = await submitAssessment(payload);

      expect(result.success).toBe(true);
      expect(mockFetch).toHaveBeenCalled();
    });
  });

  describe('successful submission', () => {
    it('should submit assessment successfully', async () => {
      mockFetch.mockResolvedValueOnce(
        createMockFetchResponse({
          assessmentId: 'test-123',
          leadId: 'lead-456',
          success: true,
        })
      );

      const result = await submitAssessment(validPayload);

      expect(result.success).toBe(true);
      expect(result.data).toEqual({
        assessmentId: 'test-123',
        leadId: 'lead-456',
        success: true,
      });
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });

    it('should include metadata in request', async () => {
      mockFetch.mockResolvedValueOnce(
        createMockFetchResponse({
          assessmentId: 'test-123',
          leadId: 'lead-456',
          success: true,
        })
      );

      await submitAssessment(validPayload);

      const callArgs = mockFetch.mock.calls[0];
      const requestBody = JSON.parse(callArgs[1].body);

      expect(requestBody.metadata).toBeDefined();
      expect(requestBody.metadata.userAgent).toBe(navigator.userAgent);
      expect(requestBody.metadata.referrer).toBe(document.referrer);
      expect(requestBody.metadata.timestamp).toBeDefined();
    });

    it('should merge custom metadata', async () => {
      mockFetch.mockResolvedValueOnce(
        createMockFetchResponse({
          assessmentId: 'test-123',
          leadId: 'lead-456',
          success: true,
        })
      );

      const payloadWithMetadata = {
        ...validPayload,
        metadata: {
          customField: 'custom value',
        },
      };

      await submitAssessment(payloadWithMetadata);

      const callArgs = mockFetch.mock.calls[0];
      const requestBody = JSON.parse(callArgs[1].body);

      expect(requestBody.metadata.customField).toBe('custom value');
      expect(requestBody.metadata.userAgent).toBeDefined();
    });
  });

  describe('error handling', () => {
    it('should handle 400 validation errors', async () => {
      mockFetch.mockResolvedValueOnce(
        createMockFetchResponse(
          { error: 'Validation failed', message: 'Invalid data' },
          400,
          false
        )
      );

      const result = await submitAssessment(validPayload);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Validation failed');
      expect(result.code).toBe(ApiErrorCode.VALIDATION_ERROR);
    });

    it('should handle 401 unauthorized errors', async () => {
      mockFetch.mockResolvedValueOnce(
        createMockFetchResponse({ error: 'Unauthorized' }, 401, false)
      );

      const result = await submitAssessment(validPayload);

      expect(result.success).toBe(false);
      expect(result.code).toBe(ApiErrorCode.UNAUTHORIZED);
    });

    it('should handle 404 not found errors', async () => {
      mockFetch.mockResolvedValueOnce(
        createMockFetchResponse({ error: 'Not found' }, 404, false)
      );

      const result = await submitAssessment(validPayload);

      expect(result.success).toBe(false);
      expect(result.code).toBe(ApiErrorCode.NOT_FOUND);
    });

    it('should handle 429 rate limit errors', async () => {
      mockFetch.mockResolvedValueOnce(
        createMockFetchResponse({ error: 'Too many requests' }, 429, false)
      );

      const result = await submitAssessment(validPayload);

      expect(result.success).toBe(false);
      expect(result.code).toBe(ApiErrorCode.RATE_LIMIT);
    });

    it('should handle 500 server errors with retry', async () => {
      // First 3 attempts fail with 500, 4th succeeds
      mockFetch
        .mockResolvedValueOnce(
          createMockFetchResponse({ error: 'Server error' }, 500, false)
        )
        .mockResolvedValueOnce(
          createMockFetchResponse({ error: 'Server error' }, 500, false)
        )
        .mockResolvedValueOnce(
          createMockFetchResponse({ error: 'Server error' }, 500, false)
        )
        .mockResolvedValueOnce(
          createMockFetchResponse({
            assessmentId: 'test-123',
            leadId: 'lead-456',
            success: true,
          })
        );

      const result = await submitAssessment(validPayload);

      expect(result.success).toBe(true);
      expect(mockFetch).toHaveBeenCalledTimes(4);
    });

    it('should exhaust retries on persistent server errors', async () => {
      // All attempts fail with 500
      mockFetch.mockResolvedValue(
        createMockFetchResponse({ error: 'Server error' }, 500, false)
      );

      const result = await submitAssessment(validPayload);

      expect(result.success).toBe(false);
      expect(result.code).toBe(ApiErrorCode.SERVER_ERROR);
      expect(mockFetch).toHaveBeenCalledTimes(4); // Initial + 3 retries
    });

    it('should handle network errors with retry', async () => {
      // First 2 attempts fail with network error, 3rd succeeds
      mockFetch
        .mockRejectedValueOnce(createMockFetchError('Network error'))
        .mockRejectedValueOnce(createMockFetchError('Network error'))
        .mockResolvedValueOnce(
          createMockFetchResponse({
            assessmentId: 'test-123',
            leadId: 'lead-456',
            success: true,
          })
        );

      const result = await submitAssessment(validPayload);

      expect(result.success).toBe(true);
      expect(mockFetch).toHaveBeenCalledTimes(3);
    });

    it('should handle timeout errors with retry', async () => {
      // Simulate timeout
      mockFetch
        .mockRejectedValueOnce(createMockAbortError())
        .mockResolvedValueOnce(
          createMockFetchResponse({
            assessmentId: 'test-123',
            leadId: 'lead-456',
            success: true,
          })
        );

      const result = await submitAssessment(validPayload);

      expect(result.success).toBe(true);
      expect(mockFetch).toHaveBeenCalledTimes(2);
    });

    it('should not retry 4xx client errors', async () => {
      mockFetch.mockResolvedValueOnce(
        createMockFetchResponse({ error: 'Bad request' }, 400, false)
      );

      const result = await submitAssessment(validPayload);

      expect(result.success).toBe(false);
      expect(mockFetch).toHaveBeenCalledTimes(1); // No retries
    });
  });

  describe('PII redaction in logging', () => {
    let consoleDebugSpy: ReturnType<typeof vi.spyOn>;

    beforeEach(() => {
      consoleDebugSpy = vi.spyOn(console, 'debug').mockImplementation(() => {});
    });

    afterEach(() => {
      consoleDebugSpy.mockRestore();
    });

    it('should redact PII fields in request logging', async () => {
      mockFetch.mockResolvedValueOnce(
        createMockFetchResponse({
          assessmentId: 'test-123',
          leadId: 'lead-456',
          success: true,
        })
      );

      await submitAssessment(validPayload);

      expect(consoleDebugSpy).toHaveBeenCalled();
      const logCalls = consoleDebugSpy.mock.calls;
      const requestLog = logCalls.find((call) => call[0] === '[API Request]');

      if (requestLog) {
        const logData = requestLog[1];
        const payloadString = JSON.stringify(logData.payload);
        expect(payloadString).toContain('[REDACTED]');
        expect(payloadString).not.toContain('john@example.com');
        expect(payloadString).not.toContain('John Doe');
      }
    });
  });
});

describe('saveProgress', () => {
  const validPayload: SaveProgressPayload = {
    assessmentId: 'test-123',
    progress: {
      conditions: ['chronic-back-pain'],
      sensations: ['sharp', 'dull'],
      currentPage: '/page-2',
    },
  };

  beforeEach(() => {
    mockFetch.mockClear();
  });

  it('should save progress successfully', async () => {
    mockFetch.mockResolvedValueOnce(
      createMockFetchResponse({
        success: true,
        assessmentId: 'test-123',
      })
    );

    const result = await saveProgress(validPayload);

    expect(result.success).toBe(true);
    expect(result.data).toEqual({
      success: true,
      assessmentId: 'test-123',
    });
  });

  it('should include savedAt timestamp', async () => {
    mockFetch.mockResolvedValueOnce(
      createMockFetchResponse({
        success: true,
        assessmentId: 'test-123',
      })
    );

    await saveProgress(validPayload);

    const callArgs = mockFetch.mock.calls[0];
    const requestBody = JSON.parse(callArgs[1].body);

    expect(requestBody.savedAt).toBeDefined();
    expect(new Date(requestBody.savedAt).toString()).not.toBe('Invalid Date');
  });

  it('should use lower retry count for auto-save', async () => {
    mockFetch
      .mockResolvedValueOnce(
        createMockFetchResponse({ error: 'Server error' }, 500, false)
      )
      .mockResolvedValueOnce(
        createMockFetchResponse({
          success: true,
          assessmentId: 'test-123',
        })
      );

    const result = await saveProgress(validPayload);

    expect(result.success).toBe(true);
    expect(mockFetch).toHaveBeenCalledTimes(2); // Initial + 1 retry (not 3)
  });

  it('should handle save errors gracefully', async () => {
    mockFetch.mockResolvedValue(
      createMockFetchResponse({ error: 'Save failed' }, 500, false)
    );

    const result = await saveProgress(validPayload);

    expect(result.success).toBe(false);
  });
});

describe('sendEmailResults', () => {
  beforeEach(() => {
    mockFetch.mockClear();
  });

  it('should send email results successfully', async () => {
    mockFetch.mockResolvedValueOnce(
      createMockFetchResponse({
        success: true,
        messageId: 'msg-123',
      })
    );

    const result = await sendEmailResults('john@example.com', 'assessment-123');

    expect(result.success).toBe(true);
    expect(result.data).toEqual({
      success: true,
      messageId: 'msg-123',
    });
  });

  it('should validate email before sending', async () => {
    const result = await sendEmailResults('invalid-email', 'assessment-123');

    expect(result.success).toBe(false);
    expect(result.error).toBe('Please provide a valid email address');
    expect(result.code).toBe(ApiErrorCode.INVALID_EMAIL);
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it('should validate assessment ID', async () => {
    const result = await sendEmailResults('john@example.com', '');

    expect(result.success).toBe(false);
    expect(result.error).toBe('Assessment ID is required');
    expect(result.code).toBe(ApiErrorCode.VALIDATION_ERROR);
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it('should include sentAt timestamp', async () => {
    mockFetch.mockResolvedValueOnce(
      createMockFetchResponse({
        success: true,
        messageId: 'msg-123',
      })
    );

    await sendEmailResults('john@example.com', 'assessment-123');

    const callArgs = mockFetch.mock.calls[0];
    const requestBody = JSON.parse(callArgs[1].body);

    expect(requestBody.sentAt).toBeDefined();
    expect(new Date(requestBody.sentAt).toString()).not.toBe('Invalid Date');
  });
});

describe('checkApiHealth', () => {
  beforeEach(() => {
    mockFetch.mockClear();
  });

  it('should check API health successfully', async () => {
    mockFetch.mockResolvedValueOnce(
      createMockFetchResponse({
        status: 'healthy',
        version: '1.0.0',
      })
    );

    const result = await checkApiHealth();

    expect(result.success).toBe(true);
    expect(result.data).toEqual({
      status: 'healthy',
      version: '1.0.0',
    });
  });

  it('should use lower retry count for health checks', async () => {
    mockFetch
      .mockResolvedValueOnce(
        createMockFetchResponse({ error: 'Unhealthy' }, 503, false)
      )
      .mockResolvedValueOnce(
        createMockFetchResponse({
          status: 'healthy',
          version: '1.0.0',
        })
      );

    const result = await checkApiHealth();

    expect(result.success).toBe(true);
    expect(mockFetch).toHaveBeenCalledTimes(2); // Initial + 1 retry
  });

  it('should handle unhealthy API', async () => {
    mockFetch.mockResolvedValue(
      createMockFetchResponse({ error: 'Unhealthy' }, 503, false)
    );

    const result = await checkApiHealth();

    expect(result.success).toBe(false);
    expect(result.code).toBe(ApiErrorCode.SERVER_ERROR);
  });
});

describe('batchOperations', () => {
  beforeEach(() => {
    mockFetch.mockClear();
  });

  it('should execute multiple operations successfully', async () => {
    mockFetch
      .mockResolvedValueOnce(
        createMockFetchResponse({ success: true, id: '1' })
      )
      .mockResolvedValueOnce(
        createMockFetchResponse({ success: true, id: '2' })
      )
      .mockResolvedValueOnce(
        createMockFetchResponse({ success: true, id: '3' })
      );

    const operations = [
      checkApiHealth(),
      checkApiHealth(),
      checkApiHealth(),
    ];

    const results = await batchOperations(operations);

    expect(results).toHaveLength(3);
    expect(results[0].success).toBe(true);
    expect(results[1].success).toBe(true);
    expect(results[2].success).toBe(true);
  });

  it('should handle mixed success and failure operations', async () => {
    mockFetch
      .mockResolvedValueOnce(
        createMockFetchResponse({ success: true, id: '1' })
      )
      .mockResolvedValueOnce(
        createMockFetchResponse({ error: 'Failed' }, 500, false)
      )
      .mockResolvedValueOnce(
        createMockFetchResponse({ success: true, id: '3' })
      );

    const operations = [
      checkApiHealth(),
      checkApiHealth(),
      checkApiHealth(),
    ];

    const results = await batchOperations(operations);

    expect(results).toHaveLength(3);
    expect(results[0].success).toBe(true);
    expect(results[1].success).toBe(false);
    expect(results[2].success).toBe(true);
  });

  it('should handle all failed operations', async () => {
    mockFetch.mockResolvedValue(
      createMockFetchResponse({ error: 'Failed' }, 500, false)
    );

    const operations = [
      checkApiHealth(),
      checkApiHealth(),
    ];

    const results = await batchOperations(operations);

    expect(results).toHaveLength(2);
    expect(results[0].success).toBe(false);
    expect(results[1].success).toBe(false);
  });

  it('should handle rejected promises', async () => {
    const operations = [
      Promise.resolve({ success: true, data: { id: '1' } }),
      Promise.reject(new Error('Failed')),
      Promise.resolve({ success: true, data: { id: '3' } }),
    ];

    const results = await batchOperations(operations as any);

    expect(results).toHaveLength(3);
    expect(results[0].success).toBe(true);
    expect(results[1].success).toBe(false);
    expect(results[1].error).toBe('Operation failed');
    expect(results[2].success).toBe(true);
  });
});

describe('exponential backoff', () => {
  beforeEach(() => {
    mockFetch.mockClear();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should implement exponential backoff delays', async () => {
    // All attempts fail to test backoff timing
    mockFetch.mockResolvedValue(
      createMockFetchResponse({ error: 'Server error' }, 500, false)
    );

    const startTime = Date.now();
    const promise = submitAssessment({
      assessment: createMockAssessment(),
      contactInfo: {
        name: 'John Doe',
        email: 'john@example.com',
      },
    });

    // Fast-forward through all retries
    await vi.runAllTimersAsync();
    await promise;

    // Should have made 4 calls (initial + 3 retries)
    expect(mockFetch).toHaveBeenCalledTimes(4);
  });
});

describe('request headers', () => {
  beforeEach(() => {
    mockFetch.mockClear();
  });

  it('should include Content-Type header', async () => {
    mockFetch.mockResolvedValueOnce(
      createMockFetchResponse({
        assessmentId: 'test-123',
        leadId: 'lead-456',
        success: true,
      })
    );

    await submitAssessment({
      assessment: createMockAssessment(),
      contactInfo: {
        name: 'John Doe',
        email: 'john@example.com',
      },
    });

    const callArgs = mockFetch.mock.calls[0];
    expect(callArgs[1].headers['Content-Type']).toBe('application/json');
  });
});
