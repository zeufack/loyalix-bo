import { Customer } from './customer';
import { LoyaltyProgram } from './loyalty-program';

export interface CustomerEnrollment {
  id: string;
  enrollmentDate: string;
  customer: Customer;
  program: LoyaltyProgram;
}

export interface CreateCustomerEnrollmentDto {
  customerId: string;
  programId: string;
  enrollmentDate?: string;
}
