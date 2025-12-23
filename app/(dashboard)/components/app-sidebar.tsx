'use client';

import Link from 'next/link';
import { Package2, Settings } from 'lucide-react';
import { mainNavItems } from './nav-items';
import { SidebarMenuButton } from './sidebar-menu-button';

export function AppSidebar() {
  return (
    <aside
      className="hidden border-r bg-muted/40 md:block"
      role="complementary"
      aria-label="Main navigation sidebar"
    >
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
          <Link
            href="/"
            className="flex items-center gap-2 font-semibold"
            aria-label="Loyalix - Go to dashboard"
          >
            <Package2 className="h-6 w-6" aria-hidden="true" />
            <span>Loyalix</span>
          </Link>
        </div>
        <div className="flex-1 ">
          <nav
            className="grid items-start px-2 text-sm font-medium lg:px-4"
            aria-label="Main navigation"
          >
            {mainNavItems.map((item) => (
              <SidebarMenuButton key={item.label} item={item} />
            ))}
          </nav>
        </div>
      </div>
    </aside>
  );
}
