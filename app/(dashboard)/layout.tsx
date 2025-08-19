import Link from 'next/link';
import {
  Building2,
  Home,
  LineChart,
  Medal,
  Package,
  Package2,
  PanelLeft,
  Settings,
  ShoppingCart,
  Sprout,
  UserIcon,
  Users2,
  TrendingUp,
  ScrollText,
  Tag,
  Ruler,
  Bell,
  Shield
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components/ui/tooltip';
import { Analytics } from '@vercel/analytics/react';
import { User } from './user';
import Providers from './providers';
import { NavItem } from './nav-item';
import { DashboardBreadcrumbs } from './dashboard-breadcrumbs';
import { Notifications } from './notification';
import { MobileNav } from './mobile-nav';

const mainNavItems = [
  { href: '/', label: 'Dashboard', icon: Home },
  { href: '/business', label: 'Business', icon: Building2 },
  { href: '/loyalty-program', label: 'Loyalty Program', icon: Sprout },
  { href: '/loyalty-program-type', label: 'Loyalty Program Type', icon: Tag }, // Using Tag icon
  {
    href: '/loyalty-program-rules',
    label: 'Loyalty Program Rules',
    icon: ScrollText
  },
  { href: '/customers', label: 'Customers', icon: Users2 },
  { href: '/rewards', label: 'Rewards', icon: Medal },
  { href: '/users', label: 'Users', icon: UserIcon },
  { href: 'customers-progress', label: 'Customer Progress', icon: TrendingUp }, // Using TrendingUp icon
  { href: '/promotions', label: 'Promotions', icon: Tag },
  { href: '/rule-types', label: 'Rule Types', icon: Ruler },
  { href: '/event-types', label: 'Event Types', icon: Bell },
  { href: '/activities', label: 'Activities', icon: LineChart },
  { href: '/permissions', label: 'Permissions', icon: Shield }
];

export default function DashboardLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <Providers>
      <main className="flex min-h-screen w-full flex-col bg-muted/40">
        <DesktopNav />
        <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
          <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
            <MobileNav />
            <DashboardBreadcrumbs
              items={[
                { label: 'Home', href: '/' },
                { label: 'Dashboard', href: '/dashboard' },
                { label: 'Products' }
              ]}
            />
            <div className="ml-auto flex items-center gap-4">
              <Notifications />
              <User />
            </div>
          </header>
          <main className="grid flex-1 items-start gap-2 p-4 sm:px-6 sm:py-0 md:gap-4 bg-muted/40">
            {children}
          </main>
        </div>
        <Analytics />
      </main>
    </Providers>
  );
}

function DesktopNav() {
  return (
    <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
      <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
        {mainNavItems.map((item) => (
          <NavItem key={item.label} href={item.href} label={item.label}>
            <item.icon className="h-5 w-5" />
          </NavItem>
        ))}
      </nav>
      <nav className="mt-auto flex flex-col items-center gap-4 px-2 sm:py-5">
        <Tooltip>
          <TooltipTrigger asChild>
            <Link
              href="#"
              className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
            >
              <Settings className="h-5 w-5" />
              <span className="sr-only">Settings</span>
            </Link>
          </TooltipTrigger>
          <TooltipContent side="right">Settings</TooltipContent>
        </Tooltip>
      </nav>
    </aside>
  );
}
