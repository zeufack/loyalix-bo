import { Page, Locator, expect } from '@playwright/test';

export abstract class BasePage {
  protected page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  abstract get url(): string;

  async navigate(): Promise<void> {
    await this.page.goto(this.url);
    await this.waitForPageLoad();
  }

  async waitForPageLoad(): Promise<void> {
    await this.page.waitForLoadState('networkidle');
  }

  // Common UI element getters
  get pageTitle(): Locator {
    return this.page.locator('h1, h2').first();
  }

  // Toast notifications (Sonner)
  get toastSuccess(): Locator {
    return this.page.locator('[data-sonner-toast][data-type="success"]');
  }

  get toastError(): Locator {
    return this.page.locator('[data-sonner-toast][data-type="error"]');
  }

  get anyToast(): Locator {
    return this.page.locator('[data-sonner-toast]');
  }

  // Wait for toast notification
  async waitForToast(
    type: 'success' | 'error',
    message?: string
  ): Promise<void> {
    const toast = type === 'success' ? this.toastSuccess : this.toastError;
    await expect(toast).toBeVisible({ timeout: 10000 });
    if (message) {
      await expect(toast).toContainText(message);
    }
  }

  async expectToastSuccess(message?: string): Promise<void> {
    await this.waitForToast('success', message);
  }

  async expectToastError(message?: string): Promise<void> {
    await this.waitForToast('error', message);
  }

  // Navigation helpers
  async clickNavLink(text: string): Promise<void> {
    await this.page.getByRole('link', { name: text }).click();
    await this.waitForPageLoad();
  }

  // Common assertions
  async expectUrl(url: string): Promise<void> {
    await expect(this.page).toHaveURL(url);
  }

  async expectTitle(title: string): Promise<void> {
    await expect(this.pageTitle).toContainText(title);
  }
}
