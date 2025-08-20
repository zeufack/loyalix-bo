import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import BusinessDataTable from './business-data-table';
import { CreateBusinessForm } from './create-business-form';
import ExportButton from '@/components/ui/export-btn';

export default async function businessPage() {
  const session = await auth();

  if (!session) {
    redirect('/login');
  }
  return (
    <Tabs defaultValue="all">
      <div className="flex items-center">
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="draft">Draft</TabsTrigger>
          <TabsTrigger value="archived" className="hidden sm:flex">
            Archived
          </TabsTrigger>
        </TabsList>
        <div className="ml-auto flex items-center gap-2">
          <CreateBusinessForm />
          <ExportButton />
        </div>
      </div>
      <TabsContent value="all">
        <BusinessDataTable />
      </TabsContent>
    </Tabs>
  );
}
