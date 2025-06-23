import { CustomerEnrollment } from './customer-enrollment.type';
import { ProgramRule } from './programm-rule';

type RewardStatus = 'pending' | 'redeemed' | 'expired' | 'cancelled';

interface RewardDetails {
  description: string;
  value?: string | number;
  metadata?: Record<string, unknown>;
  // ... other specific reward detail fields
}

export interface RewardEarned {
  id: string;
  enrollment: CustomerEnrollment;
  rule: ProgramRule;
  earnedAt: Date;
  redeemedAt: Date | null;
  status: RewardStatus;
  rewardDetails: RewardDetails | null;
}
