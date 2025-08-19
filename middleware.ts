import { auth } from './lib/auth'; // import your NextAuth config
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define routes to protect
const protectedRoutes = ['/', '/dashboard', '/account'];

export async function middleware(request: NextRequest) {
  console.log('middleware is loaded');
  const session = await auth(); // pulls session via NextAuth using JWT strategy

  const { pathname } = request.nextUrl;

  // Check if current path needs protection
  const isProtected = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (isProtected && !session) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('callbackUrl', request.url); // redirect after login
    return NextResponse.redirect(loginUrl);
  }

  // if (isProtected && session && !session.user.roles.includes('admin')) {
  //   return NextResponse.redirect(new URL('/not-authorized', request.url));
  // }

  return NextResponse.next();
}

// Apply to routes you want to protect
export const config = {
  matcher: ['/', '/dashboard/:path*', '/account/:path*']
};
