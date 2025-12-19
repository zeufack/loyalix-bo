export interface CustomerProgress {
  id: string;
  enrollmentId: string;
  ruleId: string;
  currentValue: number;
  isComplete: boolean;
  lastUpdated: Date;
  createdAt: Date;
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
    thresholdValue: number;
    rewardDescription?: string;
  };
}
