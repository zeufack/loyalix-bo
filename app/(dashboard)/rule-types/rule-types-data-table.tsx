'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { DataTable } from '@/components/data-table/data-table';
import { getRuleTypes } from '@/app/api/rule-type';
import { ruleTypeColumns } from '@/lib/columns/rule-type-columns';
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

export function RuleTypesDataTable() {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10
  });
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const { data, isLoading, error } = useQuery({
    queryKey: ['rule-types', pagination.pageIndex, pagination.pageSize, sorting],
    queryFn: () => getRuleTypes({
      page: pagination.pageIndex + 1,
      limit: pagination.pageSize,
      sortBy: sorting[0]?.id,
      sortOrder: sorting[0]?.desc ? 'desc' : 'asc'
    })
  });

  const table = useTable({
    data: data?.data || [],
    columns: ruleTypeColumns,
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
            Error loading rule types: {error.message}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Rule Types</CardTitle>
        <CardDescription>
          Manage loyalty program rule types.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <DataTableToolbar
            table={table}
            exportFilename="rule-types"
            searchColumn="name"
            searchPlaceholder="Search rule types..."
          />
          {isLoading ? (
            <TableSkeleton columns={5} rows={5} />
          ) : (
            <DataTable table={table} columns={ruleTypeColumns} />
          )}
          <DataTablePagination table={table} totalItems={data?.total} />
        </div>
      </CardContent>
    </Card>
  );
}
