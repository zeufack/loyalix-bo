'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { getCustomers } from '@/app/api/customer';
import { PaginationState, ColumnFiltersState } from '@tanstack/react-table';
import { Customer } from '@/types/customer';
import { customerColumns } from '@/lib/columns/customer-columns';
import { DataTable } from '@/components/data-table/data-table';
import { useTable } from '@/hooks/useCustomerTable';
import { DataTablePagination } from '@/components/data-table/data-table-pagination';
import { DataTableToolbar } from '@/components/data-table/data-table-toolbar';
import { SortingState } from '@/types/table';

interface CustomersDataTableProps {
  initialData?: Customer[];
}

export function CustomersDataTable({
  initialData = []
}: CustomersDataTableProps) {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10
  });
  const [sorting, setSorting] = useState<SortingState[]>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const { data, isLoading, error } = useQuery({
    queryKey: ['customers', pagination, sorting],
    queryFn: () => getCustomers()
  });

  const table = useTable({
    data: data?.customers || [],
    columns: customerColumns,
    pageCount: data?.total ? Math.ceil(data.total / pagination.pageSize) : 0,
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
          <DataTableToolbar table={table} />
          <DataTable table={table} columns={customerColumns} />
          <DataTablePagination table={table} />
        </div>
      </CardContent>
    </Card>
  );
}
