import { getLoyaltyProgramTypes } from '@/app/api/loyalty-program-type';
import { LoyaltyProgramTypesDataTable } from './loyalty-program-type-data-table';
import { CreateLoyaltyProgramTypeForm } from './create-loyalty-program-type-form';

export default async function LoyaltyProgramTypePage() {
  const loyaltyProgramTypes = await getLoyaltyProgramTypes();
  return (
    <div>
      <div className="flex justify-end">
        <CreateLoyaltyProgramTypeForm />
      </div>
      <LoyaltyProgramTypesDataTable loyaltyProgramTypes={loyaltyProgramTypes} />
    </div>
  );
}
