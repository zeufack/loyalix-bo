import { DataTable } from '@/components/data-table/data-table';
import { loyaltyProgramColumns } from '@/lib/columns/loyalty-program-columns';
import { LoyaltyProgram } from '@/types/loyalty-program';

interface LoyaltyProgramsDataTableProps {
  loyaltyPrograms: LoyaltyProgram[];
}

export function LoyaltyProgramsDataTable({ loyaltyPrograms }: LoyaltyProgramsDataTableProps) {
  return <DataTable columns={loyaltyProgramColumns} data={loyaltyPrograms} />;
}
