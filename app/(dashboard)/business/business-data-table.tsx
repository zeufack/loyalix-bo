'use client';

import { useState } from 'react';
import { Business } from '../../../types/business';
import { PaginationState } from '../../../types/table';
import { ColumnFiltersState, SortingState } from '@tanstack/react-table';
import { useQuery } from '@tanstack/react-query';
import { getBusinesses } from '../../api/business';
import { useTable } from '../../../hooks/useCustomerTable';
import { businessColumns } from '../../../lib/columns/business-columns';
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

interface BusinessDataTableProps {
  initialData?: Business[];
}

export default function BusinessDataTable({
  initialData = []
}: BusinessDataTableProps) {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10
  });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [sorting, setSorting] = useState<any[]>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const { data, isLoading, error } = useQuery({
    queryKey: ['business'],
    queryFn: () => getBusinesses()
  });

  const table = useTable({
    data: data || [],
    columns: businessColumns,
    pageCount: Math.ceil((data?.length || 0) / pagination.pageSize),
    onPaginationChange: setPagination,
    onSortingChange: setSorting as (sorting: SortingState) => void,
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
        <CardTitle>Business</CardTitle>
        <CardDescription>
          Manage your business and view their activity.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <DataTableToolbar table={table} />
          <DataTable table={table} columns={businessColumns} />
          <DataTablePagination table={table} />
        </div>
      </CardContent>
    </Card>
  );
}
