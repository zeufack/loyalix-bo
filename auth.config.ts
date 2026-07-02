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

          const { accessToken, refreshToken, accessTokenExpiresIn, user } =
            responseBody;
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
        const expiresInSeconds =
          (user as { accessTokenExpiresIn?: number }).accessTokenExpiresIn ||
          900;
        token.accessTokenExpires = Date.now() + expiresInSeconds * 1000;
      }

      const expiresAt = token.accessTokenExpires as number | undefined;
      if (expiresAt && Date.now() < expiresAt - REFRESH_BUFFER_MS) {
        return token;
      }

      return await refreshAccessToken(token);
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken;
      session.user = token.user;
      session.error = token.error;
      session.accessTokenExpires = token.accessTokenExpires;
      return session;
    }
  },
  events: {
    async signOut(message) {
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

const REFRESH_BUFFER_MS = 60 * 1000;

type RefreshableToken = {
  refreshToken?: string;
  accessToken?: string;
  accessTokenExpires?: number;
  user?: unknown;
  error?: string;
};

const inflightRefreshes = new Map<string, Promise<RefreshableToken>>();

async function refreshAccessToken(
  token: RefreshableToken
): Promise<RefreshableToken> {
  const { refreshToken } = token;
  if (!refreshToken) {
    return { ...token, error: 'RefreshAccessTokenError' };
  }

  let inflight = inflightRefreshes.get(refreshToken);
  if (!inflight) {
    inflight = requestRefreshedTokens(token, refreshToken).finally(() => {
      inflightRefreshes.delete(refreshToken);
    });
    inflightRefreshes.set(refreshToken, inflight);
  }
  return inflight;
}

async function requestRefreshedTokens(
  token: RefreshableToken,
  refreshToken: string
): Promise<RefreshableToken> {
  try {
    const response = await fetch(
      `${process.env.NESTJS_API_URL}/auth/refresh-token`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken })
      }
    );

    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        console.error('Refresh token rejected by backend, session expired');
        return { ...token, error: 'RefreshAccessTokenError' };
      }
      console.error(`Token refresh failed transiently: ${response.status}`);
      return { ...token, error: undefined };
    }

    const refreshedTokens = await response.json();
    const expiresInSeconds = refreshedTokens.accessTokenExpiresIn || 900;

    return {
      ...token,
      accessToken: refreshedTokens.accessToken,
      accessTokenExpires: Date.now() + expiresInSeconds * 1000,
      refreshToken: refreshedTokens.refreshToken ?? refreshToken,
      error: undefined
    };
  } catch (error) {
    console.error('Error refreshing access token:', error);
    return { ...token, error: undefined };
  }
}
