import { User } from './user';

export interface Customer {
  id: string;
  user: Pick<User, 'id' | 'email' | 'firstName' | 'lastName' | 'isActive'>; // You'll also need a User type
  deviceToken?: string; // nullable → optional
  createdAt: Date;
  lastActive?: Date; // nullable → optional
  // enrollments?: CustomerEnrollment[]; // relations are optional
  notifications?: Notification[];
}
