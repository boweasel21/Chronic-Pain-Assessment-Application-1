# Component Library - Setup & Installation Guide

## Quick Start (5 Minutes)

Follow these steps to start using the component library immediately.

---

## Step 1: Install Dependencies

The component library requires **Framer Motion** for animations.

```bash
cd "/Users/elijahbowie/Chronic Pain Assessment Application"
npm install framer-motion
```

**Verify installation:**
```bash
npm list framer-motion
```

Expected output:
```
chronic-pain-assessment@1.0.0
└── framer-motion@10.16.16
```

---

## Step 2: Verify File Structure

Ensure all component files are in place:

```bash
ls -la src/components/common/
```

**You should see:**
- ✅ Button.tsx + Button.module.css
- ✅ Checkbox.tsx + Checkbox.module.css
- ✅ FormField.tsx + FormField.module.css
- ✅ ProgressBar.tsx + ProgressBar.module.css
- ✅ PageTransition.tsx
- ✅ Card.tsx + Card.module.css
- ✅ ComponentExample.tsx
- ✅ index.ts

```bash
ls -la src/styles/
```

**You should see:**
- ✅ theme.js
- ✅ theme.ts (if already exists)
- ✅ global.css (if already exists)

---

## Step 3: Test Components

### Option A: Run the Example Component

1. **Create a test route** in your app (if using React Router):

```typescript
// In your main App.tsx or routes file
import { ComponentExample } from './components/common/ComponentExample';

// Add route:
<Route path="/test-components" element={<ComponentExample />} />
```

2. **Start development server:**

```bash
npm run dev
```

3. **Visit the test page:**
```
http://localhost:5173/test-components
```

### Option B: Import Individual Components

Create a new test file:

```typescript
// src/pages/TestPage.tsx
import { Button, Card, FormField } from '@/components/common';
import { useState } from 'react';

export const TestPage = () => {
  const [name, setName] = useState('');

  return (
    <Card variant="white" shadow="md" padding="lg">
      <h1>Component Test</h1>

      <FormField
        label="Name"
        type="text"
        value={name}
        onChange={setName}
        aria-label="Enter your name"
      />

      <Button
        variant="primary"
        size="large"
        onClick={() => alert(`Hello ${name}!`)}
        aria-label="Submit form"
      >
        Submit
      </Button>
    </Card>
  );
};
```

---

## Step 4: Import in Your Pages

### Basic Import Pattern

```typescript
// Import components
import { Button, Card, FormField, Checkbox } from '@/components/common';

// Import types (if needed)
import type { ButtonProps, CardProps } from '@/components/common';
```

### With Theme

```typescript
import { theme } from '@/styles/theme';

// Use theme values in your component
const buttonColor = theme.colors.primary;
```

---

## Step 5: TypeScript Configuration

Ensure your `tsconfig.json` includes path aliases:

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"],
      "@/components/*": ["./src/components/*"],
      "@/styles/*": ["./src/styles/*"]
    }
  }
}
```

If not using path aliases, use relative imports:

```typescript
import { Button } from '../../components/common';
```

---

## Common Setup Issues & Solutions

### Issue 1: Framer Motion Not Found

**Error:**
```
Cannot find module 'framer-motion'
```

**Solution:**
```bash
npm install framer-motion
# or
npm install framer-motion --legacy-peer-deps
```

### Issue 2: CSS Modules Not Working

**Error:**
```
Cannot find module './Button.module.css'
```

**Solution 1 - Add TypeScript declaration:**

Create `src/types/css-modules.d.ts`:
```typescript
declare module '*.module.css' {
  const classes: { [key: string]: string };
  export default classes;
}
```

**Solution 2 - Check Vite config:**

Ensure `vite.config.ts` includes:
```typescript
export default defineConfig({
  css: {
    modules: {
      localsConvention: 'camelCase'
    }
  }
});
```

### Issue 3: Import Path Not Working

**Error:**
```
Cannot find module '@/components/common'
```

**Solution:**

Update `vite.config.ts`:
```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
});
```

### Issue 4: TypeScript Errors

**Error:**
```
Property 'aria-label' is missing in type
```

**Solution:**

Ensure you provide required props:
```typescript
// ❌ Missing aria-label
<Button onClick={handleClick}>Submit</Button>

// ✅ Correct
<Button onClick={handleClick} aria-label="Submit form">Submit</Button>
```

---

## Integration with Existing Code

### Replace Existing Buttons

**Before:**
```tsx
<button className="btn-primary" onClick={handleNext}>
  Next
</button>
```

**After:**
```tsx
<Button
  variant="primary"
  size="large"
  onClick={handleNext}
  aria-label="Continue to next step"
>
  Next
</Button>
```

### Replace Existing Form Inputs

**Before:**
```tsx
<div className="form-group">
  <label htmlFor="email">Email</label>
  <input
    type="email"
    id="email"
    value={email}
    onChange={e => setEmail(e.target.value)}
  />
  {error && <span className="error">{error}</span>}
</div>
```

**After:**
```tsx
<FormField
  label="Email"
  type="email"
  value={email}
  onChange={setEmail}
  error={error}
  aria-label="Enter your email address"
/>
```

### Add Page Transitions

**Before:**
```tsx
<Routes>
  <Route path="/" element={<HomePage />} />
  <Route path="/about" element={<AboutPage />} />
</Routes>
```

**After:**
```tsx
import { useLocation } from 'react-router-dom';
import { PageTransition } from '@/components/common';

const location = useLocation();

<PageTransition transitionKey={location.pathname}>
  <Routes location={location}>
    <Route path="/" element={<HomePage />} />
    <Route path="/about" element={<AboutPage />} />
  </Routes>
</PageTransition>
```

---

## Example Page Implementation

Here's a complete example of a page using all components:

```typescript
// src/pages/AssessmentPage.tsx
import { useState } from 'react';
import {
  Button,
  Card,
  FormField,
  Checkbox,
  ProgressBar,
  PageTransition
} from '@/components/common';

export const AssessmentPage = () => {
  const [step, setStep] = useState(1);
  const totalSteps = 3;

  const [formData, setFormData] = useState({
    name: '',
    email: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [agreed, setAgreed] = useState(false);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      newErrors.email = 'Invalid email address';
    }

    if (!agreed) {
      newErrors.agreed = 'You must agree to continue';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validate()) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    setStep(step - 1);
    setErrors({});
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '24px' }}>
      <ProgressBar
        current={step}
        total={totalSteps}
        showLabel
        showPercentage
        aria-label="Assessment progress"
      />

      <PageTransition transitionKey={step}>
        <Card variant="white" shadow="md" padding="lg">
          <h1>Step {step} of {totalSteps}</h1>

          {step === 1 && (
            <>
              <FormField
                label="Full Name"
                type="text"
                value={formData.name}
                onChange={(value) => setFormData({ ...formData, name: value })}
                error={errors.name}
                required
                aria-label="Enter your full name"
              />

              <FormField
                label="Email Address"
                type="email"
                value={formData.email}
                onChange={(value) => setFormData({ ...formData, email: value })}
                error={errors.email}
                required
                helperText="We'll never share your email"
                aria-label="Enter your email address"
              />

              <Checkbox
                id="agree-terms"
                label="I agree to the terms and conditions"
                checked={agreed}
                onChange={setAgreed}
              />

              {errors.agreed && (
                <p style={{ color: '#EF4444', marginTop: '8px' }}>
                  {errors.agreed}
                </p>
              )}
            </>
          )}

          {step === 2 && (
            <p>Step 2 content here...</p>
          )}

          {step === 3 && (
            <p>Step 3 content here...</p>
          )}

          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: '24px'
          }}>
            <Button
              variant="secondary"
              size="large"
              onClick={handleBack}
              disabled={step === 1}
              aria-label="Go to previous step"
            >
              Back
            </Button>

            <Button
              variant="primary"
              size="large"
              onClick={handleNext}
              disabled={step === totalSteps}
              aria-label="Continue to next step"
            >
              Next
            </Button>
          </div>
        </Card>
      </PageTransition>
    </div>
  );
};
```

---

## Development Workflow

### 1. Start Development Server

```bash
npm run dev
```

Visit: `http://localhost:5173`

### 2. Type Check

```bash
npm run type-check
```

Should show **0 errors** if everything is set up correctly.

### 3. Lint Code

```bash
npm run lint
```

Should show **0 warnings**.

### 4. Build for Production

```bash
npm run build
```

Should complete without errors.

---

## Accessibility Testing

### Install axe DevTools

1. Install Chrome extension: [axe DevTools](https://chrome.google.com/webstore)
2. Open DevTools (F12)
3. Go to "axe DevTools" tab
4. Click "Scan ALL of my page"

**Expected Result:** 0 violations

### Keyboard Testing Checklist

Test each page with keyboard only (no mouse):

- [ ] Tab navigates through all interactive elements
- [ ] Focus indicator visible on all elements
- [ ] Enter/Space activates buttons
- [ ] Space toggles checkboxes
- [ ] No keyboard traps
- [ ] Logical tab order (top to bottom, left to right)

### Screen Reader Testing

**Mac (VoiceOver):**
```bash
Cmd + F5 to toggle VoiceOver
```

**Windows (NVDA):**
Download from: https://www.nvaccess.org/download/

**Test:**
- [ ] All buttons announced with labels
- [ ] All form fields announced with labels
- [ ] Error messages announced
- [ ] Progress bar updates announced
- [ ] Checkbox states announced

---

## Performance Testing

### Bundle Size Check

```bash
npm run build
```

Check `dist/` folder for bundle sizes:

```bash
ls -lh dist/assets/
```

**Expected:**
- Total JavaScript: < 200KB gzipped
- Component library: ~14KB gzipped

### Lighthouse Audit

1. Open Chrome DevTools
2. Go to "Lighthouse" tab
3. Select "Desktop" and click "Generate report"

**Target Scores:**
- Performance: > 90
- Accessibility: 100
- Best Practices: 100
- SEO: > 90

---

## Troubleshooting Commands

### Clear Cache & Rebuild

```bash
rm -rf node_modules
rm -rf dist
rm package-lock.json
npm install
npm run build
```

### Check for Missing Dependencies

```bash
npm ls
```

Look for `UNMET DEPENDENCY` warnings.

### Verify TypeScript Config

```bash
cat tsconfig.json
```

Ensure `strict: true` is set.

### Check for CSS Module Support

```bash
cat vite.config.ts | grep -A 5 "css:"
```

---

## Next Steps

Once setup is complete:

1. ✅ **Test all components** using ComponentExample.tsx
2. ✅ **Run accessibility audit** with axe DevTools
3. ✅ **Test keyboard navigation** on all pages
4. ✅ **Verify responsive design** at 320px, 768px, 1440px
5. ✅ **Check animations** are smooth at 60fps
6. ✅ **Test reduced motion** mode in browser settings

---

## Getting Help

### Documentation Files

- **COMPONENT_LIBRARY.md** - Complete component documentation
- **COMPONENT_LIBRARY_SUMMARY.md** - Implementation details
- **COMPONENT_VISUAL_GUIDE.md** - Visual reference guide
- **COMPONENT_SETUP.md** - This file

### Code Examples

- **ComponentExample.tsx** - All components in action
- **theme.js** - Design system reference

### Common Questions

**Q: Can I customize the colors?**
A: Yes! Edit `src/styles/theme.js` and update the color values.

**Q: Can I add new variants?**
A: Yes! Add new types to the component's type unions and add corresponding CSS classes.

**Q: How do I disable animations?**
A: Set `prefers-reduced-motion` in your OS accessibility settings. Components will automatically respect it.

**Q: Can I use these components outside React Router?**
A: Yes! All components work standalone. PageTransition just needs a `transitionKey` prop.

---

## Support Checklist

Before asking for help, verify:

- [ ] Framer Motion installed (`npm list framer-motion`)
- [ ] No TypeScript errors (`npm run type-check`)
- [ ] No lint errors (`npm run lint`)
- [ ] Dev server running (`npm run dev`)
- [ ] Browser console shows no errors (F12)
- [ ] All component files present in `src/components/common/`
- [ ] Theme file present at `src/styles/theme.js`

---

## Quick Command Reference

```bash
# Install dependencies
npm install framer-motion

# Start dev server
npm run dev

# Type check
npm run type-check

# Lint code
npm run lint

# Build for production
npm run build

# Preview production build
npm run preview

# List all dependencies
npm ls

# Check specific dependency
npm list framer-motion

# Clear cache and reinstall
rm -rf node_modules && npm install
```

---

## Success Indicators

Your setup is complete when:

✅ Dev server runs without errors
✅ TypeScript compilation succeeds (0 errors)
✅ ESLint shows 0 warnings
✅ All components render in ComponentExample
✅ Animations are smooth
✅ Keyboard navigation works
✅ axe DevTools shows 0 violations
✅ Production build completes successfully

---

**Setup complete!** You're ready to use the component library.

Refer to **COMPONENT_LIBRARY.md** for detailed usage documentation.

---

*Setup Guide v1.0 - October 24, 2025*
