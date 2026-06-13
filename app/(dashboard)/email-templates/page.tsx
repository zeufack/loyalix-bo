import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import EmailTemplateDataTable from './email-template-data-table';
import { CreateEmailTemplateForm } from './create-email-template-form';

export default async function EmailTemplatePage() {
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
          <TabsTrigger value="inactive">Inactive</TabsTrigger>
        </TabsList>
        <div className="ml-auto flex items-center gap-2">
          <CreateEmailTemplateForm />
        </div>
      </div>
      <TabsContent value="all">
        <EmailTemplateDataTable />
      </TabsContent>
      <TabsContent value="active">
        <EmailTemplateDataTable status="active" />
      </TabsContent>
      <TabsContent value="inactive">
        <EmailTemplateDataTable status="inactive" />
      </TabsContent>
    </Tabs>
  );
}
