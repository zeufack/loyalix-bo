import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './base.page';

export class SettingsPage extends BasePage {
  get url(): string {
    return '/settings';
  }

  // Tab locators
  get generalTab(): Locator {
    return this.page.getByRole('tab', { name: 'General' });
  }

  get notificationsTab(): Locator {
    return this.page.getByRole('tab', { name: 'Notifications' });
  }

  get securityTab(): Locator {
    return this.page.getByRole('tab', { name: 'Security' });
  }

  // Tab content
  get generalContent(): Locator {
    return this.page.locator('[role="tabpanel"]').filter({ hasText: /general/i });
  }

  get notificationsContent(): Locator {
    return this.page.locator('[role="tabpanel"]').filter({ hasText: /notification/i });
  }

  get securityContent(): Locator {
    return this.page.locator('[role="tabpanel"]').filter({ hasText: /security/i });
  }

  // Actions
  async switchToGeneralTab(): Promise<void> {
    await this.generalTab.click();
    await this.page.waitForLoadState('networkidle');
  }

  async switchToNotificationsTab(): Promise<void> {
    await this.notificationsTab.click();
    await this.page.waitForLoadState('networkidle');
  }

  async switchToSecurityTab(): Promise<void> {
    await this.securityTab.click();
    await this.page.waitForLoadState('networkidle');
  }

  // Assertions
  async expectGeneralTabActive(): Promise<void> {
    await expect(this.generalTab).toHaveAttribute('data-state', 'active');
  }

  async expectNotificationsTabActive(): Promise<void> {
    await expect(this.notificationsTab).toHaveAttribute('data-state', 'active');
  }

  async expectSecurityTabActive(): Promise<void> {
    await expect(this.securityTab).toHaveAttribute('data-state', 'active');
  }

  async expectAllTabsVisible(): Promise<void> {
    await expect(this.generalTab).toBeVisible();
    await expect(this.notificationsTab).toBeVisible();
    await expect(this.securityTab).toBeVisible();
  }
}
