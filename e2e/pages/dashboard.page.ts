import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './base.page';

export class DashboardPage extends BasePage {
  get url(): string {
    return '/';
  }

  get welcomeMessage(): Locator {
    return this.page.getByText(/welcome|dashboard/i);
  }

  // Stat cards
  get totalUsersCard(): Locator {
    return this.page.locator('text=Total Users').locator('..');
  }

  get businessesCard(): Locator {
    return this.page.locator('text=Businesses').locator('..');
  }

  get customersCard(): Locator {
    return this.page.locator('text=Customers').locator('..');
  }

  get loyaltyProgramsCard(): Locator {
    return this.page.locator('text=Loyalty Programs').locator('..');
  }

  // Charts
  get charts(): Locator {
    return this.page.locator('.recharts-wrapper');
  }

  // Navigation sidebar
  get sidebar(): Locator {
    return this.page.locator('nav, [class*="sidebar"]').first();
  }

  async expectDashboardLoaded(): Promise<void> {
    await expect(this.pageTitle).toBeVisible();
    await this.page.waitForLoadState('networkidle');
  }

  async expectStatCardsVisible(): Promise<void> {
    await expect(this.page.getByText('Total Users')).toBeVisible();
    await expect(this.page.getByText('Businesses')).toBeVisible();
  }

  async getStatValue(statName: string): Promise<string> {
    const card = this.page.locator(`text=${statName}`).locator('..');
    const value = card.locator('.text-2xl, .font-bold').first();
    return (await value.textContent()) || '0';
  }

  async navigateToPage(pageName: string): Promise<void> {
    await this.page.getByRole('link', { name: pageName }).click();
    await this.page.waitForLoadState('networkidle');
  }

  async expectChartsLoaded(): Promise<void> {
    await expect(this.charts.first()).toBeVisible({ timeout: 15000 });
  }
}
