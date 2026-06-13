'use client';

import { useState } from 'react';
import { DataTableToolbar } from '../../../components/data-table/data-table-toolbar';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from '../../../components/ui/card';
import { useTable } from '../../../hooks/useCustomerTable';
import { permissionColumns } from '../../../lib/columns/permission-columns';
import {
  PaginationState,
  SortingState,
  ColumnFiltersState
} from '@tanstack/react-table';
import { useQuery } from '@tanstack/react-query';
import { getPermissions } from '../../api/permission';
import { DataTable } from '../../../components/data-table/data-table';
import { DataTablePagination } from '../../../components/data-table/data-table-pagination';

export default function PermissionsDataTable() {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10
  });
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: [
      'permissions',
      pagination.pageIndex,
      pagination.pageSize,
      sorting
    ],
    queryFn: () =>
      getPermissions({
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize,
        sortBy: sorting[0]?.id,
        sortOrder: sorting[0]?.desc ? 'desc' : 'asc'
      })
  });

  const table = useTable({
    data: data?.data || [],
    columns: permissionColumns,
    pageCount: data?.totalPages || 0,
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    manualPagination: true,
    manualSorting: true,
    manualFiltering: true
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Permissions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <DataTableToolbar
            table={table}
            exportFilename="permissions"
            searchColumn="name"
            searchPlaceholder="Search permissions..."
          />
          <DataTable
            table={table}
            columns={permissionColumns}
            isLoading={isLoading}
            error={error}
            onRetry={() => refetch()}
          />
          <DataTablePagination
            table={table}
            totalItems={data?.total}
            isLoading={isLoading}
            error={error}
          />
        </div>
      </CardContent>
    </Card>
  );
}
