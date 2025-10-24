# Primary Cell Repair Method - Interactive Assessment Tool

## 🔴 CRITICAL RULES (Never Violate)

**THIS IS NOT A PROTOTYPE. BUILD FOR 10,000 USERS.**

### Must Always Do
- Every page 100% functional with error handling
- WCAG 2.1 AA compliance on every component (min 44x44px targets, 4.5:1 contrast, keyboard nav)
- Framer Motion transitions on all pages: fade + 20px slide, 300ms
- Validate all form inputs before navigation

### Never Do
- ❌ Inline styles or hardcoded colors/spacing (use theme.js)
- ❌ TODO comments, placeholder functions, or `console.log` in production
- ❌ Skip error handling, accessibility, or form validation
- ❌ Default exports (only named: `export const Component`)
- ❌ Prop drilling beyond 2 levels (use Context instead)

---

## Tech Stack

- React 18+ (functional components with hooks only)
- React Router v6 (routing)
- Context API + useReducer (state)
- Framer Motion (animations)
- React Hook Form (forms)
- CSS Modules (styling - NO external UI libraries)

## Commands

- `npm run dev` - Start dev server
- `npm run build` - Production build (zero errors tolerated)
- `npm run test` - Run tests (must pass)
- `npm run lint` - ESLint check (zero warnings)

---

## Project Structure

```
src/
├── components/
│   ├── common/      # Button, ProgressBar, Checkbox, FormField, PageTransition
│   ├── pages/       # 17 page components (LandingPage, CellularSciencePage, etc.)
│   └── layout/      # AssessmentLayout, Navigation
├── context/         # AssessmentContext.jsx, AssessmentReducer.js
├── hooks/           # useAssessmentData, usePageValidation
├── utils/           # personalization.js, validation.js, routing.js
├── data/            # conditions.js, treatments.js, sensations.js
└── styles/          # theme.js, global.css
```

---

## 🟠 State Management Structure

### Required State Shape
```javascript
{
  currentPage: 1,
  totalPages: 14,
  responses: {
    hasChronicPain6Months: null,              // boolean
    selectedConditions: {
      canHelp: [],                            // array of condition IDs
      cannotHelp: [],                         // array of condition IDs
      other: ''                               // string
    },
    sensations: [],                           // array of sensation IDs
    treatmentHistory: {
      medications: [],                        // arrays of treatment names
      procedures: [],
      devices: [],
      therapies: [],
      mindBody: [],
      other: ''
    },
    urgencyLevel: null,                       // string: "urgent" | "soon" | "exploring"
    budgetRange: null,                        // string: "$0-$3,000" | "$3,000-$5,000" | etc.
    isAffordable: null,                       // boolean (only if budgetRange === "$0-$3,000")
    additionalInfo: '',
    wantsHighlightsVideo: null,               // boolean
    wantsDemoVideo: null,                     // boolean
    contactInfo: { name: '', email: '', phone: '' }
  },
  qualified: true,                            // boolean
  disqualificationReason: null                // string | null
}
```

### Context Actions
- `UPDATE_RESPONSE` - Update any response field
- `NEXT_PAGE` - Increment currentPage
- `PREV_PAGE` - Decrement currentPage
- `DISQUALIFY` - Set qualified: false and reason
- `GENERATE_RESULTS` - Trigger personalization

---

## 🔴 Routing Table

| Page | Path | Next Route Logic |
|------|------|------------------|
| 1 | `/` | No → `/waiting-list` (END), Yes → `/cellular-science` |
| 2 | `/cellular-science` | Only "cannot help" → `/disqualified` (END), else → `/condition-confirmation` |
| 3 | `/condition-confirmation` | Linear → `/treatment-history` |
| 4 | `/treatment-history` | Linear → `/urgency` |
| 5 | `/urgency` | Linear → `/budget` |
| 6 | `/budget` | "$0-$3,000" → `/affordability`, else → `/additional-info` |
| 6B | `/affordability` | Linear → `/additional-info` |
| 7 | `/additional-info` | Linear → `/results` |
| 8 | `/results` | Linear → `/process-explanation` |
| 9-14 | Educational flow | Linear progression → `/final-video` |

### Disqualification Routes (END)
- `/waiting-list` - No to 6-month pain question
- `/disqualified` - Only selected "cannot help" conditions

---

## Code Patterns

### Component Structure (Always Follow)
```javascript
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAssessmentData } from '../../hooks/useAssessmentData';
import { Button } from '../common/Button';
import styles from './PageName.module.css';

export const PageName = () => {
  const { responses, updateResponse, nextPage } = useAssessmentData();
  const [localState, setLocalState] = useState(initial);

  const handleNext = () => {
    updateResponse('fieldName', localState);
    nextPage();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* content */}
    </motion.div>
  );
};
```

### Validation Pattern (Use This)
```javascript
// In component
const errors = validateCurrentPage(state);
if (!errors.isValid) {
  setErrors(errors.messages);
  return; // Block navigation
}
```

### File Naming Rules
- Components: PascalCase - `Button.jsx`, `LandingPage.jsx`
- Utilities: camelCase - `personalization.js`, `validation.js`
- CSS Modules: `ComponentName.module.css`
- Use named exports only: `export const Button` (never `export default`)

---

## Design System (Use theme.js)

### Colors (Never Hardcode)
- Primary Navy: `rgba(29, 44, 73, 1)` - Headers, CTAs
- Secondary Cream: `rgba(226, 211, 163, 1)` - Accents, highlights
- Always reference from theme.js: `theme.colors.primary`

### Typography Scale (Responsive with clamp)
- H1: `clamp(2rem, 5vw, 3.052rem)` - Hero headlines only
- H2: `clamp(1.5rem, 4vw, 2.441rem)` - Major sections
- H3: `clamp(1.25rem, 3vw, 1.953rem)` - Questions
- Body: `clamp(1rem, 2vw, 1.125rem)` - Standard text

### Spacing (8px Grid - Enforce Strictly)
- Component padding: 8px, 16px, 24px (tight, comfortable, generous)
- Section spacing: 48px, 64px (vertical)
- Max content width: 1200px
- All margins/padding must be multiples of 8px

### Animations (Consistent Everywhere)
- Page transitions: fade + 20px slide, 300ms ease
- Button hover: `scale(1.02)`, shadow, 150ms
- Button active: `scale(0.98)`
- Checkbox: Spring animation `{ stiffness: 300, damping: 20 }`
- Respect prefers-reduced-motion

---

## 🟠 Accessibility (WCAG 2.1 AA - Mandatory)

### Must Implement on Every Component
- Touch targets: 44x44px minimum (mobile: 48x48px)
- Focus indicators: 3px cream outline, 2px offset on all interactive elements
- Semantic HTML: `<header>`, `<main>`, `<section>`, `<nav>`
- ARIA labels: All form inputs need `aria-label="descriptive text"`
- Keyboard nav: Tab order top→bottom, left→right, skip links on pages
- Color contrast: Text on navy ≥4.5:1, large text ≥3:1
- Alt text: Descriptive on all images
- Motion: Respect `prefers-reduced-motion`

### Validation Pattern
```javascript
<Button
  onClick={handleNext}
  disabled={!isValid}
  aria-label="Continue to next step"
>
  Next
</Button>
```

---

## Validation Rules (Enforce Before Navigation)

### Required Validation by Page
```javascript
// Page 1: Radio button required
hasChronicPain6Months !== null

// Page 2: At least one condition OR text
canHelp.length > 0 || cannotHelp.length > 0 || other.trim().length > 0

// Page 3: At least one sensation
sensations.length > 0

// Page 5: Urgency selection
urgencyLevel !== null

// Page 6: Budget range
budgetRange !== null

// Page 13: Contact info (all required)
name.trim() && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && phone.trim()
```

### Error Display Pattern
```javascript
{errors.length > 0 && (
  <div className={styles.errorContainer} role="alert">
    {errors.map(error => (
      <p key={error} className={styles.error}>⚠️ {error}</p>
    ))}
  </div>
)}
```

---

## 🟠 Personalization Engine (Results Page)

### Must Generate Dynamically
1. **User's Conditions**: Display selected `canHelp` conditions by name
2. **User's Sensations**: Display selected sensations by name
3. **Treatment Breakdown**: For EACH checked treatment, show:

```javascript
{
  name: "Chiropractic care",
  whatItFixed: "Spinal alignment and joint mobility",
  whatItMissed: "Cellular damage in your Primary Cell",
  result: "Temporary relief then pain returned"
}
```

### Treatment Mapping (from data/treatments.js)
Map each treatment name to its `whatItFixed` value. Examples:
- "Chiropractic care" → "Spinal alignment and joint mobility"
- "Physical therapy" → "Muscle strength and range of motion"
- "Steroid shots" → "Local inflammation and swelling"
- "Surgery" → "Structural tissue and bone damage"

### Results Page Structure
```javascript
<h2>Your conditions: {canHelp.join(', ')}</h2>
<p>Symptoms: {sensations.join(', ')}</p>

{treatmentBreakdown.map(treatment => (
  <div>
    <h4>{treatment.name}:</h4>
    <p>✅ Fixed: {treatment.whatItFixed}</p>
    <p>❌ Missed: {treatment.whatItMissed}</p>
    <p>📊 Result: {treatment.result}</p>
  </div>
))}
```

---

## Error Handling Pattern

```javascript
try {
  await saveData(data);
} catch (error) {
  console.error('Save failed:', error);
  setError('Unable to save. Please try again.');
  // Show error UI with retry option
}
```

User-facing messages:
- Network: "Connection issue. Please try again."
- Validation: "Please [specific action]."
- Unknown: "Something went wrong. Please refresh."

---

## Pre-Commit Checklist

- [ ] All pages render without console errors
- [ ] All routing paths tested (including disqualification)
- [ ] Accessibility: axe DevTools shows zero violations
- [ ] Mobile tested: 375px, 768px, 1440px
- [ ] All forms validate correctly
- [ ] Personalization displays user data accurately
- [ ] Animations smooth at 60fps

---

## Performance Targets

- First Contentful Paint: < 1.5s
- Total bundle: < 200KB gzipped
- Use React.lazy() for route-based code splitting
- Use useMemo() for personalization calculations

---

## 🟡 Important Development Rules

- Use Context for responses/progress state (never prop drill beyond 2 levels)
- Use useState for local component state only (checkboxes, text fields)
- All pages must use PageTransition wrapper
- All buttons must have aria-label attributes
- All images must have descriptive alt text (not decorative)
- Always check validation before calling nextPage()

---

## Quick Reference

### Import Pattern
```javascript
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAssessmentData } from '../../hooks/useAssessmentData';
import { Button } from '../common/Button';
import styles from './Page.module.css';
```

### Common Transitions
```javascript
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.3 }}
/>
```

---

## Troubleshooting

**Routing not working?** Check state.qualified and disqualificationReason

**Validation blocking incorrectly?** Verify validation logic matches page number

**Personalization not showing data?** Check responses object structure matches state shape

**Animation stuttering?** Check for console errors, verify transition duration 300ms

---

See project specification document for complete page content, detailed examples, and full data structures.