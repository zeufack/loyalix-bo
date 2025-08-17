import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { useAuthStore } from './stores/use-auth-store';

export const { handlers, signIn, signOut, auth } = NextAuth({
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
          if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Authentication failed');
          }

          const { accessToken, refreshToken, user } = await response.json();
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
        }
        return null;
      }
    })
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      console.log(`token in callback ${token}`);
      if (user) {
        token.user = {
          id: user.id,
          email: user.email,
          roles: user.roles,
          isEmailVerified: user.isEmailVerified
        };
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
      }
      return token;
    },
    async session({ session, token }) {
      if (token.accessToken && typeof token.accessToken === 'string') {
        session.accessToken = token.accessToken;
        session.refreshToken = token.refreshToken;
        session.user = token.user;
        session.error = token.error;
        return session;
      }
      return session;
    }
  },
  events: {
    async signOut() {
      useAuthStore.getState().logout();
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
});
