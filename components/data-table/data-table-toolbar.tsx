'use client';

import { Table } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X, Search, SlidersHorizontal } from 'lucide-react';
import { DataTableViewOptions } from './data-table-view-options';
import { DataTableFacetedFilter } from './data-table-faceted-filter';
import ExportButton from '@/components/ui/export-btn';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import { DateRange } from 'react-day-picker';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';

export interface FilterOption {
  label: string;
  value: string;
  icon?: React.ComponentType<{ className?: string }>;
}

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  searchColumn?: string;
  searchPlaceholder?: string;
  exportFilename?: string;
  allData?: TData[];
  showExport?: boolean;
  showSearch?: boolean;
  // Advanced filters
  statusColumn?: string;
  statusOptions?: FilterOption[];
  dateRangeColumn?: string;
  dateRange?: DateRange;
  onDateRangeChange?: (range: DateRange | undefined) => void;
  filterableColumns?: {
    id: string;
    title: string;
    options: FilterOption[];
  }[];
}

export function DataTableToolbar<TData>({
  table,
  searchColumn,
  searchPlaceholder = 'Search...',
  exportFilename = 'data',
  allData,
  showExport = true,
  showSearch = true,
  statusColumn,
  statusOptions,
  dateRange,
  onDateRangeChange,
  filterableColumns = []
}: Readonly<DataTableToolbarProps<TData>>) {
  const isFiltered = table.getState().columnFilters.length > 0 || dateRange?.from;
  const column = searchColumn ? table.getColumn(searchColumn) : null;
  const statusCol = statusColumn ? table.getColumn(statusColumn) : null;

  const activeFilterCount = [
    table.getState().columnFilters.length > 0,
    dateRange?.from
  ].filter(Boolean).length;

  const handleResetFilters = () => {
    table.resetColumnFilters();
    onDateRangeChange?.(undefined);
  };

  return (
    <div className="flex flex-col gap-2">
      {/* Mobile: stack vertically, Desktop: side by side */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        {/* Search and filters */}
        <div className="flex flex-wrap items-center gap-2">
          {showSearch && column && (
            <div className="relative w-full sm:w-auto">
              <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder={searchPlaceholder}
                value={(column.getFilterValue() as string) ?? ''}
                onChange={(event) => column.setFilterValue(event.target.value)}
                className="h-8 w-full pl-8 sm:w-[150px] lg:w-[250px]"
              />
            </div>
          )}

          {/* Status filter - hide on very small screens */}
          {statusCol && statusOptions && (
            <div className="hidden sm:block">
              <DataTableFacetedFilter
                column={statusCol}
                title="Status"
                options={statusOptions}
              />
            </div>
          )}

          {/* Additional filterable columns - hide on mobile */}
          <div className="hidden md:flex md:items-center md:gap-2">
            {filterableColumns.map((filterCol) => {
              const col = table.getColumn(filterCol.id);
              if (!col) return null;
              return (
                <DataTableFacetedFilter
                  key={filterCol.id}
                  column={col}
                  title={filterCol.title}
                  options={filterCol.options}
                />
              );
            })}
          </div>

          {/* Date range filter - hide on mobile */}
          {onDateRangeChange && (
            <div className="hidden lg:block">
              <DateRangePicker
                dateRange={dateRange}
                onDateRangeChange={onDateRangeChange}
                placeholder="Filter by date"
                className="w-auto"
              />
            </div>
          )}

          {isFiltered && (
            <Button
              variant="ghost"
              onClick={handleResetFilters}
              className="h-8 px-2 lg:px-3"
            >
              Reset
              <X className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-2">
          {activeFilterCount > 0 && (
            <Badge variant="secondary" className="hidden sm:inline-flex rounded-sm px-1.5">
              {activeFilterCount} active
            </Badge>
          )}
          {showExport && (
            <ExportButton
              table={table}
              filename={exportFilename}
              allData={allData}
            />
          )}
          <DataTableViewOptions table={table} />
        </div>
      </div>
    </div>
  );
}
