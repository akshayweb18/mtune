// proxy.ts

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Routes that don't require authentication
const PUBLIC_ROUTES = ["/auth"];

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

  const isPublicRoute = PUBLIC_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(route + "/")
  );

  const authCookie = request.cookies.get("mtune-auth");
  const isAuthenticated = Boolean(authCookie?.value);

  // Logged in user visiting /auth
  if (isAuthenticated && isPublicRoute) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Unauthenticated user visiting protected route
  if (!isAuthenticated && !isPublicRoute) {
    return NextResponse.redirect(new URL("/auth", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};