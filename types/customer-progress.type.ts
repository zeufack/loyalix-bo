import { CustomerEnrollment } from './customer-enrollment.type';
import { ProgramRule } from './programm-rule';

export interface CustomerProgress {
  id: string;
  enrollment: CustomerEnrollment;
  rule: ProgramRule;
  currentValue: number;
  lastUpdated: Date;
  createdAt: Date;
}
