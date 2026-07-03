import { test, expect } from '@playwright/test';
import { UsersPage } from '../../pages/crud/users.page';
import { generateUser } from '../../helpers/test-data-generators';
import { ApiClient } from '../../helpers/api-client';

test.describe('Users CRUD Operations', () => {
  let usersPage: UsersPage;
  let apiClient: ApiClient;
  const createdUserIds: string[] = [];

  test.beforeAll(async () => {
    apiClient = new ApiClient();
    await apiClient.login(
      process.env.TEST_USER_EMAIL || 'admin@loyalix.test',
      process.env.TEST_USER_PASSWORD || 'Admin123!@#'
    );
  });

  test.beforeEach(async ({ page }) => {
    usersPage = new UsersPage(page);
    await usersPage.navigate();
  });

  test.afterAll(async () => {
    // Cleanup created test users
    for (const id of createdUserIds) {
      try {
        await apiClient.deleteUser(id);
      } catch (e) {
        // Ignore cleanup errors
      }
    }
  });

  test('should display users data table', async () => {
    await expect(usersPage.pageTitle).toBeVisible();
    await usersPage.dataTable.expectTableVisible();
    await expect(usersPage.createButton).toBeVisible();
  });

  test('should open create user dialog', async () => {
    await usersPage.openCreateDialog();
    await usersPage.createDialog.expectTitle('Create User');
  });

  test('should show validation errors for empty form', async () => {
    await usersPage.openCreateDialog();
    await usersPage.createDialog.submit();

    // Should show validation errors
    const errors = await usersPage.getFormValidationErrors();
    expect(errors.length).toBeGreaterThan(0);
  });

  test('should show validation error for invalid email', async () => {
    await usersPage.openCreateDialog();
    await usersPage.fillCreateForm({
      email: 'invalid-email',
      password: 'ValidPass123!@#',
    });
    await usersPage.createDialog.submit();

    const errors = await usersPage.getFormValidationErrors();
    expect(errors.some(e => e.toLowerCase().includes('email'))).toBeTruthy();
  });

  test('should show validation error for weak password', async () => {
    await usersPage.openCreateDialog();
    await usersPage.fillCreateForm({
      email: 'test@example.com',
      password: 'weak',
    });
    await usersPage.createDialog.submit();

    const errors = await usersPage.getFormValidationErrors();
    expect(errors.some(e => e.toLowerCase().includes('password'))).toBeTruthy();
  });

  test('should create a new user successfully', async ({ page }) => {
    const userData = generateUser();

    await usersPage.createUser(userData);

    // Wait for success toast
    await usersPage.expectToastSuccess('User created successfully');

    // Verify user appears in table
    await usersPage.dataTable.search(userData.email);
    await usersPage.dataTable.expectToContainText(userData.email);

    // Store ID for cleanup
    const user = await apiClient.getUserByEmail(userData.email);
    if (user) createdUserIds.push(user.id);
  });

  test('should cancel create operation', async () => {
    await usersPage.openCreateDialog();
    await usersPage.fillCreateForm({
      email: 'cancel-test@example.com',
      password: 'TestPass123!@#',
    });
    await usersPage.createDialog.cancel();

    // Dialog should be closed
    expect(await usersPage.createDialog.isOpen()).toBeFalsy();
  });

  test('should delete a user with confirmation', async ({ page }) => {
    // Create a user via API first
    const userData = generateUser();
    const createResponse = await apiClient.createUser({
      email: userData.email,
      password: userData.password,
    });
    const userId = createResponse.id;

    // Refresh and search
    await page.reload();
    await usersPage.dataTable.search(userData.email);
    await usersPage.dataTable.expectToContainText(userData.email);

    // Delete the user
    await usersPage.deleteRow(0);

    // Wait for success toast
    await usersPage.expectToastSuccess();

    // Verify deletion
    await usersPage.dataTable.search(userData.email);
    await usersPage.dataTable.expectNoResults();
  });

  test('should cancel delete operation', async ({ page }) => {
    await usersPage.dataTable.openActionsMenu(0);
    await page.getByRole('menuitem', { name: /delete/i }).click();

    await usersPage.deleteDialog.cancel();

    // Dialog should close
    expect(await usersPage.deleteDialog.isOpen()).toBeFalsy();
  });
});
