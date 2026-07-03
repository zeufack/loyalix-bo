import { test, expect } from '@playwright/test';

test.describe('Logout', () => {
  test('should redirect unauthenticated users to login', async ({ browser }) => {
    // Create a new context without auth state
    const context = await browser.newContext({ storageState: { cookies: [], origins: [] } });
    const page = await context.newPage();

    await page.goto('/');

    // Should redirect to login
    await expect(page).toHaveURL(/\/login/);

    await context.close();
  });

  test('should protect dashboard routes from unauthenticated access', async ({ browser }) => {
    const context = await browser.newContext({ storageState: { cookies: [], origins: [] } });
    const page = await context.newPage();

    // Try to access protected route
    await page.goto('/users');

    // Should redirect to login
    await expect(page).toHaveURL(/\/login/);

    await context.close();
  });
});
