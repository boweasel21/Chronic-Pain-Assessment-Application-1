# Quick Reference Guide

## Import Patterns

### Data Imports
```typescript
// Import all data
import { CONDITIONS, SENSATIONS, TREATMENTS } from './data';

// Import specific utilities
import { getConditionById, isConditionTreatable } from './data/conditions';
import { getSensationsByIds } from './data/sensations';
import { getTreatmentsByCategory } from './data/treatments';
```

### Utils Imports
```typescript
// Import all utilities
import {
  validateEmail,
  getNextPage,
  generatePersonalizedResults,
  submitAssessment,
} from './utils';

// Import from specific modules
import { PAGES, ERROR_MESSAGES } from './utils/constants';
import { validateCurrentPage } from './utils/validation';
import { shouldDisqualify } from './utils/routing';
```

### Type Imports
```typescript
import type { AssessmentResponse, PageProps } from './types';
```

## Common Workflows

### 1. Validate User Input
```typescript
import { validateCurrentPage } from './utils/validation';

const result = validateCurrentPage({
  currentPage: '/page-1',
  conditions: ['fibromyalgia'],
});

if (!result.isValid) {
  // Show errors
  result.errors.forEach(error => console.log(error));
}
```

### 2. Navigate to Next Page
```typescript
import { getNextPage } from './utils/routing';

const responses = {
  conditions: ['fibromyalgia'],
  hasBudget: true,
};

const nextPage = getNextPage('/page-6', responses);
// Returns '/page-6b' if hasBudget is true
```

### 3. Generate Results
```typescript
import { generatePersonalizedResults } from './utils/personalization';

const results = generatePersonalizedResults({
  conditions: ['fibromyalgia', 'neuropathy'],
  sensations: ['burning', 'tingling'],
  previousTreatments: ['gabapentinoids'],
  duration: '2-to-5-years',
  intensity: 7,
});

console.log(results.summaryParagraph);
console.log(results.treatmentAnalysis);
```

### 4. Submit Assessment
```typescript
import { submitAssessment } from './utils/api';

const response = await submitAssessment({
  conditions: ['fibromyalgia'],
  sensations: ['burning'],
  name: 'John Doe',
  email: 'john@example.com',
  completedAt: new Date().toISOString(),
});

if (response.success && response.data) {
  const assessmentId = response.data.id;
}
```

## Key Data Structures

### Conditions
- 15 treatable conditions
- 10 non-treatable conditions
- Use `isConditionTreatable(id)` to check

### Sensations
- 9 pain sensation types
- Each with name and description
- Use `getSensationsByIds(ids)` for bulk lookup

### Treatments
- 25 treatments across 5 categories:
  - medications (7)
  - procedures (5)
  - devices (3)
  - therapies (5)
  - mindBody (5)
- Use `groupTreatmentsByCategory(ids)` for organized display

## Page Flow

```
Welcome → Page 1 → Check Disqualification
                ↓
         [If qualified]
                ↓
         Page 2 → Page 3 → Page 4 → Page 5
                ↓
         Page 6 → Budget Check
                ↓
         [If hasBudget: true] → Page 6B
         [If hasBudget: false] → Skip to Page 7
                ↓
         Page 7 → Page 8 → Page 9 → Page 10
                ↓
         Page 11 (Results) → Thank You

         [If disqualified] → Waiting List
```

## Validation Rules

- **Conditions:** Minimum 1 required
- **Sensations:** Minimum 1 required
- **Email:** Must match regex pattern
- **Phone:** Optional, min 10 digits if provided
- **Name:** 2-100 characters
- **Intensity:** Integer 1-10

## API Endpoints

```typescript
POST /api/v1/assessments              // Submit assessment
POST /api/v1/assessments/progress     // Save progress
POST /api/v1/assessments/email        // Email results
POST /api/v1/leads                    // Capture lead
GET  /api/v1/assessments/:id          // Get assessment
```

## Environment Variables

```bash
NEXT_PUBLIC_API_BASE_URL=https://api.primarycell.com
```

## Error Handling Pattern

```typescript
try {
  const result = await apiFunction();

  if (result.success) {
    // Handle success
    console.log(result.data);
  } else {
    // Handle API error
    console.error(result.error);
  }
} catch (error) {
  // Handle unexpected error
  console.error('Unexpected error:', error);
}
```

## TypeScript Tips

- All functions are fully typed
- Use `readonly` arrays for immutable data
- Import types with `import type { ... }`
- Interfaces are exported from each module
- Use type guards for runtime validation

## Performance Best Practices

1. Use `groupTreatmentsByCategory()` instead of multiple filters
2. Validate incrementally with `validateCurrentPage()` not `validateAssessment()`
3. Cache API responses when possible
4. Use `batchOperations()` for multiple API calls
5. Lazy load large data sets

## Common Gotchas

1. **Page 6B is conditional** - Only shown if `hasBudget: true`
2. **Disqualification happens after Page 1** - Check with `shouldDisqualify()`
3. **Phone is optional** - Don't require it in validation
4. **API timeout is 30 seconds** - Design for network delays
5. **Progress percentage excludes Welcome/Thank You** - Use `getProgressPercentage()`

## Testing Checklist

- [ ] Validate all 14 pages individually
- [ ] Test disqualification logic with non-treatable conditions
- [ ] Test budget routing (Page 6 → 6B vs 7)
- [ ] Test personalization with 0, 1, and many treatments
- [ ] Test API error handling (network, timeout, server errors)
- [ ] Test email validation edge cases
- [ ] Test phone validation with various formats
- [ ] Test progress calculation on all pages

## Debug Commands

```typescript
// Log validation errors
console.log('Validation:', validateCurrentPage(responses));

// Log routing decision
console.log('Next page:', getNextPage(currentPage, responses));

// Log disqualification check
console.log('Disqualified:', shouldDisqualify(responses));

// Log personalization result
console.log('Results:', generatePersonalizedResults(responses));
```

---

For complete documentation, see [BACKEND_DOCUMENTATION.md](./BACKEND_DOCUMENTATION.md)
