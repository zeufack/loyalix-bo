import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { RewardsDataTable } from './rewards-data-table';
import { CreateRewardForm } from './create-reward-form';

export default async function RewardsPage() {
  const session = await auth();

  if (!session) {
    redirect('/login');
  }
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-end gap-2">
        <CreateRewardForm />
      </div>
      <RewardsDataTable />
    </div>
  );
}
