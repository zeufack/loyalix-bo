// Import and re-export Role from shared types as UserRole for backwards compatibility
import { Role } from '@loyal-ix/loyalix-shared-types';
export { Role };
export const UserRole = Role;
export type UserRole = Role;

export interface User {
  id: string;
  email: string;
  firstName?: string | null;
  lastName?: string | null;
  password?: string;
  phoneNumber?: string | null;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
  isVerified: boolean;
  emailVerificationToken?: string;
  roles: UserRole[];
  createdAt: Date;
  updatedAt: Date;
}
