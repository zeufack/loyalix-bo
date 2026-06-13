import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { LoyaltyProgramRulesDataTable } from './loyalty-program-rules-data-table';
import { CreateLoyaltyProgramRuleForm } from './create-loyalty-program-rule-form';

export default async function LoyaltyProgramRulesPage() {
  const session = await auth();

  if (!session) {
    redirect('/login');
  }
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-end gap-2">
        <CreateLoyaltyProgramRuleForm />
      </div>
      <LoyaltyProgramRulesDataTable />
    </div>
  );
}
