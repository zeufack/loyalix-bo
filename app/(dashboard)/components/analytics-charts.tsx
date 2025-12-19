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
  PieChart,
  Pie,
  Cell,
  Legend,
  LineChart,
  Line
} from 'recharts';
import { useQuery } from '@tanstack/react-query';
import { getTotalUsers } from '@/app/api/user';
import { getTotalBusinesses } from '@/app/api/business';
import { getTotalCustomers } from '@/app/api/customer';
import { getTotalLoyaltyPrograms } from '@/app/api/loyalty-program';
import { getTotalCustomerEnrollments } from '@/app/api/customer-enrollment';
import { getTotalPromotions } from '@/app/api/promotion';
import { Skeleton } from '@/components/ui/skeleton';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

export function AnalyticsCharts() {
  const { data: totalUsers, isLoading: loadingUsers } = useQuery({
    queryKey: ['totalUsers'],
    queryFn: getTotalUsers
  });

  const { data: totalBusinesses, isLoading: loadingBusinesses } = useQuery({
    queryKey: ['totalBusinesses'],
    queryFn: getTotalBusinesses
  });

  const { data: totalCustomers, isLoading: loadingCustomers } = useQuery({
    queryKey: ['totalCustomers'],
    queryFn: getTotalCustomers
  });

  const { data: totalPrograms, isLoading: loadingPrograms } = useQuery({
    queryKey: ['totalLoyaltyPrograms'],
    queryFn: getTotalLoyaltyPrograms
  });

  const { data: totalEnrollments, isLoading: loadingEnrollments } = useQuery({
    queryKey: ['totalEnrollments'],
    queryFn: getTotalCustomerEnrollments
  });

  const { data: totalPromotions, isLoading: loadingPromotions } = useQuery({
    queryKey: ['totalPromotions'],
    queryFn: getTotalPromotions
  });

  const isLoading = loadingUsers || loadingBusinesses || loadingCustomers ||
    loadingPrograms || loadingEnrollments || loadingPromotions;

  // Platform overview bar chart data
  const platformData = [
    { name: 'Users', value: totalUsers || 0, fill: COLORS[0] },
    { name: 'Businesses', value: totalBusinesses || 0, fill: COLORS[1] },
    { name: 'Customers', value: totalCustomers || 0, fill: COLORS[2] },
    { name: 'Programs', value: totalPrograms || 0, fill: COLORS[3] },
    { name: 'Enrollments', value: totalEnrollments || 0, fill: COLORS[4] },
    { name: 'Promotions', value: totalPromotions || 0, fill: COLORS[5] }
  ];

  // Distribution pie chart data
  const distributionData = [
    { name: 'Active Businesses', value: totalBusinesses || 0 },
    { name: 'Customers', value: totalCustomers || 0 },
    { name: 'Enrollments', value: totalEnrollments || 0 }
  ];

  // Simulated growth trend data (would come from actual API in production)
  const growthTrendData = [
    { month: 'Jan', users: Math.floor((totalUsers || 0) * 0.6), businesses: Math.floor((totalBusinesses || 0) * 0.5) },
    { month: 'Feb', users: Math.floor((totalUsers || 0) * 0.7), businesses: Math.floor((totalBusinesses || 0) * 0.6) },
    { month: 'Mar', users: Math.floor((totalUsers || 0) * 0.75), businesses: Math.floor((totalBusinesses || 0) * 0.7) },
    { month: 'Apr', users: Math.floor((totalUsers || 0) * 0.8), businesses: Math.floor((totalBusinesses || 0) * 0.8) },
    { month: 'May', users: Math.floor((totalUsers || 0) * 0.9), businesses: Math.floor((totalBusinesses || 0) * 0.9) },
    { month: 'Jun', users: totalUsers || 0, businesses: totalBusinesses || 0 }
  ];

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="col-span-2">
          <CardHeader>
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-4 w-60" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[300px] w-full" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-4 w-60" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[300px] w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Platform Overview Bar Chart */}
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Platform Overview</CardTitle>
            <CardDescription>
              Total counts across all platform entities
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={platformData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
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
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {platformData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Distribution Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Distribution</CardTitle>
            <CardDescription>
              Business, customer & enrollment ratio
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={distributionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {distributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Growth Trend Line Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Growth Trend</CardTitle>
          <CardDescription>
            User and business growth over the last 6 months
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={growthTrendData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 12 }}
                className="text-muted-foreground"
              />
              <YAxis
                tick={{ fontSize: 12 }}
                className="text-muted-foreground"
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="users"
                stroke={COLORS[0]}
                strokeWidth={2}
                dot={{ fill: COLORS[0] }}
                name="Users"
              />
              <Line
                type="monotone"
                dataKey="businesses"
                stroke={COLORS[1]}
                strokeWidth={2}
                dot={{ fill: COLORS[1] }}
                name="Businesses"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
