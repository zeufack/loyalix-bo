'use client';

import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { getTotalUsers } from '@/app/api/user';
import { getTotalBusinesses } from '@/app/api/business';
import { getTotalLoyaltyPrograms } from '@/app/api/loyalty-program';
import { getTotalCustomers } from '@/app/api/customer';
import { getTotalPromotions } from '@/app/api/promotion';
import { getTotalRuleTypes } from '@/app/api/rule-type';
import { getTotalEventTypes } from '@/app/api/event-type';
import { getTotalRewardTypes } from '@/app/api/reward-type';
import { getTotalCustomerEnrollments } from '@/app/api/customer-enrollment';
import { useQuery } from '@tanstack/react-query';
import { Users, Building2, Users2, UserCheck, ArrowRight } from 'lucide-react';

interface StatCardProps {
  title: string;
  href: string;
  value: number | undefined;
  description?: string;
  icon: React.ReactNode;
  isLoading?: boolean;
  isError?: boolean;
}

function StatCard({
  title,
  href,
  value,
  description,
  icon,
  isLoading,
  isError
}: StatCardProps) {
  return (
    <Link href={href} className="group">
      <Card className="transition-colors group-hover:border-border-strong/30">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          <div className="h-4 w-4 text-muted-foreground">{icon}</div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold tabular-nums">
            {isLoading ? (
              <Skeleton className="h-8 w-12" />
            ) : isError ? (
              <span className="text-muted-foreground">—</span>
            ) : (
              (value ?? 0)
            )}
          </div>
          {description && (
            <p className="text-xs text-muted-foreground mt-1">{description}</p>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}

export function DashboardStats() {
  const users = useQuery({ queryKey: ['totalUsers'], queryFn: getTotalUsers });
  const businesses = useQuery({
    queryKey: ['totalBusinesses'],
    queryFn: getTotalBusinesses
  });
  const customers = useQuery({
    queryKey: ['totalCustomers'],
    queryFn: getTotalCustomers
  });
  const enrollments = useQuery({
    queryKey: ['totalEnrollments'],
    queryFn: getTotalCustomerEnrollments
  });

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Users"
        href="/users"
        value={users.data}
        description="Registered accounts"
        icon={<Users className="h-4 w-4" />}
        isLoading={users.isLoading}
        isError={users.isError}
      />
      <StatCard
        title="Businesses"
        href="/business"
        value={businesses.data}
        description="Active businesses"
        icon={<Building2 className="h-4 w-4" />}
        isLoading={businesses.isLoading}
        isError={businesses.isError}
      />
      <StatCard
        title="Customers"
        href="/customers"
        value={customers.data}
        description="Loyalty members"
        icon={<Users2 className="h-4 w-4" />}
        isLoading={customers.isLoading}
        isError={customers.isError}
      />
      <StatCard
        title="Enrollments"
        href="/customer-enrollments"
        value={enrollments.data}
        description="Program enrollments"
        icon={<UserCheck className="h-4 w-4" />}
        isLoading={enrollments.isLoading}
        isError={enrollments.isError}
      />
    </div>
  );
}

interface GlanceItemProps {
  label: string;
  href: string;
  value: number | undefined;
  isLoading: boolean;
  isError: boolean;
}

function GlanceItem({
  label,
  href,
  value,
  isLoading,
  isError
}: GlanceItemProps) {
  return (
    <Link
      href={href}
      className="group flex items-center justify-between rounded-md px-3 py-2 transition-colors hover:bg-muted"
    >
      <span className="text-sm">{label}</span>
      <span className="flex items-center gap-2 text-sm font-semibold tabular-nums">
        {isLoading ? (
          <Skeleton className="h-4 w-8" />
        ) : isError ? (
          <span className="font-normal text-muted-foreground">—</span>
        ) : (
          (value ?? 0)
        )}
        <ArrowRight className="h-3.5 w-3.5 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
      </span>
    </Link>
  );
}

export function CatalogGlance() {
  const programs = useQuery({
    queryKey: ['totalLoyaltyPrograms'],
    queryFn: getTotalLoyaltyPrograms
  });
  const promotions = useQuery({
    queryKey: ['totalPromotions'],
    queryFn: getTotalPromotions
  });
  const rewardTypes = useQuery({
    queryKey: ['totalRewardTypes'],
    queryFn: getTotalRewardTypes
  });
  const ruleTypes = useQuery({
    queryKey: ['totalRuleTypes'],
    queryFn: getTotalRuleTypes
  });
  const eventTypes = useQuery({
    queryKey: ['totalEventTypes'],
    queryFn: getTotalEventTypes
  });

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">Loyalty catalog</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-1 p-3 pt-0">
        <GlanceItem
          label="Programs"
          href="/loyalty-program"
          value={programs.data}
          isLoading={programs.isLoading}
          isError={programs.isError}
        />
        <GlanceItem
          label="Promotions"
          href="/promotions"
          value={promotions.data}
          isLoading={promotions.isLoading}
          isError={promotions.isError}
        />
        <GlanceItem
          label="Reward types"
          href="/reward-types"
          value={rewardTypes.data}
          isLoading={rewardTypes.isLoading}
          isError={rewardTypes.isError}
        />
        <GlanceItem
          label="Rule types"
          href="/rule-types"
          value={ruleTypes.data}
          isLoading={ruleTypes.isLoading}
          isError={ruleTypes.isError}
        />
        <GlanceItem
          label="Event types"
          href="/event-types"
          value={eventTypes.data}
          isLoading={eventTypes.isLoading}
          isError={eventTypes.isError}
        />
      </CardContent>
    </Card>
  );
}
