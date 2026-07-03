import { Page, Locator, expect } from '@playwright/test';
import { BaseCRUDPage, CRUDPageConfig } from './base-crud.page';
import { GeneratedUser } from '../../helpers/test-data-generators';

const USER_CONFIG: CRUDPageConfig = {
  entityName: 'User',
  entityNamePlural: 'Users',
  path: '/users',
};

export interface UserFormData {
  email: string;
  password?: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
}

export class UsersPage extends BaseCRUDPage {
  constructor(page: Page) {
    super(page, USER_CONFIG);
  }

  // Bulk action button
  get bulkDeleteButton(): Locator {
    return this.page.getByRole('button', { name: /delete/i }).filter({ hasNot: this.page.locator('[role="menuitem"]') });
  }

  // Form field accessors in dialog
  private getDialogField(fieldId: string): Locator {
    return this.createDialog.dialog.locator(`#${fieldId}`);
  }

  async fillCreateForm(data: UserFormData): Promise<void> {
    await this.getDialogField('email').fill(data.email);
    if (data.password) {
      await this.getDialogField('password').fill(data.password);
    }
    if (data.firstName) {
      await this.getDialogField('firstName').fill(data.firstName);
    }
    if (data.lastName) {
      await this.getDialogField('lastName').fill(data.lastName);
    }
    if (data.phoneNumber) {
      await this.getDialogField('phoneNumber').fill(data.phoneNumber);
    }
  }

  async fillEditForm(data: Partial<UserFormData>): Promise<void> {
    const dialog = this.editDialog.dialog;
    if (data.email) {
      await dialog.locator('#email').fill(data.email);
    }
    if (data.firstName) {
      await dialog.locator('#firstName').fill(data.firstName);
    }
    if (data.lastName) {
      await dialog.locator('#lastName').fill(data.lastName);
    }
    if (data.phoneNumber) {
      await dialog.locator('#phoneNumber').fill(data.phoneNumber);
    }
  }

  // High-level actions
  async createUser(data: UserFormData): Promise<void> {
    await this.openCreateDialog();
    await this.fillCreateForm(data);
    await this.createDialog.submit();
  }

  async createUserFromGenerated(user: GeneratedUser): Promise<void> {
    await this.createUser({
      email: user.email,
      password: user.password,
      firstName: user.firstName,
      lastName: user.lastName,
      phoneNumber: user.phoneNumber,
    });
  }

  async editUser(rowIndex: number, data: Partial<UserFormData>): Promise<void> {
    await this.openEditDialogForRow(rowIndex);
    await this.fillEditForm(data);
    await this.editDialog.submit();
  }

  // Bulk actions
  async selectMultipleRows(indices: number[]): Promise<void> {
    for (const index of indices) {
      await this.dataTable.selectRow(index);
    }
  }

  async bulkDelete(rowIndices: number[]): Promise<void> {
    await this.selectMultipleRows(rowIndices);
    await this.bulkDeleteButton.click();
    await this.deleteDialog.confirm();
  }

  // Validation helpers
  async getFormValidationErrors(): Promise<string[]> {
    const dialog = this.createDialog.dialog;
    const errorElements = await dialog.locator('.text-red-500').all();
    const errors: string[] = [];
    for (const el of errorElements) {
      const text = await el.textContent();
      if (text) errors.push(text.trim());
    }
    return errors;
  }

  async expectUserInTable(email: string): Promise<void> {
    await this.dataTable.search(email);
    await this.dataTable.expectToContainText(email);
  }

  async expectUserNotInTable(email: string): Promise<void> {
    await this.dataTable.search(email);
    await this.dataTable.expectNoResults();
  }
}
