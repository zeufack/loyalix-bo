import { redirect } from 'next/navigation';
import { auth } from '../../../lib/auth';
import UserDataTable from './user-data-table';
import { CreateUserForm } from './create-user-form';

export default async function UserPage() {
  const session = await auth();

  if (!session) {
    redirect('/login');
  }
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-end gap-2">
        <CreateUserForm />
      </div>
      <UserDataTable />
    </div>
  );
}
