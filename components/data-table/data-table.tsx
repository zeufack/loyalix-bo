import * as React from 'react';
import {
  Table as ReactTableType,
  flexRender,
  ColumnDef
} from '@tanstack/react-table';
import { AlertCircle, Inbox, RefreshCw } from 'lucide-react';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

interface DataTableProps<TData> {
  table: ReactTableType<TData>;
  columns: ColumnDef<TData>[];
  isLoading?: boolean;
  error?: Error | null;
  onRetry?: () => void;
  emptyMessage?: string;
}

export function DataTable<TData>({
  table,
  columns,
  isLoading,
  error,
  onRetry,
  emptyMessage = 'No results found.'
}: DataTableProps<TData>) {
  const renderBody = () => {
    if (isLoading) {
      return Array.from({ length: 5 }).map((_, rowIndex) => (
        <TableRow key={rowIndex}>
          {columns.map((_, cellIndex) => (
            <TableCell key={cellIndex}>
              <Skeleton className="h-5 w-full" />
            </TableCell>
          ))}
        </TableRow>
      ));
    }

    if (error) {
      return (
        <TableRow>
          <TableCell colSpan={columns.length} className="h-48">
            <div className="flex flex-col items-center justify-center gap-2 text-center">
              <AlertCircle className="h-8 w-8 text-foreground-error" />
              <p className="font-medium">Failed to load data</p>
              <p className="text-sm text-muted-foreground">{error.message}</p>
              {onRetry && (
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-2"
                  onClick={onRetry}
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Retry
                </Button>
              )}
            </div>
          </TableCell>
        </TableRow>
      );
    }

    if (!table.getRowModel().rows?.length) {
      return (
        <TableRow>
          <TableCell colSpan={columns.length} className="h-48">
            <div className="flex flex-col items-center justify-center gap-2 text-center">
              <Inbox className="h-8 w-8 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">{emptyMessage}</p>
            </div>
          </TableCell>
        </TableRow>
      );
    }

    return table.getRowModel().rows.map((row) => (
      <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
        {row.getVisibleCells().map((cell) => (
          <TableCell key={cell.id}>
            {flexRender(cell.column.columnDef.cell, cell.getContext())}
          </TableCell>
        ))}
      </TableRow>
    ));
  };

  return (
    <div className="rounded-md border overflow-x-auto">
      <Table className="min-w-[600px]">
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>{renderBody()}</TableBody>
      </Table>
    </div>
  );
}
