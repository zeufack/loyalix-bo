import { LoyaltyProgramRulesDataTable } from './loyalty-program-rules-data-table';
import { CreateLoyaltyProgramRuleForm } from './create-loyalty-program-rule-form';

export default async function LoyaltyProgramRulesPage() {
  return (
    <div>
      <div className="flex justify-end">
        <CreateLoyaltyProgramRuleForm />
      </div>
      <LoyaltyProgramRulesDataTable />
    </div>
  );
}
