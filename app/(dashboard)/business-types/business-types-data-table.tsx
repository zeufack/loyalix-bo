'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { DataTable } from '@/components/data-table/data-table';
import { getBusinessTypes } from '@/app/api/business-type';
import { businessTypeColumns } from '@/lib/columns/business-type-columns';
import { useTable } from '@/hooks/useCustomerTable';
import { DataTableToolbar } from '@/components/data-table/data-table-toolbar';
import { DataTablePagination } from '@/components/data-table/data-table-pagination';
import { TableSkeleton } from '@/components/ui/table-skeleton';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { ColumnFiltersState, SortingState, PaginationState } from '@tanstack/react-table';

export function BusinessTypesDataTable() {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10
  });
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const { data, isLoading, error } = useQuery({
    queryKey: ['business-types', pagination.pageIndex, pagination.pageSize, sorting],
    queryFn: () => getBusinessTypes({
      page: pagination.pageIndex + 1,
      limit: pagination.pageSize,
      sortBy: sorting[0]?.id,
      sortOrder: sorting[0]?.desc ? 'desc' : 'asc'
    })
  });

  const table = useTable({
    data: data?.data || [],
    columns: businessTypeColumns,
    pageCount: data?.totalPages || 0,
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    manualPagination: true,
    manualSorting: true,
    manualFiltering: true
  });

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-red-500">
            Error loading business types: {error.message}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Business Types</CardTitle>
        <CardDescription>
          Manage business type categories like Restaurant, Salon, Gym, etc.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <DataTableToolbar
            table={table}
            exportFilename="business-types"
            searchColumn="name"
            searchPlaceholder="Search business types..."
          />
          {isLoading ? (
            <TableSkeleton columns={3} rows={5} />
          ) : (
            <DataTable table={table} columns={businessTypeColumns} />
          )}
          <DataTablePagination table={table} totalItems={data?.total} />
        </div>
      </CardContent>
    </Card>
  );
}
