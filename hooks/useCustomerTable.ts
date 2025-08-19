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

interface UseTableProps<TData> {
  data: TData[];
  columns: ColumnDef<TData>[];
  pageCount?: number;
  onPaginationChange?: (pagination: PaginationState) => void;
  onSortingChange?: (sorting: SortingState[]) => void;
  onColumnFiltersChange?: (filters: ColumnFiltersState) => void;
  manualPagination?: boolean;
  manualSorting?: boolean;
  manualFiltering?: boolean;
}

export function useTable<TData>({
  data,
  columns,
  pageCount,
  onPaginationChange,
  onSortingChange,
  onColumnFiltersChange,
  manualPagination = false,
  manualSorting = false,
  manualFiltering = false
}: UseTableProps<TData>) {
  const table = useReactTable({
    data,
    columns,
    pageCount,
    onPaginationChange,
    onSortingChange,
    onColumnFiltersChange,
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
