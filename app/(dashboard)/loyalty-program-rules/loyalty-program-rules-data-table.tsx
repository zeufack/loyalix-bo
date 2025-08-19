'use client';

import { DataTable } from '@/components/data-table/data-table';
import { loyaltyProgramRuleColumns } from '@/lib/columns/loyalty-program-rule-columns';
import { LoyaltyProgramRule } from '@/types/loyalty-program-rule';
import { useTable } from '@/hooks/useCustomerTable';

interface LoyaltyProgramRulesDataTableProps {
  loyaltyProgramRules: LoyaltyProgramRule[];
}

export function LoyaltyProgramRulesDataTable({ loyaltyProgramRules }: LoyaltyProgramRulesDataTableProps) {
  const table = useTable({
    data: loyaltyProgramRules,
    columns: loyaltyProgramRuleColumns
  });

  return <DataTable table={table} columns={loyaltyProgramRuleColumns} />;
}
