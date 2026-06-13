import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { CustomersDataTable } from './customers-data-table';
import { CreateCustomerForm } from './create-customer-form';

export default async function CustomersPage() {
  const session = await auth();

  if (!session) {
    redirect('/login');
  }
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-end gap-2">
        <CreateCustomerForm />
      </div>
      <CustomersDataTable></CustomersDataTable>
    </div>
  );
}
