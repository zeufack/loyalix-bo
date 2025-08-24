import {
  Home,
  Building2,
  Sprout,
  Tag,
  ScrollText,
  Users2,
  Medal,
  UserIcon,
  TrendingUp,
  Ruler,
  Bell,
  LineChart,
  Shield
} from 'lucide-react';

export const mainNavItems = [
  { href: '/', label: 'Dashboard', icon: Home },
  { href: '/business', label: 'Business', icon: Building2 },
  { href: '/loyalty-program', label: 'Loyalty Program', icon: Sprout },
  { href: '/loyalty-program-type', label: 'Loyalty Program Type', icon: Tag },
  {
    href: '/loyalty-program-rules',
    label: 'Loyalty Program Rules',
    icon: ScrollText
  },
  { href: '/customers', label: 'Customers', icon: Users2 },
  { href: '/rewards', label: 'Rewards', icon: Medal },
  { href: '/users', label: 'Users', icon: UserIcon },
  { href: 'customers-progress', label: 'Customer Progress', icon: TrendingUp },
  { href: '/promotions', label: 'Promotions', icon: Tag },
  { href: '/rule-types', label: 'Rule Types', icon: Ruler },
  { href: '/event-types', label: 'Event Types', icon: Bell },
  { href: '/activities', label: 'Activities', icon: LineChart },
  { href: '/permissions', label: 'Permissions', icon: Shield }
];
