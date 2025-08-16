import { DataTable } from '@/components/data-table/data-table';
import { businessColumns } from '@/lib/columns/business-columns';
import { Business } from '@/types/business';

interface BusinessesDataTableProps {
  businesses: Business[];
}

export function BusinessesDataTable({ businesses }: BusinessesDataTableProps) {
  return <DataTable columns={businessColumns} data={businesses} />;
}
