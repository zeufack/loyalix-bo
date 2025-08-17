import { getLoyaltyPrograms } from '@/app/api/loyalty-program';
import { LoyaltyProgramsDataTable } from './loyalty-program-data-table';
import { CreateLoyaltyProgramForm } from './create-loyalty-program-form';

export default async function LoyaltyProgramPage() {
  const loyaltyPrograms = await getLoyaltyPrograms();
  return (
    <div>
      <div className="flex justify-end">
        <CreateLoyaltyProgramForm />
      </div>
      <LoyaltyProgramsDataTable loyaltyPrograms={loyaltyPrograms} />
    </div>
  );
}
