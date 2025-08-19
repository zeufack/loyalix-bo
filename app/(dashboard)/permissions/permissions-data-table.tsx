'use client';

import { useState } from 'react';
import { DataTableToolbar } from '../../../components/data-table/data-table-toolbar';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '../../../components/ui/card';
import { useTable } from '../../../hooks/useCustomerTable';
import { permissionColumns } from '../../../lib/columns/permission-columns';
import { Permission } from '../../../types/permission';
import { PaginationState, SortingState } from '@tanstack/react-table';
import { useQuery } from '@tanstack/react-query';
import { getPermissions } from '../../api/permission';
import { DataTable } from '../../../components/data-table/data-table';
import { DataTablePagination } from '../../../components/data-table/data-table-pagination';

interface PermissionsDataTableProps {
  initialData?: Permission[];
}

export default function PermissionsDataTable({
  initialData = []
}: PermissionsDataTableProps) {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10
  });
  const [sorting, setSorting] = useState<SortingState[]>([]);

  const { data, isLoading, error } = useQuery({
    queryKey: ['permissions', pagination, sorting],
    queryFn: () => getPermissions()
  });

  const table = useTable({
    data: data || [],
    columns: permissionColumns,
    pageCount: data?.length ? Math.ceil(data.length / pagination.pageSize) : 0,
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    manualPagination: true,
    manualSorting: true,
  });

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-red-500">
            Error loading permissions: {error.message}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Permissions</CardTitle>
        <CardDescription>
          Manage your permissions and view their activity.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {isLoading ? (
            <div>Loading permissions...</div>
          ) : (
            <>
              <DataTableToolbar table={table} />
              <DataTable table={table} columns={permissionColumns} />
              <DataTablePagination table={table} />
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
