export interface LoyaltyProgramRule {
  id: string;
  ruleName: string;
  ruleType: string;
  points?: number | null;
  purchaseAmount?: number | null;
  loyaltyProgramId: string;
  createdAt: Date;
  updatedAt: Date;
}
