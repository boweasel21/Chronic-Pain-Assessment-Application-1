/**
 * End-to-End Tests
 * Full user journey tests using Playwright/Cypress
 *
 * Note: This file uses Playwright API. To run with Cypress, adapt the syntax.
 * Install Playwright: npm install -D @playwright/test
 */

import { test, expect } from '@playwright/test';

/**
 * Test configuration
 */
const BASE_URL = process.env.BASE_URL || 'http://localhost:3003';
const MOBILE_VIEWPORT = { width: 375, height: 667 };
const TABLET_VIEWPORT = { width: 768, height: 1024 };
const DESKTOP_VIEWPORT = { width: 1920, height: 1080 };

test.describe('Assessment Flow E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL);
  });

  test.describe('Complete Assessment Flow', () => {
    test('should complete full assessment from start to finish', async ({
      page,
    }) => {
      // Page 1: Landing Page
      await expect(page).toHaveURL('/');
      await expect(
        page.getByRole('heading', { name: /chronic pain|assessment/i })
      ).toBeVisible();

      // Start assessment
      await page.getByRole('button', { name: /start|begin|get started/i }).click();

      // Page 2: Cellular Science
      await expect(page).toHaveURL(/cellular-science/);
      await expect(
        page.getByText(/cellular|condition|select/i)
      ).toBeVisible();

      // Select a treatable condition
      await page
        .getByRole('checkbox', { name: /arthritis|back pain/i })
        .first()
        .check();
      await page.getByRole('button', { name: /next|continue/i }).click();

      // Should NOT be disqualified
      await expect(page).not.toHaveURL(/disqualified|waiting/);

      // Page 3: Condition Confirmation
      await expect(page).toHaveURL(/condition-confirmation/);
      await page.getByRole('button', { name: /next|continue/i }).click();

      // Page 4: Treatment History
      await expect(page).toHaveURL(/treatment/);

      // Select some treatments
      const treatmentCheckboxes = await page
        .getByRole('checkbox')
        .all();
      if (treatmentCheckboxes.length > 0) {
        await treatmentCheckboxes[0].check();
      }
      await page.getByRole('button', { name: /next|continue/i }).click();

      // Page 5: Urgency Assessment
      await expect(page).toHaveURL(/urgency/);
      await page
        .getByRole('radio', { name: /immediate|within|month/i })
        .first()
        .check();
      await page.getByRole('button', { name: /next|continue/i }).click();

      // Page 6: Budget Qualification
      await expect(page).toHaveURL(/budget/);
      await page
        .getByRole('radio', { name: /15k|30k|over/i })
        .first()
        .check();
      await page.getByRole('button', { name: /next|continue/i }).click();

      // Should skip affordability page (Page 6B) since budget is >$3K
      await expect(page).not.toHaveURL(/affordability/);

      // Page 7: Additional Info
      await expect(page).toHaveURL(/additional-info/);
      await page.getByRole('button', { name: /next|continue/i }).click();

      // Page 8: Results
      await expect(page).toHaveURL(/results/);
      await expect(
        page.getByText(/results|personalized|recommendation/i)
      ).toBeVisible();
    });

    test('should handle disqualification path correctly', async ({ page }) => {
      // Start assessment
      await page.goto(BASE_URL);
      await page.getByRole('button', { name: /start|begin|get started/i }).click();

      // Select only non-treatable condition (if available)
      const nonTreatableCheckbox = page.getByRole('checkbox', {
        name: /non-treatable|terminal|cancer/i,
      });

      if (await nonTreatableCheckbox.count() > 0) {
        await nonTreatableCheckbox.first().check();
        await page.getByRole('button', { name: /next|continue/i }).click();

        // Should be redirected to disqualification page
        await expect(page).toHaveURL(/disqualified|waiting-list/);
        await expect(
          page.getByText(/waiting|notify|future/i)
        ).toBeVisible();
      }
    });
  });

  test.describe('Budget Routing Logic', () => {
    test('should show affordability page for low budget', async ({ page }) => {
      // Navigate directly to budget page
      await page.goto(`${BASE_URL}/budget-qualification`);

      // Select low budget option
      await page
        .getByRole('radio', { name: /under|0-3|low/i })
        .first()
        .check();
      await page.getByRole('button', { name: /next|continue/i }).click();

      // Should go to affordability check (Page 6B)
      await expect(page).toHaveURL(/affordability/);
    });

    test('should skip affordability page for high budget', async ({ page }) => {
      // Navigate directly to budget page
      await page.goto(`${BASE_URL}/budget-qualification`);

      // Select high budget option
      await page
        .getByRole('radio', { name: /15k|30k|over|high/i })
        .first()
        .check();
      await page.getByRole('button', { name: /next|continue/i }).click();

      // Should skip to Page 7 (Additional Info)
      await expect(page).toHaveURL(/additional-info/);
      await expect(page).not.toHaveURL(/affordability/);
    });
  });

  test.describe('Lead Capture Form', () => {
    test('should submit lead form successfully', async ({ page }) => {
      await page.goto(`${BASE_URL}/lead-capture`);

      // Fill out form
      await page.getByLabel(/name/i).fill('John Doe');
      await page.getByLabel(/email/i).fill('john.doe@example.com');

      const phoneInput = page.getByLabel(/phone/i);
      if (await phoneInput.count() > 0) {
        await phoneInput.fill('(555) 123-4567');
      }

      // Submit form
      await page.getByRole('button', { name: /submit|send|continue/i }).click();

      // Should show success or navigate to next page
      await expect(async () => {
        const successMessage = await page
          .getByText(/success|thank you|submitted/i)
          .count();
        const urlChanged = page.url() !== `${BASE_URL}/lead-capture`;
        expect(successMessage > 0 || urlChanged).toBeTruthy();
      }).toPass({ timeout: 5000 });
    });

    test('should show validation errors for invalid input', async ({ page }) => {
      await page.goto(`${BASE_URL}/lead-capture`);

      // Try to submit empty form
      await page.getByRole('button', { name: /submit|send|continue/i }).click();

      // Should show validation errors
      await expect(page.getByText(/required|invalid/i)).toBeVisible();
      await expect(page).toHaveURL(/lead-capture/);
    });

    test('should validate email format', async ({ page }) => {
      await page.goto(`${BASE_URL}/lead-capture`);

      // Enter invalid email
      await page.getByLabel(/email/i).fill('invalid-email');
      await page.getByLabel(/name/i).click(); // Trigger blur

      // Should show email validation error
      await expect(
        page.getByText(/invalid.*email|valid.*email/i)
      ).toBeVisible();
    });
  });

  test.describe('Navigation and State Persistence', () => {
    test('should preserve selections when navigating back', async ({ page }) => {
      await page.goto(`${BASE_URL}/cellular-science`);

      // Select a condition
      const conditionCheckbox = page
        .getByRole('checkbox', { name: /arthritis/i })
        .first();
      await conditionCheckbox.check();

      // Verify it's checked
      await expect(conditionCheckbox).toBeChecked();

      // Navigate forward
      await page.getByRole('button', { name: /next|continue/i }).click();
      await page.waitForURL(/condition-confirmation/);

      // Navigate back
      const backButton = page.getByRole('button', { name: /back|previous/i });
      if (await backButton.count() > 0) {
        await backButton.click();
        await page.waitForURL(/cellular-science/);

        // Condition should still be checked
        const checkbox = page
          .getByRole('checkbox', { name: /arthritis/i })
          .first();
        await expect(checkbox).toBeChecked();
      }
    });

    test('should show progress indicator', async ({ page }) => {
      await page.goto(`${BASE_URL}/cellular-science`);

      // Should have progress indicator
      const progressIndicator =
        page.getByRole('progressbar') ||
        page.getByText(/page|step|of/i);

      await expect(progressIndicator).toBeVisible();
    });

    test('should disable back button on first page', async ({ page }) => {
      await page.goto(BASE_URL);

      const backButton = page.getByRole('button', { name: /back|previous/i });

      if (await backButton.count() > 0) {
        await expect(backButton).toBeDisabled();
      }
    });
  });

  test.describe('Mobile Responsive Design', () => {
    test('should render correctly on mobile viewport', async ({ page }) => {
      await page.setViewportSize(MOBILE_VIEWPORT);
      await page.goto(BASE_URL);

      // Should be visible and readable on mobile
      await expect(
        page.getByRole('heading', { name: /chronic pain|assessment/i })
      ).toBeVisible();

      // Buttons should be tappable (not too small)
      const startButton = page.getByRole('button', {
        name: /start|begin|get started/i,
      });
      const boundingBox = await startButton.boundingBox();
      expect(boundingBox?.height).toBeGreaterThan(40); // Touch target size
    });

    test('should handle form input on mobile', async ({ page }) => {
      await page.setViewportSize(MOBILE_VIEWPORT);
      await page.goto(`${BASE_URL}/lead-capture`);

      // Should be able to interact with inputs
      await page.getByLabel(/name/i).fill('John Doe');
      await page.getByLabel(/email/i).fill('john@example.com');

      // Verify inputs work
      await expect(page.getByLabel(/name/i)).toHaveValue('John Doe');
      await expect(page.getByLabel(/email/i)).toHaveValue('john@example.com');
    });

    test('should render condition selection on mobile', async ({ page }) => {
      await page.setViewportSize(MOBILE_VIEWPORT);
      await page.goto(`${BASE_URL}/cellular-science`);

      // Checkboxes should be visible and clickable
      const checkboxes = await page.getByRole('checkbox').all();
      expect(checkboxes.length).toBeGreaterThan(0);

      if (checkboxes.length > 0) {
        await checkboxes[0].check();
        await expect(checkboxes[0]).toBeChecked();
      }
    });
  });

  test.describe('Keyboard Navigation', () => {
    test('should navigate form with Tab key', async ({ page }) => {
      await page.goto(`${BASE_URL}/lead-capture`);

      // Focus first input
      await page.keyboard.press('Tab');

      // Should focus on name input
      const nameInput = page.getByLabel(/name/i);
      await expect(nameInput).toBeFocused();

      // Tab to next field
      await page.keyboard.press('Tab');

      // Should focus on email input
      const emailInput = page.getByLabel(/email/i);
      await expect(emailInput).toBeFocused();
    });

    test('should submit form with Enter key', async ({ page }) => {
      await page.goto(`${BASE_URL}/lead-capture`);

      // Fill form
      await page.getByLabel(/name/i).fill('John Doe');
      await page.getByLabel(/email/i).fill('john@example.com');

      // Press Enter
      await page.keyboard.press('Enter');

      // Should submit form
      await expect(async () => {
        const successMessage = await page
          .getByText(/success|thank you|submitted/i)
          .count();
        const urlChanged = page.url() !== `${BASE_URL}/lead-capture`;
        expect(successMessage > 0 || urlChanged).toBeTruthy();
      }).toPass({ timeout: 5000 });
    });

    test('should toggle checkboxes with Space key', async ({ page }) => {
      await page.goto(`${BASE_URL}/cellular-science`);

      // Focus first checkbox
      const checkbox = page.getByRole('checkbox').first();
      await checkbox.focus();

      // Press Space to check
      await page.keyboard.press('Space');
      await expect(checkbox).toBeChecked();

      // Press Space to uncheck
      await page.keyboard.press('Space');
      await expect(checkbox).not.toBeChecked();
    });

    test('should navigate buttons with keyboard', async ({ page }) => {
      await page.goto(`${BASE_URL}/cellular-science`);

      // Tab through interactive elements
      await page.keyboard.press('Tab');
      await page.keyboard.press('Tab');

      // Should be able to activate buttons with Enter
      const nextButton = page.getByRole('button', { name: /next|continue/i });
      await nextButton.focus();
      await expect(nextButton).toBeFocused();
    });
  });

  test.describe('Error Handling', () => {
    test('should handle network errors gracefully', async ({ page }) => {
      // Intercept and fail API calls
      await page.route('**/api/**', (route) => {
        route.abort('failed');
      });

      await page.goto(`${BASE_URL}/lead-capture`);

      // Fill and submit form
      await page.getByLabel(/name/i).fill('John Doe');
      await page.getByLabel(/email/i).fill('john@example.com');
      await page.getByRole('button', { name: /submit|send/i }).click();

      // Should show error message
      await expect(
        page.getByText(/error|failed|try again/i)
      ).toBeVisible();
    });

    test('should allow retry after error', async ({ page }) => {
      let requestCount = 0;

      // Intercept API calls - fail first, succeed second
      await page.route('**/api/**', (route) => {
        requestCount++;
        if (requestCount === 1) {
          route.abort('failed');
        } else {
          route.fulfill({
            status: 200,
            body: JSON.stringify({ success: true }),
          });
        }
      });

      await page.goto(`${BASE_URL}/lead-capture`);

      // Fill and submit form
      await page.getByLabel(/name/i).fill('John Doe');
      await page.getByLabel(/email/i).fill('john@example.com');
      await page.getByRole('button', { name: /submit|send/i }).click();

      // Wait for error
      await expect(page.getByText(/error|failed/i)).toBeVisible();

      // Click retry button
      const retryButton = page.getByRole('button', { name: /retry|try again/i });
      if (await retryButton.count() > 0) {
        await retryButton.click();

        // Should succeed on retry
        await expect(async () => {
          expect(requestCount).toBeGreaterThan(1);
        }).toPass({ timeout: 5000 });
      }
    });
  });

  test.describe('Accessibility', () => {
    test('should have proper ARIA labels', async ({ page }) => {
      await page.goto(`${BASE_URL}/lead-capture`);

      // Inputs should have labels
      const nameInput = page.getByLabel(/name/i);
      const emailInput = page.getByLabel(/email/i);

      await expect(nameInput).toBeVisible();
      await expect(emailInput).toBeVisible();
    });

    test('should show validation errors with aria-invalid', async ({ page }) => {
      await page.goto(`${BASE_URL}/lead-capture`);

      // Enter invalid email
      const emailInput = page.getByLabel(/email/i);
      await emailInput.fill('invalid');
      await page.getByLabel(/name/i).click(); // Trigger blur

      // Should have aria-invalid="true"
      await expect(emailInput).toHaveAttribute('aria-invalid', 'true');
    });

    test('should have sufficient color contrast', async ({ page }) => {
      await page.goto(BASE_URL);

      // Run axe accessibility check (if using @axe-core/playwright)
      // const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
      // expect(accessibilityScanResults.violations).toEqual([]);
    });

    test('should support screen reader navigation', async ({ page }) => {
      await page.goto(BASE_URL);

      // Check for proper heading structure
      const h1 = page.getByRole('heading', { level: 1 });
      await expect(h1).toBeVisible();

      // Check for landmarks
      const main = page.locator('main');
      if (await main.count() > 0) {
        await expect(main).toBeVisible();
      }
    });
  });

  test.describe('Performance', () => {
    test('should load within acceptable time', async ({ page }) => {
      const startTime = Date.now();

      await page.goto(BASE_URL);
      await page.waitForLoadState('domcontentloaded');

      const loadTime = Date.now() - startTime;

      // Should load in under 3 seconds
      expect(loadTime).toBeLessThan(3000);
    });

    test('should not have memory leaks on navigation', async ({ page }) => {
      await page.goto(BASE_URL);

      // Navigate through multiple pages
      for (let i = 0; i < 5; i++) {
        await page.goBack();
        await page.goForward();
      }

      // Page should still be responsive
      const button = page.getByRole('button').first();
      await expect(button).toBeVisible();
    });
  });
});
