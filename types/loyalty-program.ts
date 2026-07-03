import { Icon } from './icon';

export interface LoyaltyProgram {
  id: string;
  name: string;
  description?: string | null;
  /** Days an earned reward stays valid after minting. Null/omitted = never expires. */
  rewardValidityDays?: number | null;
  isActive: boolean;
  businessId: string;
  createdAt: Date;
  updatedAt: Date;
  coverImage?: Icon | null;
}
