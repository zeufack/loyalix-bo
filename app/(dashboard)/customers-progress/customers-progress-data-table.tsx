import { DataTable } from '@/components/data-table/data-table';
import { customerProgressColumns } from '@/lib/columns/customer-progress-columns';
import { CustomerProgress } from '@/types/customer-progress.type';

interface CustomersProgressDataTableProps {
  customersProgress: CustomerProgress[];
}

export function CustomersProgressDataTable({ customersProgress }: CustomersProgressDataTableProps) {
  return <DataTable columns={customerProgressColumns} data={customersProgress} />;
}
