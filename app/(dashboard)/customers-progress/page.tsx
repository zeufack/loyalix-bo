import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { CustomersProgressDataTable } from './customers-progress-data-table';

export default async function CustomersProgressPage() {
  const session = await auth();

  if (!session) {
    redirect('/login');
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold">Customer Progress</h1>
        <p className="text-muted-foreground">
          Track customer progress toward rewards across all loyalty programs
        </p>
      </div>
      <CustomersProgressDataTable />
    </div>
  );
}
