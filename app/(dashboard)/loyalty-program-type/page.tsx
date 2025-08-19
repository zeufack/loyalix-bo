import { LoyaltyProgramTypesDataTable } from './loyalty-program-type-data-table';
import { CreateLoyaltyProgramTypeForm } from './create-loyalty-program-type-form';

export default async function LoyaltyProgramTypePage() {
  return (
    <div>
      <div className="flex justify-end">
        <CreateLoyaltyProgramTypeForm />
      </div>
      <LoyaltyProgramTypesDataTable />
    </div>
  );
}
