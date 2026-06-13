import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { EventTypesDataTable } from './event-types-data-table';
import { CreateEventTypeForm } from './create-event-type-form';

export default async function EventTypesPage() {
  const session = await auth();

  if (!session) {
    redirect('/login');
  }
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-end gap-2">
        <CreateEventTypeForm />
      </div>
      <EventTypesDataTable />
    </div>
  );
}
