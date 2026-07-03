import { test, expect } from '@playwright/test';

test.describe('Smoke Tests', () => {
  test('should load dashboard', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading').first()).toBeVisible();
  });

  test('should navigate to users page', async ({ page }) => {
    await page.goto('/users');
    await expect(page.locator('table')).toBeVisible();
  });

  test('should navigate to business page', async ({ page }) => {
    await page.goto('/business');
    await expect(page.locator('table')).toBeVisible();
  });

  test('should navigate to customers page', async ({ page }) => {
    await page.goto('/customers');
    await expect(page.locator('table')).toBeVisible();
  });

  test('should navigate to loyalty programs page', async ({ page }) => {
    await page.goto('/loyalty-program');
    await expect(page.locator('table')).toBeVisible();
  });

  test('should navigate to rewards page', async ({ page }) => {
    await page.goto('/rewards');
    await expect(page.locator('table')).toBeVisible();
  });

  test('should navigate to roles page', async ({ page }) => {
    await page.goto('/roles');
    await expect(page.locator('table')).toBeVisible();
  });

  test('should navigate to settings page', async ({ page }) => {
    await page.goto('/settings');
    await expect(page.getByRole('tab', { name: 'General' })).toBeVisible();
  });

  test('should navigate to activities page', async ({ page }) => {
    await page.goto('/activities');
    // Not waitForLoadState('networkidle') — the app holds an open SSE
    // connection (/events/stream), so network never actually goes idle.
    await expect(page.getByRole('heading').first()).toBeVisible();
  });

  test('should navigate to promotions page', async ({ page }) => {
    await page.goto('/promotions');
    await expect(page.locator('table')).toBeVisible();
  });
});
