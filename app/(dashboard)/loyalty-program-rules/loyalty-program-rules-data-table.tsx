'use client';

import { useState } from 'react';
import { LoyaltyProgramRule } from '../../../types/loyalty-program-rule';
import { ColumnFiltersState, SortingState, PaginationState } from '@tanstack/react-table';
import { useQuery } from '@tanstack/react-query';
import { getLoyaltyProgramRules } from '../../api/loyalty-program-rule';
import { useTable } from '../../../hooks/useCustomerTable';
import { loyaltyProgramRuleColumns } from '../../../lib/columns/loyalty-program-rule-columns';
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

interface LoyaltyProgramRulesDataTableProps {
  initialData?: LoyaltyProgramRule[];
}

export function LoyaltyProgramRulesDataTable({
  initialData = []
}: LoyaltyProgramRulesDataTableProps) {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10
  });
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const { data, isLoading, error } = useQuery({
    queryKey: ['loyalty-program-rules'],
    queryFn: () => getLoyaltyProgramRules()
  });

  const table = useTable({
    data: data || [],
    columns: loyaltyProgramRuleColumns,
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
        <CardTitle>Loyalty Program Rules</CardTitle>
        <CardDescription>
          Manage your loyalty program rules and view their activity.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <DataTableToolbar
            table={table}
            exportFilename="loyalty-program-rules"
          />
          <DataTable table={table} columns={loyaltyProgramRuleColumns} />
          <DataTablePagination table={table} />
        </div>
      </CardContent>
    </Card>
  );
}
