import { ProgramRule } from './programm-rule';

export interface LoyaltyProgrammType {
  id: string;
  name: string;
  description: string | null;
  measurementUnit: string | null;
  icon: string | null;
  rules: ProgramRule[];
  createdAt: Date;
  updatedAt: Date;
}
