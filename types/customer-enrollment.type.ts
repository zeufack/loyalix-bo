import { Customer } from './customer';
import { CustomerProgress } from './customer-progress.type';
import { LoyaltyEvent } from './loyalty-event.type';
import { LoyaltyProgram } from './loyalty-programm';
import { RewardEarned } from './reward-earned.type';

export interface CustomerEnrollment {
  id: string;
  customer: Customer;
  program: LoyaltyProgram;
  enrollmentDate: Date;
  progresses: CustomerProgress[];
  events: LoyaltyEvent[];
  rewardsEarned: RewardEarned[];
  createdAt: Date;
  updatedAt: Date;
}
