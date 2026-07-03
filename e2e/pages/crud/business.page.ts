import { Page, Locator } from '@playwright/test';
import { BaseCRUDPage, CRUDPageConfig } from './base-crud.page';
import { GeneratedBusiness } from '../../helpers/test-data-generators';

const BUSINESS_CONFIG: CRUDPageConfig = {
  entityName: 'Business',
  entityNamePlural: 'Businesses',
  path: '/business',
};

export interface BusinessFormData {
  name: string;
  description?: string;
  email?: string;
  phone?: string;
  address?: string;
  businessTypeId?: string;
}

export class BusinessPage extends BaseCRUDPage {
  constructor(page: Page) {
    super(page, BUSINESS_CONFIG);
  }

  async fillCreateForm(data: BusinessFormData): Promise<void> {
    const dialog = this.createDialog.dialog;
    await dialog.locator('#name, [id*="name"]').first().fill(data.name);
    if (data.description) {
      await dialog.locator('#description, [id*="description"]').first().fill(data.description);
    }
    if (data.email) {
      await dialog.locator('#email, [id*="email"]').first().fill(data.email);
    }
    if (data.phone) {
      await dialog.locator('#phone, [id*="phone"]').first().fill(data.phone);
    }
    if (data.address) {
      await dialog.locator('#address, [id*="address"]').first().fill(data.address);
    }
  }

  async fillEditForm(data: Partial<BusinessFormData>): Promise<void> {
    const dialog = this.editDialog.dialog;
    if (data.name) {
      await dialog.locator('#name, [id*="name"]').first().fill(data.name);
    }
    if (data.description) {
      await dialog.locator('#description, [id*="description"]').first().fill(data.description);
    }
  }

  async createBusiness(data: BusinessFormData): Promise<void> {
    await this.openCreateDialog();
    await this.fillCreateForm(data);
    await this.createDialog.submit();
  }

  async createBusinessFromGenerated(business: GeneratedBusiness): Promise<void> {
    await this.createBusiness({
      name: business.name,
      description: business.description,
      email: business.email,
      phone: business.phone,
      address: business.address,
    });
  }

  async expectBusinessInTable(name: string): Promise<void> {
    await this.dataTable.search(name);
    await this.dataTable.expectToContainText(name);
  }
}
