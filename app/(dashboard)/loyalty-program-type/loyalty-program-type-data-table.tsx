'use client';

import { useState } from 'react';
import { ColumnFiltersState, SortingState, PaginationState } from '@tanstack/react-table';
import { useQuery } from '@tanstack/react-query';
import { getLoyaltyProgramTypes } from '../../api/loyalty-program-type';
import { useTable } from '../../../hooks/useCustomerTable';
import { loyaltyProgramTypeColumns } from '../../../lib/columns/loyalty-program-type-columns';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '../../../components/ui/card';
import { DataTableToolbar } from '../../../components/data-table/data-table-toolbar';
import { DataTable } from '../../../components/data-table/data-table';
import { DataTablePagination } from '../../../components/data-table/data-table-pagination';
import { TableSkeleton } from '../../../components/ui/table-skeleton';

export function LoyaltyProgramTypesDataTable() {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10
  });
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const { data, isLoading, error } = useQuery({
    queryKey: ['loyalty-program-type', pagination.pageIndex, pagination.pageSize, sorting],
    queryFn: () =>
      getLoyaltyProgramTypes({
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize,
        sortBy: sorting[0]?.id,
        sortOrder: sorting[0]?.desc ? 'desc' : 'asc'
      })
  });

  const table = useTable({
    data: data?.data || [],
    columns: loyaltyProgramTypeColumns,
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
            Error loading loyalty program types: {error.message}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Loyalty Program Types</CardTitle>
        <CardDescription>
          Manage your loyalty program types and view their activity.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <DataTableToolbar
            table={table}
            exportFilename="loyalty-program-types"
            searchColumn="name"
            searchPlaceholder="Search types..."
          />
          {isLoading ? (
            <TableSkeleton columns={5} rows={5} />
          ) : (
            <DataTable table={table} columns={loyaltyProgramTypeColumns} />
          )}
          <DataTablePagination table={table} totalItems={data?.total} />
        </div>
      </CardContent>
    </Card>
  );
}
