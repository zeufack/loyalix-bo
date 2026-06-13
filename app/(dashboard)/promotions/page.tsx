import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { PromotionsDataTable } from './promotions-data-table';
import { CreatePromotionForm } from './create-promotion-form';

export default async function PromotionsPage() {
  const session = await auth();

  if (!session) {
    redirect('/login');
  }
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-end gap-2">
        <CreatePromotionForm />
      </div>
      <PromotionsDataTable />
    </div>
  );
}
