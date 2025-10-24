# Testing Documentation

Comprehensive testing suite for the Chronic Pain Assessment Application with integration tests and E2E scenarios.

## Table of Contents

- [Overview](#overview)
- [Test Structure](#test-structure)
- [Installation](#installation)
- [Running Tests](#running-tests)
- [Test Coverage](#test-coverage)
- [Writing Tests](#writing-tests)
- [CI/CD Integration](#cicd-integration)

## Overview

This project uses a multi-layered testing strategy:

1. **Integration Tests** - Test user workflows with real components (Vitest + React Testing Library)
2. **E2E Tests** - Full browser testing of complete user journeys (Playwright)

### Testing Stack

- **Vitest** - Fast unit/integration test runner
- **React Testing Library** - Component testing utilities
- **Playwright** - Cross-browser E2E testing
- **@testing-library/jest-dom** - Custom matchers for assertions
- **@testing-library/user-event** - Advanced user interaction simulation

## Test Structure

```
├── src/__tests__/
│   ├── setup.ts                                    # Test configuration
│   ├── testUtils.ts                                # Shared test utilities
│   ├── assessment-flow.integration.test.ts         # Assessment flow tests
│   ├── form-validation.integration.test.ts         # Form validation tests
│   ├── api-integration.integration.test.ts         # API integration tests
│   └── state-management.integration.test.ts        # State management tests
├── e2e/
│   └── assessment.e2e.test.ts                      # End-to-end scenarios
├── vitest.config.ts                                # Vitest configuration
└── playwright.config.ts                            # Playwright configuration
```

## Installation

### Install Test Dependencies

The project should already have testing dependencies installed. If not:

```bash
# Install all dependencies
npm install

# Or install test-specific packages
npm install -D vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom @vitest/ui happy-dom

# Install Playwright for E2E tests
npm install -D @playwright/test
npx playwright install
```

## Running Tests

### Integration Tests (Vitest)

```bash
# Run all tests in watch mode
npm test

# Run tests once
npm run test:run

# Run with UI
npm run test:ui

# Run with coverage
npm run test:coverage

# Run only integration tests
npm run test:integration

# Watch mode
npm run test:watch
```

### E2E Tests (Playwright)

```bash
# Run all E2E tests
npm run test:e2e

# Run with UI mode
npm run test:e2e:ui

# Run in headed mode (see browser)
npm run test:e2e:headed

# Debug mode
npm run test:e2e:debug

# Run specific test file
npx playwright test e2e/assessment.e2e.test.ts

# Run specific test by name
npx playwright test -g "should complete full assessment"
```

### Run All Tests

```bash
# Run integration tests + E2E tests
npm run test:all
```

## Test Coverage

### Coverage Requirements

The project enforces the following coverage thresholds:

- **Statements**: 80%
- **Branches**: 80%
- **Functions**: 80%
- **Lines**: 80%

### View Coverage Report

```bash
# Generate coverage report
npm run test:coverage

# Open HTML report
open coverage/index.html
```

## Writing Tests

### Integration Test Example

```typescript
import { describe, it, expect, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from './testUtils';
import MyComponent from '../components/MyComponent';

describe('MyComponent', () => {
  beforeEach(() => {
    // Setup before each test
  });

  it('should handle user interaction', async () => {
    const user = userEvent.setup();
    renderWithProviders(<MyComponent />);

    const button = await screen.findByRole('button', { name: /click me/i });
    await user.click(button);

    await waitFor(() => {
      expect(screen.getByText(/success/i)).toBeInTheDocument();
    });
  });
});
```

### E2E Test Example

```typescript
import { test, expect } from '@playwright/test';

test('user completes assessment', async ({ page }) => {
  await page.goto('/');

  await page.getByRole('button', { name: /start/i }).click();

  await expect(page).toHaveURL(/cellular-science/);
});
```

## Test Files

### 1. Assessment Flow Integration Tests

**File**: `src/__tests__/assessment-flow.integration.test.ts`

Tests complete user journeys through the assessment:

- ✅ Happy path: Landing → Cellular Science → Condition → Treatment → Results
- ✅ Disqualification path: Non-treatable conditions → Waiting list
- ✅ Budget routing: $0-3K → Page 6B, >$3K → Skip to Page 7
- ✅ Lead capture: Form submission → Success
- ✅ Navigation: Back/forward buttons work correctly
- ✅ Progress tracking: Progress indicator updates
- ✅ Error handling: Network errors, retry logic

### 2. Form Validation Integration Tests

**File**: `src/__tests__/form-validation.integration.test.ts`

Tests form validation behavior:

- ✅ Email validation: Invalid format → Error → Corrected → Error clears
- ✅ Required fields: Empty → Error → Filled → Error clears
- ✅ Input sanitization: XSS attempts blocked
- ✅ Phone validation: Format checking
- ✅ Name validation: Length constraints
- ✅ Real-time validation: Blur and change events
- ✅ Multiple selections: Minimum condition checks
- ✅ Accessibility: ARIA attributes set correctly

### 3. API Integration Tests

**File**: `src/__tests__/api-integration.integration.test.ts`

Tests API interactions:

- ✅ CSRF token: Fetched on startup, included in requests
- ✅ HTTP 401: Token refresh → Retry
- ✅ HTTP 429: Rate limit message
- ✅ HTTP 500: Server error handling
- ✅ HTTP 400: Validation errors displayed
- ✅ Network timeout: Retry with backoff
- ✅ Successful submission: Redirect to success page
- ✅ Request payload: Correct data format
- ✅ Loading states: Show during API call

### 4. State Management Integration Tests

**File**: `src/__tests__/state-management.integration.test.ts`

Tests state management:

- ✅ Context provider: State accessible to components
- ✅ State updates: Response data updates correctly
- ✅ Page navigation: Next/prev page logic
- ✅ Qualification status: Qualify/disqualify actions
- ✅ Assessment reset: Returns to initial state
- ✅ State persistence: Maintains data across pages
- ✅ Back button: Works correctly
- ✅ Forward button: Respects validation
- ✅ Results generation: Based on assessment state

### 5. E2E Test Scenarios

**File**: `e2e/assessment.e2e.test.ts`

Full browser testing:

- ✅ Complete flow: User completes entire assessment
- ✅ Disqualification: User gets disqualified and sees appropriate page
- ✅ Lead form: User fills form and gets confirmation
- ✅ Mobile viewport: Responsive design works
- ✅ Keyboard navigation: All elements reachable
- ✅ Error handling: Network errors handled gracefully
- ✅ Accessibility: ARIA labels, color contrast
- ✅ Performance: Page load times < 3 seconds

## Test Utilities

### `renderWithProviders()`

Renders components with all necessary providers:

```typescript
import { renderWithProviders } from './testUtils';

renderWithProviders(<MyComponent />, {
  initialState: { /* custom state */ },
  route: '/custom-route',
});
```

### Mock Data Creators

```typescript
import {
  createMockAssessmentResponse,
  createMockAssessmentState,
  createMockPersonalizationResult,
} from './testUtils';

const mockResponse = createMockAssessmentResponse({
  conditionType: 'arthritis',
  painLevel: 7,
});
```

### Mock API Responses

```typescript
import { mockApiResponses } from './testUtils';

global.fetch = vi.fn(() =>
  Promise.resolve({
    ok: true,
    json: async () => mockApiResponses.submitSuccess,
  })
);
```

### Assertion Helpers

```typescript
import { assertions } from './testUtils';

assertions.hasText(element, 'Expected text');
assertions.isVisible(element);
assertions.hasError(container, 'email');
assertions.navigationOccurred('/results');
```

## Best Practices

### 1. Test User Workflows, Not Implementation

```typescript
// ❌ Bad - Testing implementation
expect(component.state.count).toBe(1);

// ✅ Good - Testing user behavior
await user.click(button);
expect(screen.getByText(/count: 1/i)).toBeInTheDocument();
```

### 2. Use Semantic Queries

```typescript
// ❌ Bad
screen.getByTestId('submit-button');

// ✅ Good
screen.getByRole('button', { name: /submit/i });
```

### 3. Wait for Asynchronous Changes

```typescript
// ❌ Bad
await user.click(button);
expect(screen.getByText(/success/i)).toBeInTheDocument();

// ✅ Good
await user.click(button);
await waitFor(() => {
  expect(screen.getByText(/success/i)).toBeInTheDocument();
});
```

### 4. Clean Test Data

```typescript
beforeEach(() => {
  // Clear mocks and storage before each test
  vi.clearAllMocks();
  localStorage.clear();
  sessionStorage.clear();
});
```

### 5. Test Isolation

Each test should be independent and not rely on other tests.

```typescript
// ❌ Bad - Tests depend on execution order
it('test 1', () => {
  globalState.user = 'John';
});

it('test 2', () => {
  expect(globalState.user).toBe('John'); // Breaks if run alone
});

// ✅ Good - Each test is self-contained
it('test 1', () => {
  const user = 'John';
  expect(user).toBe('John');
});

it('test 2', () => {
  const user = 'John';
  expect(user).toBe('John');
});
```

## CI/CD Integration

### GitHub Actions Example

```yaml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm ci

      - name: Run integration tests
        run: npm run test:run

      - name: Run E2E tests
        run: npm run test:e2e

      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/coverage-final.json
```

## Debugging Tests

### Vitest Debugging

```bash
# Use --inspect flag
node --inspect-brk ./node_modules/.bin/vitest

# Or use VS Code debugger with launch.json:
{
  "type": "node",
  "request": "launch",
  "name": "Debug Vitest Tests",
  "runtimeExecutable": "npm",
  "runtimeArgs": ["run", "test"],
  "console": "integratedTerminal"
}
```

### Playwright Debugging

```bash
# Debug mode with Playwright Inspector
npm run test:e2e:debug

# Run with headed browser
npm run test:e2e:headed

# Use VS Code extension
# Install: Playwright Test for VSCode
```

## Troubleshooting

### Common Issues

**Tests timeout**
```bash
# Increase timeout in vitest.config.ts
test: {
  testTimeout: 30000,
}
```

**Import errors**
```bash
# Check path aliases in vitest.config.ts
resolve: {
  alias: {
    '@': path.resolve(__dirname, './src'),
  }
}
```

**Playwright browser not found**
```bash
npx playwright install
```

## Performance

### Test Execution Speed

- Integration tests: < 100ms per test
- E2E tests: < 5 seconds per test
- Total suite: < 2 minutes

### Optimization Tips

1. **Use `happy-dom` instead of `jsdom`** for faster tests
2. **Parallelize tests** - Vitest runs tests in parallel by default
3. **Mock expensive operations** - API calls, complex calculations
4. **Use `screen.getByRole()`** - Faster than other queries
5. **Avoid unnecessary waits** - Only wait when needed

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/react)
- [Playwright Documentation](https://playwright.dev/)
- [Testing Library Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

## License

UNLICENSED - Primary Cell Assessment Application
