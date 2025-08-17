import { DataTable } from '@/components/data-table/data-table';
import { getPromotions } from '@/app/api/promotion';
import { promotionColumns } from '@/lib/columns/promotion-columns';

export async function PromotionsDataTable() {
  const data = await getPromotions();

  return <DataTable columns={promotionColumns} data={data} />;
}
