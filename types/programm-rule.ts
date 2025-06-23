import { CustomerProgress } from './customer-progress.type';
import { LoyaltyEvent } from './loyalty-event.type';
import { LoyaltyProgrammType } from './loyalty-program-type';
import { LoyaltyProgram } from './loyalty-programm';
import { RewardEarned } from './reward-earned.type';

export interface ProgramRule {
  id: string;
  program: LoyaltyProgram;
  ruleType: LoyaltyProgrammType;
  thresholdValue: number;
  rewardDescription: string;
  rewardType: string;
  rewardValue: string | null;
  isActive: boolean;
  position: number;
  validFrom: Date;
  validUntil: Date | null;
  progresses: CustomerProgress[];
  events: LoyaltyEvent[];
  rewardsEarned: RewardEarned[];
  createdAt: Date;
  updatedAt: Date;
}
