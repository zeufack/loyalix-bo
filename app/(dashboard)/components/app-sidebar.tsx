'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { ChevronRight, Home, Settings } from 'lucide-react';
import { navGroups, type NavGroup } from './nav-items';
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarGroup,
  SidebarGroupContent,
  SidebarRail,
  useSidebar
} from '@/components/ui/sidebar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { cn } from '@/lib/utils';

function NavSection({
  group,
  pathname
}: {
  group: NavGroup;
  pathname: string;
}) {
  const { state, isMobile } = useSidebar();
  const items = group.items.filter(
    (item) => item.href !== '/' && item.href !== '/settings'
  );
  const hasActiveItem = items.some((item) => pathname.startsWith(item.href));
  const [open, setOpen] = useState(hasActiveItem);

  if (items.length === 0) return null;

  const Icon = group.icon;
  const isCollapsed = state === 'collapsed' && !isMobile;

  // Collapsed icon rail: render the group as a flyout so sub-items stay
  // reachable (the SidebarMenuSub itself is display:none in icon mode).
  if (isCollapsed) {
    return (
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              tooltip={group.label}
              isActive={hasActiveItem}
            >
              <Icon className="size-4" />
              <span>{group.label}</span>
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            side="right"
            align="start"
            className="min-w-48"
          >
            <DropdownMenuLabel>{group.label}</DropdownMenuLabel>
            {items.map((item) => (
              <DropdownMenuItem key={item.href} asChild>
                <Link href={item.href}>{item.label}</Link>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    );
  }

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        tooltip={group.label}
        aria-expanded={open}
        onClick={() => setOpen((prev) => !prev)}
      >
        <Icon className="size-4" />
        <span>{group.label}</span>
        <ChevronRight
          className={cn(
            'ml-auto size-4 transition-transform duration-200',
            open && 'rotate-90'
          )}
        />
      </SidebarMenuButton>
      {open && (
        <SidebarMenuSub>
          {items.map((item) => (
            <SidebarMenuSubItem key={item.href}>
              <SidebarMenuSubButton
                asChild
                isActive={pathname.startsWith(item.href)}
              >
                <Link href={item.href}>
                  <span>{item.label}</span>
                </Link>
              </SidebarMenuSubButton>
            </SidebarMenuSubItem>
          ))}
        </SidebarMenuSub>
      )}
    </SidebarMenuItem>
  );
}

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              asChild
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Link href="/" aria-label="Loyalix - Go to dashboard">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-white">
                  <Image
                    src="/loyalix.png"
                    alt="Loyalix"
                    width={64}
                    height={64}
                    className="size-6 object-contain"
                  />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Loyalix</span>
                  <span className="truncate text-xs text-sidebar-foreground/70">
                    Back Office
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === '/'}
                  tooltip="Dashboard"
                >
                  <Link href="/">
                    <Home className="size-4" />
                    <span>Dashboard</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              {navGroups.map((group) => (
                <NavSection
                  key={group.label}
                  group={group}
                  pathname={pathname}
                />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={pathname.startsWith('/settings')}
              tooltip="Settings"
            >
              <Link href="/settings">
                <Settings className="size-4" />
                <span>Settings</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <div className="flex w-full  px-2 py-1.5 group-data-[collapsible=icon]:px-0">
              <ThemeToggle />
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
