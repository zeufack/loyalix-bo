export interface User {
  id: string;
  email: string;
  firstName?: string | null;
  lastName?: string | null;
  password?: string;
  phoneNumber?: string | null;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
  isEmailVerified: boolean;
  emailVerificationToken?: string;
  isActive: boolean;
  //   customerProfile?: Customer;
  //   staffProfile?: BusinessStaff;
  //   roles?: Role[];
  //   refreshTokens?: RefreshToken[];
  createdAt: Date;
  updatedAt: Date;
}
