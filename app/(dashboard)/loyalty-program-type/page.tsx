import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LoyaltyProgramTypesDataTable } from './loyalty-program-type-data-table';
import ExportButton from '@/components/ui/export-btn';
import { CreateLoyaltyProgramTypeForm } from './create-loyalty-program-type-form';

export default async function LoyaltyProgramTypePage() {
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
          <CreateLoyaltyProgramTypeForm />
        </div>
      </div>
      <TabsContent value="all">
        <LoyaltyProgramTypesDataTable />
      </TabsContent>
    </Tabs>
  );
}
