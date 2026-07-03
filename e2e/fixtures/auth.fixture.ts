import { test as base, Page, BrowserContext } from '@playwright/test';
import path from 'path';
import fs from 'fs';

const AUTH_FILE = path.join(__dirname, '../.auth/user.json');

export interface AuthFixtures {
  authenticatedPage: Page;
  authContext: BrowserContext;
}

// Test credentials from environment
const TEST_USER = {
  email: process.env.TEST_USER_EMAIL || 'admin@loyalix.test',
  password: process.env.TEST_USER_PASSWORD || 'Admin123!@#',
};

export const test = base.extend<AuthFixtures>({
  // Reuse authenticated context across tests
  authenticatedPage: async ({ browser }, use) => {
    // Check if auth state exists
    if (fs.existsSync(AUTH_FILE)) {
      const context = await browser.newContext({ storageState: AUTH_FILE });
      const page = await context.newPage();
      await use(page);
      await context.close();
      return;
    }

    // Otherwise, login and save state
    const context = await browser.newContext();
    const page = await context.newPage();

    await page.goto('/login');
    await page.locator('#email').fill(TEST_USER.email);
    await page.locator('#password').fill(TEST_USER.password);
    await page.getByRole('button', { name: 'Sign in', exact: true }).click();

    // Wait for redirect to dashboard
    await page.waitForURL('/');

    // Save auth state
    await context.storageState({ path: AUTH_FILE });

    await use(page);
    await context.close();
  },

  authContext: async ({ browser }, use) => {
    const context = await browser.newContext({ storageState: AUTH_FILE });
    await use(context);
    await context.close();
  },
});

export { expect } from '@playwright/test';
