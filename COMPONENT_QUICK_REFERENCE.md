# Component Quick Reference

## DetailedProcess Components

### Directory: `/src/pages/DetailedProcess/`

| File | Lines | Purpose | Key Props |
|------|-------|---------|-----------|
| **index.tsx** | 124 | Main page orchestrator | - |
| **types.ts** | 26 | TypeScript interfaces | - |
| **data.tsx** | 278 | Process steps & benefits data | - |
| **ProcessStep.tsx** | 109 | Individual expandable step card | `step`, `isExpanded`, `onToggle` |
| **ProcessSteps.tsx** | 77 | Container for all steps | `steps` |
| **BenefitsGrid.tsx** | 46 | Responsive benefits grid | `benefits` |

### Usage Example
```typescript
import DetailedProcess from '@/pages/DetailedProcess';

// In router
<Route path="/detailed-process" element={<DetailedProcess />} />
```

### Component Tree
```
DetailedProcess (index.tsx)
├── Headline & Subtitle
├── ProcessSteps
│   └── ProcessStep (x4)
│       ├── Step Header (always visible)
│       └── Step Content (expandable)
├── BenefitsGrid
│   └── BenefitCard (x5)
├── Final Message
└── CTA Button
```

---

## FinalVideoPage Components

### Directory: `/src/pages/FinalVideoPage/`

| File | Lines | Purpose | Key Props |
|------|-------|---------|-----------|
| **index.tsx** | 64 | Main page orchestrator | - |
| **types.ts** | 32 | TypeScript interfaces | - |
| **data.tsx** | 122 | FAQ & expectation data | - |
| **SuccessBadge.tsx** | 124 | Confetti animation & congrats | - |
| **ConfirmationCard.tsx** | 123 | Booking details card | `calendlyUrl` |
| **BonusVideo.tsx** | 56 | YouTube video embed | `videoId` |
| **WhatToExpect.tsx** | 56 | Expectation cards grid | `items` |
| **FAQItem.tsx** | 83 | Single FAQ item | `faq`, `index`, `isOpen`, `onToggle` |
| **FAQAccordion.tsx** | 62 | FAQ container | `faqs` |
| **FinalCTA.tsx** | 60 | Call-to-action section | `calendlyUrl` |

### Usage Example
```typescript
import FinalVideoPage from '@/pages/FinalVideoPage';

// In router
<Route path="/final-video" element={<FinalVideoPage />} />
```

### Component Tree
```
FinalVideoPage (index.tsx)
├── SuccessBadge
│   ├── Confetti Animation
│   └── Success Message
├── ConfirmationCard
│   ├── Appointment Details
│   └── Add to Calendar Button
├── BonusVideo
│   └── YouTube Iframe
├── WhatToExpect
│   └── ExpectCard (x4)
├── FAQAccordion
│   └── FAQItem (x4)
│       ├── Question Button
│       └── Answer (expandable)
└── FinalCTA
    └── Book Another Button
```

---

## Shared Patterns

### State Management
Both pages use **accordion pattern** for expandable sections:
- Only ONE item can be expanded at a time
- State managed in container components
- Child components are controlled via props

### Animation Pattern
All animations use **Framer Motion**:
```typescript
import { motion, AnimatePresence } from 'framer-motion';

// Entrance animation
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6 }}
>

// Expand/collapse animation
<AnimatePresence>
  {isOpen && (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: 'auto', opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ duration: 0.3 }}
    />
  )}
</AnimatePresence>
```

### Styling Pattern
All components use **CSS Modules**:
```typescript
import styles from './Component.module.css';

<div className={styles.container}>
  <h1 className={styles.headline}>Title</h1>
</div>
```

### Type Pattern
```typescript
// types.ts
export interface ComponentProps {
  data: DataType;
  onAction: () => void;
}

// Component.tsx
import { ComponentProps } from './types';

export const Component: React.FC<ComponentProps> = ({ data, onAction }) => {
  // ...
};
```

---

## Environment Variables

### FinalVideoPage
```env
VITE_VIDEO_FINAL_ID=dQw4w9WgXcQ          # YouTube video ID
VITE_CALENDLY_URL=https://calendly.com/... # Calendly booking URL
```

---

## Responsive Breakpoints

### DetailedProcess
```css
/* Small Mobile */
@media (max-width: 479px)

/* Medium Mobile */
@media (min-width: 480px) and (max-width: 767px)

/* Tablet */
@media (min-width: 768px)

/* Desktop */
@media (min-width: 1024px)

/* Large Desktop */
@media (min-width: 1200px)
```

### FinalVideoPage
```css
/* Mobile */
@media (max-width: 640px)

/* Tablet */
@media (min-width: 641px) and (max-width: 1024px)

/* Desktop */
@media (min-width: 1025px)
```

---

## Accessibility Features

### Keyboard Navigation
- All interactive elements are focusable
- Tab order is logical
- Focus styles are visible

### Screen Readers
- ARIA labels on all buttons
- ARIA expanded/controls on expandable sections
- Semantic HTML structure

### Motion Preferences
```css
@media (prefers-reduced-motion: reduce) {
  /* Disable animations */
}
```

### High Contrast
```css
@media (prefers-contrast: high) {
  /* Increase border widths */
}
```

---

## Testing Strategy

### Unit Tests
Test each component in isolation:
```typescript
import { render, screen } from '@testing-library/react';
import { ProcessStep } from './ProcessStep';

test('renders step title', () => {
  render(<ProcessStep step={mockStep} isExpanded={false} onToggle={jest.fn()} />);
  expect(screen.getByText('Step Title')).toBeInTheDocument();
});
```

### Integration Tests
Test component interactions:
```typescript
test('expands step on click', async () => {
  render(<ProcessSteps steps={mockSteps} />);
  const button = screen.getByRole('button', { name: /step 1/i });
  await userEvent.click(button);
  expect(screen.getByText('Step content')).toBeInTheDocument();
});
```

### Visual Tests
Use Storybook for visual regression:
```typescript
export const Default: Story = {
  args: {
    step: mockStep,
    isExpanded: false,
    onToggle: () => {},
  },
};
```

---

## Performance Tips

### Code Splitting
```typescript
// Lazy load subcomponents if needed
const BonusVideo = lazy(() => import('./BonusVideo'));

<Suspense fallback={<Spinner />}>
  <BonusVideo videoId={id} />
</Suspense>
```

### Memoization
```typescript
import { memo } from 'react';

export const ProcessStep = memo<ProcessStepProps>(({ step, isExpanded, onToggle }) => {
  // Component only re-renders if props change
});
```

### Virtualization
For long lists (future enhancement):
```typescript
import { VirtualList } from 'react-window';

// Use for FAQ lists with many items
```

---

## Common Customizations

### Add New Process Step
1. Edit `DetailedProcess/data.tsx`
2. Add new step to `processSteps` array
3. No other changes needed (automatically renders)

### Add New FAQ
1. Edit `FinalVideoPage/data.tsx`
2. Add new FAQ to `faqItems` array
3. No other changes needed (automatically renders)

### Add New Benefit
1. Edit `DetailedProcess/data.tsx`
2. Add new benefit to `benefits` array
3. Grid automatically adjusts (responsive)

### Change Animation Timing
Edit the component's transition prop:
```typescript
transition={{ duration: 0.6 }} // Change duration
```

---

## File Size Comparison

| Page | Before | After | Change |
|------|--------|-------|--------|
| DetailedProcess | 1 file (516 lines) | 10 files (1,209 lines) | +693 lines (includes separated data/styles) |
| FinalVideoPage | 1 file (524 lines) | 18 files (1,385 lines) | +861 lines (includes separated data/styles) |

**Note**: Line increase is due to:
- Extracted inline data to separate files
- Added JSDoc comments (100% coverage)
- Separated CSS to individual modules
- Improved type definitions

**Actual logic is more concise** when comparing just the component code.

---

## Quick Commands

### Run TypeScript Check
```bash
npm run type-check
# or
npx tsc --noEmit
```

### Run Tests
```bash
npm test -- DetailedProcess
npm test -- FinalVideoPage
```

### Build Production
```bash
npm run build
```

### Start Dev Server
```bash
npm run dev
```

---

## Support & Documentation

- **Main Documentation**: `REFACTORING_SUMMARY.md`
- **Type Definitions**: `types.ts` in each directory
- **JSDoc Comments**: Inline in all component files
- **Storybook**: Coming soon

For questions, refer to the component's JSDoc comments or the main refactoring summary document.
