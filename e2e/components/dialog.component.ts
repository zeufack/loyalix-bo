import { Page, Locator, expect } from '@playwright/test';

export class DialogComponent {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  get dialog(): Locator {
    return this.page.getByRole('dialog');
  }

  get title(): Locator {
    return this.dialog.locator('[class*="DialogTitle"], h2').first();
  }

  get description(): Locator {
    return this.dialog.locator('[class*="DialogDescription"]');
  }

  get submitButton(): Locator {
    return this.dialog.getByRole('button', { name: /create|save|submit|update|confirm/i }).first();
  }

  get cancelButton(): Locator {
    return this.dialog.getByRole('button', { name: /cancel/i });
  }

  get closeButton(): Locator {
    return this.dialog.locator('button[class*="close"], button:has(svg[class*="X"])').first();
  }

  async waitForOpen(): Promise<void> {
    await expect(this.dialog).toBeVisible({ timeout: 10000 });
  }

  async waitForClose(): Promise<void> {
    await expect(this.dialog).not.toBeVisible({ timeout: 10000 });
  }

  async submit(): Promise<void> {
    await this.submitButton.click();
  }

  async cancel(): Promise<void> {
    await this.cancelButton.click();
    await this.waitForClose();
  }

  async close(): Promise<void> {
    // Press Escape or click close button
    await this.page.keyboard.press('Escape');
    await this.waitForClose();
  }

  // Form field helpers
  async fillField(labelOrId: string, value: string): Promise<void> {
    // Try by label first
    let field = this.dialog.getByLabel(labelOrId);
    if (!(await field.isVisible().catch(() => false))) {
      // Try by id
      field = this.dialog.locator(`#${labelOrId}`);
    }
    if (!(await field.isVisible().catch(() => false))) {
      // Try by placeholder
      field = this.dialog.locator(`input[placeholder*="${labelOrId}"], textarea[placeholder*="${labelOrId}"]`);
    }
    await field.fill(value);
  }

  async selectOption(labelOrId: string, value: string): Promise<void> {
    // Find the select trigger by label
    const label = this.dialog.locator(`label:has-text("${labelOrId}")`);
    const container = label.locator('..');
    const trigger = container.locator('button[role="combobox"]');
    await trigger.click();
    await this.page.getByRole('option', { name: value }).click();
  }

  async toggleSwitch(labelOrId: string): Promise<void> {
    const switchControl = this.dialog.getByLabel(labelOrId);
    await switchControl.click();
  }

  async toggleCheckbox(labelOrId: string): Promise<void> {
    const checkbox = this.dialog.getByLabel(labelOrId);
    await checkbox.click();
  }

  async expectFieldError(errorText: string): Promise<void> {
    await expect(this.dialog.locator('.text-red-500, .text-destructive')).toContainText(errorText);
  }

  async expectTitle(title: string): Promise<void> {
    await expect(this.title).toContainText(title);
  }

  async isOpen(): Promise<boolean> {
    return await this.dialog.isVisible();
  }
}
