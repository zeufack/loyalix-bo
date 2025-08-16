import { ColumnDef } from '@tanstack/react-table';
import { Business } from '@/types/business';

export const businessColumns: ColumnDef<Business>[] = [
  {
    accessorKey: 'id',
    header: 'ID'
  },
  {
    accessorKey: 'name',
    header: 'Name'
  },
  {
    accessorKey: 'email',
    header: 'Email'
  },
  {
    accessorKey: 'phoneNumber',
    header: 'Phone Number'
  },
  {
    accessorKey: 'ownerId',
    header: 'Owner ID'
  }
];
