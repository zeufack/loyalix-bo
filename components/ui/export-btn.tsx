'use client';

import { useState } from 'react';
import { FileSpreadsheet, FileText, Download, Loader2 } from 'lucide-react';
import { Button } from './button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel
} from './dropdown-menu';
import { Table } from '@tanstack/react-table';
import { exportTable, ExportFormat } from '@/lib/export/export-utils';
import { toast } from 'sonner';

interface ExportButtonProps<T> {
  table?: Table<T>;
  filename?: string;
  allData?: T[];
  onExportStart?: () => void;
  onExportComplete?: () => void;
}

export default function ExportButton<T>({
  table,
  filename = 'export',
  allData,
  onExportStart,
  onExportComplete
}: ExportButtonProps<T>) {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async (format: ExportFormat) => {
    if (!table) {
      toast.error('No data available to export');
      return;
    }

    setIsExporting(true);
    onExportStart?.();

    try {
      const timestamp = new Date().toISOString().split('T')[0];
      const exportFilename = `${filename}-${timestamp}`;

      exportTable(table, format, {
        filename: exportFilename,
        sheetName: filename.charAt(0).toUpperCase() + filename.slice(1),
        includeHeaders: true
      }, allData);

      toast.success(`Exported to ${format.toUpperCase()} successfully`);
    } catch (error) {
      console.error('Export failed:', error);
      toast.error('Failed to export data');
    } finally {
      setIsExporting(false);
      onExportComplete?.();
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          size="sm"
          variant="outline"
          className="h-8 gap-1"
          disabled={isExporting || !table}
        >
          {isExporting ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Download className="h-3.5 w-3.5" />
          )}
          <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
            {isExporting ? 'Exporting...' : 'Export'}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Export Format</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => handleExport('csv')}>
          <FileText className="mr-2 h-4 w-4" />
          Export as CSV
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport('excel')}>
          <FileSpreadsheet className="mr-2 h-4 w-4" />
          Export as Excel
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// Simple export button for pages without table context
export function SimpleExportButton() {
  return (
    <Button
      size="sm"
      variant="outline"
      className="h-8 gap-1"
      disabled
      title="Export available in data table"
    >
      <Download className="h-3.5 w-3.5" />
      <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
        Export
      </span>
    </Button>
  );
}
