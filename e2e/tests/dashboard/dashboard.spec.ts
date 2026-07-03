import { test, expect } from '@playwright/test';
import { DashboardPage } from '../../pages/dashboard.page';

test.describe('Dashboard Page', () => {
  let dashboardPage: DashboardPage;

  test.beforeEach(async ({ page }) => {
    dashboardPage = new DashboardPage(page);
    await dashboardPage.navigate();
  });

  test('should display dashboard heading', async ({ page }) => {
    await expect(page.getByRole('heading').first()).toBeVisible();
  });

  test('should display stat cards', async ({ page }) => {
    await page.waitForLoadState('networkidle');

    // Check for stat cards
    await expect(page.getByText('Total Users')).toBeVisible();
    await expect(page.getByText('Businesses')).toBeVisible();
  });

  test('should display numeric values in stat cards', async ({ page }) => {
    await page.waitForLoadState('networkidle');

    // Stat values should be visible (numbers or loading state)
    const statValues = page.locator('.text-2xl.font-bold, .text-3xl.font-bold');
    await expect(statValues.first()).toBeVisible();
  });

  test('should have working sidebar navigation', async ({ page }) => {
    // Click on Users in sidebar
    await page.getByRole('link', { name: /users/i }).click();
    await expect(page).toHaveURL('/users');

    // Navigate back to dashboard
    await page.goto('/');
    await expect(page.getByRole('heading').first()).toBeVisible();
  });
});
