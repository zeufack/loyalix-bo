import { Analytics } from '@vercel/analytics/react';
import { User } from './components/user';
import Providers from './providers';
import { DashboardBreadcrumbs } from './components/dashboard-breadcrumbs';
import { Notifications } from './components/notification';
import { MobileNav } from './components/mobile-nav';
import { AppSidebar } from './components/app-sidebar';
import { GlobalSearch } from '@/components/global-search';
import { SkipLink } from '@/components/ui/skip-link';

export default function DashboardLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <Providers>
      <SkipLink />
      <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
        <AppSidebar />
        <div className="flex flex-col">
          <header
            className="flex h-14 items-center gap-4 border-b bg-background px-4 lg:h-[60px] lg:px-6"
            role="banner"
          >
            <MobileNav />
            <DashboardBreadcrumbs
              items={[
                { label: 'Home', href: '/' },
                { label: 'Dashboard', href: '/dashboard' },
                { label: 'Products' }
              ]}
            />
            <div className="ml-auto flex items-center gap-4">
              <GlobalSearch />
              <Notifications />
              <User />
            </div>
          </header>
          <main
            id="main-content"
            className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6"
            role="main"
            tabIndex={-1}
          >
            {children}
          </main>
        </div>
      </div>
      <Analytics />
    </Providers>
  );
}
