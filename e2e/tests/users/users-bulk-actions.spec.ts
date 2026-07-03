import { test, expect } from '@playwright/test';
import { UsersPage } from '../../pages/crud/users.page';
import { ApiClient } from '../../helpers/api-client';
import { generateUser } from '../../helpers/test-data-generators';

test.describe('Users Bulk Actions', () => {
  let usersPage: UsersPage;
  let apiClient: ApiClient;
  const testUserIds: string[] = [];

  test.beforeAll(async () => {
    apiClient = new ApiClient();
    await apiClient.login(
      process.env.TEST_USER_EMAIL || 'admin@loyalix.test',
      process.env.TEST_USER_PASSWORD || 'Admin123!@#'
    );

    // Create test users for bulk operations
    for (let i = 0; i < 3; i++) {
      const userData = generateUser();
      try {
        const response = await apiClient.createUser({
          email: userData.email,
          password: userData.password,
        });
        testUserIds.push(response.id);
      } catch (e) {
        console.warn('Failed to create test user:', e);
      }
    }
  });

  test.beforeEach(async ({ page }) => {
    usersPage = new UsersPage(page);
    await usersPage.navigate();
    // Filter to test users
    await usersPage.dataTable.search('e2e-test-');
  });

  test.afterAll(async () => {
    // Cleanup remaining test users
    for (const id of testUserIds) {
      try {
        await apiClient.deleteUser(id);
      } catch (e) {
        // Ignore cleanup errors
      }
    }
  });

  test('should select a single row', async () => {
    const rowCount = await usersPage.dataTable.getRowCount();
    if (rowCount > 0) {
      await usersPage.dataTable.selectRow(0);

      const selectedCount = await usersPage.dataTable.getSelectedRowCount();
      expect(selectedCount).toBe(1);
    }
  });

  test('should select multiple rows', async () => {
    const rowCount = await usersPage.dataTable.getRowCount();
    if (rowCount >= 2) {
      await usersPage.dataTable.selectRow(0);
      await usersPage.dataTable.selectRow(1);

      const selectedCount = await usersPage.dataTable.getSelectedRowCount();
      expect(selectedCount).toBe(2);
    }
  });

  test('should select all rows', async () => {
    const rowCount = await usersPage.dataTable.getRowCount();
    if (rowCount > 0) {
      await usersPage.dataTable.selectAllRows();

      const selectedCount = await usersPage.dataTable.getSelectedRowCount();
      expect(selectedCount).toBe(rowCount);
    }
  });

  test('should show bulk delete button when rows selected', async ({ page }) => {
    const rowCount = await usersPage.dataTable.getRowCount();
    if (rowCount > 0) {
      await usersPage.dataTable.selectRow(0);

      // Bulk delete button should appear
      await expect(usersPage.bulkDeleteButton).toBeVisible();
    }
  });

  test('should bulk delete selected users', async ({ page }) => {
    // Ensure we have test users
    await page.reload();
    await usersPage.dataTable.search('e2e-test-');

    const initialCount = await usersPage.dataTable.getRowCount();

    if (initialCount >= 2) {
      // Select first two rows
      await usersPage.dataTable.selectRow(0);
      await usersPage.dataTable.selectRow(1);

      // Click bulk delete
      await usersPage.bulkDeleteButton.click();

      // Confirm deletion
      await usersPage.deleteDialog.confirm();

      // Wait for operation to complete
      await page.waitForLoadState('networkidle');

      // Verify count decreased
      await usersPage.dataTable.search('e2e-test-');
      const newCount = await usersPage.dataTable.getRowCount();
      expect(newCount).toBeLessThan(initialCount);
    }
  });
});
