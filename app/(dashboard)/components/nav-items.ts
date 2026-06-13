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
  Shield,
  Gift,
  UserCheck,
  Trophy,
  KeyRound,
  Settings,
  QrCode,
  Store,
  Mail,
  CreditCard,
  Receipt,
  ClipboardList,
  Image,
  UsersRound,
  Timer,
  type LucideIcon
} from 'lucide-react';

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

export interface NavGroup {
  label: string;
  icon: LucideIcon;
  items: NavItem[];
}

export const navGroups: NavGroup[] = [
  {
    label: 'Overview',
    icon: LineChart,
    items: [
      { href: '/', label: 'Dashboard', icon: Home },
      { href: '/activities', label: 'Activities', icon: LineChart },
      { href: '/audit-logs', label: 'Audit Logs', icon: ClipboardList }
    ]
  },
  {
    label: 'Businesses',
    icon: Building2,
    items: [
      { href: '/business', label: 'Businesses', icon: Building2 },
      { href: '/business-staff', label: 'Staff', icon: UsersRound },
      { href: '/qrcode', label: 'QR Codes', icon: QrCode }
    ]
  },
  {
    label: 'Loyalty',
    icon: Medal,
    items: [
      { href: '/loyalty-program', label: 'Programs', icon: Sprout },
      { href: '/loyalty-program-rules', label: 'Rules', icon: ScrollText },
      { href: '/promotions', label: 'Promotions', icon: Tag },
      { href: '/rewards', label: 'Rewards', icon: Medal },
      { href: '/rewards-earned', label: 'Rewards Earned', icon: Trophy }
    ]
  },
  {
    label: 'Customers',
    icon: Users2,
    items: [
      { href: '/customers', label: 'Customers', icon: Users2 },
      { href: '/customer-enrollments', label: 'Enrollments', icon: UserCheck },
      { href: '/customers-progress', label: 'Progress', icon: TrendingUp }
    ]
  },
  {
    label: 'Billing',
    icon: CreditCard,
    items: [
      { href: '/subscriptions', label: 'Subscriptions', icon: Receipt },
      { href: '/payments', label: 'Payments', icon: CreditCard }
    ]
  },
  {
    label: 'Configuration',
    icon: Ruler,
    items: [
      { href: '/business-types', label: 'Business Types', icon: Store },
      { href: '/loyalty-program-type', label: 'Program Types', icon: Tag },
      { href: '/reward-types', label: 'Reward Types', icon: Gift },
      { href: '/rule-types', label: 'Rule Types', icon: Ruler },
      { href: '/event-types', label: 'Event Types', icon: Bell }
    ]
  },
  {
    label: 'System',
    icon: Shield,
    items: [
      { href: '/users', label: 'Users', icon: UserIcon },
      { href: '/roles', label: 'Roles', icon: KeyRound },
      { href: '/permissions', label: 'Permissions', icon: Shield },
      { href: '/notifications', label: 'Notifications', icon: Bell },
      { href: '/email-templates', label: 'Email Templates', icon: Mail },
      { href: '/media', label: 'Media', icon: Image },
      { href: '/scheduled-tasks', label: 'Scheduled Tasks', icon: Timer },
      { href: '/settings', label: 'Settings', icon: Settings }
    ]
  }
];

/** Flat list kept for consumers that don't render groups (search, etc.). */
export const mainNavItems: NavItem[] = navGroups.flatMap(
  (group) => group.items
);
