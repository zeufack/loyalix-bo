import { ColumnDef } from '@tanstack/react-table';
import { LoyaltyProgram } from '@/types/loyalty-program';

export const loyaltyProgramColumns: ColumnDef<LoyaltyProgram>[] = [
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
  },
  {
    accessorKey: 'type',
    header: 'Type'
  },
  {
    accessorKey: 'businessId',
    header: 'Business ID'
  }
];
