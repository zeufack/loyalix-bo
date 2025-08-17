import { DataTable } from '@/components/data-table/data-table';
import { getRuleTypes } from '@/app/api/rule-type';
import { ruleTypeColumns } from '@/lib/columns/rule-type-columns';

export async function RuleTypesDataTable() {
  const data = await getRuleTypes();

  return <DataTable columns={ruleTypeColumns} data={data} />;
}
