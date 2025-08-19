'use client';

import { DataTable } from '@/components/data-table/data-table';
import { loyaltyProgramTypeColumns } from '@/lib/columns/loyalty-program-type-columns';
import { LoyaltyProgramType } from '@/types/loyalty-program-type';
import { useTable } from '@/hooks/useCustomerTable';

interface LoyaltyProgramTypesDataTableProps {
  loyaltyProgramTypes: LoyaltyProgramType[];
}

export function LoyaltyProgramTypesDataTable({ loyaltyProgramTypes }: LoyaltyProgramTypesDataTableProps) {
  const table = useTable({
    data: loyaltyProgramTypes,
    columns: loyaltyProgramTypeColumns
  });

  return <DataTable table={table} columns={loyaltyProgramTypeColumns} />;
}
