import { Page, Locator, expect } from '@playwright/test';

export class ToastComponent {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  get successToast(): Locator {
    return this.page.locator('[data-sonner-toast][data-type="success"]');
  }

  get errorToast(): Locator {
    return this.page.locator('[data-sonner-toast][data-type="error"]');
  }

  get infoToast(): Locator {
    return this.page.locator('[data-sonner-toast][data-type="info"]');
  }

  get warningToast(): Locator {
    return this.page.locator('[data-sonner-toast][data-type="warning"]');
  }

  get anyToast(): Locator {
    return this.page.locator('[data-sonner-toast]');
  }

  async expectSuccess(message?: string): Promise<void> {
    await expect(this.successToast).toBeVisible({ timeout: 10000 });
    if (message) {
      await expect(this.successToast).toContainText(message);
    }
  }

  async expectError(message?: string): Promise<void> {
    await expect(this.errorToast).toBeVisible({ timeout: 10000 });
    if (message) {
      await expect(this.errorToast).toContainText(message);
    }
  }

  async expectInfo(message?: string): Promise<void> {
    await expect(this.infoToast).toBeVisible({ timeout: 10000 });
    if (message) {
      await expect(this.infoToast).toContainText(message);
    }
  }

  async expectWarning(message?: string): Promise<void> {
    await expect(this.warningToast).toBeVisible({ timeout: 10000 });
    if (message) {
      await expect(this.warningToast).toContainText(message);
    }
  }

  async waitForDismiss(): Promise<void> {
    await expect(this.anyToast).not.toBeVisible({ timeout: 10000 });
  }

  async dismissAll(): Promise<void> {
    const toasts = await this.anyToast.all();
    for (const toast of toasts) {
      // Click close button if available
      const closeButton = toast.locator('button');
      if (await closeButton.isVisible()) {
        await closeButton.click();
      }
    }
  }
}
