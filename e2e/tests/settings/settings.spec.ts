import { test, expect } from '@playwright/test';
import { SettingsPage } from '../../pages/settings.page';

test.describe('Settings Page', () => {
  let settingsPage: SettingsPage;

  test.beforeEach(async ({ page }) => {
    settingsPage = new SettingsPage(page);
    await settingsPage.navigate();
  });

  test('should display settings tabs', async () => {
    await settingsPage.expectAllTabsVisible();
  });

  test('should show General tab by default', async () => {
    await settingsPage.expectGeneralTabActive();
  });

  test('should switch to Notifications tab', async () => {
    await settingsPage.switchToNotificationsTab();
    await settingsPage.expectNotificationsTabActive();
  });

  test('should switch to Security tab', async () => {
    await settingsPage.switchToSecurityTab();
    await settingsPage.expectSecurityTabActive();
  });

  test('should switch back to General tab', async () => {
    // Go to another tab first
    await settingsPage.switchToSecurityTab();

    // Then switch back
    await settingsPage.switchToGeneralTab();
    await settingsPage.expectGeneralTabActive();
  });
});
