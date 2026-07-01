import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { LoyaltyProgramTemplatesDataTable } from './loyalty-program-templates-data-table';
import { CreateLoyaltyProgramTemplateForm } from './create-loyalty-program-template-form';

export default async function LoyaltyProgramTemplatesPage() {
  const session = await auth();

  if (!session) {
    redirect('/login');
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Loyalty Program Templates</h1>
        <CreateLoyaltyProgramTemplateForm />
      </div>
      <LoyaltyProgramTemplatesDataTable />
    </div>
  );
}
