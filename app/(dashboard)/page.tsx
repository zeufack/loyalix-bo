import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getTotalUsers } from '@/app/api/user';
import { getTotalBusinesses } from '@/app/api/business';
import { getTotalLoyaltyPrograms } from '@/app/api/loyalty-program';
import { getTotalCustomers } from '@/app/api/customer';

export default async function DashboardPage() {
  const totalUsers = await getTotalUsers();
  const totalBusinesses = await getTotalBusinesses();
  const totalLoyaltyPrograms = await getTotalLoyaltyPrograms();
  const totalCustomers = await getTotalCustomers();

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
          <CardTitle className="text-sm font-medium">Total Businesses</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalBusinesses}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Loyalty Programs</CardTitle>
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
    </div>
  );
}
