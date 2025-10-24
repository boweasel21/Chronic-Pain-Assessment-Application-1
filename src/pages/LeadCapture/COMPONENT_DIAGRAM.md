# LeadCapture Component Architecture

## Component Hierarchy

```
┌─────────────────────────────────────────────────────────────────┐
│                         LeadCapture                              │
│                      (Main Container)                            │
│                        376 lines                                 │
│                                                                   │
│  Responsibilities:                                               │
│  • State management (values, errors, touched, submission state) │
│  • Form validation logic                                         │
│  • API integration                                               │
│  • Input sanitization (via @utils/sanitizer)                    │
│  • Navigation on success                                         │
│                                                                   │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │            ContactFormInputs (193 lines)                  │  │
│  │                                                            │  │
│  │  Props:                                                    │  │
│  │  • values: FormValues                                     │  │
│  │  • errors: FormErrors                                     │  │
│  │  • touched: FormTouched                                   │  │
│  │  • disabled: boolean                                      │  │
│  │  • onChange: (field, value) => void                       │  │
│  │  • onBlur: (field) => void                                │  │
│  │                                                            │  │
│  │  Renders:                                                  │  │
│  │  ┌──────────────────────────────────────────────┐         │  │
│  │  │  Input: Name                                 │         │  │
│  │  │  • Label + Required indicator                │         │  │
│  │  │  • Text input with validation                │         │  │
│  │  │  • Animated error message (if invalid)       │         │  │
│  │  └──────────────────────────────────────────────┘         │  │
│  │  ┌──────────────────────────────────────────────┐         │  │
│  │  │  Input: Email                                │         │  │
│  │  │  • Label + Required indicator                │         │  │
│  │  │  • Email input with validation               │         │  │
│  │  │  • Animated error message (if invalid)       │         │  │
│  │  └──────────────────────────────────────────────┘         │  │
│  │  ┌──────────────────────────────────────────────┐         │  │
│  │  │  Input: Phone                                │         │  │
│  │  │  • Label + Required indicator                │         │  │
│  │  │  • Tel input with validation                 │         │  │
│  │  │  • Animated error message (if invalid)       │         │  │
│  │  └──────────────────────────────────────────────┘         │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                   │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │              PrivacyNotice (75 lines)                     │  │
│  │                                                            │  │
│  │  Props:                                                    │  │
│  │  • privacyUrl?: string (default: '/privacy')             │  │
│  │                                                            │  │
│  │  Renders:                                                  │  │
│  │  ┌──────────────────────────────────────────────┐         │  │
│  │  │  [🔒] We respect your privacy. Your          │         │  │
│  │  │      information is secure. Privacy Policy   │         │  │
│  │  └──────────────────────────────────────────────┘         │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                   │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │           SubmissionStatus (167 lines)                    │  │
│  │                                                            │  │
│  │  Props:                                                    │  │
│  │  • state: SubmissionState                                 │  │
│  │  • canSubmit: boolean                                     │  │
│  │  • onRetry: () => void                                    │  │
│  │  • onSuccessComplete: () => void                          │  │
│  │                                                            │  │
│  │  State Machine:                                            │  │
│  │                                                            │  │
│  │  state === 'idle':                                        │  │
│  │  ┌──────────────────────────────────────────────┐         │  │
│  │  │  [Schedule My Discovery Call]  (Button)     │         │  │
│  │  │  • Primary button                            │         │  │
│  │  │  • Disabled if !canSubmit                    │         │  │
│  │  └──────────────────────────────────────────────┘         │  │
│  │                                                            │  │
│  │  state === 'loading':                                     │  │
│  │  ┌──────────────────────────────────────────────┐         │  │
│  │  │     LoadingSpinner Component                 │         │  │
│  │  │     "Scheduling your call..."                │         │  │
│  │  └──────────────────────────────────────────────┘         │  │
│  │                                                            │  │
│  │  state === 'success':                                     │  │
│  │  ┌──────────────────────────────────────────────┐         │  │
│  │  │        SuccessAnimation (127 lines)          │         │  │
│  │  │  ┌────────────────────────────────────┐      │         │  │
│  │  │  │    Animated Checkmark (SVG)        │      │         │  │
│  │  │  │    ✓ (drawing animation)           │      │         │  │
│  │  │  └────────────────────────────────────┘      │         │  │
│  │  │  "Success! Redirecting..."                   │         │  │
│  │  │  "Redirecting in 2..."                       │         │  │
│  │  └──────────────────────────────────────────────┘         │  │
│  │                                                            │  │
│  │  state === 'error':                                       │  │
│  │  ┌──────────────────────────────────────────────┐         │  │
│  │  │  [⚠️] Something went wrong.                  │         │  │
│  │  │       Please try again.                      │         │  │
│  │  │                                              │         │  │
│  │  │  [Try Again]  (Button)                       │         │  │
│  │  └──────────────────────────────────────────────┘         │  │
│  └────────────────────────────────────────────────────────────┘  │
└───────────────────────────────────────────────────────────────────┘
```

## Data Flow

```
┌─────────────┐
│    User     │
│   Inputs    │
└──────┬──────┘
       │
       ↓
┌──────────────────────────────┐
│   ContactFormInputs          │
│   • onChange(field, value)   │ ──┐
└──────────────────────────────┘   │
                                   │
                                   ↓
                        ┌──────────────────────────┐
                        │   LeadCapture            │
                        │   handleChange()         │
                        │   • Sanitize input       │
                        │   • Update state         │
                        │   • Validate if touched  │
                        └────────┬─────────────────┘
                                 │
       ┌─────────────────────────┼─────────────────────────┐
       │                         │                         │
       ↓                         ↓                         ↓
┌─────────────┐       ┌──────────────────┐       ┌─────────────┐
│  values     │       │    errors        │       │   touched   │
│  updated    │       │    updated       │       │   updated   │
└─────────────┘       └──────────────────┘       └─────────────┘
```

## State Management Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    LeadCapture State                        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  values: FormValues                                         │
│  ├── name: string                                           │
│  ├── email: string                                          │
│  └── phone: string                                          │
│                                                             │
│  errors: FormErrors                                         │
│  ├── name?: string                                          │
│  ├── email?: string                                         │
│  └── phone?: string                                         │
│                                                             │
│  touched: FormTouched                                       │
│  ├── name: boolean                                          │
│  ├── email: boolean                                         │
│  └── phone: boolean                                         │
│                                                             │
│  submissionState: SubmissionState                           │
│  └── 'idle' | 'loading' | 'success' | 'error'             │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## Validation Flow

```
User Types → onChange() → Sanitize → Update values state
                                            ↓
                          ┌─────────────────┴──────────────────┐
                          │                                    │
                   Is field touched?                           │
                          │                                    │
                    ┌─────┴─────┐                              │
                    ↓           ↓                              ↓
                  Yes          No                      Store in state
                    │           │
              Validate    Do nothing
                    │
                    ↓
            Update errors state
```

## Submission Flow

```
User Clicks Submit
       ↓
Mark all fields as touched
       ↓
Validate all fields
       ↓
┌──────┴──────┐
│             │
↓             ↓
Invalid      Valid
│             │
│             ↓
│       Set state: 'loading'
│             ↓
│       Build assessment data
│             ↓
│       Submit to API
│             ↓
│       ┌─────┴─────┐
│       │           │
│       ↓           ↓
│    Success      Error
│       │           │
│       │           ↓
│       │     Set state: 'error'
│       │           │
│       │           ↓
│       │     Show error + retry
│       │           │
│       ↓           ↓
│  Set state: 'success'
│       ↓
│  Show animation
│       ↓
│  Countdown (2s)
│       ↓
│  Navigate to /final-video
│
↓
Show inline errors
Announce to screen readers
```

## Component Communication

```
┌───────────────────────────────────────────────────────────┐
│                      LeadCapture                          │
│                      (Smart/Container)                    │
├───────────────────────────────────────────────────────────┤
│                                                           │
│  ┌─────────────────────────────────────────────────┐     │
│  │          Props Down (Data)                      │     │
│  │  • values, errors, touched → ContactFormInputs  │     │
│  │  • privacyUrl → PrivacyNotice                   │     │
│  │  • state, canSubmit → SubmissionStatus          │     │
│  └─────────────────────────────────────────────────┘     │
│                                                           │
│  ┌─────────────────────────────────────────────────┐     │
│  │          Callbacks Up (Events)                  │     │
│  │  • onChange ← ContactFormInputs                 │     │
│  │  • onBlur ← ContactFormInputs                   │     │
│  │  • onRetry ← SubmissionStatus                   │     │
│  │  • onSuccessComplete ← SuccessAnimation         │     │
│  └─────────────────────────────────────────────────┘     │
│                                                           │
└───────────────────────────────────────────────────────────┘
```

## Reusable Components

```
┌─────────────────────────────────────────────────────────────┐
│            Components Available for Reuse                   │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  SuccessAnimation                                           │
│  └─ Use in: Other forms, confirmation pages                │
│                                                             │
│  PrivacyNotice                                              │
│  └─ Use in: Any form requiring privacy assurance           │
│                                                             │
│  ErrorDisplay                                               │
│  └─ Use in: Form error summaries                           │
│                                                             │
│  SubmissionStatus                                           │
│  └─ Use in: Any form with async submission                 │
│                                                             │
│  ContactFormInputs                                          │
│  └─ Use as: Pattern for other input collections            │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## File Dependencies

```
LeadCapture.tsx
  ├─ imports → ContactFormInputs.tsx
  ├─ imports → PrivacyNotice.tsx
  ├─ imports → SubmissionStatus.tsx
  ├─ imports → types.ts
  ├─ imports → LeadCapture.module.css
  ├─ imports → @context/AssessmentContext
  ├─ imports → @utils/api
  └─ imports → @utils/sanitizer

SubmissionStatus.tsx
  ├─ imports → SuccessAnimation.tsx
  ├─ imports → types.ts
  ├─ imports → SubmissionStatus.module.css
  ├─ imports → @components/common/LoadingSpinner
  └─ imports → @components/common/Button

ContactFormInputs.tsx
  ├─ imports → types.ts
  └─ imports → ContactFormInputs.module.css

PrivacyNotice.tsx
  ├─ imports → types.ts
  └─ imports → PrivacyNotice.module.css

ErrorDisplay.tsx
  ├─ imports → types.ts
  └─ imports → ErrorDisplay.module.css

SuccessAnimation.tsx
  ├─ imports → types.ts
  └─ imports → SuccessAnimation.module.css

index.ts
  ├─ exports → LeadCapture
  ├─ exports → ContactFormInputs
  ├─ exports → PrivacyNotice
  ├─ exports → ErrorDisplay
  ├─ exports → SuccessAnimation
  ├─ exports → SubmissionStatus
  └─ exports → types
```

## Testing Strategy

```
┌────────────────────────────────────────────────────────────┐
│                    Testing Pyramid                         │
├────────────────────────────────────────────────────────────┤
│                                                            │
│                       ▲                                    │
│                      ╱ ╲                                   │
│                     ╱ E2E╲                                 │
│                    ╱───────╲                               │
│                   ╱Integration╲                            │
│                  ╱─────────────╲                           │
│                 ╱  Unit Tests   ╲                          │
│                ╱─────────────────╲                         │
│                                                            │
│  Unit Tests (Most):                                        │
│  • ContactFormInputs.test.tsx                              │
│  • PrivacyNotice.test.tsx                                  │
│  • ErrorDisplay.test.tsx                                   │
│  • SuccessAnimation.test.tsx                               │
│  • SubmissionStatus.test.tsx                               │
│  • LeadCapture.test.tsx (state/validation logic)           │
│                                                            │
│  Integration Tests (Some):                                 │
│  • Form submission flow                                    │
│  • Error handling and retry                                │
│  • Success animation and navigation                        │
│                                                            │
│  E2E Tests (Few):                                          │
│  • Complete user journey from landing to final video       │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

## Security Layers

```
┌────────────────────────────────────────────────────────────┐
│                  Security Architecture                      │
├────────────────────────────────────────────────────────────┤
│                                                            │
│  Layer 1: Input Sanitization                               │
│  └─ LeadCapture.handleChange()                             │
│     └─ @utils/sanitizer (DOMPurify)                        │
│        ├─ sanitizeName()                                   │
│        ├─ sanitizeEmail()                                  │
│        └─ sanitizePhone()                                  │
│                                                            │
│  Layer 2: Validation                                       │
│  └─ LeadCapture validation functions                       │
│     ├─ validateName() → Regex check                        │
│     ├─ validateEmail() → RFC 5322 regex                    │
│     └─ validatePhone() → Min 10 digits                     │
│                                                            │
│  Layer 3: Pre-Submission Sanitization                      │
│  └─ LeadCapture.buildAssessmentData()                      │
│     └─ Final sanitization pass before API                  │
│                                                            │
│  Layer 4: API Layer                                        │
│  └─ submitAssessment() with CSRF protection                │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

---

## Component Size Comparison

| Component | Lines | Complexity | Testability |
|-----------|-------|------------|-------------|
| LeadCapture (main) | 376 | Medium | High |
| ContactFormInputs | 193 | Low | High |
| SubmissionStatus | 167 | Medium | High |
| SuccessAnimation | 127 | Low | High |
| ErrorDisplay | 106 | Low | High |
| PrivacyNotice | 75 | Low | High |
| types.ts | 70 | N/A | N/A |
| index.ts | 31 | N/A | N/A |

**Total**: 1,145 lines (vs original 657 lines)

**Benefit**: +488 lines (+74%) for:
- 5 reusable components
- Full type safety
- Comprehensive documentation
- Testable architecture
