import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { LoyaltyProgramTypesDataTable } from './loyalty-program-type-data-table';
import { CreateLoyaltyProgramTypeForm } from './create-loyalty-program-type-form';

export default async function LoyaltyProgramTypePage() {
  const session = await auth();

  if (!session) {
    redirect('/login');
  }
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-end gap-2">
        <CreateLoyaltyProgramTypeForm />
      </div>
      <LoyaltyProgramTypesDataTable />
    </div>
  );
}
