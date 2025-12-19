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
import { userColumns } from '../../../lib/columns/user-columns';
import {
  PaginationState,
  SortingState,
  ColumnFiltersState,
  RowSelectionState
} from '@tanstack/react-table';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getUsers, deleteUser } from '../../api/user';
import { DataTable } from '../../../components/data-table/data-table';
import { DataTablePagination } from '../../../components/data-table/data-table-pagination';
import { DataTableBulkActions, BulkAction } from '@/components/data-table/data-table-bulk-actions';
import { TableSkeleton } from '../../../components/ui/table-skeleton';
import { User } from '@/types/user';
import { Trash2, Ban, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function UserDataTable() {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10
  });
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ['users', pagination.pageIndex, pagination.pageSize, sorting],
    queryFn: () => getUsers({
      page: pagination.pageIndex + 1,
      limit: pagination.pageSize,
      sortBy: sorting[0]?.id,
      sortOrder: sorting[0]?.desc ? 'desc' : 'asc'
    })
  });

  const table = useTable({
    data: data?.data || [],
    columns: userColumns,
    pageCount: data?.totalPages || 0,
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onRowSelectionChange: setRowSelection,
    state: {
      rowSelection
    },
    manualPagination: true,
    manualSorting: true,
    manualFiltering: true,
    enableRowSelection: true
  });

  const bulkActions: BulkAction<User>[] = [
    {
      label: 'Delete',
      icon: <Trash2 className="h-4 w-4" />,
      variant: 'destructive',
      requireConfirmation: true,
      confirmTitle: 'Delete selected users?',
      confirmDescription: 'This action cannot be undone. All selected users will be permanently deleted.',
      onClick: async (selectedUsers) => {
        const results = await Promise.allSettled(
          selectedUsers.map((user) => deleteUser(user.id))
        );
        const succeeded = results.filter((r) => r.status === 'fulfilled').length;
        const failed = results.filter((r) => r.status === 'rejected').length;

        if (succeeded > 0) {
          toast.success(`Successfully deleted ${succeeded} user(s)`);
        }
        if (failed > 0) {
          toast.error(`Failed to delete ${failed} user(s)`);
        }
        await queryClient.invalidateQueries({ queryKey: ['users'] });
      }
    }
  ];

  const handleBulkActionComplete = () => {
    setRowSelection({});
  };

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-red-500">
            Error loading users: {error.message}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Users</CardTitle>
        <CardDescription>
          Manage users and view their activity.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <DataTableBulkActions
            table={table}
            actions={bulkActions}
            onActionComplete={handleBulkActionComplete}
          />
          <DataTableToolbar
            table={table}
            exportFilename="users"
            searchColumn="email"
            searchPlaceholder="Search users..."
          />
          {isLoading ? (
            <TableSkeleton columns={6} rows={5} />
          ) : (
            <DataTable table={table} columns={userColumns} />
          )}
          <DataTablePagination table={table} totalItems={data?.total} />
        </div>
      </CardContent>
    </Card>
  );
}
