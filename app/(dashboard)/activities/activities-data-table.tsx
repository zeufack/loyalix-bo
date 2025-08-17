import { DataTable } from '@/components/data-table/data-table';
import { getActivities } from '@/app/api/activity';
import { activityColumns } from '@/lib/columns/activity-columns';

export async function ActivitiesDataTable() {
  const data = await getActivities();

  return <DataTable columns={activityColumns} data={data} />;
}
