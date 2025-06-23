import { redirect } from 'next/navigation';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from '../../../components/ui/tabs';
import { auth } from '../../../lib/auth';
import ExportButton from '../../../components/ui/export-btn';
import AddItemButton from '../../../components/ui/add-item-btn';
import LoyaltyProgramDataTable from './loyalty-program-data-table';

export default async function LoyaltyProgram() {
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
          <AddItemButton />
        </div>
      </div>
      <TabsContent value="all">
        <LoyaltyProgramDataTable />
      </TabsContent>
    </Tabs>
  );
}
