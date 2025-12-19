import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { RewardsEarnedDataTable } from './rewards-earned-data-table';

export default async function RewardsEarnedPage() {
  const session = await auth();

  if (!session) {
    redirect('/login');
  }

  return <RewardsEarnedDataTable />;
}
