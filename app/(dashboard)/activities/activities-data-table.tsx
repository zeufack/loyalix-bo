'use client';

import { useQuery } from '@tanstack/react-query';
import { DataTable } from '@/components/data-table/data-table';
import { getActivities } from '@/app/api/activity';
import { activityColumns } from '@/lib/columns/activity-columns';
import { useTable } from '@/hooks/useCustomerTable';

export function ActivitiesDataTable() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['activities'],
    queryFn: () => getActivities()
  });

  const table = useTable({
    data: data || [],
    columns: activityColumns
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading activities</div>;

  return <DataTable table={table} columns={activityColumns} />;
}
