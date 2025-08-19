import { redirect } from 'next/navigation';
import { CreatePermissionForm } from './create-permission-form';
import PermissionsDataTable from './permissions-data-table';
import { auth } from '../../../lib/auth';
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent
} from '../../../components/ui/tabs';
import ExportButton from '../../../components/ui/export-btn';

export default async function PermissionsPage() {
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
          <CreatePermissionForm />
        </div>
      </div>
      <TabsContent value="all">
        <PermissionsDataTable />
      </TabsContent>
    </Tabs>
  );
}
