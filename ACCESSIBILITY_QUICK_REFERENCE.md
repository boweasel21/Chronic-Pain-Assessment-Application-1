# Accessibility Quick Reference Card

## Import Statements

```typescript
// Hooks
import {
  usePrefersReducedMotion,
  usePageFocus,
  useAnnounce,
  useSkipLink
} from '@hooks/useAccessibility';

// Components
import {
  MainContent,
  LiveRegion,
  AlertLiveRegion,
  PageContainer
} from '@components/common';
```

## Common Patterns

### 1. New Page Component
```typescript
import { PageContainer } from '@components/common';

const MyPage = () => (
  <PageContainer>
    <h1>Page Title</h1>
    {content}
  </PageContainer>
);
```

### 2. Animated Component
```typescript
const prefersReducedMotion = usePrefersReducedMotion();

const props = prefersReducedMotion ? {} : {
  whileHover: { scale: 1.02 },
  transition: { duration: 0.3 }
};

<motion.div {...props}>{content}</motion.div>
```

### 3. Form Validation
```typescript
const [error, setError] = useState('');
const announce = useAnnounce();

const validate = () => {
  if (!valid) {
    setError('Error message');
    announce('Error message', { priority: 'assertive' });
  }
};

<LiveRegion message={error} priority="assertive" />
```

### 4. Loading States
```typescript
const announce = useAnnounce();

const loadData = async () => {
  announce('Loading data...');
  await fetch();
  announce('Data loaded successfully');
};
```

## Hook Usage

| Hook | Returns | Usage |
|------|---------|-------|
| `usePrefersReducedMotion()` | `boolean` | Check before animations |
| `usePageFocus(id?)` | `void` | Call in page components |
| `useAnnounce()` | `function` | Get announcement function |
| `useSkipLink()` | `void` | Call in layout |

## Component Props

### LiveRegion
```typescript
<LiveRegion
  message="Status message"
  priority="polite" // or "assertive"
  clearDelay={5000}
  onClear={() => {}}
/>
```

### MainContent
```typescript
<MainContent
  id="main-content"
  aria-label="Main content"
  className="custom-class"
>
  {children}
</MainContent>
```

### PageContainer
```typescript
<PageContainer
  id="main-content" // optional
  aria-label="Page content" // optional
>
  {children}
</PageContainer>
```

## Animation Examples

### Reduce Motion Variants
```typescript
const prefersReducedMotion = usePrefersReducedMotion();

const variants = prefersReducedMotion
  ? {
      hidden: { opacity: 0 },
      visible: { opacity: 1, transition: { duration: 0.01 } }
    }
  : {
      hidden: { opacity: 0, y: 20 },
      visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
    };
```

### Conditional Props
```typescript
const prefersReducedMotion = usePrefersReducedMotion();

<motion.div
  {...(prefersReducedMotion ? {} : {
    whileHover: { scale: 1.05 },
    whileTap: { scale: 0.95 }
  })}
>
  {content}
</motion.div>
```

## Announcement Patterns

### Success
```typescript
announce('Form submitted successfully!', { priority: 'polite' });
```

### Error
```typescript
announce('Error: Please try again', { priority: 'assertive' });
```

### Loading
```typescript
announce('Loading...', { priority: 'polite' });
```

### Results Count
```typescript
announce(`Found ${count} results`, { priority: 'polite' });
```

## Testing Checklist

- [ ] Tab through entire page
- [ ] Verify focus visible on all interactive elements
- [ ] Test with screen reader
- [ ] Enable reduced motion in OS settings
- [ ] Verify all animations disabled/reduced
- [ ] Check skip links work (Tab on page load)
- [ ] Verify all form errors announced
- [ ] Test keyboard shortcuts work

## Common Issues & Solutions

### Issue: Focus not moving on navigation
**Solution**: Add `usePageFocus()` to page component

### Issue: Animations still playing with reduced motion
**Solution**: Check `usePrefersReducedMotion()` is being used

### Issue: Screen reader not announcing changes
**Solution**: Add `LiveRegion` or use `useAnnounce()`

### Issue: Can't tab to element
**Solution**: Add `tabIndex={0}` or use button/link

### Issue: Focus indicator not visible
**Solution**: Check CSS, ensure outline is not removed

## Browser DevTools

### Test Reduced Motion
```javascript
// Chrome/Edge Console
matchMedia('(prefers-reduced-motion: reduce)').matches
```

### Accessibility Tree
- Chrome: DevTools → Elements → Accessibility
- Firefox: DevTools → Accessibility

### Keyboard Shortcuts
- Tab: Next focusable element
- Shift+Tab: Previous focusable element
- Enter/Space: Activate element
- Esc: Close modal/dialog

## ARIA Quick Reference

```html
<!-- Labels -->
<button aria-label="Close dialog">×</button>
<div aria-labelledby="heading-id">...</div>

<!-- States -->
<button aria-pressed="true">Toggle</button>
<button aria-expanded="false">Expand</button>
<div aria-busy="true">Loading...</div>

<!-- Form -->
<input aria-invalid="true" />
<input aria-required="true" />
<input aria-describedby="error-id" />

<!-- Live Regions -->
<div aria-live="polite">Status</div>
<div aria-live="assertive">Error</div>
<div role="alert">Alert!</div>
<div role="status">Loading...</div>

<!-- Landmarks -->
<main role="main">
<nav role="navigation">
<header role="banner">
<footer role="contentinfo">
```

## Resources

- [WCAG Quick Reference](https://www.w3.org/WAI/WCAG21/quickref/)
- [ARIA Patterns](https://www.w3.org/WAI/ARIA/apg/)
- [WebAIM](https://webaim.org/)

## Need Help?

1. Check `/ACCESSIBILITY.md` - Main guide
2. Check `/src/hooks/USAGE_EXAMPLES.md` - Code examples
3. Check component JSDoc comments
4. Test with actual screen reader
5. Consult WCAG guidelines
