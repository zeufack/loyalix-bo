import { DataTable } from '@/components/data-table/data-table';
import { loyaltyProgramTypeColumns } from '@/lib/columns/loyalty-program-type-columns';
import { LoyaltyProgramType } from '@/types/loyalty-program-type';

interface LoyaltyProgramTypesDataTableProps {
  loyaltyProgramTypes: LoyaltyProgramType[];
}

export function LoyaltyProgramTypesDataTable({ loyaltyProgramTypes }: LoyaltyProgramTypesDataTableProps) {
  return <DataTable columns={loyaltyProgramTypeColumns} data={loyaltyProgramTypes} />;
}
