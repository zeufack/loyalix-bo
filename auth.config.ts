import type { NextAuthConfig } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

export const authConfig = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        try {
          const response = await fetch(
            `${process.env.NESTJS_API_URL}/auth/login`,
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                email: credentials.email,
                password: credentials.password
              })
            }
          );

          const responseBody = await response.json();

          if (!response.ok) {
            throw new Error(responseBody.message || 'Authentication failed');
          }

          const { accessToken, refreshToken, accessTokenExpiresIn, user } = responseBody;
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            accessToken,
            refreshToken,
            accessTokenExpiresIn: accessTokenExpiresIn || 900, // Default to 15 min if not provided
            ...user
          };
        } catch (error) {
          console.error('Auth error:', error);
          return null;
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.user = {
          id: user.id,
          email: user.email,
          name: user.name,
          roles: user.roles,
          isVerified: user.isVerified
        };
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
        // Use dynamic expiration from backend (in seconds), fallback to 15 min
        const expiresInSeconds = (user as { accessTokenExpiresIn?: number }).accessTokenExpiresIn || 900;
        token.accessTokenExpires = Date.now() + expiresInSeconds * 1000;
      }

      // Return previous token if the access token has not expired yet
      if (Date.now() < (token.accessTokenExpires as number)) {
        return token;
      }

      // Access token has expired, try to refresh it
      return await refreshAccessToken(token);
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken;
      session.refreshToken = token.refreshToken;
      session.user = token.user;
      session.error = token.error;
      session.accessTokenExpires = token.accessTokenExpires;
      return session;
    }
  },
  events: {
    async signOut(message) {
      // Call backend logout endpoint to revoke refresh token
      // In JWT strategy, message contains the token
      if ('token' in message && message.token?.refreshToken) {
        try {
          await fetch(`${process.env.NESTJS_API_URL}/auth/logout`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refreshToken: message.token.refreshToken })
          });
        } catch (error) {
          console.error('Error revoking refresh token:', error);
        }
      }
    }
  },
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60 // 24 hours
  },
  pages: {
    signIn: '/login',
    error: '/error'
  },
  secret: process.env.NEXTAUTH_SECRET
} satisfies NextAuthConfig;

// Token refresh function
async function refreshAccessToken(token: {
  refreshToken?: string;
  accessToken?: string;
  accessTokenExpires?: number;
  user?: unknown;
  error?: string;
}) {
  if (!token.refreshToken) {
    return { ...token, error: 'RefreshAccessTokenError' };
  }

  try {
    const response = await fetch(
      `${process.env.NESTJS_API_URL}/auth/refresh-token`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token.refreshToken}`
        },
        body: JSON.stringify({
          refreshToken: token.refreshToken
        })
      }
    );

    const responseBody = await response.json();

    if (!response.ok) {
      if (response.status === 401) {
        return { ...token, error: 'RefreshAccessTokenError' };
      }
      throw responseBody;
    }

    const refreshedTokens = responseBody;
    // Use dynamic expiration from backend (in seconds), fallback to 15 min
    const expiresInSeconds = refreshedTokens.accessTokenExpiresIn || 900;

    return {
      ...token,
      accessToken: refreshedTokens.accessToken,
      accessTokenExpires: Date.now() + expiresInSeconds * 1000,
      refreshToken: refreshedTokens.refreshToken ?? token.refreshToken,
      error: undefined
    };
  } catch (error) {
    console.error('Error refreshing access token:', error);
    return {
      ...token,
      error: 'RefreshAccessTokenError'
    };
  }
}
