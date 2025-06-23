'use client';

import { useState } from 'react';
import { PaginationState, SortingState } from '../../../types/table';
import { ColumnFiltersState } from '@tanstack/react-table';
import { useQuery } from '@tanstack/react-query';
import { useTable } from '../../../hooks/useTable';
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
import { useToolbarConfig } from '../../../hooks/useToolBareConfig';
import { LoyaltyProgram } from '../../../types/loyalty-programm';
import { fetchLoyaltyPrograms } from '../../api/loyalty-program';
import { loyaltyProgramColumns } from '../../../lib/columns/loyalty-program-columns';

interface LoyaltyProgrammDataTableProps {
  initialData?: LoyaltyProgram[];
}

export default function LoyaltyProgramDataTable({
  initialData = []
}: LoyaltyProgrammDataTableProps) {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10
  });
  const [sorting, setSorting] = useState<SortingState[]>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const { data, isLoading, error } = useQuery({
    queryKey: ['loyaltyProgram'],
    queryFn: () => fetchLoyaltyPrograms()
  });

  const table = useTable({
    data: data?.programs || [],
    columns: loyaltyProgramColumns,
    pageCount: Math.ceil((data?.total || 0) / pagination.pageSize),
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
            Error loading Loyalties programs: {error.message}
          </div>
        </CardContent>
      </Card>
    );
  }

  const toolbarConfig = useToolbarConfig('programs');

  return (
    <Card>
      <CardHeader>
        <CardTitle>Loyality Programs</CardTitle>
        <CardDescription>
          Manage your Loyality program and view their activity.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <DataTableToolbar table={table} config={toolbarConfig} />
          <DataTable table={table} />
          <DataTablePagination table={table} />
        </div>
      </CardContent>
    </Card>
  );
}
