import { ColumnDef } from '@tanstack/react-table';
import { LoyaltyProgramType } from '@/types/loyalty-program-type';

export const loyaltyProgramTypeColumns: ColumnDef<LoyaltyProgramType>[] = [
  {
    accessorKey: 'id',
    header: 'ID'
  },
  {
    accessorKey: 'name',
    header: 'Name'
  },
  {
    accessorKey: 'description',
    header: 'Description'
  }
];
