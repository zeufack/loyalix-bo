import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import AuditLogDataTable from './audit-log-data-table';

export default async function AuditLogPage() {
  const session = await auth();

  if (!session) {
    redirect('/login');
  }

  return <AuditLogDataTable />;
}
