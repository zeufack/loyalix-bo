import { Page, Locator, expect } from '@playwright/test';

export class AlertDialogComponent {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  get dialog(): Locator {
    return this.page.getByRole('alertdialog');
  }

  get title(): Locator {
    return this.dialog.locator('[class*="AlertDialogTitle"], h2').first();
  }

  get description(): Locator {
    return this.dialog.locator('[class*="AlertDialogDescription"]');
  }

  get confirmButton(): Locator {
    return this.dialog.getByRole('button', { name: /delete|confirm|yes|remove|continue/i }).first();
  }

  get cancelButton(): Locator {
    return this.dialog.getByRole('button', { name: /cancel|no/i });
  }

  async waitForOpen(): Promise<void> {
    await expect(this.dialog).toBeVisible({ timeout: 10000 });
  }

  async waitForClose(): Promise<void> {
    await expect(this.dialog).not.toBeVisible({ timeout: 10000 });
  }

  async confirm(): Promise<void> {
    await this.waitForOpen();
    await this.confirmButton.click();
    await this.waitForClose();
  }

  async cancel(): Promise<void> {
    await this.waitForOpen();
    await this.cancelButton.click();
    await this.waitForClose();
  }

  async expectTitle(text: string): Promise<void> {
    await expect(this.title).toContainText(text);
  }

  async expectDescription(text: string): Promise<void> {
    await expect(this.description).toContainText(text);
  }

  async isOpen(): Promise<boolean> {
    return await this.dialog.isVisible();
  }
}
