import { Icon } from './icon';

export interface LoyaltyProgram {
  id: string;
  name: string;
  description?: string | null;
  isActive: boolean;
  businessId: string;
  createdAt: Date;
  updatedAt: Date;
  coverImage?: Icon | null;
}
