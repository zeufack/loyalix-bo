import { Business } from './business';
import { CustomerEnrollment } from './customer-enrollment.type';
import { ProgramRule } from './programm-rule';

export interface LoyaltyEvent {
  id: string;
  enrollment: CustomerEnrollment;
  rule: ProgramRule;
  business: Business;
  eventType: string;
  eventValue: number;
  eventData: Date;
  createdAt: Date;
}
