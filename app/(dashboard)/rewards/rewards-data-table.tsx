'use client';

import { useQuery } from '@tanstack/react-query';
import { DataTable } from '@/components/data-table/data-table';
import { getRewards } from '@/app/api/reward';
import { rewardColumns } from '@/lib/columns/reward-columns';
import { useTable } from '@/hooks/useCustomerTable';

export function RewardsDataTable() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['rewards'],
    queryFn: () => getRewards()
  });

  const table = useTable({
    data: data || [],
    columns: rewardColumns
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading rewards</div>;

  return <DataTable table={table} columns={rewardColumns} />;
}
