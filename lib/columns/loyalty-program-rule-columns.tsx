import { ColumnDef } from '@tanstack/react-table';
import { LoyaltyProgramRule } from '@/types/loyalty-program-rule';

export const loyaltyProgramRuleColumns: ColumnDef<LoyaltyProgramRule>[] = [
  {
    accessorKey: 'id',
    header: 'ID'
  },
  {
    accessorKey: 'ruleName',
    header: 'Rule Name'
  },
  {
    accessorKey: 'ruleType',
    header: 'Rule Type'
  },
  {
    accessorKey: 'points',
    header: 'Points'
  },
  {
    accessorKey: 'purchaseAmount',
    header: 'Purchase Amount'
  },
  {
    accessorKey: 'loyaltyProgramId',
    header: 'Loyalty Program ID'
  }
];
