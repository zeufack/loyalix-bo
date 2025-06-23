import { Business } from './business';
import { CustomerEnrollment } from './customer-enrollment.type';
import { ProgramRule } from './programm-rule';

export interface LoyaltyProgram {
  id: string;
  business: Business;
  name: string;
  isActive: boolean;
  createdAt: Date;
  rules: ProgramRule[];
  enrollments: CustomerEnrollment[];
}
