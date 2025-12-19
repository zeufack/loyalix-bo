import { User } from './user';

export interface Customer {
  id: string;
  user: Pick<User, 'id' | 'email' | 'firstName' | 'lastName' | 'isActive'>;
  deviceToken?: string;
  createdAt: Date;
  lastActive?: Date;
  notifications?: Notification[];
}

export interface CreateCustomerDto {
  userId: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
}
