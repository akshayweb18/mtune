// proxy.ts — Auth is handled client-side via popup, not server redirect

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Static/system paths to always allow
const BYPASS_PREFIXES = [
  "/_next",
  "/api",
  "/favicon",
  "/icon",
  "/apple-icon",
  "/manifest",
];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow static files and API routes
  if (BYPASS_PREFIXES.some((prefix) => pathname.startsWith(prefix))) {
    return NextResponse.next();
  }

  const authCookie = request.cookies.get("mtune-auth");
  const isAuthenticated = Boolean(authCookie?.value);

  // Logged-in user visiting /auth → redirect to home
  if (isAuthenticated && pathname.startsWith("/auth")) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // All other routes are public — no redirect for unauthenticated users
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
