import { DataTable } from '@/components/data-table/data-table';
import { getEventTypes } from '@/app/api/event-type';
import { eventTypeColumns } from '@/lib/columns/event-type-columns';

export async function EventTypesDataTable() {
  const data = await getEventTypes();

  return <DataTable columns={eventTypeColumns} data={data} />;
}
