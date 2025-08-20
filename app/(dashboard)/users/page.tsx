import { redirect } from 'next/navigation';
import { auth } from '../../../lib/auth';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from '../../../components/ui/tabs';
import ExportButton from '../../../components/ui/export-btn';
import UserDataTable from './user-data-table';
import { CreateUserForm } from './create-user-form';

export default async function UserPage() {
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
          <CreateUserForm />
        </div>
      </div>
      <TabsContent value="all">
        <UserDataTable />
      </TabsContent>
    </Tabs>
  );
}
