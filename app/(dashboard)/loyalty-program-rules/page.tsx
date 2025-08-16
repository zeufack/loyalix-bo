import { getLoyaltyProgramRules } from '@/app/api/loyalty-program-rule';
import { LoyaltyProgramRulesDataTable } from './loyalty-program-rules-data-table';
import { CreateLoyaltyProgramRuleForm } from './create-loyalty-program-rule-form';

export default async function LoyaltyProgramRulesPage() {
  const loyaltyProgramRules = await getLoyaltyProgramRules();
  return (
    <div>
      <div className="flex justify-end">
        <CreateLoyaltyProgramRuleForm />
      </div>
      <LoyaltyProgramRulesDataTable loyaltyProgramRules={loyaltyProgramRules} />
    </div>
  );
}
