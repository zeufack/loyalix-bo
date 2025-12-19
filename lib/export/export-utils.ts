'use client';

import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { Table } from '@tanstack/react-table';

export interface ExportOptions {
  filename: string;
  sheetName?: string;
  includeHeaders?: boolean;
}

/**
 * Get visible columns and their headers from a TanStack table
 */
export function getExportableColumns<T>(table: Table<T>) {
  return table
    .getAllColumns()
    .filter((column) => column.getIsVisible() && column.id !== 'actions' && column.id !== 'select')
    .map((column) => ({
      id: column.id,
      header: typeof column.columnDef.header === 'string'
        ? column.columnDef.header
        : column.id.charAt(0).toUpperCase() + column.id.slice(1).replace(/([A-Z])/g, ' $1')
    }));
}

/**
 * Extract row data for export based on visible columns
 */
export function getExportableData<T>(table: Table<T>, allData?: T[]) {
  const columns = getExportableColumns(table);
  const rows = allData || table.getRowModel().rows.map((row) => row.original);

  return rows.map((row) => {
    const rowData: Record<string, unknown> = {};
    columns.forEach((column) => {
      const value = getNestedValue(row, column.id);
      rowData[column.header] = formatCellValue(value);
    });
    return rowData;
  });
}

/**
 * Get nested value from object using dot notation
 */
function getNestedValue(obj: unknown, path: string): unknown {
  if (!obj || typeof obj !== 'object') return '';

  const keys = path.split('.');
  let value: unknown = obj;

  for (const key of keys) {
    if (value === null || value === undefined) return '';
    if (typeof value === 'object' && key in value) {
      value = (value as Record<string, unknown>)[key];
    } else {
      return '';
    }
  }

  return value;
}

/**
 * Format cell value for export
 */
function formatCellValue(value: unknown): string {
  if (value === null || value === undefined) return '';
  if (value instanceof Date) return value.toISOString();
  if (typeof value === 'object') return JSON.stringify(value);
  return String(value);
}

/**
 * Export table data to CSV
 */
export function exportToCSV<T>(
  table: Table<T>,
  options: ExportOptions,
  allData?: T[]
) {
  const data = getExportableData(table, allData);

  const csv = Papa.unparse(data, {
    quotes: true,
    header: options.includeHeaders !== false
  });

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  saveAs(blob, `${options.filename}.csv`);
}

/**
 * Export table data to Excel
 */
export function exportToExcel<T>(
  table: Table<T>,
  options: ExportOptions,
  allData?: T[]
) {
  const data = getExportableData(table, allData);
  const columns = getExportableColumns(table);

  // Create worksheet
  const ws = XLSX.utils.json_to_sheet(data, {
    header: columns.map((c) => c.header)
  });

  // Set column widths
  const colWidths = columns.map((col) => ({
    wch: Math.max(col.header.length, 15)
  }));
  ws['!cols'] = colWidths;

  // Create workbook
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, options.sheetName || 'Data');

  // Generate buffer and save
  const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([excelBuffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  });
  saveAs(blob, `${options.filename}.xlsx`);
}

/**
 * Export types
 */
export type ExportFormat = 'csv' | 'excel';

/**
 * Unified export function
 */
export function exportTable<T>(
  table: Table<T>,
  format: ExportFormat,
  options: ExportOptions,
  allData?: T[]
) {
  if (format === 'csv') {
    exportToCSV(table, options, allData);
  } else {
    exportToExcel(table, options, allData);
  }
}
