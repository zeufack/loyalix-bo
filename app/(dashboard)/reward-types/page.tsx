import { RewardTypesDataTable } from './reward-types-data-table';
import { CreateRewardTypeForm } from './create-reward-type-form';

export default function RewardTypesPage() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Reward Types</h1>
        <CreateRewardTypeForm />
      </div>
      <RewardTypesDataTable />
    </div>
  );
}
