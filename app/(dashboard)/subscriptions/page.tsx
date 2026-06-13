import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import SubscriptionPlanDataTable from './subscription-plan-data-table';
import { CreateSubscriptionPlanForm } from './create-subscription-plan-form';

export default async function SubscriptionPage() {
  const session = await auth();

  if (!session) {
    redirect('/login');
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-end gap-2">
        <CreateSubscriptionPlanForm />
      </div>
      <SubscriptionPlanDataTable />
    </div>
  );
}
