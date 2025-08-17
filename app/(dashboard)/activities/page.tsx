import { ActivitiesDataTable } from './activities-data-table';

export default function ActivitiesPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Activities</h1>
      <ActivitiesDataTable />
    </div>
  );
}
