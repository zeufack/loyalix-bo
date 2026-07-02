import { DefaultSession, DefaultUser } from 'next-auth';
import { JWT } from 'next-auth/jwt';

declare module 'next-auth' {
  interface User extends DefaultUser {
    id: string;
    email: string;
    roles: string[];
    isVerified: boolean;
    accessToken: string;
    refreshToken: string;
  }

  // The refresh token intentionally never appears on the client-visible
  // Session — it lives only in the server-side JWT cookie.
  interface Session extends DefaultSession {
    user?: User;
    accessToken?: string;
    accessTokenExpires?: number;
    error?: 'RefreshAccessTokenError' | string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    user?: User;
    accessToken?: string;
    refreshToken?: string;
    accessTokenExpires?: number;
    error?: 'RefreshAccessTokenError' | string;
  }
}
