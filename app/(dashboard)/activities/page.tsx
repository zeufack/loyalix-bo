import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ActivitiesDataTable } from './activities-data-table';
import ExportButton from '@/components/ui/export-btn';

export default async function ActivitiesPage() {
  const session = await auth();

  if (!session) {
    redirect('/login');
  }
  return (
    <Tabs defaultValue="all">
      <div className="flex items-center">
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
        </TabsList>
        <div className="ml-auto flex items-center gap-2">
          <ExportButton />
        </div>
      </div>
      <TabsContent value="all">
        <ActivitiesDataTable />
      </TabsContent>
    </Tabs>
  );
}
