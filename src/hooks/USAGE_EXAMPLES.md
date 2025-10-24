# Accessibility Hooks - Usage Examples

## Complete Usage Examples for All Scenarios

### 1. Basic Page with Focus Management

```typescript
import React from 'react';
import { usePageFocus } from '@hooks/useAccessibility';

const SimplePage: React.FC = () => {
  // Automatically focus main content on page load
  usePageFocus('main-content');

  return (
    <main id="main-content" tabIndex={-1} style={{ outline: 'none' }}>
      <h1>Welcome to Our Service</h1>
      <p>This page content will be focused automatically for screen readers.</p>
    </main>
  );
};

export default SimplePage;
```

### 2. Animated Component with Reduced Motion Support

```typescript
import React from 'react';
import { motion } from 'framer-motion';
import { usePrefersReducedMotion } from '@hooks/useAccessibility';

const AnimatedCard: React.FC = () => {
  const prefersReducedMotion = usePrefersReducedMotion();

  // Define different animation variants
  const cardVariants = prefersReducedMotion
    ? {
        // Reduced motion: instant, no movement
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 0.01 } }
      }
    : {
        // Full motion: slide and fade
        hidden: { opacity: 0, y: 20 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.5, ease: 'easeOut' }
        }
      };

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
    >
      <h2>Accessible Card</h2>
      <p>This card respects your motion preferences.</p>
    </motion.div>
  );
};

export default AnimatedCard;
```

### 3. Form with Live Validation Announcements

```typescript
import React, { useState } from 'react';
import { FormField } from '@components/common/FormField';
import { Button } from '@components/common/Button';
import { LiveRegion } from '@components/common/LiveRegion';
import { useAnnounce } from '@hooks/useAccessibility';

const ContactForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [emailError, setEmailError] = useState('');
  const [statusMessage, setStatusMessage] = useState('');

  const announce = useAnnounce();

  const validateEmail = (value: string) => {
    const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

    if (!isValid && value) {
      setEmailError('Please enter a valid email address');
      announce('Email validation error: Please enter a valid email address', {
        priority: 'assertive'
      });
    } else {
      setEmailError('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setStatusMessage('Submitting form...');
    announce('Submitting form, please wait');

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      setStatusMessage('Form submitted successfully! We will contact you soon.');
      announce('Success: Form submitted successfully', { priority: 'polite' });
    } catch (error) {
      setStatusMessage('Error submitting form. Please try again.');
      announce('Error: Form submission failed', { priority: 'assertive' });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <FormField
        label="Name"
        type="text"
        value={name}
        onChange={setName}
        required
        aria-label="Enter your full name"
      />

      <FormField
        label="Email Address"
        type="email"
        value={email}
        onChange={setEmail}
        error={emailError}
        onBlur={() => validateEmail(email)}
        required
        aria-label="Enter your email address"
        helperText="We'll never share your email"
      />

      <Button
        type="submit"
        variant="primary"
        aria-label="Submit contact form"
      >
        Submit
      </Button>

      {/* Screen reader announcements */}
      <LiveRegion
        message={statusMessage}
        priority="polite"
        clearDelay={5000}
      />
    </form>
  );
};

export default ContactForm;
```

### 4. Search Component with Results Announcements

```typescript
import React, { useState, useEffect } from 'react';
import { useAnnounce } from '@hooks/useAccessibility';

interface SearchResult {
  id: string;
  title: string;
  description: string;
}

const SearchComponent: React.FC = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const announce = useAnnounce();

  useEffect(() => {
    const searchResults = async () => {
      if (!query) {
        setResults([]);
        return;
      }

      setIsLoading(true);
      announce('Searching...', { priority: 'polite' });

      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        const mockResults: SearchResult[] = [
          { id: '1', title: 'Result 1', description: 'Description 1' },
          { id: '2', title: 'Result 2', description: 'Description 2' }
        ];

        setResults(mockResults);

        // Announce results to screen reader
        if (mockResults.length > 0) {
          announce(
            `Found ${mockResults.length} result${mockResults.length > 1 ? 's' : ''}`,
            { priority: 'polite', timeout: 3000 }
          );
        } else {
          announce('No results found', { priority: 'polite', timeout: 3000 });
        }
      } catch (error) {
        announce('Error searching. Please try again.', { priority: 'assertive' });
      } finally {
        setIsLoading(false);
      }
    };

    const timeoutId = setTimeout(searchResults, 300); // Debounce
    return () => clearTimeout(timeoutId);
  }, [query, announce]);

  return (
    <div>
      <label htmlFor="search-input">Search</label>
      <input
        id="search-input"
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        aria-label="Search for content"
        aria-describedby="search-results-count"
      />

      <div
        id="search-results-count"
        className="sr-only"
        aria-live="polite"
        aria-atomic="true"
      >
        {results.length > 0
          ? `${results.length} results found`
          : query ? 'No results found' : ''
        }
      </div>

      {isLoading && (
        <div role="status" aria-live="polite">
          Loading results...
        </div>
      )}

      <ul aria-label="Search results">
        {results.map(result => (
          <li key={result.id}>
            <h3>{result.title}</h3>
            <p>{result.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SearchComponent;
```

### 5. Complete Page Component Example

```typescript
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  usePageFocus,
  usePrefersReducedMotion,
  useAnnounce
} from '@hooks/useAccessibility';
import { Button } from '@components/common/Button';
import { LiveRegion } from '@components/common/LiveRegion';

const AssessmentPage: React.FC = () => {
  const navigate = useNavigate();
  const [answer, setAnswer] = useState<string | null>(null);
  const [liveMessage, setLiveMessage] = useState('');

  // Accessibility hooks
  usePageFocus('assessment-main');
  const prefersReducedMotion = usePrefersReducedMotion();
  const announce = useAnnounce();

  const handleAnswer = (value: string) => {
    setAnswer(value);

    // Announce selection to screen readers
    announce(`Selected: ${value}`, { priority: 'polite' });
    setLiveMessage(`You selected: ${value}`);
  };

  const handleNext = () => {
    if (!answer) {
      announce('Please select an answer before continuing', {
        priority: 'assertive'
      });
      setLiveMessage('Error: Please select an answer');
      return;
    }

    announce('Moving to next question', { priority: 'polite' });
    navigate('/next-page');
  };

  // Animation variants that respect motion preferences
  const containerVariants = prefersReducedMotion
    ? { hidden: { opacity: 0 }, visible: { opacity: 1 } }
    : {
        hidden: { opacity: 0, y: 20 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.5 }
        }
      };

  return (
    <motion.main
      id="assessment-main"
      tabIndex={-1}
      style={{ outline: 'none' }}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <h1>Assessment Question</h1>

      <fieldset>
        <legend>How would you rate your pain?</legend>

        <div role="group" aria-label="Pain level options">
          {['Mild', 'Moderate', 'Severe'].map((level) => (
            <Button
              key={level}
              variant={answer === level ? 'primary' : 'secondary'}
              onClick={() => handleAnswer(level)}
              aria-label={`Select ${level} pain level`}
              aria-pressed={answer === level}
            >
              {level}
            </Button>
          ))}
        </div>
      </fieldset>

      <Button
        variant="primary"
        onClick={handleNext}
        aria-label="Continue to next question"
      >
        Next
      </Button>

      {/* Live region for announcements */}
      <LiveRegion
        message={liveMessage}
        priority="polite"
        clearDelay={3000}
        onClear={() => setLiveMessage('')}
      />
    </motion.main>
  );
};

export default AssessmentPage;
```

### 6. Custom Hook Integration

```typescript
import React from 'react';
import { usePrefersReducedMotion } from '@hooks/useAccessibility';

// Custom hook that uses accessibility hooks
const useAnimationConfig = () => {
  const prefersReducedMotion = usePrefersReducedMotion();

  return {
    duration: prefersReducedMotion ? 0.01 : 0.3,
    ease: prefersReducedMotion ? 'linear' : 'easeOut',
    shouldAnimate: !prefersReducedMotion
  };
};

const AnimatedList: React.FC = () => {
  const animationConfig = useAnimationConfig();

  return (
    <ul>
      {items.map((item, index) => (
        <motion.li
          key={item.id}
          initial={{ opacity: 0, x: animationConfig.shouldAnimate ? -20 : 0 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{
            duration: animationConfig.duration,
            ease: animationConfig.ease,
            delay: animationConfig.shouldAnimate ? index * 0.1 : 0
          }}
        >
          {item.text}
        </motion.li>
      ))}
    </ul>
  );
};
```

### 7. Alert Dialog with Announcements

```typescript
import React, { useEffect } from 'react';
import { AlertLiveRegion } from '@components/common/LiveRegion';
import { useAnnounce } from '@hooks/useAccessibility';

interface AlertDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  onClose: () => void;
}

const AlertDialog: React.FC<AlertDialogProps> = ({
  isOpen,
  title,
  message,
  onClose
}) => {
  const announce = useAnnounce();

  useEffect(() => {
    if (isOpen) {
      // Announce dialog opening
      announce(`Alert: ${title}`, { priority: 'assertive' });
    }
  }, [isOpen, title, announce]);

  if (!isOpen) return null;

  return (
    <div
      role="alertdialog"
      aria-labelledby="dialog-title"
      aria-describedby="dialog-message"
      aria-modal="true"
    >
      <h2 id="dialog-title">{title}</h2>
      <p id="dialog-message">{message}</p>

      <button
        onClick={onClose}
        aria-label="Close alert dialog"
      >
        OK
      </button>

      <AlertLiveRegion message={isOpen ? title : ''} />
    </div>
  );
};

export default AlertDialog;
```

## Testing Your Implementation

### Manual Testing Checklist

```typescript
// 1. Test keyboard navigation
// - Tab through all interactive elements
// - Use Enter/Space to activate buttons
// - Ensure focus is visible

// 2. Test with screen reader
// - NVDA (Windows): https://www.nvaccess.org/
// - JAWS (Windows): https://www.freedomscientific.com/
// - VoiceOver (Mac): Cmd + F5

// 3. Test reduced motion
// Enable in system settings, then verify:
const TestReducedMotion: React.FC = () => {
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    console.log('Reduced motion enabled:', prefersReducedMotion);
  }, [prefersReducedMotion]);

  return (
    <div>
      <p>Reduced motion: {prefersReducedMotion ? 'Yes' : 'No'}</p>
    </div>
  );
};
```

## Common Patterns

### Pattern 1: Loading States

```typescript
const LoadingExample: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const announce = useAnnounce();

  const handleLoad = async () => {
    setIsLoading(true);
    announce('Loading data...', { priority: 'polite' });

    try {
      await fetchData();
      announce('Data loaded successfully', { priority: 'polite' });
    } catch (error) {
      announce('Error loading data', { priority: 'assertive' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <button onClick={handleLoad} aria-busy={isLoading}>
        {isLoading ? 'Loading...' : 'Load Data'}
      </button>
    </div>
  );
};
```

### Pattern 2: Conditional Rendering with Announcements

```typescript
const ConditionalContent: React.FC = () => {
  const [showContent, setShowContent] = useState(false);
  const announce = useAnnounce();

  const toggleContent = () => {
    setShowContent(!showContent);
    announce(
      showContent ? 'Content hidden' : 'Content shown',
      { priority: 'polite' }
    );
  };

  return (
    <div>
      <button
        onClick={toggleContent}
        aria-expanded={showContent}
        aria-controls="expandable-content"
      >
        {showContent ? 'Hide' : 'Show'} Content
      </button>

      {showContent && (
        <div id="expandable-content">
          <p>This content is now visible</p>
        </div>
      )}
    </div>
  );
};
```

## Remember

1. **Always test with real assistive technology**
2. **Use semantic HTML first, ARIA second**
3. **Respect user preferences (reduced motion, high contrast, etc.)**
4. **Provide multiple ways to accomplish tasks**
5. **Keep announcements concise and meaningful**
6. **Test keyboard navigation thoroughly**
7. **Maintain focus visibility**
8. **Associate labels with form controls**
