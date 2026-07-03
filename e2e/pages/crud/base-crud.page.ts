import { Page, Locator } from '@playwright/test';
import { BasePage } from '../base.page';
import { DataTableComponent } from '../../components/data-table.component';
import { DialogComponent } from '../../components/dialog.component';
import { AlertDialogComponent } from '../../components/alert-dialog.component';

export interface CRUDPageConfig {
  entityName: string; // e.g., 'User', 'Business'
  entityNamePlural: string; // e.g., 'Users', 'Businesses'
  path: string; // e.g., '/users', '/business'
}

export abstract class BaseCRUDPage extends BasePage {
  protected config: CRUDPageConfig;
  public dataTable: DataTableComponent;
  public createDialog: DialogComponent;
  public editDialog: DialogComponent;
  public deleteDialog: AlertDialogComponent;

  constructor(page: Page, config: CRUDPageConfig) {
    super(page);
    this.config = config;
    this.dataTable = new DataTableComponent(page);
    this.createDialog = new DialogComponent(page);
    this.editDialog = new DialogComponent(page);
    this.deleteDialog = new AlertDialogComponent(page);
  }

  get url(): string {
    return this.config.path;
  }

  // Common locators
  get createButton(): Locator {
    // Look for button with "Create", "Add", or "New" text
    return this.page.getByRole('button', { name: /create|add|new/i }).first();
  }

  // Tab locators
  get tabAll(): Locator {
    return this.page.getByRole('tab', { name: 'All' });
  }

  get tabActive(): Locator {
    return this.page.getByRole('tab', { name: 'Active' });
  }

  get tabDraft(): Locator {
    return this.page.getByRole('tab', { name: 'Draft' });
  }

  get tabArchived(): Locator {
    return this.page.getByRole('tab', { name: 'Archived' });
  }

  // Common actions
  async openCreateDialog(): Promise<void> {
    await this.createButton.click();
    await this.createDialog.waitForOpen();
  }

  async openEditDialogForRow(rowIndex: number): Promise<void> {
    await this.dataTable.openActionsMenu(rowIndex);
    await this.page.getByRole('menuitem', { name: /edit/i }).click();
    await this.editDialog.waitForOpen();
  }

  async deleteRow(rowIndex: number): Promise<void> {
    await this.dataTable.openActionsMenu(rowIndex);
    await this.page.getByRole('menuitem', { name: /delete/i }).click();
    await this.deleteDialog.confirm();
  }

  async switchTab(tab: 'all' | 'active' | 'draft' | 'archived'): Promise<void> {
    const tabLocator = {
      all: this.tabAll,
      active: this.tabActive,
      draft: this.tabDraft,
      archived: this.tabArchived,
    }[tab];
    await tabLocator.click();
    await this.page.waitForLoadState('networkidle');
  }

  // Abstract methods to be implemented by specific pages
  abstract fillCreateForm(data: Record<string, unknown>): Promise<void>;
  abstract fillEditForm(data: Record<string, unknown>): Promise<void>;
}
