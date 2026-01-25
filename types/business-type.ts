export interface BusinessType {
  id: string;
  name: string;
  description?: string | null;
}

export type CreateBusinessTypePayload = Omit<BusinessType, 'id'>;
export type UpdateBusinessTypePayload = Partial<CreateBusinessTypePayload>;
