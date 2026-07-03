import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import {
  DEFAULT_LOGIN_REDIRECT,
  apiAuthPrefix,
  authRoutes,
  publicRoutes
} from './routes';

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;

  // Defense-in-depth: the matcher below is meant to exclude static assets
  // already, but its exact compiled semantics have drifted across Next.js
  // versions before (a hand-rolled negative-lookahead pattern silently
  // stopped excluding public/*.png under Next 16, redirecting unauthenticated
  // asset requests to /login). A plain extension check here doesn't depend on
  // matcher-compilation internals, so it can't regress the same way again.
  if (/\.[\w]+$/.test(nextUrl.pathname)) {
    return;
  }

  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
  const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
  const isAuthRoute = authRoutes.includes(nextUrl.pathname);

  if (isApiAuthRoute) {
    return;
  }

  if (isAuthRoute) {
    if (isLoggedIn) {
      return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
    }
    return;
  }

  if (!isLoggedIn && !isPublicRoute) {
    let callbackUrl = nextUrl.pathname;
    if (nextUrl.search) {
      callbackUrl += nextUrl.search;
    }

    const encodedCallbackUrl = encodeURIComponent(callbackUrl);

    return Response.redirect(
      new URL(`/login?callbackUrl=${encodedCallbackUrl}`, nextUrl)
    );
  }
});

// Match everything except static assets (Next.js's own canonical exclusion
// pattern — the negative-lookahead-in-a-path-segment idiom this used to use
// stopped reliably excluding public/*.png under Next.js 16; the in-function
// extension check above is the real backstop, this is just to avoid running
// the auth() wrapper at all for asset requests).
export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)']
};

