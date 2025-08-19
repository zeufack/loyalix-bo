'use client';

import { useState } from 'react';
import { LoyaltyProgramType } from '../../../types/loyalty-program-type';
import { PaginationState } from '../../../types/table';
import { ColumnFiltersState, SortingState } from '@tanstack/react-table';
import { useQuery } from '@tanstack/react-query';
import { getLoyaltyProgramTypes } from '../../api/loyalty-program-type';
import { useTable } from '../../../hooks/useCustomerTable';
import { loyaltyProgramTypeColumns } from '../../../lib/columns/loyalty-program-type-columns';
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

interface LoyaltyProgramTypesDataTableProps {
  initialData?: LoyaltyProgramType[];
}

export function LoyaltyProgramTypesDataTable({
  initialData = []
}: LoyaltyProgramTypesDataTableProps) {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10
  });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [sorting, setSorting] = useState<any[]>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const { data, isLoading, error } = useQuery({
    queryKey: ['loyalty-program-type'],
    queryFn: () => getLoyaltyProgramTypes()
  });

  const table = useTable({
    data: data || [],
    columns: loyaltyProgramTypeColumns,
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
        <CardTitle>Loyalty Program Types</CardTitle>
        <CardDescription>
          Manage your loyalty program types and view their activity.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <DataTableToolbar table={table} />
          <DataTable table={table} columns={loyaltyProgramTypeColumns} />
          <DataTablePagination table={table} />
        </div>
      </CardContent>
    </Card>
  );
}
