import { Page, Locator, expect } from '@playwright/test';

export class DataTableComponent {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  get table(): Locator {
    return this.page.locator('table').first();
  }

  get rows(): Locator {
    return this.table.locator('tbody tr');
  }

  get headers(): Locator {
    return this.table.locator('thead th');
  }

  get searchInput(): Locator {
    return this.page.locator('input[placeholder*="Search"], input[placeholder*="search"]');
  }

  get noResultsMessage(): Locator {
    return this.page.getByText('No results.');
  }

  // Pagination controls
  get nextPageButton(): Locator {
    return this.page.locator('button').filter({ has: this.page.locator('.sr-only:has-text("Go to next page")') });
  }

  get prevPageButton(): Locator {
    return this.page.locator('button').filter({ has: this.page.locator('.sr-only:has-text("Go to previous page")') });
  }

  get firstPageButton(): Locator {
    return this.page.locator('button').filter({ has: this.page.locator('.sr-only:has-text("Go to first page")') });
  }

  get lastPageButton(): Locator {
    return this.page.locator('button').filter({ has: this.page.locator('.sr-only:has-text("Go to last page")') });
  }

  get rowsPerPageSelect(): Locator {
    return this.page.locator('button[role="combobox"]').filter({ hasText: /^(10|20|30|40|50)$/ });
  }

  get pageInfo(): Locator {
    return this.page.locator('text=/Page \\d+ of \\d+/');
  }

  // Actions
  async getRowCount(): Promise<number> {
    await this.page.waitForLoadState('networkidle');
    const count = await this.rows.count();
    // Exclude "No results" row
    if (count === 1) {
      const text = await this.rows.first().textContent();
      if (text?.includes('No results')) {
        return 0;
      }
    }
    return count;
  }

  async getRowData(rowIndex: number): Promise<string[]> {
    const cells = await this.rows.nth(rowIndex).locator('td').all();
    const data: string[] = [];
    for (const cell of cells) {
      const text = await cell.textContent();
      data.push(text?.trim() || '');
    }
    return data;
  }

  async getCellText(rowIndex: number, columnIndex: number): Promise<string> {
    const cell = this.rows.nth(rowIndex).locator('td').nth(columnIndex);
    return (await cell.textContent())?.trim() || '';
  }

  async search(query: string): Promise<void> {
    await this.searchInput.fill(query);
    await this.page.waitForLoadState('networkidle');
  }

  async clearSearch(): Promise<void> {
    await this.searchInput.clear();
    await this.page.waitForLoadState('networkidle');
  }

  async sortByColumn(columnName: string): Promise<void> {
    const header = this.headers.filter({ hasText: columnName }).first();
    await header.click();
    await this.page.waitForLoadState('networkidle');
  }

  async goToNextPage(): Promise<void> {
    await this.nextPageButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async goToPrevPage(): Promise<void> {
    await this.prevPageButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async goToFirstPage(): Promise<void> {
    await this.firstPageButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async goToLastPage(): Promise<void> {
    await this.lastPageButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async setRowsPerPage(count: 10 | 20 | 30 | 40 | 50): Promise<void> {
    await this.rowsPerPageSelect.click();
    await this.page.getByRole('option', { name: String(count) }).click();
    await this.page.waitForLoadState('networkidle');
  }

  async openActionsMenu(rowIndex: number): Promise<void> {
    const row = this.rows.nth(rowIndex);
    // Find the actions button (usually has MoreHorizontal icon or "Open menu" text)
    const actionsButton = row.locator('button').last();
    await actionsButton.click();
  }

  async selectRow(rowIndex: number): Promise<void> {
    const row = this.rows.nth(rowIndex);
    const checkbox = row.locator('input[type="checkbox"], button[role="checkbox"]').first();
    await checkbox.click();
  }

  async selectAllRows(): Promise<void> {
    const headerRow = this.table.locator('thead tr').first();
    const selectAllCheckbox = headerRow.locator('input[type="checkbox"], button[role="checkbox"]').first();
    await selectAllCheckbox.click();
  }

  async getSelectedRowCount(): Promise<number> {
    const selectedText = await this.page.locator('text=/\\d+ of \\d+ row\\(s\\) selected/').textContent();
    const match = selectedText?.match(/(\d+) of/);
    return match ? parseInt(match[1], 10) : 0;
  }

  // Assertions
  async expectRowCount(count: number): Promise<void> {
    const actualCount = await this.getRowCount();
    expect(actualCount).toBe(count);
  }

  async expectMinRowCount(minCount: number): Promise<void> {
    const actualCount = await this.getRowCount();
    expect(actualCount).toBeGreaterThanOrEqual(minCount);
  }

  async expectToContainText(text: string): Promise<void> {
    await expect(this.table).toContainText(text);
  }

  async expectNoResults(): Promise<void> {
    await expect(this.noResultsMessage).toBeVisible();
  }

  async expectRowToContain(rowIndex: number, text: string): Promise<void> {
    const row = this.rows.nth(rowIndex);
    await expect(row).toContainText(text);
  }

  async expectTableVisible(): Promise<void> {
    await expect(this.table).toBeVisible();
  }
}
