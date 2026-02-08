// Import and re-export BusinessStatus from shared types
import { BusinessStatus } from '@loyal-ix/loyalix-shared-types';
import { Icon } from './icon';
export { BusinessStatus };

export interface Business {
  id: string;
  name: string;
  phone?: string;
  email: string;
  description?: string | null;
  industryType?: {
    id: string;
    name: string;
  };
  address?: string | null;
  qrSecret?: string;
  status: BusinessStatus;
  createdAt: Date;
  updatedAt: Date;
  staffMembers?: any[];
  loyaltyPrograms?: any[];
  profileImage?: Icon | null;
  images?: Icon[];
}

export type BusinessTableItem = Pick<
  Business,
  'id' | 'name' | 'email' | 'phone' | 'industryType' | 'createdAt' | 'profileImage'
> & {
  staffCount: number;
  programsCount: number;
};

export interface CreateBusinessPayload {
  name: string;
  email: string;
  phone?: string;
  description?: string;
  industryType: string;
  address?: string;
  owner: string;
}

export interface UpdateBusinessPayload {
  name?: string;
  email?: string;
  phone?: string;
  description?: string;
  industryType?: string;
  address?: string;
}
