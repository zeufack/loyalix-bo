'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getTotalUsers } from '@/app/api/user';
import { getTotalBusinesses } from '@/app/api/business';
import { getTotalLoyaltyPrograms } from '@/app/api/loyalty-program';
import { getTotalCustomers } from '@/app/api/customer';
import { getTotalPromotions } from '@/app/api/promotion';
import { getTotalRuleTypes } from '@/app/api/rule-type';
import { getTotalEventTypes } from '@/app/api/event-type';
import { useQuery } from '@tanstack/react-query';

export function DashboardStats() {
  const { data: totalUsers } = useQuery({
    queryKey: ['totalUsers'],
    queryFn: getTotalUsers
  });
  const { data: totalBusinesses } = useQuery({
    queryKey: ['totalBusinesses'],
    queryFn: getTotalBusinesses
  });
  const { data: totalLoyaltyPrograms } = useQuery({
    queryKey: ['totalLoyaltyPrograms'],
    queryFn: getTotalLoyaltyPrograms
  });
  const { data: totalCustomers } = useQuery({
    queryKey: ['totalCustomers'],
    queryFn: getTotalCustomers
  });
  const { data: totalPromotions } = useQuery({
    queryKey: ['totalPromotions'],
    queryFn: getTotalPromotions
  });
  const { data: totalRuleTypes } = useQuery({
    queryKey: ['totalRuleTypes'],
    queryFn: getTotalRuleTypes
  });
  const { data: totalEventTypes } = useQuery({
    queryKey: ['totalEventTypes'],
    queryFn: getTotalEventTypes
  });

  return (
    <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Users</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalUsers}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Total Businesses
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalBusinesses}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Total Loyalty Programs
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalLoyaltyPrograms}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalCustomers}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Total Promotions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalPromotions}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Total Rule Types
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalRuleTypes}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Total Event Types
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalEventTypes}</div>
        </CardContent>
      </Card>
    </div>
  );
}
