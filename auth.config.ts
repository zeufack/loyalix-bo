import type { NextAuthConfig } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { useAuthStore } from './lib/stores/use-auth-store';

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

          const { accessToken, refreshToken, user } = responseBody.data;
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            accessToken,
            refreshToken,
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
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.user = {
          id: user.id,
          email: user.email,
          name: user.name,
          roles: user.roles,
          isEmailVerified: user.isEmailVerified
        };
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
        token.accessTokenExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes
      }

      // Return previous token if the access token has not expired yet
      if (new Date() < new Date(token.accessTokenExpires as string)) {
        return token;
      }

      // Access token has expired, try to refresh it
      const refreshed = await refreshAccessToken(token as any);

      if ('signOut' in refreshed && refreshed.signOut) {
        return null;
      }

      return refreshed;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken;
      session.refreshToken = token.refreshToken;
      session.user = token.user;
      session.error = token.error;
      return session;
    }
  },
  events: {
    async signOut() {
      // useAuthStore.getState().logout();
    }
  },
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60
  },
  pages: {
    signIn: '/login',
    error: '/error'
  },
  secret: process.env.NEXTAUTH_SECRET
} satisfies NextAuthConfig;

// Token refresh function
async function refreshAccessToken(token: { refreshToken: string }) {
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

    const refreshedTokens = await response.json();

    if (!response.ok) {
      if (response.status === 401) {
        return { ...token, error: 'RefreshAccessTokenError', signOut: true };
      }
      throw refreshedTokens;
    }

    return {
      ...token,
      accessToken: refreshedTokens.accessToken,
      accessTokenExpires: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes
      refreshToken: refreshedTokens.refreshToken ?? token.refreshToken
    };
  } catch (error) {
    console.error('Error refreshing access token:', error);
    return {
      ...token,
      error: 'RefreshAccessTokenError'
    };
  }
}
