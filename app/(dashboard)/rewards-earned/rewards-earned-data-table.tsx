'use client';

import { useState } from 'react';
import { ColumnFiltersState, SortingState, PaginationState } from '@tanstack/react-table';
import { useQuery } from '@tanstack/react-query';
import { DateRange } from 'react-day-picker';
import { getRewardsEarned } from '@/app/api/rewards-earned';
import { useTable } from '@/hooks/useCustomerTable';
import { rewardsEarnedColumns } from '@/lib/columns/rewards-earned-columns';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { DataTableToolbar } from '@/components/data-table/data-table-toolbar';
import { DataTable } from '@/components/data-table/data-table';
import { DataTablePagination } from '@/components/data-table/data-table-pagination';
import { TableSkeleton } from '@/components/ui/table-skeleton';
import { Clock, CheckCircle, Gift, XCircle } from 'lucide-react';

const statusOptions = [
  { label: 'Pending', value: 'pending', icon: Clock },
  { label: 'Earned', value: 'earned', icon: Gift },
  { label: 'Redeemed', value: 'redeemed', icon: CheckCircle },
  { label: 'Expired', value: 'expired', icon: XCircle }
];

export function RewardsEarnedDataTable() {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10
  });
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [dateRange, setDateRange] = useState<DateRange | undefined>();

  const { data, isLoading, error } = useQuery({
    queryKey: ['rewards-earned', pagination.pageIndex, pagination.pageSize, sorting, dateRange],
    queryFn: () =>
      getRewardsEarned({
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize,
        sortBy: sorting[0]?.id,
        sortOrder: sorting[0]?.desc ? 'desc' : 'asc',
        startDate: dateRange?.from?.toISOString(),
        endDate: dateRange?.to?.toISOString()
      })
  });

  const table = useTable({
    data: data?.data || [],
    columns: rewardsEarnedColumns,
    pageCount: data?.totalPages || 0,
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
            Error loading rewards: {error.message}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Rewards Earned</CardTitle>
        <CardDescription>
          Track customer rewards earned and redemptions across all loyalty programs.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <DataTableToolbar
            table={table}
            exportFilename="rewards-earned"
            searchColumn="redemptionCode"
            searchPlaceholder="Search by code..."
            statusColumn="status"
            statusOptions={statusOptions}
            dateRange={dateRange}
            onDateRangeChange={setDateRange}
          />
          {isLoading ? (
            <TableSkeleton columns={5} rows={5} />
          ) : (
            <DataTable table={table} columns={rewardsEarnedColumns} />
          )}
          <DataTablePagination table={table} totalItems={data?.total} />
        </div>
      </CardContent>
    </Card>
  );
}
