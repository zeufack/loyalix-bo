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
import { SortingState, useTable } from '../../../hooks/useCustomerTable';
import { userColumns } from '../../../lib/columns/user-columns';
import { User } from '../../../types/user';
import { PaginationState } from '../../../types/table';
import { ColumnFiltersState } from '@tanstack/react-table';
import { useQuery } from '@tanstack/react-query';
import { getUsers } from '../../api/user';
import { DataTable } from '../../../components/data-table/data-table';
import { DataTablePagination } from '../../../components/data-table/data-table-pagination';

interface UserDataTableProps {
  initialData?: User[];
}

export default function UserDataTable({
  initialData = []
}: UserDataTableProps) {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10
  });
  const [sorting, setSorting] = useState<SortingState[]>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const { data, isLoading, error } = useQuery({
    queryKey: ['users'],
    queryFn: () => getUsers()
  });

  const table = useTable({
    data: data || [],
    columns: userColumns,
    pageCount: Math.ceil((data?.length || 0) / pagination.pageSize),
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
            Error loading customers: {error.message}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Customers</CardTitle>
        <CardDescription>
          Manage your customers and view their activity.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {isLoading ? (
            <div>Loading users...</div>
          ) : (
            <>
              <DataTableToolbar table={table} />
              <DataTable table={table} columns={userColumns} />
              <DataTablePagination table={table} />
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
