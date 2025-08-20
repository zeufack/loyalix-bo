import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LoyaltyProgramsDataTable } from './loyalty-program-data-table';
import ExportButton from '@/components/ui/export-btn';
import { CreateLoyaltyProgramForm } from './create-loyalty-program-form';

export default async function LoyaltyProgramPage() {
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
          <ExportButton />
          <CreateLoyaltyProgramForm />
        </div>
      </div>
      <TabsContent value="all">
        <LoyaltyProgramsDataTable />
      </TabsContent>
    </Tabs>
  );
}
