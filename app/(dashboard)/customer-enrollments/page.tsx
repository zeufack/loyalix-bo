import { CustomerEnrollmentsDataTable } from './customer-enrollments-data-table';
import { CreateCustomerEnrollmentForm } from './create-customer-enrollment-form';

export default function CustomerEnrollmentsPage() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Customer Enrollments</h1>
          <p className="text-muted-foreground">
            Manage customer enrollments in loyalty programs
          </p>
        </div>
        <CreateCustomerEnrollmentForm />
      </div>
      <CustomerEnrollmentsDataTable />
    </div>
  );
}
