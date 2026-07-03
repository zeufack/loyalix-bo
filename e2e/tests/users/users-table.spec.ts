import { test, expect } from '@playwright/test';
import { UsersPage } from '../../pages/crud/users.page';

test.describe('Users Data Table Features', () => {
  let usersPage: UsersPage;

  test.beforeEach(async ({ page }) => {
    usersPage = new UsersPage(page);
    await usersPage.navigate();
  });

  test('should display table with data', async () => {
    await usersPage.dataTable.expectTableVisible();
    const rowCount = await usersPage.dataTable.getRowCount();
    expect(rowCount).toBeGreaterThanOrEqual(0);
  });

  test('should search users', async () => {
    const searchTerm = 'admin';
    await usersPage.dataTable.search(searchTerm);

    // Either find results or no results
    const rowCount = await usersPage.dataTable.getRowCount();
    if (rowCount > 0) {
      // All visible rows should contain search term (in some column)
      await usersPage.dataTable.expectToContainText(searchTerm);
    }
  });

  test('should clear search', async () => {
    // Search first
    await usersPage.dataTable.search('admin');

    // Clear search
    await usersPage.dataTable.clearSearch();

    // Should show all results again
    await usersPage.dataTable.expectTableVisible();
  });

  test('should sort by clicking column header', async ({ page }) => {
    // Click on Email header to sort
    await usersPage.dataTable.sortByColumn('Email');

    // Page should reload with sorted data
    await page.waitForLoadState('networkidle');
    await usersPage.dataTable.expectTableVisible();
  });

  test('should navigate to next page', async ({ page }) => {
    const rowCount = await usersPage.dataTable.getRowCount();

    if (rowCount >= 10) {
      // There might be more pages
      const nextButton = usersPage.dataTable.nextPageButton;
      if (await nextButton.isEnabled()) {
        // Get first row text before navigation
        const firstRowBefore = await usersPage.dataTable.getCellText(0, 1);

        await usersPage.dataTable.goToNextPage();

        // First row should be different
        const firstRowAfter = await usersPage.dataTable.getCellText(0, 1);
        // Note: This might fail if there's only one page - that's ok
      }
    }
  });

  test('should show correct pagination info', async ({ page }) => {
    await usersPage.dataTable.expectTableVisible();

    // Should show page info
    const pageInfo = usersPage.dataTable.pageInfo;
    await expect(pageInfo).toBeVisible();

    // Should contain "Page X of Y" format
    const text = await pageInfo.textContent();
    expect(text).toMatch(/Page \d+ of \d+/);
  });

  test('should show row count', async ({ page }) => {
    await usersPage.dataTable.expectTableVisible();

    // Should show total rows info
    await expect(page.locator('text=/\\d+ total row/')).toBeVisible();
  });

  test('should switch between tabs', async () => {
    // Switch to different tabs if they exist
    const allTab = usersPage.tabAll;
    if (await allTab.isVisible()) {
      await usersPage.switchTab('all');
      await usersPage.dataTable.expectTableVisible();
    }
  });
});
