import { EventTypesDataTable } from './event-types-data-table';
import { CreateEventTypeForm } from './create-event-type-form';

export default function EventTypesPage() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Event Types</h1>
        <CreateEventTypeForm />
      </div>
      <EventTypesDataTable />
    </div>
  );
}
