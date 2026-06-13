import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import BusinessStaffView from './business-staff-view';

export default async function BusinessStaffPage() {
  const session = await auth();

  if (!session) {
    redirect('/login');
  }

  return <BusinessStaffView />;
}
