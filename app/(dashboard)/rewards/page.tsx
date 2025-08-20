import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RewardsDataTable } from './rewards-data-table';
import ExportButton from '@/components/ui/export-btn';
import { CreateRewardForm } from './create-reward-form';

export default async function RewardsPage() {
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
          <CreateRewardForm />
        </div>
      </div>
      <TabsContent value="all">
        <RewardsDataTable />
      </TabsContent>
    </Tabs>
  );
}

