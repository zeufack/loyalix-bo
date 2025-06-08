import { useMemo, useState } from 'react';
import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type PaginationState,
  type SortingState,
  type ColumnFiltersState
} from '@tanstack/react-table';
import { Customer } from '../types/customer';

interface UseCustomerTableProps {
  data: Customer[];
  columns: ColumnDef<Customer>[];
  pageCount?: number;
  onPaginationChange?: (pagination: PaginationState) => void;
  onSortingChange?: (sorting: SortingState[]) => void;
  onColumnFiltersChange?: (filters: ColumnFiltersState) => void;
  manualPagination?: boolean;
  manualSorting?: boolean;
  manualFiltering?: boolean;
}

export function useCustomerTable({
  data,
  columns,
  pageCount,
  onPaginationChange,
  onSortingChange,
  onColumnFiltersChange,
  manualPagination = false,
  manualSorting = false,
  manualFiltering = false
}: UseCustomerTableProps) {
  const [sorting, setSorting] = useState<SortingState[]>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10
  });

  const table = useReactTable({
    data,
    columns,
    pageCount,
    state: {
      //   sorting,
      columnFilters,
      pagination
    },
    onSortingChange: (updater) => {
      //   const newSorting =
      //     typeof updater === 'function' ? updater(sorting) : updater;
      //   setSorting(newSorting);
      //   onSortingChange?.(newSorting);
    },
    onColumnFiltersChange: (updater) => {
      const newFilters =
        typeof updater === 'function' ? updater(columnFilters) : updater;
      setColumnFilters(newFilters);
      onColumnFiltersChange?.(newFilters);
    },
    onPaginationChange: (updater) => {
      const newPagination =
        typeof updater === 'function' ? updater(pagination) : updater;
      setPagination(newPagination);
      onPaginationChange?.(newPagination);
    },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualPagination,
    manualSorting,
    manualFiltering
  });

  return table;
}
