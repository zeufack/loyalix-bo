'use client';

import { DataTable } from '@/components/data-table/data-table';
import { customerProgressColumns } from '@/lib/columns/customer-progress-columns';
import { CustomerProgress } from '@/types/customer-progress.type';
import { useTable } from '@/hooks/useCustomerTable';

interface CustomersProgressDataTableProps {
  customersProgress: CustomerProgress[];
}

export function CustomersProgressDataTable({ customersProgress }: CustomersProgressDataTableProps) {
  const table = useTable({
    data: customersProgress,
    columns: customerProgressColumns
  });

  return <DataTable table={table} columns={customerProgressColumns} />;
}
