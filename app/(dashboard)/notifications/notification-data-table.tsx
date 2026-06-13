'use client';

import { useState } from 'react';
import { DataTableToolbar } from '@/components/data-table/data-table-toolbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTable } from '@/hooks/useCustomerTable';
import {
  PaginationState,
  SortingState,
  ColumnFiltersState
} from '@tanstack/react-table';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getNotifications,
  deleteNotification,
  markAsRead,
  Notification
} from '@/app/api/notification';
import { DataTable } from '@/components/data-table/data-table';
import { DataTablePagination } from '@/components/data-table/data-table-pagination';
import { toast } from 'sonner';
import { ColumnDef } from '@tanstack/react-table';
import { Check, Trash2, Eye, Bell } from 'lucide-react';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { StatusBadge } from '@/components/ui/status-badge';

interface NotificationDataTableProps {
  status?: 'all' | 'read' | 'unread';
}

const notificationColumns: ColumnDef<Notification>[] = [
  {
    accessorKey: 'title',
    header: 'Title',
    cell: ({ row }) => <div className="font-medium">{row.original.title}</div>
  },
  {
    accessorKey: 'message',
    header: 'Message',
    cell: ({ row }) => (
      <div className="max-w-xs truncate">{row.original.message}</div>
    )
  },
  {
    accessorKey: 'type',
    header: 'Type',
    cell: ({ row }) => <Badge variant="outline">{row.original.type}</Badge>
  },
  {
    accessorKey: 'isRead',
    header: 'Status',
    cell: ({ row }) => (
      <StatusBadge status={row.original.isRead ? 'read' : 'unread'} />
    )
  },
  {
    accessorKey: 'createdAt',
    header: 'Date',
    cell: ({ row }) => (
      <div className="text-muted-foreground">
        {format(new Date(row.original.createdAt), 'MMM d, yyyy HH:mm')}
      </div>
    )
  },
  {
    id: 'actions',
    cell: ({ row }) => <ActionsCell notification={row.original} />
  }
];

function ActionsCell({ notification }: { notification: Notification }) {
  const queryClient = useQueryClient();

  const handleMarkAsRead = async () => {
    try {
      await markAsRead(notification.id);
      toast.success('Notification marked as read');
      await queryClient.invalidateQueries({ queryKey: ['notifications'] });
    } catch {
      toast.error('Failed to mark notification as read');
    }
  };

  const handleDelete = async () => {
    try {
      await deleteNotification(notification.id);
      toast.success('Notification deleted');
      await queryClient.invalidateQueries({ queryKey: ['notifications'] });
    } catch {
      toast.error('Failed to delete notification');
    }
  };

  return (
    <div className="flex items-center gap-2">
      {!notification.isRead && (
        <button
          onClick={handleMarkAsRead}
          className="p-2 hover:bg-muted rounded-md"
          title="Mark as read"
        >
          <Check className="h-4 w-4" />
        </button>
      )}
      <button
        onClick={handleDelete}
        className="p-2 hover:bg-muted rounded-md text-destructive"
        title="Delete"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  );
}

export default function NotificationDataTable({
  status = 'all'
}: NotificationDataTableProps) {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10
  });
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const queryClient = useQueryClient();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: [
      'notifications',
      pagination.pageIndex,
      pagination.pageSize,
      sorting,
      status
    ],
    queryFn: () =>
      getNotifications({
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize,
        sortBy: sorting[0]?.id,
        sortOrder: sorting[0]?.desc ? 'desc' : 'asc',
        status: status === 'all' ? undefined : status
      })
  });

  const table = useTable({
    data: data?.data || [],
    columns: notificationColumns,
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
        <CardTitle>Notifications</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <DataTableToolbar table={table} />
          <DataTable
            table={table}
            columns={notificationColumns}
            isLoading={isLoading}
            error={error}
            onRetry={() => refetch()}
            emptyMessage="No notifications yet."
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
