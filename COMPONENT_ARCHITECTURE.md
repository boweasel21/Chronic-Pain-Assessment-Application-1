# Component Architecture Diagrams

## DetailedProcess Page Architecture

### Component Hierarchy

```
DetailedProcess/index.tsx (Main Orchestrator)
│
├─── Page Layout (motion.div)
│    │
│    ├─── Container (div)
│    │    │
│    │    └─── Content (motion.div)
│    │         │
│    │         ├─── 1. Headline Section (motion.div)
│    │         │    ├─── h1: "Your 4-Step Cellular Repair Process"
│    │         │    └─── p: "This isn't guesswork..."
│    │         │
│    │         ├─── 2. ProcessSteps Component (motion.div)
│    │         │    │
│    │         │    └─── ProcessSteps.tsx
│    │         │         │
│    │         │         ├─── ProcessStep #1 (Identify)
│    │         │         │    ├─── Step Header [Button]
│    │         │         │    │    ├─── Step Number
│    │         │         │    │    ├─── Icon
│    │         │         │    │    ├─── Title + Subtitle
│    │         │         │    │    └─── Toggle Chevron
│    │         │         │    │
│    │         │         │    └─── Step Content [Expandable]
│    │         │         │         ├─── Description
│    │         │         │         ├─── Details List (9 items)
│    │         │         │         ├─── Examples List (3 items)
│    │         │         │         └─── Timeline Badge
│    │         │         │
│    │         │         ├─── ProcessStep #2 (Assess)
│    │         │         │    └─── [Same structure as #1]
│    │         │         │
│    │         │         ├─── ProcessStep #3 (Apply)
│    │         │         │    └─── [Same structure as #1]
│    │         │         │
│    │         │         └─── ProcessStep #4 (Monitor)
│    │         │              └─── [Same structure as #1]
│    │         │
│    │         ├─── 3. BenefitsGrid Component (motion.div)
│    │         │    │
│    │         │    └─── BenefitsGrid.tsx
│    │         │         ├─── Section Title
│    │         │         ├─── Section Description
│    │         │         │
│    │         │         └─── Benefits Grid
│    │         │              ├─── Benefit Card #1 (Pain Relief)
│    │         │              │    ├─── Icon Circle
│    │         │              │    ├─── Title
│    │         │              │    └─── Description
│    │         │              │
│    │         │              ├─── Benefit Card #2 (Movement)
│    │         │              ├─── Benefit Card #3 (Energy)
│    │         │              ├─── Benefit Card #4 (Sleep)
│    │         │              └─── Benefit Card #5 (Wellbeing)
│    │         │
│    │         ├─── 4. Final Message Section (motion.div)
│    │         │    ├─── Title
│    │         │    └─── 3 Paragraphs
│    │         │
│    │         └─── 5. CTA Section (motion.div)
│    │              └─── Button: "I Want to Get Started"
│    │
│    └─── Background Gradient
```

### Data Flow

```
data.tsx (Static Data)
│
├─── processSteps[]
│    └──> index.tsx
│         └──> ProcessSteps.tsx
│              └──> ProcessStep.tsx (x4)
│
└─── benefits[]
     └──> index.tsx
          └──> BenefitsGrid.tsx
```

### State Management

```
index.tsx
│
└─── ProcessSteps.tsx
     │
     ├─── STATE: expandedStep (number | null)
     │
     └─── HANDLERS:
          └─── toggleStep(stepId: number)
               ├─── Sets expandedStep to stepId
               └─── Or null if already expanded
```

---

## FinalVideoPage Architecture

### Component Hierarchy

```
FinalVideoPage/index.tsx (Main Orchestrator)
│
├─── Container (div)
│    │
│    └─── Content (div)
│         │
│         ├─── 1. SuccessBadge Component
│         │    │
│         │    ├─── Confetti Container (fixed position)
│         │    │    └─── Confetti Particles (x50)
│         │    │         └─── [Auto-remove after 4s]
│         │    │
│         │    └─── Congrats Section (motion.section)
│         │         ├─── Success Badge Icon (animated)
│         │         ├─── h1: "Your Discovery Call is Scheduled!"
│         │         └─── p: "Check your email..."
│         │
│         ├─── 2. ConfirmationCard Component
│         │    │
│         │    └─── Card (white, large shadow)
│         │         ├─── h2: "Your Appointment Details"
│         │         │
│         │         ├─── Details Grid
│         │         │    ├─── Detail Item (Date/Time)
│         │         │    │    ├─── Calendar Icon
│         │         │    │    └─── Label + Value
│         │         │    │
│         │         │    └─── Detail Item (Format)
│         │         │         ├─── Video Icon
│         │         │         └─── Label + Value
│         │         │
│         │         └─── Add to Calendar Button
│         │
│         ├─── 3. BonusVideo Component
│         │    │
│         │    └─── Card (white, medium shadow)
│         │         ├─── h2: "While You Wait..."
│         │         ├─── Video Wrapper (16:9)
│         │         │    └─── YouTube iframe
│         │         └─── Description text
│         │
│         ├─── 4. WhatToExpect Component
│         │    │
│         │    ├─── h2: "What to Expect..."
│         │    │
│         │    └─── Expect Grid (4 columns)
│         │         ├─── Expect Card #1 (30-Min Call)
│         │         │    ├─── Icon Circle
│         │         │    ├─── Title
│         │         │    └─── Description
│         │         │
│         │         ├─── Expect Card #2 (Assessment)
│         │         ├─── Expect Card #3 (Treatment Plan)
│         │         └─── Expect Card #4 (Next Steps)
│         │
│         ├─── 5. FAQAccordion Component
│         │    │
│         │    ├─── h2: "Frequently Asked Questions"
│         │    │
│         │    └─── FAQ List
│         │         ├─── FAQItem #1
│         │         │    ├─── Question Button
│         │         │    │    ├─── Question Text
│         │         │    │    └─── Chevron Icon (rotates)
│         │         │    │
│         │         │    └─── Answer [Expandable]
│         │         │         └─── Answer Text
│         │         │
│         │         ├─── FAQItem #2
│         │         ├─── FAQItem #3
│         │         └─── FAQItem #4
│         │
│         └─── 6. FinalCTA Component
│              │
│              └─── Card (primary color, large shadow)
│                   ├─── h2: "Ready for More Support?"
│                   ├─── p: Description
│                   └─── Button: "Book Another Session"
│
└─── Background Gradient
```

### Data Flow

```
data.tsx (Static Data)
│
├─── faqItems[]
│    └──> index.tsx
│         └──> FAQAccordion.tsx
│              └──> FAQItem.tsx (x4)
│
└─── expectItems[]
     └──> index.tsx
          └──> WhatToExpect.tsx
```

### Props Flow

```
index.tsx (Environment Variables)
│
├─── videoId (from env)
│    └──> BonusVideo.tsx
│
└─── calendlyUrl (from env)
     ├──> ConfirmationCard.tsx
     └──> FinalCTA.tsx
```

### State Management

```
SuccessBadge.tsx
│
├─── STATE: showConfetti (boolean)
└─── EFFECT: Auto-hide after 4s


FAQAccordion.tsx
│
├─── STATE: expandedFAQ (number | null)
│
└─── HANDLERS:
     └─── toggleFAQ(index: number)
          ├─── Sets expandedFAQ to index
          └─── Or null if already expanded
```

---

## Shared Patterns

### 1. Accordion Pattern (Both Pages)

```
Container Component (ProcessSteps / FAQAccordion)
│
├─── STATE: expanded (number | null)
│    └─── Tracks which item is currently open
│
├─── HANDLER: toggle(id: number)
│    └─── If id === expanded: set null
│         Else: set id
│
└─── RENDER: map over items
     └─── Pass isOpen={expanded === item.id}
          Pass onToggle={() => toggle(item.id)}
```

### 2. Animation Sequence Pattern

```typescript
// Staggered entrance (DetailedProcess)
containerVariants = {
  animate: {
    transition: { staggerChildren: 0.1 }
  }
}

itemVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 }
}

// Each section animates 0.1s after the previous
```

### 3. Responsive Grid Pattern

```css
/* Mobile First */
grid-template-columns: 1fr;

/* Tablet */
@media (min-width: 768px) {
  grid-template-columns: repeat(2, 1fr);
}

/* Desktop */
@media (min-width: 1024px) {
  grid-template-columns: repeat(4, 1fr);
}
```

---

## Component Dependencies

### DetailedProcess Dependencies

```
index.tsx
├── react
├── framer-motion (motion, AnimatePresence)
├── react-router-dom (useNavigate)
├── @components/common/Button
├── ./ProcessSteps
├── ./BenefitsGrid
├── ./data (processSteps, benefits)
└── ./index.module.css

ProcessSteps.tsx
├── react (useState)
├── framer-motion (motion)
├── ./ProcessStep
├── ./types (ProcessStep)
└── ./ProcessSteps.module.css

ProcessStep.tsx
├── react
├── framer-motion (motion, AnimatePresence)
├── ./types (ProcessStep)
└── ./ProcessStep.module.css

BenefitsGrid.tsx
├── react
├── ./types (Benefit)
└── ./BenefitsGrid.module.css
```

### FinalVideoPage Dependencies

```
index.tsx
├── react (useEffect)
├── ./SuccessBadge
├── ./ConfirmationCard
├── ./BonusVideo
├── ./WhatToExpect
├── ./FAQAccordion
├── ./FinalCTA
├── ./data (faqItems, expectItems)
└── ./index.module.css

SuccessBadge.tsx
├── react (useState, useEffect)
├── framer-motion (motion, AnimatePresence)
├── ./types (ConfettiParticle)
└── ./SuccessBadge.module.css

FAQAccordion.tsx
├── react (useState)
├── framer-motion (motion)
├── ./FAQItem
├── ./types (FAQItem)
└── ./FAQAccordion.module.css

FAQItem.tsx
├── react
├── framer-motion (motion, AnimatePresence)
├── @components/common/Card
├── ./types (FAQItem)
└── ./FAQItem.module.css

[... other components follow similar pattern]
```

---

## Type System Architecture

### DetailedProcess Types

```typescript
// types.ts
export interface ProcessStep {
  id: number;           // Unique identifier
  title: string;        // Main heading
  subtitle: string;     // Supporting text
  description: string;  // Overview paragraph
  details: string[];    // Bullet point list
  examples: string[];   // Real-world examples
  timeline: string;     // Duration estimate
  icon: JSX.Element;    // SVG icon
}

export interface Benefit {
  title: string;        // Benefit name
  description: string;  // Benefit details
  icon: JSX.Element;    // SVG icon
}
```

### FinalVideoPage Types

```typescript
// types.ts
export interface FAQItem {
  question: string;     // Question text
  answer: string;       // Answer text
}

export interface ConfettiParticle {
  id: number;           // Unique identifier
  x: number;            // Horizontal position (%)
  y: number;            // Vertical position (px)
  rotation: number;     // Rotation angle
  color: string;        // Hex color code
  delay: number;        // Animation delay (s)
}

export interface ExpectItem {
  icon: JSX.Element;    // SVG icon
  title: string;        // Expectation title
  text: string;         // Expectation description
}
```

---

## CSS Module Structure

### Naming Convention

```css
/* Page-level */
.page { }         /* Root wrapper */
.container { }    /* Width constraint */
.content { }      /* Inner content */

/* Section-level */
.headline { }     /* Main title */
.subtitle { }     /* Supporting text */
.cta { }          /* Call-to-action */

/* Component-level */
.stepCard { }     /* Component wrapper */
.stepHeader { }   /* Component header */
.stepContent { }  /* Component body */

/* Element-level */
.stepIcon { }     /* Icon */
.stepTitle { }    /* Title text */
.stepToggle { }   /* Toggle button */
```

### Responsive Modifier Pattern

```css
/* Base (Mobile) */
.benefitsGrid {
  grid-template-columns: 1fr;
}

/* Tablet */
@media (min-width: 768px) {
  .benefitsGrid {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* Desktop */
@media (min-width: 1024px) {
  .benefitsGrid {
    grid-template-columns: repeat(4, 1fr);
  }
}
```

### State Modifier Pattern

```css
/* Base state */
.stepToggle {
  transform: rotate(0deg);
}

/* Expanded state */
.stepToggleExpanded {
  transform: rotate(180deg);
}
```

---

## Performance Optimization Points

### 1. Code Splitting Opportunities

```typescript
// Future optimization: lazy load heavy components
const BonusVideo = lazy(() => import('./BonusVideo'));
const FAQAccordion = lazy(() => import('./FAQAccordion'));

<Suspense fallback={<Skeleton />}>
  <BonusVideo videoId={id} />
</Suspense>
```

### 2. Memoization Targets

```typescript
// Expensive calculations
const ProcessStep = memo(ProcessStepComponent);
const BenefitCard = memo(BenefitCardComponent);

// Callbacks
const toggleStep = useCallback((id: number) => {
  setExpanded(prev => prev === id ? null : id);
}, []);
```

### 3. Animation Performance

```css
/* Use transform/opacity for best performance */
.stepContent {
  transform: translateY(0);  /* GPU accelerated */
  opacity: 1;                /* GPU accelerated */
}

/* Avoid animating these: */
/* height (causes reflow) */
/* margin/padding (causes reflow) */
/* Use max-height instead if needed */
```

---

## Testing Architecture

### Component Test Structure

```typescript
describe('ProcessStep', () => {
  describe('Rendering', () => {
    it('renders step number');
    it('renders step title');
    it('renders step icon');
  });

  describe('Interactions', () => {
    it('calls onToggle when clicked');
    it('expands content when isExpanded=true');
  });

  describe('Accessibility', () => {
    it('has correct ARIA attributes');
    it('is keyboard navigable');
  });
});
```

### Integration Test Structure

```typescript
describe('ProcessSteps Integration', () => {
  it('opens step when clicked');
  it('closes other steps when opening new one');
  it('animates smoothly between states');
});
```

---

## Deployment Checklist

- [x] TypeScript compilation passes
- [x] All components < 150 lines
- [x] 100% JSDoc coverage
- [x] CSS Modules per component
- [x] Responsive design tested
- [x] Accessibility verified
- [x] No breaking changes
- [x] Old files backed up
- [ ] Unit tests written
- [ ] Integration tests written
- [ ] E2E tests updated
- [ ] Storybook stories created
- [ ] Documentation reviewed
- [ ] Performance profiled
- [ ] Bundle size checked

---

This architecture enables:
- **Easy maintenance**: Small, focused components
- **High testability**: Pure, isolated functions
- **Good performance**: Optimized rendering
- **Accessibility**: Built-in ARIA support
- **Scalability**: Add features without refactoring
