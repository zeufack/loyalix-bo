import { Icon } from './icon';

export interface BusinessType {
  id: string;
  name: string;
  description?: string | null;
  icon?: Icon | null;
}

export type CreateBusinessTypePayload = Omit<BusinessType, 'id' | 'icon'>;
export type UpdateBusinessTypePayload = Partial<CreateBusinessTypePayload>;
