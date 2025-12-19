'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
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
import {
  Users,
  Building2,
  Sprout,
  Users2,
  Tag,
  Ruler,
  Bell,
  Gift,
  UserCheck
} from 'lucide-react';

interface StatCardProps {
  title: string;
  value: number | undefined;
  description?: string;
  icon: React.ReactNode;
  isLoading?: boolean;
}

function StatCard({ title, value, description, icon, isLoading }: StatCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="h-4 w-4 text-muted-foreground">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {isLoading ? (
            <span className="animate-pulse bg-muted rounded w-12 h-8 inline-block" />
          ) : (
            value ?? 0
          )}
        </div>
        {description && (
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        )}
      </CardContent>
    </Card>
  );
}

export function DashboardStats() {
  const { data: totalUsers, isLoading: loadingUsers } = useQuery({
    queryKey: ['totalUsers'],
    queryFn: getTotalUsers
  });

  const { data: totalBusinesses, isLoading: loadingBusinesses } = useQuery({
    queryKey: ['totalBusinesses'],
    queryFn: getTotalBusinesses
  });

  const { data: totalLoyaltyPrograms, isLoading: loadingPrograms } = useQuery({
    queryKey: ['totalLoyaltyPrograms'],
    queryFn: getTotalLoyaltyPrograms
  });

  const { data: totalCustomers, isLoading: loadingCustomers } = useQuery({
    queryKey: ['totalCustomers'],
    queryFn: getTotalCustomers
  });

  const { data: totalPromotions, isLoading: loadingPromotions } = useQuery({
    queryKey: ['totalPromotions'],
    queryFn: getTotalPromotions
  });

  const { data: totalRuleTypes, isLoading: loadingRuleTypes } = useQuery({
    queryKey: ['totalRuleTypes'],
    queryFn: getTotalRuleTypes
  });

  const { data: totalEventTypes, isLoading: loadingEventTypes } = useQuery({
    queryKey: ['totalEventTypes'],
    queryFn: getTotalEventTypes
  });

  const { data: totalRewardTypes, isLoading: loadingRewardTypes } = useQuery({
    queryKey: ['totalRewardTypes'],
    queryFn: getTotalRewardTypes
  });

  const { data: totalEnrollments, isLoading: loadingEnrollments } = useQuery({
    queryKey: ['totalEnrollments'],
    queryFn: getTotalCustomerEnrollments
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold mb-4">Platform Overview</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Users"
            value={totalUsers}
            description="Registered accounts"
            icon={<Users className="h-4 w-4" />}
            isLoading={loadingUsers}
          />
          <StatCard
            title="Businesses"
            value={totalBusinesses}
            description="Active businesses"
            icon={<Building2 className="h-4 w-4" />}
            isLoading={loadingBusinesses}
          />
          <StatCard
            title="Customers"
            value={totalCustomers}
            description="Loyalty members"
            icon={<Users2 className="h-4 w-4" />}
            isLoading={loadingCustomers}
          />
          <StatCard
            title="Enrollments"
            value={totalEnrollments}
            description="Program enrollments"
            icon={<UserCheck className="h-4 w-4" />}
            isLoading={loadingEnrollments}
          />
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-4">Loyalty Programs</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Loyalty Programs"
            value={totalLoyaltyPrograms}
            description="Active programs"
            icon={<Sprout className="h-4 w-4" />}
            isLoading={loadingPrograms}
          />
          <StatCard
            title="Promotions"
            value={totalPromotions}
            description="Active promotions"
            icon={<Tag className="h-4 w-4" />}
            isLoading={loadingPromotions}
          />
          <StatCard
            title="Reward Types"
            value={totalRewardTypes}
            description="Available reward types"
            icon={<Gift className="h-4 w-4" />}
            isLoading={loadingRewardTypes}
          />
          <StatCard
            title="Rule Types"
            value={totalRuleTypes}
            description="Program rule types"
            icon={<Ruler className="h-4 w-4" />}
            isLoading={loadingRuleTypes}
          />
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-4">System Configuration</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Event Types"
            value={totalEventTypes}
            description="Tracked event types"
            icon={<Bell className="h-4 w-4" />}
            isLoading={loadingEventTypes}
          />
        </div>
      </div>
    </div>
  );
}
