import { Page } from '@playwright/test';
import { BaseCRUDPage, CRUDPageConfig } from './base-crud.page';
import { GeneratedCustomer } from '../../helpers/test-data-generators';

const CUSTOMER_CONFIG: CRUDPageConfig = {
  entityName: 'Customer',
  entityNamePlural: 'Customers',
  path: '/customers',
};

export interface CustomerFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
}

export class CustomersPage extends BaseCRUDPage {
  constructor(page: Page) {
    super(page, CUSTOMER_CONFIG);
  }

  async fillCreateForm(data: CustomerFormData): Promise<void> {
    const dialog = this.createDialog.dialog;
    await dialog.locator('#firstName, [id*="firstName"]').first().fill(data.firstName);
    await dialog.locator('#lastName, [id*="lastName"]').first().fill(data.lastName);
    await dialog.locator('#email, [id*="email"]').first().fill(data.email);
    if (data.phone) {
      await dialog.locator('#phone, [id*="phone"]').first().fill(data.phone);
    }
  }

  async fillEditForm(data: Partial<CustomerFormData>): Promise<void> {
    const dialog = this.editDialog.dialog;
    if (data.firstName) {
      await dialog.locator('#firstName, [id*="firstName"]').first().fill(data.firstName);
    }
    if (data.lastName) {
      await dialog.locator('#lastName, [id*="lastName"]').first().fill(data.lastName);
    }
    if (data.email) {
      await dialog.locator('#email, [id*="email"]').first().fill(data.email);
    }
  }

  async createCustomer(data: CustomerFormData): Promise<void> {
    await this.openCreateDialog();
    await this.fillCreateForm(data);
    await this.createDialog.submit();
  }

  async createCustomerFromGenerated(customer: GeneratedCustomer): Promise<void> {
    await this.createCustomer({
      firstName: customer.firstName,
      lastName: customer.lastName,
      email: customer.email,
      phone: customer.phone,
    });
  }

  async expectCustomerInTable(searchTerm: string): Promise<void> {
    await this.dataTable.search(searchTerm);
    await this.dataTable.expectToContainText(searchTerm);
  }
}
