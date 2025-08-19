'use client';

import { useQuery } from '@tanstack/react-query';
import { DataTable } from '@/components/data-table/data-table';
import { getEventTypes } from '@/app/api/event-type';
import { eventTypeColumns } from '@/lib/columns/event-type-columns';
import { useTable } from '@/hooks/useCustomerTable';

export function EventTypesDataTable() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['event-types'],
    queryFn: () => getEventTypes()
  });

  const table = useTable({
    data: data || [],
    columns: eventTypeColumns
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading event types</div>;

  return <DataTable table={table} columns={eventTypeColumns} />;
}
