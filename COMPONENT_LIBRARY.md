# Primary Cell Assessment - Component Library Documentation

## Overview

This is a production-ready component library for the Primary Cell Assessment application. All components are built with TypeScript, follow accessibility best practices (WCAG 2.1 AA), and include Framer Motion animations with reduced motion support.

---

## Design Principles

### 1. Accessibility First
- **WCAG 2.1 AA Compliant**: Minimum 44x44px touch targets (48px on mobile)
- **Keyboard Navigation**: Full support for Tab, Enter, Space keys
- **Screen Reader Support**: Proper ARIA labels, roles, and states
- **Focus Indicators**: 3px cream outline with 2px offset on all interactive elements
- **Color Contrast**: Text meets 4.5:1 ratio for normal text, 3:1 for large text

### 2. Motion Design
- **Consistent Animations**: All animations use theme-defined durations and easing
- **Reduced Motion**: Respects `prefers-reduced-motion` user preference
- **Purposeful Movement**: Animations guide attention and provide feedback
- **Performance**: 60fps animations using GPU-accelerated properties

### 3. Design System
- **8px Grid**: All spacing follows strict 8px increments
- **CSS Modules**: Scoped styles with BEM naming convention
- **Theme Variables**: Centralized design tokens in `theme.js`
- **Responsive**: Mobile-first approach (320px+)

---

## Component Documentation

### 1. Button Component

**Location**: `src/components/common/Button.tsx`

**Description**: Premium button with multiple variants, sizes, and full accessibility support.

#### Props

```typescript
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'danger';  // Visual style
  size?: 'small' | 'large';                       // Size variant
  disabled?: boolean;                             // Disabled state
  fullWidth?: boolean;                            // Full width
  onClick?: () => void;                           // Click handler
  'aria-label': string;                           // Required for a11y
  children: ReactNode;                            // Button content
  className?: string;                             // Additional styles
  type?: 'button' | 'submit' | 'reset';          // Button type
}
```

#### Variants

- **Primary**: Navy background (#1D2C49) with white text - Use for main CTAs
- **Secondary**: Cream outline (#E2D3A3) with navy text - Use for secondary actions
- **Danger**: Red background (#EF4444) with white text - Use for destructive actions

#### Sizes

- **Small**: 44px min height, 14px text - Use for inline actions
- **Large**: 48px min height, 16px text - Use for primary actions

#### Usage Examples

```tsx
// Primary CTA button
<Button
  variant="primary"
  size="large"
  onClick={handleNext}
  aria-label="Continue to next step"
>
  Next
</Button>

// Secondary action
<Button
  variant="secondary"
  size="small"
  onClick={handleBack}
  aria-label="Go back to previous step"
>
  Back
</Button>

// Full width button
<Button
  variant="primary"
  size="large"
  fullWidth
  onClick={handleSubmit}
  aria-label="Submit assessment"
>
  Submit
</Button>

// Disabled state
<Button
  variant="primary"
  size="large"
  disabled={!isValid}
  onClick={handleNext}
  aria-label="Continue to next step"
>
  Next
</Button>
```

#### Animations

- **Hover**: Scale 1.02, shadow increase (150ms ease-out)
- **Tap**: Scale 0.98 (150ms ease-out)
- **Disabled**: No animations

---

### 2. Checkbox Component

**Location**: `src/components/common/Checkbox.tsx`

**Description**: Custom checkbox with spring animations and full accessibility.

#### Props

```typescript
interface CheckboxProps {
  id: string;                                    // Unique identifier (required)
  label: string;                                 // Label text (required)
  checked: boolean;                              // Checked state (required)
  onChange: (checked: boolean) => void;          // Change handler (required)
  disabled?: boolean;                            // Disabled state
  description?: string;                          // Helper text below label
  className?: string;                            // Additional styles
  'aria-label'?: string;                         // Optional a11y label
}
```

#### Features

- **Custom Visual**: 24x24px checkbox with 44x44px touch target
- **Spring Animation**: Checkmark scales 0→1 with rotation -180→0
- **Color Transition**: Border animates from cream to navy on check
- **Stroke Animation**: SVG checkmark path animates on check

#### Usage Examples

```tsx
// Basic checkbox
<Checkbox
  id="terms-checkbox"
  label="I agree to the terms and conditions"
  checked={agreedToTerms}
  onChange={setAgreedToTerms}
/>

// With description
<Checkbox
  id="marketing-checkbox"
  label="Send me updates"
  description="Receive occasional emails about new features"
  checked={wantsUpdates}
  onChange={setWantsUpdates}
/>

// Disabled state
<Checkbox
  id="disabled-checkbox"
  label="This option is unavailable"
  checked={false}
  onChange={() => {}}
  disabled
/>

// Multiple checkboxes in a list
{conditions.map((condition) => (
  <Checkbox
    key={condition.id}
    id={condition.id}
    label={condition.name}
    description={condition.description}
    checked={selectedConditions.includes(condition.id)}
    onChange={(checked) => handleConditionChange(condition.id, checked)}
  />
))}
```

#### Animations

- **Check**: Spring animation (stiffness: 300, damping: 20)
- **Border**: Color transition (150ms ease-out)
- **Checkmark**: Path length 0→1 (200ms ease-out)

---

### 3. FormField Component

**Location**: `src/components/common/FormField.tsx`

**Description**: Premium input field with floating label and animated borders.

#### Props

```typescript
interface FormFieldProps {
  label: string;                                 // Field label (required)
  type?: 'text' | 'email' | 'tel' | 'password' | 'number' | 'url';
  value: string;                                 // Current value (required)
  onChange: (value: string) => void;             // Change handler (required)
  error?: string;                                // Error message
  placeholder?: string;                          // Placeholder text
  disabled?: boolean;                            // Disabled state
  helperText?: string;                           // Helper text
  required?: boolean;                            // Required field
  className?: string;                            // Additional styles
  'aria-label'?: string;                         // Optional a11y label
  id?: string;                                   // Optional ID (auto-generated)
}
```

#### Features

- **Floating Label**: Label moves up when focused or filled
- **Animated Border**: 2px navy underline appears on focus
- **Error Display**: Icon + message shown below input
- **Helper Text**: Additional context when no error present

#### Usage Examples

```tsx
// Basic text input
<FormField
  label="Full Name"
  type="text"
  value={name}
  onChange={setName}
  placeholder="John Doe"
  required
  aria-label="Enter your full name"
/>

// Email with validation
<FormField
  label="Email Address"
  type="email"
  value={email}
  onChange={setEmail}
  error={emailError}
  placeholder="your@email.com"
  required
  helperText="We'll never share your email"
  aria-label="Enter your email address"
/>

// Phone number
<FormField
  label="Phone Number"
  type="tel"
  value={phone}
  onChange={setPhone}
  placeholder="(555) 123-4567"
  helperText="Include area code"
  aria-label="Enter your phone number"
/>

// Password field
<FormField
  label="Password"
  type="password"
  value={password}
  onChange={setPassword}
  error={passwordError}
  required
  helperText="Must be at least 8 characters"
  aria-label="Enter your password"
/>

// Disabled field
<FormField
  label="User ID"
  type="text"
  value={userId}
  onChange={() => {}}
  disabled
  helperText="This field cannot be edited"
  aria-label="User identification number"
/>
```

#### Animations

- **Label**: Moves up and scales down when focused/filled (150ms ease-out)
- **Border Bottom**: Scales horizontally from center (300ms ease-out)
- **Error**: Fades in with upward movement (200ms)

---

### 4. ProgressBar Component

**Location**: `src/components/common/ProgressBar.tsx`

**Description**: Accessible progress indicator with animated width changes.

#### Props

```typescript
interface ProgressBarProps {
  current: number;                               // Current step (1-indexed, required)
  total: number;                                 // Total steps (required)
  labelPrefix?: string;                          // Label prefix (default: 'Step')
  showLabel?: boolean;                           // Show step text (default: true)
  showPercentage?: boolean;                      // Show percentage (default: false)
  className?: string;                            // Additional styles
  'aria-label'?: string;                         // Optional a11y label
}
```

#### Features

- **ARIA Support**: Full progressbar role with valuenow, valuemin, valuemax
- **Live Updates**: aria-live="polite" for screen reader announcements
- **Animated Width**: Smooth 300ms ease-out transition
- **Visual Depth**: Inner highlight for 3D effect

#### Usage Examples

```tsx
// Basic progress bar
<ProgressBar
  current={3}
  total={10}
  aria-label="Assessment progress"
/>

// With percentage
<ProgressBar
  current={5}
  total={14}
  showLabel
  showPercentage
  aria-label="Assessment completion progress"
/>

// Custom label
<ProgressBar
  current={2}
  total={5}
  labelPrefix="Question"
  showLabel
  aria-label="Question progress"
/>

// Without label (percentage only)
<ProgressBar
  current={7}
  total={10}
  showLabel={false}
  showPercentage
  aria-label="Progress indicator"
/>
```

#### Animations

- **Width**: Smooth transition (300ms ease-out)
- **Gradient Fill**: Navy gradient with highlight

---

### 5. PageTransition Component

**Location**: `src/components/common/PageTransition.tsx`

**Description**: Wrapper for page-level animations with reduced motion support.

#### Props

```typescript
interface PageTransitionProps {
  children: ReactNode;                           // Page content (required)
  transitionKey?: string | number;               // Trigger key for animations
  entryDuration?: number;                        // Entry duration (default: 0.3s)
  exitDuration?: number;                         // Exit duration (default: 0.2s)
  slideOffset?: number;                          // Slide distance (default: 20px)
  enableExit?: boolean;                          // Enable exit animation (default: true)
  className?: string;                            // Additional styles
}
```

#### Features

- **Entry Animation**: Fade in (opacity 0→1) + slide up (y: 20→0)
- **Exit Animation**: Fade out (opacity 1→0) + slide up (y: 0→-20)
- **Reduced Motion**: Automatically detected and respected
- **AnimatePresence**: Handles exit animations on unmount

#### Usage Examples

```tsx
// Basic page transition
<PageTransition transitionKey={location.pathname}>
  <LandingPage />
</PageTransition>

// With React Router
import { useLocation } from 'react-router-dom';

function App() {
  const location = useLocation();

  return (
    <PageTransition transitionKey={location.pathname}>
      <Routes location={location}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/about" element={<AboutPage />} />
      </Routes>
    </PageTransition>
  );
}

// Custom animation settings
<PageTransition
  transitionKey="custom-page"
  entryDuration={0.5}
  exitDuration={0.3}
  slideOffset={30}
>
  <CustomPage />
</PageTransition>

// No exit animation
<PageTransition
  transitionKey="instant-exit"
  enableExit={false}
>
  <QuickPage />
</PageTransition>
```

#### Animations

- **Entry**: Opacity 0→1, Y 20→0 (300ms ease-out)
- **Exit**: Opacity 1→0, Y 0→-20 (200ms ease-in)
- **Reduced Motion**: Fade only, 10ms duration

---

### 6. Card Component

**Location**: `src/components/common/Card.tsx`

**Description**: Versatile card/container with multiple variants and shadow depths.

#### Props

```typescript
interface CardProps {
  children: ReactNode;                           // Card content (required)
  variant?: 'white' | 'primary' | 'secondary';  // Visual style
  shadow?: 'none' | 'sm' | 'md' | 'lg' | 'xl'; // Shadow depth
  hoverable?: boolean;                           // Enable hover effects
  padding?: 'none' | 'sm' | 'md' | 'lg';        // Padding size
  fullWidth?: boolean;                           // Full width
  onClick?: () => void;                          // Click handler
  className?: string;                            // Additional styles
  'aria-label'?: string;                         // Required if onClick present
  disabled?: boolean;                            // Disabled state
}
```

#### Variants

- **White**: White background with subtle border - Default containers
- **Primary**: Navy background with white text - Emphasis/highlights
- **Secondary**: Cream background with navy text - Subtle emphasis

#### Shadow Depths

- **none**: No shadow (flat)
- **sm**: Subtle shadow (1-2px)
- **md**: Medium shadow (4-6px) - Default
- **lg**: Large shadow (10-15px)
- **xl**: Extra large shadow (20-25px)

#### Usage Examples

```tsx
// Basic card
<Card variant="white" shadow="md">
  <h2>Card Title</h2>
  <p>Card content goes here.</p>
</Card>

// Primary variant for emphasis
<Card variant="primary" shadow="lg" padding="lg">
  <h2>Important Notice</h2>
  <p>This content is highlighted.</p>
</Card>

// Interactive card with hover
<Card
  variant="white"
  shadow="md"
  hoverable
  onClick={handleCardClick}
  aria-label="Click to view details"
>
  <h3>Clickable Card</h3>
  <p>This card is interactive.</p>
</Card>

// Full width card with no padding
<Card
  variant="secondary"
  shadow="none"
  padding="none"
  fullWidth
>
  <img src="banner.jpg" alt="Banner" />
</Card>

// Disabled interactive card
<Card
  variant="white"
  shadow="md"
  hoverable
  onClick={handleClick}
  disabled
  aria-label="Card action currently unavailable"
>
  <h3>Unavailable Option</h3>
</Card>
```

#### Animations

- **Hover**: Lift -4px, shadow increase (150ms ease-out)
- **Tap**: Scale 0.98 (if onClick present, 100ms ease-out)

---

## Theme Configuration

**Location**: `src/styles/theme.js`

The theme file contains all design tokens including colors, typography, spacing, breakpoints, and animation settings.

### Key Theme Properties

```javascript
theme.colors.primary              // rgba(29, 44, 73, 1) - Navy
theme.colors.secondary            // rgba(226, 211, 163, 1) - Cream
theme.typography.fontSize.body    // clamp(1rem, 2vw, 1.125rem)
theme.spacing.md                  // 24px
theme.breakpoints.md              // 768px
theme.animation.duration.normal   // 300ms
```

### Usage in Components

```tsx
import { theme } from '@/styles/theme';

// In JavaScript
const buttonColor = theme.colors.primary;
const spacing = theme.spacing.md;

// In CSS Modules
.component {
  color: var(--colors-primary);
  padding: var(--spacing-md);
}
```

---

## Accessibility Guidelines

### Keyboard Navigation

All interactive components support:
- **Tab**: Navigate to next element
- **Shift + Tab**: Navigate to previous element
- **Enter**: Activate button/link
- **Space**: Activate button/checkbox

### Screen Reader Support

All components include:
- Semantic HTML elements (`<button>`, `<input>`, etc.)
- ARIA labels and descriptions
- ARIA roles for custom components
- ARIA live regions for dynamic updates

### Focus Management

- Visible focus indicators on all interactive elements
- 3px cream outline (#E2D3A3) with 2px offset
- Focus-visible for keyboard users only
- Skip links on multi-step pages

### Color Contrast

All text meets WCAG AA standards:
- Normal text (body): 4.5:1 contrast ratio
- Large text (18px+): 3:1 contrast ratio
- UI components: 3:1 contrast ratio

---

## Animation System

### Standard Transitions

```javascript
// Page transitions
initial: { opacity: 0, y: 20 }
animate: { opacity: 1, y: 0 }
transition: { duration: 0.3, ease: 'easeOut' }

// Button hover
whileHover: { scale: 1.02 }
transition: { duration: 0.15, ease: 'easeOut' }

// Checkbox check
transition: { type: 'spring', stiffness: 300, damping: 20 }
```

### Reduced Motion

All components automatically respect `prefers-reduced-motion`:

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## Testing Components

### Component Testing Checklist

For each component, test:

1. **Visual Rendering**
   - [ ] Renders correctly in all variants
   - [ ] Responsive at 320px, 768px, 1440px
   - [ ] Correct spacing (8px grid)
   - [ ] Correct colors from theme

2. **Accessibility**
   - [ ] Keyboard navigation works
   - [ ] Screen reader announces correctly
   - [ ] Focus indicators visible
   - [ ] ARIA attributes present
   - [ ] Touch targets ≥44px (48px mobile)

3. **Interactions**
   - [ ] onClick/onChange handlers fire
   - [ ] Hover states work
   - [ ] Disabled state prevents interaction
   - [ ] Form validation works

4. **Animations**
   - [ ] Animations smooth at 60fps
   - [ ] Reduced motion respected
   - [ ] No layout shift during animation

---

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- iOS Safari 14+
- Chrome Android 90+

---

## Performance

### Bundle Size

- Button: ~2KB gzipped
- Checkbox: ~3KB gzipped
- FormField: ~4KB gzipped
- ProgressBar: ~2KB gzipped
- PageTransition: ~1KB gzipped
- Card: ~2KB gzipped

**Total**: ~14KB gzipped for entire component library

### Optimization Tips

1. **Code Splitting**: Import only needed components
2. **CSS Modules**: Automatic dead code elimination
3. **Tree Shaking**: Use named imports
4. **Lazy Loading**: Use React.lazy() for routes

---

## Common Patterns

### Form with Validation

```tsx
const [formData, setFormData] = useState({
  name: '',
  email: '',
  phone: ''
});
const [errors, setErrors] = useState({});

const validate = () => {
  const newErrors = {};

  if (!formData.name.trim()) {
    newErrors.name = 'Name is required';
  }

  if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
    newErrors.email = 'Invalid email address';
  }

  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};

const handleSubmit = () => {
  if (validate()) {
    // Submit form
  }
};

return (
  <form onSubmit={handleSubmit}>
    <FormField
      label="Name"
      type="text"
      value={formData.name}
      onChange={(value) => setFormData({ ...formData, name: value })}
      error={errors.name}
      required
      aria-label="Enter your name"
    />

    <FormField
      label="Email"
      type="email"
      value={formData.email}
      onChange={(value) => setFormData({ ...formData, email: value })}
      error={errors.email}
      required
      aria-label="Enter your email"
    />

    <Button
      variant="primary"
      size="large"
      type="submit"
      aria-label="Submit form"
    >
      Submit
    </Button>
  </form>
);
```

### Multi-Step Form with Progress

```tsx
const [step, setStep] = useState(1);
const totalSteps = 5;

return (
  <PageTransition transitionKey={step}>
    <ProgressBar
      current={step}
      total={totalSteps}
      showLabel
      showPercentage
      aria-label="Form progress"
    />

    {step === 1 && <Step1 />}
    {step === 2 && <Step2 />}
    {/* ... */}

    <div>
      <Button
        variant="secondary"
        onClick={() => setStep(step - 1)}
        disabled={step === 1}
        aria-label="Go to previous step"
      >
        Back
      </Button>

      <Button
        variant="primary"
        onClick={() => setStep(step + 1)}
        disabled={step === totalSteps}
        aria-label="Go to next step"
      >
        Next
      </Button>
    </div>
  </PageTransition>
);
```

### Checkbox List

```tsx
const [selectedItems, setSelectedItems] = useState([]);

const handleCheckboxChange = (id, checked) => {
  setSelectedItems(prev =>
    checked
      ? [...prev, id]
      : prev.filter(item => item !== id)
  );
};

return (
  <Card variant="white" shadow="md">
    <h2>Select Options</h2>
    {options.map(option => (
      <Checkbox
        key={option.id}
        id={option.id}
        label={option.label}
        description={option.description}
        checked={selectedItems.includes(option.id)}
        onChange={(checked) => handleCheckboxChange(option.id, checked)}
      />
    ))}
  </Card>
);
```

---

## Troubleshooting

### Animations Not Working

1. Check if `framer-motion` is installed: `npm install framer-motion`
2. Verify `prefers-reduced-motion` setting in OS
3. Check browser console for errors
4. Ensure proper key prop for AnimatePresence

### Styles Not Applied

1. Verify CSS Module import: `import styles from './Component.module.css'`
2. Check className usage: `className={styles.component}`
3. Ensure .module.css extension is present
4. Clear build cache and rebuild

### TypeScript Errors

1. Update TypeScript: `npm install -D typescript@latest`
2. Check tsconfig.json for strict mode settings
3. Ensure all required props are provided
4. Import types: `import type { ButtonProps } from './Button'`

### Accessibility Issues

1. Run axe DevTools in browser
2. Test with keyboard navigation
3. Test with screen reader (VoiceOver, NVDA)
4. Verify ARIA labels are present
5. Check color contrast with tools

---

## Contributing

When adding new components:

1. Follow TypeScript strict mode
2. Include full JSDoc documentation
3. Create corresponding CSS Module
4. Add to index.ts exports
5. Update this documentation
6. Test accessibility
7. Test animations
8. Test responsive design

---

## License

Proprietary - Primary Cell Assessment Application

---

## Support

For questions or issues, contact the development team.
