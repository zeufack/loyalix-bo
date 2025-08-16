import { DataTable } from '@/components/data-table/data-table';
import { userColumns } from '@/lib/columns/user-columns';
import { User } from '@/types/user';

interface UsersDataTableProps {
  users: User[];
}

export function UsersDataTable({ users }: UsersDataTableProps) {
  return <DataTable columns={userColumns} data={users} />;
}
