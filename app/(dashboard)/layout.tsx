import { cookies } from 'next/headers';
import Providers from './providers';
import { SkipLink } from '@/components/ui/skip-link';
import { DashboardShell } from './components/dashboard-shell';
import { User } from './components/user';
import { Notifications } from './components/notification';

export default async function DashboardLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const sidebarState = cookieStore.get('sidebar_state')?.value;
  const defaultOpen = sidebarState !== 'false';

  return (
    <Providers>
      <SkipLink />
      <DashboardShell
        defaultOpen={defaultOpen}
        headerActions={
          <>
            <Notifications />
            <User />
          </>
        }
      >
        {children}
      </DashboardShell>
    </Providers>
  );
}
