export interface Activity {
  id: string;
  userId: string;
  type: string;
  metadata?: Record<string, any>;
  createdAt: Date;
  user?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
}
