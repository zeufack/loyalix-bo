import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import BusinessDataTable from './business-data-table';
import { CreateBusinessForm } from './create-business-form';

export default async function businessPage() {
  const session = await auth();

  if (!session) {
    redirect('/login');
  }
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-end gap-2">
        <CreateBusinessForm />
      </div>
      <BusinessDataTable />
    </div>
  );
}
