'use client';

import { useState } from 'react';
import { LoyaltyProgram } from '../../../types/loyalty-program';
import { PaginationState } from '../../../types/table';
import { ColumnFiltersState, SortingState } from '@tanstack/react-table';
import { useQuery } from '@tanstack/react-query';
import { getLoyaltyPrograms } from '../../api/loyalty-program';
import { useTable } from '../../../hooks/useCustomerTable';
import { loyaltyProgramColumns } from '../../../lib/columns/loyalty-program-columns';
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

interface LoyaltyProgramsDataTableProps {
  initialData?: LoyaltyProgram[];
}

export function LoyaltyProgramsDataTable({
  initialData = []
}: LoyaltyProgramsDataTableProps) {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10
  });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [sorting, setSorting] = useState<any[]>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const { data, isLoading, error } = useQuery({
    queryKey: ['loyalty-program'],
    queryFn: () => getLoyaltyPrograms()
  });

  const table = useTable({
    data: data || [],
    columns: loyaltyProgramColumns,
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
        <CardTitle>Loyalty Programs</CardTitle>
        <CardDescription>
          Manage your loyalty programs and view their activity.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <DataTableToolbar table={table} />
          <DataTable table={table} columns={loyaltyProgramColumns} />
          <DataTablePagination table={table} />
        </div>
      </CardContent>
    </Card>
  );
}
