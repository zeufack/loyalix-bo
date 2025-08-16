export interface CustomerProgress {
  id: string;
  customerId: string;
  loyaltyProgramId: string;
  pointsEarned: number;
  rewardsRedeemed: number;
  createdAt: Date;
  updatedAt: Date;
}
