import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/login.page';

// These tests run without authenticated state
test.use({ storageState: { cookies: [], origins: [] } });

test.describe('Login Page', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.navigate();
  });

  test('should display login form correctly', async ({ page }) => {
    await expect(page.getByText('Sign in')).toBeVisible();
    await loginPage.expectFormDisplayed();
  });

  test('should show error for invalid credentials', async () => {
    await loginPage.login('invalid@example.com', 'wrongpassword123');
    await loginPage.expectLoginError('Invalid email or password');
  });

  test('should require email field', async ({ page }) => {
    await loginPage.passwordInput.fill('somepassword');
    await loginPage.loginButton.click();
    // HTML5 validation should prevent submission
    const emailInput = await loginPage.emailInput;
    await expect(emailInput).toBeFocused();
  });

  test('should require password field', async ({ page }) => {
    await loginPage.emailInput.fill('test@example.com');
    await loginPage.loginButton.click();
    // HTML5 validation should prevent submission
    const passwordInput = await loginPage.passwordInput;
    await expect(passwordInput).toBeFocused();
  });

  test('should login successfully with valid credentials', async () => {
    const email = process.env.TEST_USER_EMAIL || 'admin@loyalix.test';
    const password = process.env.TEST_USER_PASSWORD || 'Admin123!@#';

    await loginPage.login(email, password);
    await loginPage.expectLoginSuccess();
  });

  test('should redirect to callbackUrl after login', async ({ page }) => {
    // Navigate to login with callback URL
    await page.goto('/login?callbackUrl=/users');

    const email = process.env.TEST_USER_EMAIL || 'admin@loyalix.test';
    const password = process.env.TEST_USER_PASSWORD || 'Admin123!@#';

    await loginPage.login(email, password);
    await page.waitForURL('/users', { timeout: 30000 });
  });
});
