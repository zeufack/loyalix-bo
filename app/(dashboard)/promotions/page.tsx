import { PromotionsDataTable } from './promotions-data-table';
import { CreatePromotionForm } from './create-promotion-form';

export default function PromotionsPage() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Promotions</h1>
        <CreatePromotionForm />
      </div>
      <PromotionsDataTable />
    </div>
  );
}
