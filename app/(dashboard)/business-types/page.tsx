import { BusinessTypesDataTable } from './business-types-data-table';
import { CreateBusinessTypeForm } from './create-business-type-form';

export default function BusinessTypesPage() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Business Types</h1>
        <CreateBusinessTypeForm />
      </div>
      <BusinessTypesDataTable />
    </div>
  );
}
