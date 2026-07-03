export interface ProgramRef {
  id: string;
  name: string;
}

export interface RuleTypeRef {
  id: string;
  name: string;
}

export interface RuleRewardRef {
  id: string;
  name: string;
}

export interface LoyaltyProgramRule {
  id: string;
  thresholdValue: number;
  position?: number;
  isActive: boolean;
  isRepeatable: boolean;
  validFrom?: string | null;
  validUntil?: string | null;
  program?: ProgramRef | null;
  ruleType?: RuleTypeRef | null;
  reward?: RuleRewardRef | null;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Payload accepted by the backend `POST /program-rule` endpoint.
 * Mirrors `CreateProgramRuleDto` on the backend.
 */
export interface CreateLoyaltyProgramRulePayload {
  programId: string;
  rewardId: string;
  ruleTypeId?: string;
  position?: number;
  thresholdValue?: number;
  isRepeatable?: boolean;
  isActive?: boolean;
  validFrom?: string;
  validUntil?: string;
}

/**
 * Payload accepted by the backend `PATCH /program-rule/:id` endpoint.
 * Mirrors `UpdateProgramRuleDto` (partial of create).
 */
export type UpdateLoyaltyProgramRulePayload =
  Partial<CreateLoyaltyProgramRulePayload>;
