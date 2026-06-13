import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import NotificationDataTable from './notification-data-table';

export default async function NotificationPage() {
  const session = await auth();

  if (!session) {
    redirect('/login');
  }

  return (
    <Tabs defaultValue="all">
      <div className="flex items-center">
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="unread">Unread</TabsTrigger>
          <TabsTrigger value="read">Read</TabsTrigger>
        </TabsList>
      </div>
      <TabsContent value="all">
        <NotificationDataTable />
      </TabsContent>
      <TabsContent value="unread">
        <NotificationDataTable status="unread" />
      </TabsContent>
      <TabsContent value="read">
        <NotificationDataTable status="read" />
      </TabsContent>
    </Tabs>
  );
}
