import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PaymentDataTable from './payment-data-table';

export default async function PaymentPage() {
  const session = await auth();

  if (!session) {
    redirect('/login');
  }

  return (
    <Tabs defaultValue="all">
      <div className="flex items-center">
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="succeeded">Succeeded</TabsTrigger>
          <TabsTrigger value="failed">Failed</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
        </TabsList>
      </div>
      <TabsContent value="all">
        <PaymentDataTable />
      </TabsContent>
      <TabsContent value="succeeded">
        <PaymentDataTable status="succeeded" />
      </TabsContent>
      <TabsContent value="failed">
        <PaymentDataTable status="failed" />
      </TabsContent>
      <TabsContent value="pending">
        <PaymentDataTable status="pending" />
      </TabsContent>
    </Tabs>
  );
}
