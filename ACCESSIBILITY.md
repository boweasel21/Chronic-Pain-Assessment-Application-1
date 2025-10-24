# Accessibility Implementation Guide

## Overview

This application implements comprehensive accessibility features to ensure WCAG 2.1 Level AA compliance and provide an excellent experience for all users, including those using assistive technologies.

## Key Accessibility Features

### 1. Focus Management

**Problem**: In single-page applications, when users navigate between pages, keyboard focus doesn't automatically move to the new content, forcing screen reader and keyboard users to tab through the entire navigation again.

**Solution**: Automatic focus management using `usePageFocus()` hook.

#### Implementation

```typescript
// In any page component
import { usePageFocus } from '@hooks/useAccessibility';

const MyPage: React.FC = () => {
  // Automatically focuses main content on mount
  usePageFocus('main-content');

  return (
    <main id="main-content" tabIndex={-1} style={{ outline: 'none' }}>
      <h1>Page Title</h1>
      {/* content */}
    </main>
  );
};
```

#### Or use PageContainer component

```typescript
import { PageContainer } from '@components/common/PageContainer';

const MyPage: React.FC = () => {
  return (
    <PageContainer>
      <h1>Page Title</h1>
      {/* content */}
    </PageContainer>
  );
};
```

### 2. Prefers-Reduced-Motion Support

**Problem**: Animations can cause discomfort, nausea, or disorientation for users with vestibular disorders, motion sensitivity, or those who simply prefer less motion.

**Solution**: All animations respect the `prefers-reduced-motion` CSS media query.

#### Implementation

```typescript
// In components with animations
import { usePrefersReducedMotion } from '@hooks/useAccessibility';

const AnimatedComponent = () => {
  const prefersReducedMotion = usePrefersReducedMotion();

  const motionProps = prefersReducedMotion
    ? {} // No animations
    : {
        whileHover: { scale: 1.02 },
        transition: { duration: 0.3 }
      };

  return <motion.div {...motionProps}>Content</motion.div>;
};
```

#### Components with Built-in Support

- `Button` - Automatically disables scale animations
- `FormField` - Disables label float and border animations
- `PageTransition` - Uses instant fade instead of slide
- `LandingPage` - All entrance animations respect preference

### 3. Screen Reader Announcements

**Problem**: Dynamic content changes (like form validation, loading states, search results) aren't announced to screen reader users.

**Solution**: ARIA live regions for announcing dynamic updates.

#### Implementation

**Option A: Using LiveRegion Component**

```typescript
import { LiveRegion } from '@components/common/LiveRegion';

const FormComponent = () => {
  const [statusMessage, setStatusMessage] = useState('');

  const handleSubmit = async () => {
    setStatusMessage('Submitting form...');

    try {
      await submitForm();
      setStatusMessage('Form submitted successfully!');
    } catch (error) {
      setStatusMessage('Error submitting form. Please try again.');
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>...</form>
      <LiveRegion message={statusMessage} priority="polite" />
    </>
  );
};
```

**Option B: Using useAnnounce Hook**

```typescript
import { useAnnounce } from '@hooks/useAccessibility';

const SearchComponent = () => {
  const announce = useAnnounce();
  const [results, setResults] = useState([]);

  useEffect(() => {
    if (results.length > 0) {
      announce(`Found ${results.length} results`, { priority: 'polite' });
    } else {
      announce('No results found', { priority: 'polite' });
    }
  }, [results, announce]);

  return <div>...</div>;
};
```

#### Live Region Priorities

- **'polite'**: Waits for screen reader to finish current speech (default, use for most updates)
- **'assertive'**: Interrupts screen reader immediately (use sparingly for urgent updates)
- **'off'**: Disables announcements

### 4. Skip Links

**Problem**: Keyboard users have to tab through all navigation elements to reach main content on every page.

**Solution**: Skip links that allow jumping directly to main content.

#### Implementation

Skip links are automatically implemented in `AssessmentLayout`:

```typescript
// Already included in AssessmentLayout.tsx
<a href="#main-content" className="skip-link">
  Skip to main content
</a>
```

CSS for skip links (should be in global styles):

```css
.skip-link {
  position: absolute;
  top: -40px;
  left: 0;
  padding: 8px 16px;
  background-color: #1d2c49;
  color: white;
  text-decoration: none;
  z-index: 10000;
  font-weight: 600;
}

.skip-link:focus {
  top: 0;
}
```

### 5. Semantic HTML & ARIA Landmarks

All layout components use proper semantic HTML:

- `<main>` - Main content area
- `<header>` - Page header
- `<footer>` - Page footer
- `<nav>` - Navigation
- `role="banner"` - Hero sections
- `role="contentinfo"` - Footer information

### 6. Form Accessibility

The `FormField` component includes:

- Associated labels with unique IDs
- Error message association via `aria-describedby`
- Required field indication (`aria-required`)
- Invalid state indication (`aria-invalid`)
- Helper text association
- Focus visible indicators

```typescript
<FormField
  label="Email Address"
  type="email"
  value={email}
  onChange={setEmail}
  error={emailError}
  required
  aria-label="Enter your email address"
  helperText="We'll never share your email"
/>
```

## Testing Accessibility

### Keyboard Navigation

Test that you can:
1. Tab through all interactive elements
2. Use Enter/Space to activate buttons
3. Use arrow keys in custom components
4. See visible focus indicators
5. Access skip links (Tab on page load)

### Screen Reader Testing

**NVDA (Windows - Free)**: https://www.nvaccess.org/
**JAWS (Windows - Commercial)**: https://www.freedomscientific.com/
**VoiceOver (macOS - Built-in)**: Cmd + F5

Test that:
1. Page titles are announced on navigation
2. Form errors are announced
3. Dynamic content updates are announced
4. Landmarks are navigable (NVDA: D key, VO: Ctrl+U)
5. All interactive elements have labels

### Reduced Motion Testing

**Browser DevTools**:
```javascript
// Chrome/Edge DevTools Console
document.body.classList.add('reduce-motion');
```

**System Settings**:
- **Windows**: Settings → Ease of Access → Display → Show animations
- **macOS**: System Preferences → Accessibility → Display → Reduce motion
- **iOS/iPadOS**: Settings → Accessibility → Motion → Reduce Motion

### Automated Testing Tools

- **axe DevTools**: Browser extension for accessibility scanning
- **WAVE**: Web accessibility evaluation tool
- **Lighthouse**: Chrome DevTools accessibility audit
- **Pa11y**: Command-line accessibility testing

```bash
# Install Pa11y
npm install -g pa11y

# Test a page
pa11y http://localhost:5173
```

## Best Practices for Developers

### 1. Always Use Semantic HTML
```typescript
// Good
<button onClick={handleClick}>Click me</button>

// Bad
<div onClick={handleClick}>Click me</div>
```

### 2. Provide Text Alternatives
```typescript
// Images
<img src="chart.png" alt="Sales increased 50% in Q4" />

// Icon buttons
<button aria-label="Close modal">
  <XIcon aria-hidden="true" />
</button>
```

### 3. Maintain Color Contrast
- **Normal text**: 4.5:1 minimum
- **Large text**: 3:1 minimum
- **Interactive elements**: 3:1 minimum against background

### 4. Test Without Mouse
Try completing the entire flow using only keyboard.

### 5. Don't Rely on Color Alone
```typescript
// Good - Uses icon + color
<span className="error">
  <ErrorIcon /> Email is invalid
</span>

// Bad - Color only
<span style={{ color: 'red' }}>Email is invalid</span>
```

### 6. Provide Clear Focus Indicators
All interactive elements should have visible focus state (already implemented in components).

## Components Reference

### Accessibility Hooks

| Hook | Purpose | Usage |
|------|---------|-------|
| `usePrefersReducedMotion()` | Detects motion preference | Disable/reduce animations |
| `usePageFocus(id)` | Manages focus on navigation | Call in page components |
| `useAnnounce()` | Announces to screen readers | Dynamic content updates |
| `useSkipLink()` | Manages skip link behavior | Already in AssessmentLayout |

### Accessible Components

| Component | Accessibility Features |
|-----------|----------------------|
| `Button` | ARIA labels, disabled state, reduced motion |
| `FormField` | Labels, errors, required, invalid states |
| `LiveRegion` | Screen reader announcements |
| `MainContent` | Semantic main, focusable |
| `PageContainer` | Auto focus management |
| `AssessmentLayout` | Skip links, landmarks, live regions |

## WCAG 2.1 Level AA Compliance Checklist

- [x] **1.1.1** Non-text Content - All images have alt text
- [x] **1.3.1** Info and Relationships - Semantic HTML used
- [x] **1.4.3** Contrast - Minimum 4.5:1 for normal text
- [x] **2.1.1** Keyboard - All functionality available via keyboard
- [x] **2.1.2** No Keyboard Trap - Users can navigate away from all elements
- [x] **2.4.1** Bypass Blocks - Skip links implemented
- [x] **2.4.3** Focus Order - Logical tab order maintained
- [x] **2.4.7** Focus Visible - Clear focus indicators
- [x] **2.5.3** Label in Name - Labels match visible text
- [x] **3.2.4** Consistent Identification - Consistent component behavior
- [x] **3.3.1** Error Identification - Errors clearly identified
- [x] **3.3.2** Labels or Instructions - All inputs have labels
- [x] **4.1.2** Name, Role, Value - Proper ARIA attributes
- [x] **4.1.3** Status Messages - Live regions for dynamic content

## Resources

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)
- [WebAIM Articles](https://webaim.org/articles/)
- [A11y Project](https://www.a11yproject.com/)
- [MDN Accessibility](https://developer.mozilla.org/en-US/docs/Web/Accessibility)

## Support

For accessibility issues or questions, please:
1. Check this guide first
2. Review component documentation
3. Test with actual assistive technology
4. Consult WCAG guidelines
5. Open an issue with detailed reproduction steps
