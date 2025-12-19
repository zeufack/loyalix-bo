'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useHotkeys } from 'react-hotkeys-hook';
import { useQuery } from '@tanstack/react-query';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator
} from '@/components/ui/command';
import { Button } from '@/components/ui/button';
import {
  Search,
  Building2,
  Users2,
  Sprout,
  UserIcon,
  Medal,
  Tag,
  ScrollText,
  KeyRound,
  Home,
  Settings,
  Loader2
} from 'lucide-react';
import { http } from '@/app/api/http';

interface SearchResult {
  id: string;
  title: string;
  subtitle?: string;
  type: 'user' | 'business' | 'customer' | 'program' | 'reward' | 'role';
  href: string;
}

const navigationItems = [
  { title: 'Dashboard', href: '/', icon: Home },
  { title: 'Businesses', href: '/business', icon: Building2 },
  { title: 'Users', href: '/users', icon: UserIcon },
  { title: 'Customers', href: '/customers', icon: Users2 },
  { title: 'Loyalty Programs', href: '/loyalty-program', icon: Sprout },
  { title: 'Rewards', href: '/rewards', icon: Medal },
  { title: 'Promotions', href: '/promotions', icon: Tag },
  { title: 'Roles', href: '/roles', icon: KeyRound },
  { title: 'Program Rules', href: '/loyalty-program-rules', icon: ScrollText },
  { title: 'Settings', href: '/settings', icon: Settings }
];

const typeIcons: Record<string, React.ReactNode> = {
  user: <UserIcon className="mr-2 h-4 w-4" />,
  business: <Building2 className="mr-2 h-4 w-4" />,
  customer: <Users2 className="mr-2 h-4 w-4" />,
  program: <Sprout className="mr-2 h-4 w-4" />,
  reward: <Medal className="mr-2 h-4 w-4" />,
  role: <KeyRound className="mr-2 h-4 w-4" />
};

async function searchEntities(query: string): Promise<SearchResult[]> {
  if (!query || query.length < 2) return [];

  const results: SearchResult[] = [];

  try {
    // Search users
    const usersRes = await http.get('/user', { params: { search: query, limit: 5 } });
    const users = usersRes.data?.data || usersRes.data || [];
    users.slice(0, 3).forEach((user: { id: string; email: string; firstName?: string; lastName?: string }) => {
      results.push({
        id: user.id,
        title: user.email,
        subtitle: `${user.firstName || ''} ${user.lastName || ''}`.trim() || undefined,
        type: 'user',
        href: `/users?highlight=${user.id}`
      });
    });

    // Search businesses
    const businessRes = await http.get('/business', { params: { search: query, limit: 5 } });
    const businesses = businessRes.data?.data || businessRes.data || [];
    businesses.slice(0, 3).forEach((business: { id: string; name: string; email?: string }) => {
      results.push({
        id: business.id,
        title: business.name,
        subtitle: business.email,
        type: 'business',
        href: `/business?highlight=${business.id}`
      });
    });

    // Search customers
    const customerRes = await http.get('/customer', { params: { search: query, limit: 5 } });
    const customers = customerRes.data?.data || customerRes.data || [];
    customers.slice(0, 3).forEach((customer: { id: string; user?: { firstName?: string; lastName?: string; email?: string } }) => {
      results.push({
        id: customer.id,
        title: `${customer.user?.firstName || ''} ${customer.user?.lastName || ''}`.trim() || 'Customer',
        subtitle: customer.user?.email,
        type: 'customer',
        href: `/customers?highlight=${customer.id}`
      });
    });

    // Search loyalty programs
    const programRes = await http.get('/loyalty-program', { params: { search: query, limit: 5 } });
    const programs = programRes.data?.data || programRes.data || [];
    programs.slice(0, 3).forEach((program: { id: string; name: string; description?: string }) => {
      results.push({
        id: program.id,
        title: program.name,
        subtitle: program.description?.slice(0, 50),
        type: 'program',
        href: `/loyalty-program?highlight=${program.id}`
      });
    });
  } catch (error) {
    console.error('Search error:', error);
  }

  return results;
}

export function GlobalSearch() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const router = useRouter();

  // Cmd+K / Ctrl+K shortcut
  useHotkeys('mod+k', (e) => {
    e.preventDefault();
    setOpen(true);
  }, { enableOnFormTags: true });

  const { data: searchResults = [], isLoading } = useQuery({
    queryKey: ['global-search', query],
    queryFn: () => searchEntities(query),
    enabled: query.length >= 2,
    staleTime: 30000
  });

  const handleSelect = useCallback((href: string) => {
    setOpen(false);
    setQuery('');
    router.push(href);
  }, [router]);

  // Filter navigation items based on query
  const filteredNavItems = query
    ? navigationItems.filter((item) =>
        item.title.toLowerCase().includes(query.toLowerCase())
      )
    : navigationItems;

  return (
    <>
      <Button
        variant="outline"
        className="relative h-9 w-9 p-0 xl:h-10 xl:w-60 xl:justify-start xl:px-3 xl:py-2"
        onClick={() => setOpen(true)}
      >
        <Search className="h-4 w-4 xl:mr-2" />
        <span className="hidden xl:inline-flex">Search...</span>
        <kbd className="pointer-events-none absolute right-1.5 top-2 hidden h-6 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 xl:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput
          placeholder="Search users, businesses, programs..."
          value={query}
          onValueChange={setQuery}
        />
        <CommandList>
          {isLoading && query.length >= 2 && (
            <div className="flex items-center justify-center py-6">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          )}

          <CommandEmpty>
            {query.length < 2 ? 'Type at least 2 characters to search...' : 'No results found.'}
          </CommandEmpty>

          {searchResults.length > 0 && (
            <CommandGroup heading="Search Results">
              {searchResults.map((result) => (
                <CommandItem
                  key={`${result.type}-${result.id}`}
                  value={`${result.type}-${result.title}`}
                  onSelect={() => handleSelect(result.href)}
                >
                  {typeIcons[result.type]}
                  <div className="flex flex-col">
                    <span>{result.title}</span>
                    {result.subtitle && (
                      <span className="text-xs text-muted-foreground">{result.subtitle}</span>
                    )}
                  </div>
                  <span className="ml-auto text-xs text-muted-foreground capitalize">
                    {result.type}
                  </span>
                </CommandItem>
              ))}
            </CommandGroup>
          )}

          {(searchResults.length > 0 || query.length >= 2) && <CommandSeparator />}

          <CommandGroup heading="Navigation">
            {filteredNavItems.slice(0, 6).map((item) => (
              <CommandItem
                key={item.href}
                value={item.title}
                onSelect={() => handleSelect(item.href)}
              >
                <item.icon className="mr-2 h-4 w-4" />
                {item.title}
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
