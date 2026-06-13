import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { RolesDataTable } from './roles-data-table';
import { CreateRoleForm } from './create-role-form';

export default async function RolesPage() {
  const session = await auth();

  if (!session) {
    redirect('/login');
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-end gap-2">
        <CreateRoleForm />
      </div>
      <RolesDataTable />
    </div>
  );
}
