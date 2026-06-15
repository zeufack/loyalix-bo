'use client';

import { useState, useEffect } from 'react';
import { useDebounce } from '@/hooks/useDebounce';
import { Business } from '../../../types/business';
import {
  ColumnFiltersState,
  SortingState,
  PaginationState
} from '@tanstack/react-table';
import { useQuery } from '@tanstack/react-query';
import { getBusinesses, searchBusinesses } from '../../api/business';
import { useTable } from '../../../hooks/useCustomerTable';
import { businessColumns } from '../../../lib/columns/business-columns';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from '../../../components/ui/card';
import { DataTableToolbar } from '../../../components/data-table/data-table-toolbar';
import { DataTable } from '../../../components/data-table/data-table';
import { DataTablePagination } from '../../../components/data-table/data-table-pagination';

export default function BusinessDataTable() {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10
  });
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 300);

  // The backend search endpoint requires `q` to be at least 2 characters; send
  // it only when valid, otherwise fall back to the plain list endpoint.
  const trimmed = debouncedSearch.trim();
  const q = trimmed.length >= 2 ? trimmed : undefined;

  useEffect(() => {
    setPagination((p) => ({ ...p, pageIndex: 0 }));
  }, [q]);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: [
      'business',
      pagination.pageIndex,
      pagination.pageSize,
      sorting,
      q ?? ''
    ],
    queryFn: () => {
      const params = {
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize,
        sortBy: sorting[0]?.id,
        sortOrder: (sorting[0]?.desc ? 'desc' : 'asc') as 'asc' | 'desc'
      };
      return q ? searchBusinesses({ ...params, q }) : getBusinesses(params);
    }
  });

  const table = useTable({
    data: data?.data || [],
    columns: businessColumns,
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
        <CardTitle>Businesses</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <DataTableToolbar
            table={table}
            exportFilename="businesses"
            searchValue={search}
            onSearchChange={setSearch}
            searchPlaceholder="Search businesses..."
          />
          <DataTable
            table={table}
            columns={businessColumns}
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
