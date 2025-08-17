import { ColumnDef } from '@tanstack/react-table';
import { Activity } from '@/types/activity';

export const activityColumns: ColumnDef<Activity>[] = [
  {
    accessorKey: 'id',
    header: 'ID'
  },
  {
    accessorKey: 'description',
    header: 'Description'
  },
  {
    accessorKey: 'userId',
    header: 'User ID'
  },
  {
    accessorKey: 'createdAt',
    header: 'Date'
  }
];
