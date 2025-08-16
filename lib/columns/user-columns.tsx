import { ColumnDef } from '@tanstack/react-table';
import { User } from '@/types/user';

export const userColumns: ColumnDef<User>[] = [
  {
    accessorKey: 'id',
    header: 'ID'
  },
  {
    accessorKey: 'email',
    header: 'Email'
  },
  {
    accessorKey: 'firstName',
    header: 'First Name'
  },
  {
    accessorKey: 'lastName',
    header: 'Last Name'
  },
  {
    accessorKey: 'roles',
    header: 'Roles'
  },
  {
    accessorKey: 'isActive',
    header: 'Active'
  }
];
