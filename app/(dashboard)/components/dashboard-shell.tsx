'use client';

import { ReactNode } from 'react';
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger
} from '@/components/ui/sidebar';
import { AppSidebar } from './app-sidebar';
import { MobileNav } from './mobile-nav';
import { GlobalSearch } from '@/components/global-search';

interface DashboardShellProps {
  children: ReactNode;
  headerActions?: ReactNode;
  defaultOpen?: boolean;
}

export function DashboardShell({
  children,
  headerActions,
  defaultOpen = true
}: DashboardShellProps) {
  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <AppSidebar />
      <SidebarInset>
        <header className="sticky top-0 flex h-14 shrink-0 items-center gap-2 border-b bg-background px-4 lg:h-[60px] lg:px-6">
          <SidebarTrigger className="-ml-1" />
          <div className="h-4 w-px bg-border" />
          <MobileNav />
          <div className="ml-auto flex items-center gap-4">
            <GlobalSearch />
            {headerActions}
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
