import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { LoyaltyProgramsDataTable } from './loyalty-program-data-table';
import { CreateLoyaltyProgramForm } from './create-loyalty-program-form';

export default async function LoyaltyProgramPage() {
  const session = await auth();

  if (!session) {
    redirect('/login');
  }
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-end gap-2">
        <CreateLoyaltyProgramForm />
      </div>
      <LoyaltyProgramsDataTable />
    </div>
  );
}
