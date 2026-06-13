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
import { useQuery } from '@tanstack/react-query';
import { getAuditLogs, AuditLog } from '@/app/api/audit-log';
import { DataTable } from '@/components/data-table/data-table';
import { DataTablePagination } from '@/components/data-table/data-table-pagination';
import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { StatusBadge, StatusTone } from '@/components/ui/status-badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';

const actionTone = (action: string): StatusTone => {
  if (action.includes('create')) return 'success';
  if (action.includes('update') || action.includes('change')) return 'info';
  if (
    action.includes('delete') ||
    action.includes('cancel') ||
    action.includes('suspend')
  )
    return 'error';
  return 'neutral';
};

const auditLogColumns: ColumnDef<AuditLog>[] = [
  {
    accessorKey: 'createdAt',
    header: 'Timestamp',
    cell: ({ row }) => (
      <div className="text-muted-foreground text-sm">
        {format(new Date(row.original.createdAt), 'MMM d, yyyy HH:mm:ss')}
      </div>
    )
  },
  {
    accessorKey: 'user',
    header: 'User',
    cell: ({ row }) => (
      <div>
        {row.original.user
          ? `${row.original.user.firstName} ${row.original.user.lastName}`
          : 'System'}
      </div>
    )
  },
  {
    accessorKey: 'action',
    header: 'Action',
    cell: ({ row }) => (
      <StatusBadge
        status={row.original.action}
        tone={actionTone(row.original.action)}
      />
    )
  },
  {
    accessorKey: 'entityType',
    header: 'Entity',
    cell: ({ row }) => (
      <div>
        <span className="font-medium">{row.original.entityType}</span>
        {row.original.entityId && (
          <span className="text-xs text-muted-foreground ml-1">
            ({row.original.entityId.substring(0, 8)}...)
          </span>
        )}
      </div>
    )
  },
  {
    accessorKey: 'description',
    header: 'Details',
    cell: ({ row }) => (
      <div className="max-w-xs truncate text-muted-foreground">
        {row.original.description || '-'}
      </div>
    )
  },
  {
    accessorKey: 'ipAddress',
    header: 'IP',
    cell: ({ row }) => (
      <div className="font-mono text-xs">{row.original.ipAddress || '-'}</div>
    )
  }
];

export default function AuditLogDataTable() {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 50
  });
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['auditLogs', pagination.pageIndex, pagination.pageSize, sorting],
    queryFn: () =>
      getAuditLogs({
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize,
        sortBy: sorting[0]?.id,
        sortOrder: sorting[0]?.desc ? 'desc' : 'asc'
      }),
    refetchInterval: 30000
  });

  const table = useTable({
    data: data?.data || [],
    columns: auditLogColumns,
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
        <CardTitle>Audit Logs</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <DataTableToolbar table={table} />
          <DataTable
            table={table}
            columns={auditLogColumns}
            isLoading={isLoading}
            error={error}
            onRetry={() => refetch()}
            emptyMessage="No audit log entries yet."
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
