import { DataTable } from '@/components/data-table/data-table';
import { getRewards } from '@/app/api/reward';
import { rewardColumns } from '@/lib/columns/reward-columns';

export async function RewardsDataTable() {
  const data = await getRewards();

  return <DataTable columns={rewardColumns} data={data} />;
}
