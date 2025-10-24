/**
 * Validation Utility Tests
 * Comprehensive test suite for all validation functions
 * Target: 100% coverage
 */

import { describe, it, expect } from 'vitest';
import {
  validateEmail,
  validatePhone,
  validateName,
  validateConditions,
  validateSensations,
  validateDuration,
  validateIntensity,
  validateBudgetQuestion,
  validateBudgetRange,
  validateUrgency,
  validateActivityImpact,
  validateContactInfo,
  validateCurrentPage,
  validateAssessment,
} from '../../../utils/validation';
import { PAGES } from '../../../utils/constants';
import { validationTestData, createMockAssessment } from './testHelpers';

describe('validateEmail', () => {
  describe('valid emails', () => {
    it.each(validationTestData.validEmails)('should return true for valid email: %s', (email) => {
      expect(validateEmail(email)).toBe(true);
    });
  });

  describe('invalid emails', () => {
    it.each(validationTestData.invalidEmails)('should return false for invalid email: %s', (email) => {
      expect(validateEmail(email)).toBe(false);
    });

    it('should return false for non-string values', () => {
      expect(validateEmail(null as any)).toBe(false);
      expect(validateEmail(undefined as any)).toBe(false);
      expect(validateEmail(123 as any)).toBe(false);
      expect(validateEmail({} as any)).toBe(false);
      expect(validateEmail([] as any)).toBe(false);
    });

    it('should return false for whitespace-only email', () => {
      expect(validateEmail('   ')).toBe(false);
    });

    it('should handle emails with leading/trailing whitespace', () => {
      expect(validateEmail('  test@example.com  ')).toBe(true);
    });
  });
});

describe('validatePhone', () => {
  describe('valid phone numbers', () => {
    it.each(validationTestData.validPhones)('should return true for valid phone: %s', (phone) => {
      expect(validatePhone(phone)).toBe(true);
    });
  });

  describe('invalid phone numbers', () => {
    it.each(validationTestData.invalidPhones)('should return false for invalid phone: %s', (phone) => {
      expect(validatePhone(phone)).toBe(false);
    });

    it('should return false for non-string values', () => {
      expect(validatePhone(null as any)).toBe(false);
      expect(validatePhone(undefined as any)).toBe(false);
      expect(validatePhone(123 as any)).toBe(false);
      expect(validatePhone({} as any)).toBe(false);
      expect(validatePhone([] as any)).toBe(false);
    });

    it('should return false for whitespace-only phone', () => {
      expect(validatePhone('   ')).toBe(false);
    });

    it('should return false for phone with less than 10 digits', () => {
      expect(validatePhone('555-1234')).toBe(false);
      expect(validatePhone('12345')).toBe(false);
    });

    it('should handle phones with leading/trailing whitespace', () => {
      expect(validatePhone('  555-123-4567  ')).toBe(true);
    });
  });
});

describe('validateName', () => {
  describe('valid names', () => {
    it.each(validationTestData.validNames)('should return true for valid name: %s', (name) => {
      expect(validateName(name)).toBe(true);
    });

    it('should accept names at minimum length (2 chars)', () => {
      expect(validateName('Jo')).toBe(true);
    });

    it('should accept names at maximum length (100 chars)', () => {
      const maxName = 'A'.repeat(100);
      expect(validateName(maxName)).toBe(true);
    });
  });

  describe('invalid names', () => {
    it.each(validationTestData.invalidNames)('should return false for invalid name: %s', (name) => {
      expect(validateName(name)).toBe(false);
    });

    it('should return false for non-string values', () => {
      expect(validateName(null as any)).toBe(false);
      expect(validateName(undefined as any)).toBe(false);
      expect(validateName(123 as any)).toBe(false);
      expect(validateName({} as any)).toBe(false);
      expect(validateName([] as any)).toBe(false);
    });

    it('should return false for whitespace-only name', () => {
      expect(validateName('   ')).toBe(false);
    });

    it('should return false for name too short (< 2 chars)', () => {
      expect(validateName('A')).toBe(false);
      expect(validateName('')).toBe(false);
    });

    it('should return false for name too long (> 100 chars)', () => {
      const tooLong = 'A'.repeat(101);
      expect(validateName(tooLong)).toBe(false);
    });

    it('should handle names with leading/trailing whitespace correctly', () => {
      expect(validateName('  John Doe  ')).toBe(true);
      expect(validateName('  A  ')).toBe(false); // Still too short after trim
    });
  });
});

describe('validateConditions', () => {
  it('should return valid for array with at least 1 condition', () => {
    const result = validateConditions(['condition1']);
    expect(result.isValid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('should return valid for array with multiple conditions', () => {
    const result = validateConditions(['condition1', 'condition2', 'condition3']);
    expect(result.isValid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('should return invalid for empty array', () => {
    const result = validateConditions([]);
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Please select at least one condition.');
  });

  it('should return invalid for undefined', () => {
    const result = validateConditions(undefined);
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Please select at least one condition.');
  });

  it('should return invalid for non-array', () => {
    const result = validateConditions('not an array' as any);
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Please select at least one condition.');
  });
});

describe('validateSensations', () => {
  it('should return valid for array with at least 1 sensation', () => {
    const result = validateSensations(['sharp']);
    expect(result.isValid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('should return valid for array with multiple sensations', () => {
    const result = validateSensations(['sharp', 'dull', 'burning']);
    expect(result.isValid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('should return invalid for empty array', () => {
    const result = validateSensations([]);
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Please select at least one pain sensation.');
  });

  it('should return invalid for undefined', () => {
    const result = validateSensations(undefined);
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Please select at least one pain sensation.');
  });

  it('should return invalid for non-array', () => {
    const result = validateSensations('not an array' as any);
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Please select at least one pain sensation.');
  });
});

describe('validateDuration', () => {
  it('should return valid for non-empty string', () => {
    const result = validateDuration('2-to-5-years');
    expect(result.isValid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('should return invalid for empty string', () => {
    const result = validateDuration('');
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('This field is required.');
  });

  it('should return invalid for whitespace-only string', () => {
    const result = validateDuration('   ');
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('This field is required.');
  });

  it('should return invalid for undefined', () => {
    const result = validateDuration(undefined);
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('This field is required.');
  });

  it('should return invalid for non-string', () => {
    const result = validateDuration(123 as any);
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('This field is required.');
  });
});

describe('validateIntensity', () => {
  it('should return valid for intensity 1-10', () => {
    for (let i = 1; i <= 10; i++) {
      const result = validateIntensity(i);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    }
  });

  it('should return invalid for intensity 0', () => {
    const result = validateIntensity(0);
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Please select a pain intensity level between 1 and 10.');
  });

  it('should return invalid for intensity > 10', () => {
    const result = validateIntensity(11);
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Please select a pain intensity level between 1 and 10.');
  });

  it('should return invalid for non-integer', () => {
    const result = validateIntensity(5.5);
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Please select a pain intensity level between 1 and 10.');
  });

  it('should return invalid for undefined', () => {
    const result = validateIntensity(undefined);
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('This field is required.');
  });

  it('should return invalid for null', () => {
    const result = validateIntensity(null as any);
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('This field is required.');
  });

  it('should return invalid for non-number', () => {
    const result = validateIntensity('7' as any);
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('This field is required.');
  });

  it('should return invalid for negative numbers', () => {
    const result = validateIntensity(-1);
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Please select a pain intensity level between 1 and 10.');
  });
});

describe('validateBudgetQuestion', () => {
  it('should return valid for true', () => {
    const result = validateBudgetQuestion(true);
    expect(result.isValid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('should return valid for false', () => {
    const result = validateBudgetQuestion(false);
    expect(result.isValid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('should return invalid for undefined', () => {
    const result = validateBudgetQuestion(undefined);
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('This field is required.');
  });

  it('should return invalid for null', () => {
    const result = validateBudgetQuestion(null as any);
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('This field is required.');
  });
});

describe('validateBudgetRange', () => {
  it('should return valid for non-empty string', () => {
    const result = validateBudgetRange('15k-30k');
    expect(result.isValid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('should return invalid for empty string', () => {
    const result = validateBudgetRange('');
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('This field is required.');
  });

  it('should return invalid for whitespace-only string', () => {
    const result = validateBudgetRange('   ');
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('This field is required.');
  });

  it('should return invalid for undefined', () => {
    const result = validateBudgetRange(undefined);
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('This field is required.');
  });

  it('should return invalid for non-string', () => {
    const result = validateBudgetRange(123 as any);
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('This field is required.');
  });
});

describe('validateUrgency', () => {
  it('should return valid for non-empty string', () => {
    const result = validateUrgency('within-month');
    expect(result.isValid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('should return invalid for empty string', () => {
    const result = validateUrgency('');
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('This field is required.');
  });

  it('should return invalid for whitespace-only string', () => {
    const result = validateUrgency('   ');
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('This field is required.');
  });

  it('should return invalid for undefined', () => {
    const result = validateUrgency(undefined);
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('This field is required.');
  });
});

describe('validateActivityImpact', () => {
  it('should return valid for non-empty string', () => {
    const result = validateActivityImpact('significant');
    expect(result.isValid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('should return invalid for empty string', () => {
    const result = validateActivityImpact('');
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('This field is required.');
  });

  it('should return invalid for whitespace-only string', () => {
    const result = validateActivityImpact('   ');
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('This field is required.');
  });

  it('should return invalid for undefined', () => {
    const result = validateActivityImpact(undefined);
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('This field is required.');
  });
});

describe('validateContactInfo', () => {
  it('should return valid for all valid fields', () => {
    const result = validateContactInfo('John Doe', 'john@example.com', '555-123-4567');
    expect(result.isValid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('should return valid without phone (optional)', () => {
    const result = validateContactInfo('John Doe', 'john@example.com');
    expect(result.isValid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('should return valid with empty phone string', () => {
    const result = validateContactInfo('John Doe', 'john@example.com', '');
    expect(result.isValid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('should return invalid for invalid name', () => {
    const result = validateContactInfo('A', 'john@example.com', '555-123-4567');
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Please enter a valid name (2-100 characters).');
  });

  it('should return invalid for invalid email', () => {
    const result = validateContactInfo('John Doe', 'invalid-email', '555-123-4567');
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Please enter a valid email address.');
  });

  it('should return invalid for invalid phone (when provided)', () => {
    const result = validateContactInfo('John Doe', 'john@example.com', '123');
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Please enter a valid phone number.');
  });

  it('should return multiple errors for multiple invalid fields', () => {
    const result = validateContactInfo('A', 'invalid-email', '123');
    expect(result.isValid).toBe(false);
    expect(result.errors).toHaveLength(3);
    expect(result.errors).toContain('Please enter a valid name (2-100 characters).');
    expect(result.errors).toContain('Please enter a valid email address.');
    expect(result.errors).toContain('Please enter a valid phone number.');
  });

  it('should return invalid for missing name', () => {
    const result = validateContactInfo(undefined as any, 'john@example.com');
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Please enter a valid name (2-100 characters).');
  });

  it('should return invalid for missing email', () => {
    const result = validateContactInfo('John Doe', undefined as any);
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Please enter a valid email address.');
  });
});

describe('validateCurrentPage', () => {
  it('should validate PAGE_1 (conditions)', () => {
    const validResult = validateCurrentPage({
      currentPage: PAGES.PAGE_1,
      conditions: ['condition1']
    } as any);
    expect(validResult.isValid).toBe(true);

    const invalidResult = validateCurrentPage({
      currentPage: PAGES.PAGE_1,
      conditions: []
    } as any);
    expect(invalidResult.isValid).toBe(false);
  });

  it('should validate PAGE_2 (sensations)', () => {
    const validResult = validateCurrentPage({
      currentPage: PAGES.PAGE_2,
      sensations: ['sharp']
    } as any);
    expect(validResult.isValid).toBe(true);

    const invalidResult = validateCurrentPage({
      currentPage: PAGES.PAGE_2,
      sensations: []
    } as any);
    expect(invalidResult.isValid).toBe(false);
  });

  it('should validate PAGE_3 (duration)', () => {
    const validResult = validateCurrentPage({
      currentPage: PAGES.PAGE_3,
      duration: '2-to-5-years'
    } as any);
    expect(validResult.isValid).toBe(true);

    const invalidResult = validateCurrentPage({
      currentPage: PAGES.PAGE_3,
      duration: ''
    } as any);
    expect(invalidResult.isValid).toBe(false);
  });

  it('should validate PAGE_4 (intensity)', () => {
    const validResult = validateCurrentPage({
      currentPage: PAGES.PAGE_4,
      intensity: 7
    } as any);
    expect(validResult.isValid).toBe(true);

    const invalidResult = validateCurrentPage({
      currentPage: PAGES.PAGE_4,
      intensity: 0
    } as any);
    expect(invalidResult.isValid).toBe(false);
  });

  it('should validate PAGE_5 (treatments - optional)', () => {
    const result = validateCurrentPage({
      currentPage: PAGES.PAGE_5,
      previousTreatments: []
    } as any);
    expect(result.isValid).toBe(true);
  });

  it('should validate PAGE_6 (budget question)', () => {
    const validResult = validateCurrentPage({
      currentPage: PAGES.PAGE_6,
      hasBudget: true
    } as any);
    expect(validResult.isValid).toBe(true);

    const invalidResult = validateCurrentPage({
      currentPage: PAGES.PAGE_6,
      hasBudget: undefined
    } as any);
    expect(invalidResult.isValid).toBe(false);
  });

  it('should validate PAGE_6B (budget range)', () => {
    const validResult = validateCurrentPage({
      currentPage: PAGES.PAGE_6B,
      budgetRange: '15k-30k'
    } as any);
    expect(validResult.isValid).toBe(true);

    const invalidResult = validateCurrentPage({
      currentPage: PAGES.PAGE_6B,
      budgetRange: ''
    } as any);
    expect(invalidResult.isValid).toBe(false);
  });

  it('should validate PAGE_7 (urgency)', () => {
    const validResult = validateCurrentPage({
      currentPage: PAGES.PAGE_7,
      urgency: 'within-month'
    } as any);
    expect(validResult.isValid).toBe(true);

    const invalidResult = validateCurrentPage({
      currentPage: PAGES.PAGE_7,
      urgency: ''
    } as any);
    expect(invalidResult.isValid).toBe(false);
  });

  it('should validate PAGE_8 (activity impact)', () => {
    const validResult = validateCurrentPage({
      currentPage: PAGES.PAGE_8,
      activityImpact: 'significant'
    } as any);
    expect(validResult.isValid).toBe(true);

    const invalidResult = validateCurrentPage({
      currentPage: PAGES.PAGE_8,
      activityImpact: ''
    } as any);
    expect(invalidResult.isValid).toBe(false);
  });

  it('should validate PAGE_9 (goals - optional)', () => {
    const result = validateCurrentPage({
      currentPage: PAGES.PAGE_9,
      goals: ''
    } as any);
    expect(result.isValid).toBe(true);
  });

  it('should validate PAGE_10 (contact info)', () => {
    const validResult = validateCurrentPage({
      currentPage: PAGES.PAGE_10,
      name: 'John Doe',
      email: 'john@example.com',
      phone: '555-123-4567'
    } as any);
    expect(validResult.isValid).toBe(true);

    const invalidResult = validateCurrentPage({
      currentPage: PAGES.PAGE_10,
      name: 'A',
      email: 'invalid'
    } as any);
    expect(invalidResult.isValid).toBe(false);
  });

  it('should return valid for unknown pages', () => {
    const result = validateCurrentPage({
      currentPage: '/unknown-page'
    } as any);
    expect(result.isValid).toBe(true);
  });
});

describe('validateAssessment', () => {
  it('should return valid for complete valid assessment', () => {
    const assessment = createMockAssessment();
    const result = validateAssessment(assessment);
    expect(result.isValid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('should return invalid for missing conditions', () => {
    const assessment = createMockAssessment({ conditions: [] });
    const result = validateAssessment(assessment);
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Please select at least one condition.');
  });

  it('should return invalid for missing sensations', () => {
    const assessment = createMockAssessment({ sensations: [] });
    const result = validateAssessment(assessment);
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Please select at least one pain sensation.');
  });

  it('should return invalid for missing duration', () => {
    const assessment = createMockAssessment({ duration: '' });
    const result = validateAssessment(assessment);
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('This field is required.');
  });

  it('should return invalid for invalid intensity', () => {
    const assessment = createMockAssessment({ intensity: 0 });
    const result = validateAssessment(assessment);
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Please select a pain intensity level between 1 and 10.');
  });

  it('should return invalid for missing urgency', () => {
    const assessment = createMockAssessment({ urgency: '' });
    const result = validateAssessment(assessment);
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('This field is required.');
  });

  it('should return invalid for missing activity impact', () => {
    const assessment = createMockAssessment({ activityImpact: '' });
    const result = validateAssessment(assessment);
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('This field is required.');
  });

  it('should return invalid for invalid contact info', () => {
    const assessment = createMockAssessment({
      name: 'A',
      email: 'invalid'
    });
    const result = validateAssessment(assessment);
    expect(result.isValid).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);
  });

  it('should validate budget range when hasBudget is true', () => {
    const validAssessment = createMockAssessment({
      hasBudget: true,
      budgetRange: '15k-30k'
    });
    const validResult = validateAssessment(validAssessment);
    expect(validResult.isValid).toBe(true);

    const invalidAssessment = createMockAssessment({
      hasBudget: true,
      budgetRange: ''
    });
    const invalidResult = validateAssessment(invalidAssessment);
    expect(invalidResult.isValid).toBe(false);
    expect(invalidResult.errors).toContain('This field is required.');
  });

  it('should not validate budget range when hasBudget is false', () => {
    const assessment = createMockAssessment({
      hasBudget: false,
      budgetRange: ''
    });
    const result = validateAssessment(assessment);
    expect(result.isValid).toBe(true);
  });

  it('should collect multiple errors', () => {
    const assessment = createMockAssessment({
      conditions: [],
      sensations: [],
      duration: '',
      intensity: 0,
      urgency: '',
      activityImpact: '',
      name: 'A',
      email: 'invalid',
    });
    const result = validateAssessment(assessment);
    expect(result.isValid).toBe(false);
    expect(result.errors.length).toBeGreaterThan(5);
  });
});
