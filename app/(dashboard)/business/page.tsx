import { getBusinesses } from '@/app/api/business';
import { BusinessesDataTable } from './business-data-table';
import { CreateBusinessForm } from './create-business-form';

export default async function BusinessPage() {
  const businesses = await getBusinesses();
  return (
    <div>
      <div className="flex justify-end">
        <CreateBusinessForm />
      </div>
      <BusinessesDataTable businesses={businesses} />
    </div>
  );
}
