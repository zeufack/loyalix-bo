import { LoyaltyProgramsDataTable } from './loyalty-program-data-table';
import { CreateLoyaltyProgramForm } from './create-loyalty-program-form';

export default async function LoyaltyProgramPage() {
  return (
    <div>
      <div className="flex justify-end">
        <CreateLoyaltyProgramForm />
      </div>
      <LoyaltyProgramsDataTable />
    </div>
  );
}
