import { RewardValue } from '@loyal-ix/loyalix-shared-types';

export type { RewardValue };

/** A single rule within a loyalty program template, including its reward spec. */
export interface LoyaltyProgramTemplateRule {
  id: string;
  /** Seeded RuleType name: visits | spending | referrals | purchases | points | streak. */
  ruleTypeName: string;
  thresholdValue: number;
  isRepeatable: boolean;
  position: number;
  /** Relative validity window (days) applied to the minted rule. Null = no end. */
  validForDays: number | null;
  rewardName: string;
  rewardDescription: string | null;
  /** Seeded RewardType name, e.g. free_item | discount_percentage | voucher. */
  rewardTypeName: string;
  rewardValue: RewardValue;
}

/** A curated, global program blueprint a business can instantiate. */
export interface LoyaltyProgramTemplate {
  id: string;
  /** Stable unique slug used as the seeding idempotency key. */
  key: string;
  name: string;
  description?: string;
  /** Business-type names this template is recommended for. Null/empty = universal. */
  recommendedBusinessTypes: string[] | null;
  rewardValidityDays: number | null;
  icon: string | null;
  coverImageUrl: string | null;
  isActive: boolean;
  isFeatured: boolean;
  createdAt: string;
  rules: LoyaltyProgramTemplateRule[];
}
