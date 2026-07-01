'use client';

import { useState } from 'react';
import {
  ColumnFiltersState,
  SortingState,
  PaginationState
} from '@tanstack/react-table';
import { useQuery } from '@tanstack/react-query';
import { getLoyaltyProgramTemplates } from '@/app/api/loyalty-program-templates';
import { getBusinessTypes } from '@/app/api/business-type';
import { loyaltyProgramTemplateColumns } from '@/lib/columns/loyalty-program-template-columns';
import { useTable } from '@/hooks/useCustomerTable';
import { DataTableToolbar } from '@/components/data-table/data-table-toolbar';
import { DataTable } from '@/components/data-table/data-table';
import { DataTablePagination } from '@/components/data-table/data-table-pagination';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';

const STATUS_OPTIONS = [
  { value: 'all', label: 'All Statuses' },
  { value: 'true', label: 'Active' },
  { value: 'false', label: 'Inactive' }
];

export function LoyaltyProgramTemplatesDataTable() {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10
  });
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [businessTypeFilter, setBusinessTypeFilter] = useState('all');

  const isActive =
    statusFilter === 'all' ? undefined : statusFilter === 'true';
  const businessTypeName =
    businessTypeFilter === 'all' ? undefined : businessTypeFilter;

  const { data: businessTypesData } = useQuery({
    queryKey: ['business-types-all'],
    queryFn: () => getBusinessTypes({ limit: 100 })
  });

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: [
      'loyalty-program-templates',
      pagination.pageIndex,
      pagination.pageSize,
      sorting,
      isActive,
      businessTypeName
    ],
    queryFn: () =>
      getLoyaltyProgramTemplates({
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize,
        sortBy: sorting[0]?.id,
        sortOrder: sorting[0]?.desc ? 'desc' : 'asc',
        isActive,
        businessTypeName
      })
  });

  const table = useTable({
    data: data?.data || [],
    columns: loyaltyProgramTemplateColumns,
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
        <CardTitle>Loyalty Program Templates</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap items-center gap-2">
              <Select
                value={statusFilter}
                onValueChange={(value) => {
                  setStatusFilter(value);
                  setPagination((p) => ({ ...p, pageIndex: 0 }));
                }}
              >
                <SelectTrigger className="h-8 w-[150px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  {STATUS_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                value={businessTypeFilter}
                onValueChange={(value) => {
                  setBusinessTypeFilter(value);
                  setPagination((p) => ({ ...p, pageIndex: 0 }));
                }}
              >
                <SelectTrigger className="h-8 w-[180px]">
                  <SelectValue placeholder="Business Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Business Types</SelectItem>
                  {businessTypesData?.data.map((type) => (
                    <SelectItem key={type.id} value={type.name}>
                      {type.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <DataTableToolbar
              table={table}
              exportFilename="loyalty-program-templates"
              showSearch={false}
            />
          </div>
          <DataTable
            table={table}
            columns={loyaltyProgramTemplateColumns}
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
