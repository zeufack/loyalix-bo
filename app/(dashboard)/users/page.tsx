import { RoleGate } from '@/components/auth/role-gate';
import { UserRole } from '@/types/user';
import { getUsers } from '@/app/api/user';
import { UsersDataTable } from './user-data-table';
import { CreateUserForm } from './create-user-form';

export default async function UserPage() {
  const users = await getUsers();
  return (
    <RoleGate allowedRoles={[UserRole.SUPER_ADMIN, UserRole.ADMIN]}>
      <div className="flex justify-end">
        <CreateUserForm />
      </div>
      <UsersDataTable users={users} />
    </RoleGate>
  );
}
