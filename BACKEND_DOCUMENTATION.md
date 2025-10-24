# Primary Cell Assessment - Backend Documentation

## Overview

This document provides comprehensive documentation for all data definitions and utility functions in the Primary Cell Assessment application.

## Directory Structure

```
/data
  - conditions.ts       # 25 medical conditions (15 treatable, 10 non-treatable)
  - sensations.ts       # 9 pain sensation types
  - treatments.ts       # 25 treatment options across 5 categories
  - index.ts           # Centralized exports

/utils
  - constants.ts        # Application constants and configuration
  - validation.ts       # Form validation utilities
  - routing.ts         # Page navigation logic
  - personalization.ts # Results generation engine
  - api.ts             # API service layer
  - index.ts           # Centralized exports
```

## Data Definitions

### Conditions (`data/conditions.ts`)

Defines 25 medical conditions categorized as treatable or non-treatable.

**Interface:**
```typescript
interface Condition {
  id: string;
  name: string;
  category: 'treatable' | 'non-treatable';
}
```

**Treatable Conditions (15):**
- Fibromyalgia
- Chronic Fatigue Syndrome (ME/CFS)
- Peripheral Neuropathy
- Complex Regional Pain Syndrome (CRPS)
- Chronic Migraines
- Chronic Back Pain
- Rheumatoid Arthritis
- Lupus
- Chronic Lyme Disease
- Chronic Neck Pain
- Chronic Joint Pain
- Chronic Muscle Pain (Myalgia)
- Chronic Tension Headaches
- Autoimmune-Related Pain
- Ehlers-Danlos Syndrome (EDS)

**Non-Treatable Conditions (10):**
- Cancer-Related Pain
- Post-Surgical Pain (Acute)
- Active Injury or Trauma
- Severe Psychiatric Disorder
- Advanced Kidney Disease
- Advanced Liver Disease
- Congestive Heart Failure
- Unstable Cardiac Condition
- Severe COPD
- Dementia or Severe Cognitive Impairment

**Utility Functions:**
- `getConditionById(id: string)` - Retrieve condition by ID
- `getTreatableConditions()` - Get all treatable conditions
- `getNonTreatableConditions()` - Get all non-treatable conditions
- `isConditionTreatable(id: string)` - Check if condition is treatable

### Sensations (`data/sensations.ts`)

Defines 9 pain sensation types with descriptions.

**Interface:**
```typescript
interface Sensation {
  id: string;
  name: string;
  description: string;
}
```

**Pain Sensations:**
1. Burning
2. Tingling or Numbness
3. Sharp or Stabbing
4. Deep Aching
5. Throbbing or Pulsing
6. Shooting or Radiating
7. Cramping or Spasms
8. Electric Shock-like
9. Pressure or Squeezing

**Utility Functions:**
- `getSensationById(id: string)` - Retrieve sensation by ID
- `getSensationsByIds(ids: string[])` - Get multiple sensations
- `isValidSensationId(id: string)` - Validate sensation ID

### Treatments (`data/treatments.ts`)

Defines 25 treatment options organized by category.

**Interface:**
```typescript
interface Treatment {
  id: string;
  name: string;
  category: 'medications' | 'procedures' | 'devices' | 'therapies' | 'mindBody';
  whatItFixed: string; // What this treatment addresses
}
```

**Categories:**
- **Medications (7):** Opioids, NSAIDs, Muscle Relaxants, Gabapentinoids, Antidepressants, Steroids, Topical Creams
- **Procedures (5):** Injections, Nerve Blocks, Epidural, Radiofrequency Ablation, Surgery
- **Devices (3):** TENS Unit, Spinal Cord Stimulator, PEMF Therapy
- **Therapies (5):** Physical Therapy, Chiropractic, Acupuncture, Massage, Occupational Therapy
- **Mind-Body (5):** CBT, Meditation, Yoga, Biofeedback

**Utility Functions:**
- `getTreatmentById(id: string)` - Retrieve treatment by ID
- `getTreatmentsByCategory(category)` - Get treatments in category
- `getTreatmentsByIds(ids: string[])` - Get multiple treatments
- `groupTreatmentsByCategory(treatmentIds)` - Group treatments by category
- `isValidTreatmentId(id: string)` - Validate treatment ID

## Utilities

### Constants (`utils/constants.ts`)

Central location for all application constants.

**Key Constants:**
- `API_CONFIG` - API base URL and timeout settings
- `API_ENDPOINTS` - All API endpoint paths
- `PAGES` - Page routes and total count (14 pages)
- `BUDGET_RANGES` - Budget range options and labels
- `URGENCY_LEVELS` - Urgency level options and labels
- `PAIN_DURATION` - Pain duration options
- `PAIN_INTENSITY` - Pain intensity scale (1-10)
- `ACTIVITY_IMPACT` - Activity impact levels and labels
- `VALIDATION_RULES` - Form validation rules
- `STORAGE_KEYS` - Local/session storage keys
- `ERROR_MESSAGES` - Standardized error messages
- `SUCCESS_MESSAGES` - Standardized success messages
- `PRIMARY_CELL_MESSAGING` - Brand messaging

### Validation (`utils/validation.ts`)

Comprehensive form validation with error handling.

**Core Validation Functions:**
- `validateEmail(email: string): boolean` - Email format validation
- `validatePhone(phone: string): boolean` - Phone number validation
- `validateName(name: string): boolean` - Name length validation (2-100 chars)

**Field-Specific Validation:**
- `validateConditions(conditions?: string[]): ValidationResult`
- `validateSensations(sensations?: string[]): ValidationResult`
- `validateDuration(duration?: string): ValidationResult`
- `validateIntensity(intensity?: number): ValidationResult`
- `validateBudgetQuestion(hasBudget?: boolean): ValidationResult`
- `validateBudgetRange(budgetRange?: string): ValidationResult`
- `validateUrgency(urgency?: string): ValidationResult`
- `validateActivityImpact(activityImpact?: string): ValidationResult`
- `validateContactInfo(name, email, phone): ValidationResult`

**Page Validation:**
- `validateCurrentPage(responses): ValidationResult` - Validates current page based on responses
- `validateAssessment(responses): ValidationResult` - Validates entire assessment

**ValidationResult Interface:**
```typescript
interface ValidationResult {
  isValid: boolean;
  errors: string[];
}
```

### Routing (`utils/routing.ts`)

Page navigation logic with conditional routing.

**Core Routing Functions:**
- `getNextPage(currentPage, responses): string` - Determines next page with conditional logic
- `getPreviousPage(currentPage): string` - Determines previous page
- `shouldDisqualify(responses): boolean` - Checks if user should be sent to waiting list
- `isPageAccessible(targetPage, completedPages): boolean` - Validates page access

**Progress Tracking:**
- `getPageNumber(currentPage): number | null` - Gets page number for display
- `getTotalPages(responses): number` - Returns total page count (14)
- `getProgressPercentage(currentPage, responses): number` - Calculates progress (0-100)

**Page State Checks:**
- `isFirstPage(currentPage): boolean`
- `isLastPage(currentPage): boolean`
- `getAllPages(): string[]`

**Routing Logic:**
- Page 1 → Disqualification check (only non-treatable conditions → waiting list)
- Page 6 → Conditional routing:
  - `hasBudget: true` → Page 6B (budget range)
  - `hasBudget: false` → Page 7 (skip budget range)
- Page 6B → Always Page 7

### Personalization (`utils/personalization.ts`)

Generates personalized results based on assessment responses.

**Main Function:**
```typescript
generatePersonalizedResults(responses: PersonalizationResponses): PersonalizationResult
```

**PersonalizationResult Interface:**
```typescript
interface PersonalizationResult {
  conditions: Array<{id: string, name: string, category: string}>;
  sensations: Sensation[];
  treatmentBreakdown: TreatmentBreakdown;
  treatmentAnalysis: TreatmentAnalysis;
  summaryParagraph: string;
  primaryCellMessage: string;
  isQualified: boolean;
}
```

**TreatmentAnalysis Interface:**
```typescript
interface TreatmentAnalysis {
  whatWasFixed: string[];        // What treatments addressed
  whatWasMissed: string[];       // What remains untreated (Primary Cell damage)
  totalTreatmentsTried: number;
  hasTriedTreatments: boolean;
}
```

**Supporting Functions:**
- `generateTreatmentGapSummary(analysis): string` - Creates gap summary
- `getRecommendedNextSteps(result): string[]` - Generates next step recommendations

**Edge Cases Handled:**
- No treatments tried → Everything is untreated
- Mixed treatable/non-treatable conditions → Qualified if any treatable
- Missing data → Graceful error handling with default values

### API Service (`utils/api.ts`)

Type-safe API communication layer with comprehensive error handling.

**Core API Functions:**
```typescript
submitAssessment(responses: AssessmentData): Promise<ApiResponse<SubmitAssessmentResponse>>
saveProgress(responses: Partial<AssessmentData>): Promise<ApiResponse<void>>
sendEmailResults(email: string, assessmentId: string): Promise<ApiResponse<EmailResultsResponse>>
captureLeadInfo(contactInfo: ContactInfo): Promise<ApiResponse<LeadCaptureResponse>>
getAssessment(assessmentId: string): Promise<ApiResponse<AssessmentData>>
```

**Utility Functions:**
- `checkApiHealth(): Promise<ApiResponse<{status: string}>>` - Health check
- `batchOperations<T>(operations): Promise<ApiResponse<T>[]>` - Batch API calls

**Error Handling:**
- Custom `ApiError` class with status codes and details
- 30-second timeout with abort controller
- Network error detection
- Type-safe error responses
- Comprehensive logging

**ApiResponse Interface:**
```typescript
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
```

**Environment Variables:**
- `NEXT_PUBLIC_API_BASE_URL` - API base URL (defaults to 'https://api.primarycell.com')

## Usage Examples

### Example 1: Validating Page Responses

```typescript
import { validateCurrentPage } from './utils/validation';

const responses = {
  currentPage: '/page-1',
  conditions: ['fibromyalgia', 'chronic-fatigue'],
};

const result = validateCurrentPage(responses);

if (!result.isValid) {
  console.log('Validation errors:', result.errors);
}
```

### Example 2: Routing Logic

```typescript
import { getNextPage, shouldDisqualify } from './utils/routing';

const responses = {
  conditions: ['cancer-pain'], // Non-treatable only
};

if (shouldDisqualify(responses)) {
  // User will be sent to waiting list
  const nextPage = getNextPage('/page-1', responses);
  console.log(nextPage); // '/waiting-list'
}
```

### Example 3: Generating Personalized Results

```typescript
import { generatePersonalizedResults } from './utils/personalization';

const responses = {
  conditions: ['fibromyalgia', 'neuropathy'],
  sensations: ['burning', 'tingling'],
  previousTreatments: ['gabapentinoids', 'physical-therapy'],
  duration: '2-to-5-years',
  intensity: 7,
};

const results = generatePersonalizedResults(responses);

console.log(results.summaryParagraph);
console.log('What was fixed:', results.treatmentAnalysis.whatWasFixed);
console.log('What was missed:', results.treatmentAnalysis.whatWasMissed);
```

### Example 4: API Submission

```typescript
import { submitAssessment } from './utils/api';

const assessmentData = {
  conditions: ['fibromyalgia'],
  sensations: ['burning'],
  duration: '2-to-5-years',
  intensity: 7,
  name: 'John Doe',
  email: 'john@example.com',
  completedAt: new Date().toISOString(),
};

const response = await submitAssessment(assessmentData);

if (response.success && response.data) {
  console.log('Assessment ID:', response.data.id);
} else {
  console.error('Error:', response.error);
}
```

## Type Safety

All utilities are fully TypeScript typed with:
- Exported interfaces for all data structures
- Type guards for runtime validation
- Discriminated unions for result types
- Readonly arrays for immutable data
- Strict null checks

## Error Handling

Every utility function includes:
- Try-catch blocks for error containment
- Specific error messages for debugging
- Graceful degradation for non-critical failures
- Console logging for error tracking
- Type-safe error returns

## Testing Considerations

When testing these utilities:
1. Test all validation rules with edge cases
2. Test routing logic with all page combinations
3. Test personalization with various response combinations
4. Mock API calls for reliable tests
5. Test error handling paths
6. Verify TypeScript types compile correctly

## Performance

- Pure functions wherever possible (no side effects)
- Immutable data structures
- Efficient array operations
- Memoization opportunities for repeated calculations
- Lazy loading for large data sets

## Future Enhancements

Potential improvements:
1. Add caching layer for API responses
2. Implement retry logic for failed API calls
3. Add more granular validation rules
4. Expand personalization algorithms
5. Add analytics tracking
6. Implement A/B testing support

---

**Version:** 1.0.0
**Last Updated:** 2025-10-24
**Maintained By:** Primary Cell Assessment Team
