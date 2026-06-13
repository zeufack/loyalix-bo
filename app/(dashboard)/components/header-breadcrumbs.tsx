'use client';

import { usePathname } from 'next/navigation';
import { navGroups } from './nav-items';
import { DashboardBreadcrumbs } from './dashboard-breadcrumbs';

export function HeaderBreadcrumbs() {
  const pathname = usePathname();

  if (pathname === '/') {
    return <DashboardBreadcrumbs items={[{ label: 'Dashboard' }]} />;
  }

  for (const group of navGroups) {
    const item = group.items.find(
      (i) => i.href !== '/' && pathname.startsWith(i.href)
    );
    if (item) {
      return (
        <DashboardBreadcrumbs
          items={[{ label: group.label }, { label: item.label }]}
        />
      );
    }
  }

  return null;
}
