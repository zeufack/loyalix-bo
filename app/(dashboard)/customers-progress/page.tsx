import { getCustomerProgress } from '@/app/api/customer-progress';
import { CustomersProgressDataTable } from './customers-progress-data-table';

export default async function CustomersProgressPage() {
  const customersProgress = await getCustomerProgress();
  return <CustomersProgressDataTable customersProgress={customersProgress} />;
}
