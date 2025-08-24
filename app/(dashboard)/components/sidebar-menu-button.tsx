'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { clsx } from 'clsx';

export function SidebarMenuButton({
  item,
}: {
  item: { href: string; label: string; icon: React.ElementType };
}) {
  const pathname = usePathname();
  const isActive = pathname === item.href;

  return (
    <Link
      href={item.href}
      className={clsx(
        'flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary',
        {
          'bg-muted text-primary': isActive,
        }
      )}
    >
      <item.icon className="h-4 w-4" />
      {item.label}
    </Link>
  );
}
