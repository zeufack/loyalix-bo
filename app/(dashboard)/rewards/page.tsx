import { RewardsDataTable } from './rewards-data-table';
import { CreateRewardForm } from './create-reward-form';

export default function RewardsPage() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Rewards</h1>
        <CreateRewardForm />
      </div>
      <RewardsDataTable />
    </div>
  );
}

