import { redirect } from 'next/navigation';
import { CreatePermissionForm } from './create-permission-form';
import PermissionsDataTable from './permissions-data-table';
import { auth } from '../../../lib/auth';

export default async function PermissionsPage() {
  const session = await auth();

  if (!session) {
    redirect('/login');
  }
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-end gap-2">
        <CreatePermissionForm />
      </div>
      <PermissionsDataTable />
    </div>
  );
}
