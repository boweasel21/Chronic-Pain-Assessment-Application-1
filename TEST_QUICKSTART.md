# Testing Quick Start Guide

Quick reference for running tests in the Chronic Pain Assessment Application.

## Installation

```bash
# Install all dependencies (first time only)
npm install

# Install Playwright browsers (for E2E tests)
npx playwright install
```

## Run Tests

### Quick Commands

```bash
# Run all integration tests
npm test

# Run all E2E tests
npm run test:e2e

# Run everything (integration + E2E)
npm run test:all

# Run with coverage report
npm run test:coverage
```

### Development Workflow

```bash
# Watch mode (auto-rerun on file changes)
npm run test:watch

# UI mode (interactive testing)
npm run test:ui

# E2E with UI
npm run test:e2e:ui
```

### Debug Mode

```bash
# Debug integration tests
npm run test:ui

# Debug E2E tests
npm run test:e2e:debug

# Run E2E with visible browser
npm run test:e2e:headed
```

## Test Files

- `src/__tests__/assessment-flow.integration.test.ts` - Assessment user flows
- `src/__tests__/form-validation.integration.test.ts` - Form validation
- `src/__tests__/api-integration.integration.test.ts` - API interactions
- `src/__tests__/state-management.integration.test.ts` - State management
- `e2e/assessment.e2e.test.ts` - End-to-end scenarios

## What Each Test Suite Covers

### Assessment Flow
- Complete user journey from landing to results
- Disqualification paths
- Budget routing logic
- Navigation and progress tracking

### Form Validation
- Email, phone, name validation
- XSS and SQL injection prevention
- Real-time error display and clearing
- Accessibility (ARIA attributes)

### API Integration
- CSRF token management
- HTTP status code handling (401, 429, 500)
- Network timeouts and retries
- Loading states

### State Management
- Context provider functionality
- Page navigation
- State persistence
- Qualification status updates

### E2E Tests
- Full browser testing
- Mobile responsive design
- Keyboard navigation
- Cross-browser compatibility

## Coverage Report

```bash
# Generate and view coverage
npm run test:coverage
open coverage/index.html
```

## CI/CD

Add to your CI pipeline:

```yaml
- name: Run Tests
  run: npm run test:all

- name: Check Coverage
  run: npm run test:coverage
```

## Coverage Requirements

All metrics must be ≥80%:
- Statements: 80%
- Branches: 80%
- Functions: 80%
- Lines: 80%

## Troubleshooting

### Tests failing to run

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Playwright browser not found

```bash
npx playwright install
```

### Import errors

Check that `vitest.config.ts` has correct path aliases.

### Timeout errors

Increase timeout in test file:
```typescript
test('my test', async () => {
  // ...
}, 30000); // 30 second timeout
```

## Best Practices

1. **Run tests before committing**
   ```bash
   npm run test:run
   ```

2. **Check coverage regularly**
   ```bash
   npm run test:coverage
   ```

3. **Use watch mode during development**
   ```bash
   npm run test:watch
   ```

4. **Debug failing tests with UI**
   ```bash
   npm run test:ui
   npm run test:e2e:ui
   ```

## Performance

- Integration tests: < 100ms per test
- E2E tests: < 5s per test
- Total suite: < 2 minutes

## Documentation

- **Full Guide**: `TESTING.md`
- **Summary**: `TEST_SUMMARY.md`
- **This Guide**: `TEST_QUICKSTART.md`

## Support

For detailed information, see:
- [Vitest Docs](https://vitest.dev/)
- [Testing Library Docs](https://testing-library.com/)
- [Playwright Docs](https://playwright.dev/)
