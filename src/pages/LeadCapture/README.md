# LeadCapture Module

Refactored lead capture form with modular, testable components.

## Architecture Overview

The LeadCapture module has been refactored from a single 657-line component into 6 focused, reusable sub-components following the Single Responsibility Principle.

## Component Structure

```
src/pages/LeadCapture/
├── index.ts                        # Module exports
├── types.ts                        # Shared TypeScript types
├── LeadCapture.tsx                 # Main page component (390 lines)
├── LeadCapture.module.css          # Main styles
├── ContactFormInputs.tsx           # Form inputs (207 lines)
├── ContactFormInputs.module.css    # Input styles
├── PrivacyNotice.tsx              # Privacy message (75 lines)
├── PrivacyNotice.module.css       # Privacy styles
├── ErrorDisplay.tsx               # Error summary (106 lines)
├── ErrorDisplay.module.css        # Error styles
├── SuccessAnimation.tsx           # Success checkmark (127 lines)
├── SuccessAnimation.module.css    # Success styles
├── SubmissionStatus.tsx           # Submission states (167 lines)
└── SubmissionStatus.module.css    # Status styles
```

## Component Details

### 1. LeadCapture (Main Component)

**File**: `LeadCapture.tsx` (390 lines)

**Responsibilities**:
- State management (form values, errors, touched, submission state)
- Form validation logic
- API submission handling
- LocalStorage auto-save
- Coordinates sub-components

**Props**: None (page-level component)

**Key Features**:
- Real-time validation with debouncing
- Auto-save to localStorage every 500ms
- Accessibility announcements for screen readers
- Success/error state management
- Navigation on successful submission

---

### 2. ContactFormInputs

**File**: `ContactFormInputs.tsx` (207 lines)

**Responsibilities**:
- Renders name, email, and phone input fields
- Displays field-specific validation errors
- Handles input sanitization (XSS prevention)
- Manages blur/change events

**Props**:
```typescript
interface ContactFormInputsProps {
  values: FormValues;              // Current field values
  errors: FormErrors;              // Validation errors
  touched: FormTouched;            // Touched state per field
  disabled?: boolean;              // Disable during submission
  onChange: (field, value) => void; // Change handler
  onBlur: (field) => void;         // Blur handler
}
```

**Key Features**:
- Input sanitization (removes HTML tags, JS injection attempts)
- Animated error messages with Framer Motion
- Full ARIA accessibility attributes
- Auto-complete attributes for browser autofill
- Max length validation (100 chars for name)

---

### 3. PrivacyNotice

**File**: `PrivacyNotice.tsx` (75 lines)

**Responsibilities**:
- Displays privacy assurance message
- Shows lock icon for trust
- Links to privacy policy

**Props**:
```typescript
interface PrivacyNoticeProps {
  privacyUrl?: string;  // URL to privacy policy (default: '/privacy')
}
```

**Key Features**:
- Animated entrance with Framer Motion
- Lock icon for visual trust indicator
- Accessible link with proper ARIA labels
- Opens privacy policy in new tab

---

### 4. ErrorDisplay

**File**: `ErrorDisplay.tsx` (106 lines)

**Responsibilities**:
- Displays summary of all validation errors
- Only shows errors for touched fields
- Provides accessible error announcements

**Props**:
```typescript
interface ErrorDisplayProps {
  errors: FormErrors;    // Validation errors
  touched: FormTouched;  // Touched state per field
}
```

**Key Features**:
- Only renders when errors exist
- Animated entrance/exit
- Proper ARIA live regions for screen readers
- Error icon with count
- Staggered animation for multiple errors

---

### 5. SuccessAnimation

**File**: `SuccessAnimation.tsx` (127 lines)

**Responsibilities**:
- Animated checkmark icon
- Success message display
- Countdown timer before redirect
- Triggers callback on completion

**Props**:
```typescript
interface SuccessAnimationProps {
  message?: string;           // Success message
  redirectTime?: number;      // Countdown time (seconds)
  onComplete?: () => void;    // Completion callback
}
```

**Key Features**:
- SVG path animation (drawing effect)
- Countdown timer with automatic decrement
- Accessible status announcements
- Calls `onComplete` when countdown finishes

---

### 6. SubmissionStatus

**File**: `SubmissionStatus.tsx` (167 lines)

**Responsibilities**:
- Manages all submission states (idle, loading, success, error)
- Renders appropriate UI for each state
- Handles retry logic on error

**Props**:
```typescript
interface SubmissionStatusProps {
  state: SubmissionState;         // Current state
  loadingMessage?: string;        // Loading text
  successMessage?: string;        // Success text
  errorMessage?: string;          // Error text
  onRetry?: () => void;           // Retry handler
  canSubmit?: boolean;            // Enable submit button
  submitLabel?: string;           // Submit button text
  redirectTime?: number;          // Success redirect time
  onSuccessComplete?: () => void; // Success callback
}
```

**Key Features**:
- State machine for submission flow
- AnimatePresence for smooth transitions
- Loading spinner integration
- Error state with retry button
- Success animation with redirect
- Idle state with submit button

---

## Shared Types

**File**: `types.ts`

```typescript
// Form field values
interface FormValues {
  name: string;
  email: string;
  phone: string;
}

// Validation errors
interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
}

// Touched state
interface FormTouched {
  name: boolean;
  email: boolean;
  phone: boolean;
}

// Submission states
type SubmissionState = 'idle' | 'loading' | 'success' | 'error';

// Field names
type FormFieldName = 'name' | 'email' | 'phone';

// Validation regex
const RFC5322_EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
const PHONE_REGEX = /^\d{10,}$/;
const NAME_REGEX = /^[a-zA-Z\s-']+$/;
```

---

## Validation Rules

### Name Field
- **Required**: Must not be empty
- **Max Length**: 100 characters
- **Allowed Characters**: Letters, spaces, hyphens, apostrophes
- **Regex**: `/^[a-zA-Z\s-']+$/`

### Email Field
- **Required**: Must not be empty
- **Format**: RFC 5322 compliant
- **Regex**: RFC5322_EMAIL_REGEX

### Phone Field
- **Required**: Must not be empty
- **Min Digits**: 10 digits (after removing non-numeric chars)
- **Regex**: `/^\d{10,}$/`

---

## State Management

### Form State
```typescript
const [values, setValues] = useState<FormValues>({
  name: '',
  email: '',
  phone: '',
});
const [errors, setErrors] = useState<FormErrors>({});
const [touched, setTouched] = useState<FormTouched>({
  name: false,
  email: false,
  phone: false,
});
const [submissionState, setSubmissionState] = useState<SubmissionState>('idle');
```

### LocalStorage Keys
- `assessment_contact_info`: Form values auto-save
- `selected_conditions`: Conditions from previous pages
- `selected_sensations`: Sensations from previous pages
- `assessment_treatment_history`: Treatment history data

---

## API Integration

### Submission Flow
1. User submits form
2. Validate all fields
3. Mark all fields as touched
4. If invalid: Show errors, announce to screen readers
5. If valid:
   - Set submission state to 'loading'
   - Build assessment data from localStorage + form
   - Call `submitAssessment(assessmentData)`
   - On success: Show success animation, redirect after 2s
   - On error: Show error message, allow retry

### Assessment Data Structure
```typescript
interface AssessmentData {
  conditions: string[];
  sensations: string[];
  duration?: string;
  intensity?: number;
  previousTreatments: string[];
  hasBudget?: boolean;
  budgetRange?: string;
  urgency?: string;
  activityImpact?: string;
  goals?: string;
  name: string;
  email: string;
  phone: string;
  completedAt: string;
}
```

---

## Security Features

### Input Sanitization
All user inputs are sanitized in `ContactFormInputs.tsx`:
```typescript
const sanitizeInput = (value: string): string => {
  return value
    .replace(/[<>]/g, '')           // Remove HTML tags
    .replace(/javascript:/gi, '')   // Remove JS protocol
    .replace(/on\w+=/gi, '');       // Remove event handlers
};
```

### XSS Prevention
- HTML tags stripped from all inputs
- JavaScript injection attempts removed
- Event handler attributes blocked

---

## Accessibility

### ARIA Attributes
- `aria-required="true"` on all required fields
- `aria-invalid` states on error
- `aria-describedby` linking errors to inputs
- `aria-label` on submit button
- `aria-live="assertive"` for error announcements
- `aria-live="polite"` for success messages

### Keyboard Navigation
- Tab order follows logical flow
- Focus visible indicators
- Enter key submits form
- Escape key (if implemented) would clear errors

### Screen Reader Support
- Error messages announced on submit
- Success/error states announced
- Loading states announced
- Countdown announced

---

## Performance Optimizations

### Debouncing
- LocalStorage auto-save debounced to 500ms
- Prevents excessive writes on every keystroke

### Memoization
- All validation functions wrapped in `useCallback`
- Event handlers memoized to prevent re-renders
- Prevents unnecessary component re-renders

### Code Splitting
- Main page lazy-loaded in App.tsx
- Sub-components loaded together (small enough)

---

## Testing Strategy

### Unit Tests
Each component should have unit tests covering:

**ContactFormInputs**:
- Renders all three input fields
- Calls onChange with sanitized values
- Calls onBlur when fields lose focus
- Shows error messages when touched and invalid
- Sanitizes malicious input (XSS attempts)

**PrivacyNotice**:
- Renders lock icon
- Renders privacy message
- Links to correct privacy URL
- Opens link in new tab

**ErrorDisplay**:
- Renders only when errors exist
- Shows correct error count
- Lists all active errors
- Doesn't render for untouched fields

**SuccessAnimation**:
- Animates checkmark drawing
- Shows countdown
- Calls onComplete after countdown
- Decrements countdown every second

**SubmissionStatus**:
- Renders submit button in idle state
- Shows spinner in loading state
- Shows success animation in success state
- Shows error message in error state
- Retry button calls onRetry
- Submit button disabled when canSubmit=false

**LeadCapture**:
- Loads saved data from localStorage
- Validates fields on blur
- Saves to localStorage on change
- Submits to API on form submit
- Navigates on success
- Shows errors on validation failure

### Integration Tests
- Full form submission flow
- Error handling and retry
- Success animation and redirect
- LocalStorage persistence

---

## Usage Example

```typescript
import { LeadCapture } from '@pages/LeadCapture';

// In your routes
<Route path="/lead-capture" element={<LeadCapture />} />
```

**Importing Sub-components** (for testing or reuse):
```typescript
import {
  ContactFormInputs,
  PrivacyNotice,
  ErrorDisplay,
  SuccessAnimation,
  SubmissionStatus,
  type FormValues,
  type FormErrors,
} from '@pages/LeadCapture';
```

---

## CSS Modules

Each component has its own CSS module for encapsulated styling:

- **Responsive**: Mobile-first, tablet, desktop breakpoints
- **Accessible**: High contrast mode support
- **Motion**: Reduced motion preferences respected
- **Print**: Print-friendly styles
- **Touch**: Touch target sizes (min 48px on mobile)

---

## Migration Notes

### Breaking Changes
- Old import: `import LeadCapture from './pages/LeadCapture'`
- New import: `import { LeadCapture } from '@pages/LeadCapture'`
- Both default and named exports supported for backward compatibility

### Backward Compatibility
The refactored module maintains 100% API compatibility:
- Same props interface (none - page component)
- Same routes work without changes
- Same localStorage keys
- Same API submission format

### Files Backed Up
- `src/pages/LeadCapture.tsx.backup` (original 657-line file)
- `src/pages/LeadCapture.module.css.backup` (original styles)

---

## Component Metrics

| Component | Lines | Responsibility | Complexity |
|-----------|-------|----------------|------------|
| LeadCapture | 390 | Orchestration | Medium |
| ContactFormInputs | 207 | Form inputs | Low |
| SubmissionStatus | 167 | State display | Medium |
| SuccessAnimation | 127 | Animation | Low |
| ErrorDisplay | 106 | Error display | Low |
| PrivacyNotice | 75 | Static content | Low |

**Total Lines**: ~1,072 (including CSS modules and types)
**Original Lines**: 657 (single file)
**Increase**: +415 lines (+63%) for improved maintainability

---

## Benefits of Refactoring

1. **Testability**: Each component can be tested in isolation
2. **Reusability**: Components like SuccessAnimation can be used elsewhere
3. **Maintainability**: Smaller files are easier to understand and modify
4. **Separation of Concerns**: Each component has a single responsibility
5. **Type Safety**: Shared types ensure consistency
6. **Code Organization**: Clear structure with dedicated files
7. **Developer Experience**: Easier to locate and fix bugs

---

## Future Improvements

1. **Form Library**: Consider integrating Formik or React Hook Form
2. **Validation Library**: Use Yup or Zod for schema validation
3. **Error Boundary**: Add error boundary component
4. **Loading States**: More granular loading indicators
5. **Analytics**: Track form interactions and errors
6. **A/B Testing**: Support for variant testing
7. **Field Masks**: Add input masking for phone numbers

---

## Contributing

When modifying components:
1. Keep components under 200 lines
2. Add JSDoc comments for all functions
3. Include TypeScript types for all props
4. Update this README with changes
5. Add unit tests for new features
6. Ensure accessibility compliance
7. Test responsive behavior

---

## License

Part of Chronic Pain Assessment Application.
See main project LICENSE file.
