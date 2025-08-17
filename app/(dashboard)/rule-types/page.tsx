import { RuleTypesDataTable } from './rule-types-data-table';
import { CreateRuleTypeForm } from './create-rule-type-form';

export default function RuleTypesPage() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Rule Types</h1>
        <CreateRuleTypeForm />
      </div>
      <RuleTypesDataTable />
    </div>
  );
}
