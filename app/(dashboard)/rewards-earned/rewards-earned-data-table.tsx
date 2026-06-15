'use client';

import { useState, useEffect } from 'react';
import {
  ColumnFiltersState,
  SortingState,
  PaginationState
} from '@tanstack/react-table';
import { useQuery } from '@tanstack/react-query';
import { DateRange } from 'react-day-picker';
import {
  getRewardsEarned,
  searchRewardsEarned
} from '@/app/api/rewards-earned';
import { useDebounce } from '@/hooks/useDebounce';
import { useTable } from '@/hooks/useCustomerTable';
import { rewardsEarnedColumns } from '@/lib/columns/rewards-earned-columns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DataTableToolbar } from '@/components/data-table/data-table-toolbar';
import { DataTable } from '@/components/data-table/data-table';
import { DataTablePagination } from '@/components/data-table/data-table-pagination';
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
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 300);

  // The backend search endpoint requires `q` to be at least 2 characters; send
  // it only when valid, otherwise fall back to the plain list endpoint (which
  // carries the date-range filter — the search endpoint does not).
  const trimmed = debouncedSearch.trim();
  const q = trimmed.length >= 2 ? trimmed : undefined;

  useEffect(() => {
    setPagination((p) => ({ ...p, pageIndex: 0 }));
  }, [q]);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: [
      'rewards-earned',
      pagination.pageIndex,
      pagination.pageSize,
      sorting,
      dateRange,
      q ?? ''
    ],
    queryFn: () => {
      const base = {
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize,
        sortBy: sorting[0]?.id,
        sortOrder: (sorting[0]?.desc ? 'desc' : 'asc') as 'asc' | 'desc'
      };
      return q
        ? searchRewardsEarned({ ...base, q })
        : getRewardsEarned({
            ...base,
            startDate: dateRange?.from?.toISOString(),
            endDate: dateRange?.to?.toISOString()
          });
    }
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Rewards Earned</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <DataTableToolbar
            table={table}
            exportFilename="rewards-earned"
            searchValue={search}
            onSearchChange={setSearch}
            searchPlaceholder="Search by code..."
            statusColumn="status"
            statusOptions={statusOptions}
            dateRange={dateRange}
            onDateRangeChange={setDateRange}
          />
          <DataTable
            table={table}
            columns={rewardsEarnedColumns}
            isLoading={isLoading}
            error={error}
            onRetry={() => refetch()}
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
