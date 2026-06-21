/**
 * Module-level cache of the current access token.
 *
 * Kept in sync by the SessionProvider (see `components/auth/session-provider`)
 * so the axios request interceptor can attach the JWT **synchronously** instead
 * of calling `getSession()` — a network round-trip to `/api/auth/session` — on
 * every request.
 */
let accessToken: string | undefined;

export function getCachedAccessToken(): string | undefined {
  return accessToken;
}

export function setCachedAccessToken(token: string | undefined): void {
  accessToken = token;
}
