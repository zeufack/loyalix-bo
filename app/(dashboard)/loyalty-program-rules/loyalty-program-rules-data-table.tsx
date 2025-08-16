import { DataTable } from '@/components/data-table/data-table';
import { loyaltyProgramRuleColumns } from '@/lib/columns/loyalty-program-rule-columns';
import { LoyaltyProgramRule } from '@/types/loyalty-program-rule';

interface LoyaltyProgramRulesDataTableProps {
  loyaltyProgramRules: LoyaltyProgramRule[];
}

export function LoyaltyProgramRulesDataTable({ loyaltyProgramRules }: LoyaltyProgramRulesDataTableProps) {
  return <DataTable columns={loyaltyProgramRuleColumns} data={loyaltyProgramRules} />;
}
