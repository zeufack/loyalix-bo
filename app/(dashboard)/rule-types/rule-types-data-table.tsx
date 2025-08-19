'use client';

import { useQuery } from '@tanstack/react-query';
import { DataTable } from '@/components/data-table/data-table';
import { getRuleTypes } from '@/app/api/rule-type';
import { ruleTypeColumns } from '@/lib/columns/rule-type-columns';
import { useTable } from '@/hooks/useCustomerTable';

export function RuleTypesDataTable() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['rule-types'],
    queryFn: () => getRuleTypes()
  });

  const table = useTable({
    data: data || [],
    columns: ruleTypeColumns
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading rule types</div>;

  return <DataTable table={table} columns={ruleTypeColumns} />;
}
