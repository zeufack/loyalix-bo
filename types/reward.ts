export interface RewardBusinessRef {
  id: string;
  name: string;
}

export interface RewardTypeRef {
  id: string;
  name: string;
}

export interface Reward {
  id: string;
  name: string;
  description?: string | null;
  value: RewardValue;
  isActive: boolean;
  business?: RewardBusinessRef | null;
  rewardType?: RewardTypeRef | null;
  createdAt?: string;
  updatedAt?: string;
}

export type RewardValueType = 'free_item' | 'discount' | 'gift_card' | 'points';

/**
 * Structured reward value sent to the backend. Mirrors `RewardValueDto`.
 */
export interface RewardValue {
  type: RewardValueType;
  itemCode?: string;
  quantity?: number;
  discountPercent?: number;
  discountAmount?: number;
  pointsValue?: number;
}

/**
 * Payload accepted by the backend `POST /rewards` endpoint.
 * Mirrors `CreateRewardDto`.
 */
export interface CreateRewardPayload {
  businessId: string;
  rewardTypeId?: string;
  name: string;
  description?: string;
  value: RewardValue;
  isActive?: boolean;
}

/**
 * Payload accepted by the backend `PATCH /rewards/:id` endpoint.
 * Mirrors `UpdateRewardDto` (partial of create).
 */
export type UpdateRewardPayload = Partial<CreateRewardPayload>;
