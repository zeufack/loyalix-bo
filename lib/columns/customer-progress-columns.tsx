import { ColumnDef } from '@tanstack/react-table';
import { CustomerProgress } from '@/types/customer-progress.type';

export const customerProgressColumns: ColumnDef<CustomerProgress>[] = [
  {
    accessorKey: 'id',
    header: 'ID'
  },
  {
    accessorKey: 'customerId',
    header: 'Customer ID'
  },
  {
    accessorKey: 'loyaltyProgramId',
    header: 'Loyalty Program ID'
  },
  {
    accessorKey: 'pointsEarned',
    header: 'Points Earned'
  },
  {
    accessorKey: 'rewardsRedeemed',
    header: 'Rewards Redeemed'
  }
];
