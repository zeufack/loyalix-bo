'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';
import { useQuery } from '@tanstack/react-query';
import { getTotalUsers } from '@/app/api/user';
import { getTotalBusinesses } from '@/app/api/business';
import { getTotalCustomers } from '@/app/api/customer';
import { getTotalLoyaltyPrograms } from '@/app/api/loyalty-program';
import { getTotalCustomerEnrollments } from '@/app/api/customer-enrollment';
import { getTotalPromotions } from '@/app/api/promotion';
import { Skeleton } from '@/components/ui/skeleton';

const COLORS = [
  'var(--chart-1)',
  'var(--chart-2)',
  'var(--chart-3)',
  'var(--chart-4)',
  'var(--chart-5)',
  'var(--chart-6)'
];

export function AnalyticsCharts() {
  const users = useQuery({ queryKey: ['totalUsers'], queryFn: getTotalUsers });
  const businesses = useQuery({
    queryKey: ['totalBusinesses'],
    queryFn: getTotalBusinesses
  });
  const customers = useQuery({
    queryKey: ['totalCustomers'],
    queryFn: getTotalCustomers
  });
  const programs = useQuery({
    queryKey: ['totalLoyaltyPrograms'],
    queryFn: getTotalLoyaltyPrograms
  });
  const enrollments = useQuery({
    queryKey: ['totalEnrollments'],
    queryFn: getTotalCustomerEnrollments
  });
  const promotions = useQuery({
    queryKey: ['totalPromotions'],
    queryFn: getTotalPromotions
  });

  const queries = [
    users,
    businesses,
    customers,
    programs,
    enrollments,
    promotions
  ];
  const isLoading = queries.some((q) => q.isLoading);
  const isError = queries.every((q) => q.isError);

  const platformData = [
    { name: 'Users', value: users.data || 0, fill: COLORS[0] },
    { name: 'Businesses', value: businesses.data || 0, fill: COLORS[1] },
    { name: 'Customers', value: customers.data || 0, fill: COLORS[2] },
    { name: 'Programs', value: programs.data || 0, fill: COLORS[3] },
    { name: 'Enrollments', value: enrollments.data || 0, fill: COLORS[4] },
    { name: 'Promotions', value: promotions.data || 0, fill: COLORS[5] }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Platform breakdown</CardTitle>
        <CardDescription>
          Current totals across the main platform entities
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-[300px] w-full" />
        ) : isError ? (
          <div className="flex h-[300px] items-center justify-center">
            <p className="text-sm text-muted-foreground">
              Couldn&apos;t load platform data.
            </p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={platformData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 12 }}
                className="text-muted-foreground"
              />
              <YAxis
                tick={{ fontSize: 12 }}
                className="text-muted-foreground"
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--card)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-lg)'
                }}
              />
              <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                {platformData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
