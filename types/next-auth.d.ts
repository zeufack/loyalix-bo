import 'next-auth';

declare module 'next-auth' {
  interface User {
    accessToken?: string;
  }

  interface Session {
    accessToken?: string;
    sessionToken?: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    accessToken?: string;
  }
}
