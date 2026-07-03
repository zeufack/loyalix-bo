import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './base.page';

export class LoginPage extends BasePage {
  get url(): string {
    return '/login';
  }

  get emailInput(): Locator {
    return this.page.locator('#email');
  }

  get passwordInput(): Locator {
    return this.page.locator('#password');
  }

  get loginButton(): Locator {
    return this.page.getByRole('button', { name: 'Sign in', exact: true });
  }

  get googleLoginButton(): Locator {
    return this.page.getByRole('button', { name: 'Login with Google' });
  }

  get errorMessage(): Locator {
    return this.page.locator('.text-red-500');
  }

  get forgotPasswordLink(): Locator {
    return this.page.getByText('Forgot your password?');
  }

  get signUpLink(): Locator {
    return this.page.getByRole('link', { name: 'Sign up' });
  }

  get loadingSpinner(): Locator {
    return this.page.locator('[class*="spinner"], [class*="animate-spin"]');
  }

  async login(email: string, password: string): Promise<void> {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async expectLoginSuccess(): Promise<void> {
    await this.page.waitForURL('/', { timeout: 30000 });
  }

  async expectLoginError(message?: string): Promise<void> {
    await expect(this.errorMessage).toBeVisible();
    if (message) {
      await expect(this.errorMessage).toContainText(message);
    }
  }

  async expectFormDisplayed(): Promise<void> {
    await expect(this.emailInput).toBeVisible();
    await expect(this.passwordInput).toBeVisible();
    await expect(this.loginButton).toBeVisible();
  }

  async expectLoadingState(): Promise<void> {
    await expect(this.loadingSpinner).toBeVisible();
  }
}
