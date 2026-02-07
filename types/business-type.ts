export interface BusinessTypeIcon {
  id: string;
  url: string;
  thumbnailUrl?: string;
}

export interface BusinessType {
  id: string;
  name: string;
  description?: string | null;
  icon?: BusinessTypeIcon | null;
}

export type CreateBusinessTypePayload = Omit<BusinessType, 'id' | 'icon'>;
export type UpdateBusinessTypePayload = Partial<CreateBusinessTypePayload>;
