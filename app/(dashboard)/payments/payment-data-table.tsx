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
import { getPayments, Payment } from '@/app/api/payment';
import { DataTable } from '@/components/data-table/data-table';
import { DataTablePagination } from '@/components/data-table/data-table-pagination';
import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { StatusBadge } from '@/components/ui/status-badge';

interface PaymentDataTableProps {
  status?: string;
}

const paymentColumns: ColumnDef<Payment>[] = [
  {
    accessorKey: 'id',
    header: 'Transaction ID',
    cell: ({ row }) => (
      <div className="font-mono text-xs max-w-[120px] truncate">
        {row.original.id}
      </div>
    )
  },
  {
    accessorKey: 'business',
    header: 'Business',
    cell: ({ row }) => (
      <div>{row.original.business?.name || row.original.businessId}</div>
    )
  },
  {
    accessorKey: 'amount',
    header: 'Amount',
    cell: ({ row }) => (
      <div className="font-medium">
        ${Number(row.original.amount).toFixed(2)}{' '}
        {row.original.currency?.toUpperCase()}
      </div>
    )
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => <StatusBadge status={row.original.status} />
  },
  {
    accessorKey: 'providerType',
    header: 'Provider',
    cell: ({ row }) => (
      <Badge variant="outline">{row.original.providerType}</Badge>
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
  }
];

export default function PaymentDataTable({ status }: PaymentDataTableProps) {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10
  });
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: [
      'payments',
      pagination.pageIndex,
      pagination.pageSize,
      sorting,
      status
    ],
    queryFn: () =>
      getPayments({
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize,
        sortBy: sorting[0]?.id,
        sortOrder: sorting[0]?.desc ? 'desc' : 'asc',
        status
      })
  });

  const table = useTable({
    data: data?.data || [],
    columns: paymentColumns,
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
        <CardTitle>Payments</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <DataTableToolbar table={table} />
          <DataTable
            table={table}
            columns={paymentColumns}
            isLoading={isLoading}
            error={error}
            onRetry={() => refetch()}
            emptyMessage="No payments recorded yet."
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
