import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { ActivitiesDataTable } from './activities-data-table';

export default async function ActivitiesPage() {
  const session = await auth();

  if (!session) {
    redirect('/login');
  }
  return <ActivitiesDataTable />;
}
