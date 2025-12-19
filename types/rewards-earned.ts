export interface RewardEarned {
  id: string;
  redemptionCode: string;
  earnedAt: Date;
  redeemedAt?: Date;
  expiresAt?: Date;
  status: 'pending' | 'earned' | 'redeemed' | 'expired';
  rewardDetails?: Record<string, any>;
  enrollment?: {
    id: string;
    customer?: {
      id: string;
      user?: {
        firstName: string;
        lastName: string;
        email: string;
      };
    };
    program?: {
      id: string;
      name: string;
    };
  };
  rule?: {
    id: string;
    rewardDescription?: string;
    rewardValue?: number;
  };
}

export interface CreateRewardEarnedDto {
  enrollmentId: string;
  ruleId: string;
  status?: string;
  expiresAt?: string;
  rewardDetails?: Record<string, any>;
}
