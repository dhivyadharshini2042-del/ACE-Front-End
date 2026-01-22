import { NextResponse } from "next/server";

/**
 * Middleware
 * Intercepts requests to handle authentication, route protection, and consent logic.
 */
/* ===============================
   ROUTE CONFIG
================================ */

// Public routes (token / no consent )
const PUBLIC_ROUTES = [
  "/",
  "/about",
  "/contact",
  "/faq",
  "/terms-and-conditions",
  "/events",
  "/explore-events",
  "/explore-categories",
  "/organization-details",
  "/auth",
  "/unauthorized",
];

// Protected routes (token MUST)
const PROTECTED_ROUTES = [
  "/dashboard",
  "/profile",
  "/settings",
  "/space",
];

// Consent required routes (GDPR / cookie consent)
const CONSENT_REQUIRED_ROUTES = [
  "/",
  "/events",
  "/explore-events",
  "/explore-categories",
  "/organization-details",
];

/* ===============================
   MIDDLEWARE
================================ */

export function middleware(request) {
  const { pathname } = request.nextUrl;

  /* --------------------------------
     1. Ignore Next internals & assets
  --------------------------------- */
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/images") ||
    pathname.startsWith("/favicon") ||
    pathname.endsWith(".png") ||
    pathname.endsWith(".jpg") ||
    pathname.endsWith(".jpeg") ||
    pathname.endsWith(".svg") ||
    pathname.endsWith(".css") ||
    pathname.endsWith(".js") ||
    pathname.endsWith(".ico")
  ) {
    return NextResponse.next();
  }

  /* --------------------------------
     2. Read cookies
  --------------------------------- */
  const token = request.cookies.get("token")?.value;
  const consent = request.cookies.get("user_consent")?.value;

  /* --------------------------------
     3. PROTECTED ROUTES (Auth)
  --------------------------------- */
  if (PROTECTED_ROUTES.some((route) => pathname.startsWith(route))) {
    if (!token) {
      return NextResponse.redirect(
        new URL("/unauthorized", request.url)
      );
    }
    return NextResponse.next();
  }

  /* --------------------------------
     4. CONSENT CHECK
     (only if route needs consent)
  --------------------------------- */
  if (
    CONSENT_REQUIRED_ROUTES.some((route) => pathname.startsWith(route)) &&
    !consent
  ) {
    // Consent no → page load 
    // consent modal client side handle 
    return NextResponse.next();
  }

  /* --------------------------------
     5. PUBLIC ROUTES → allow
  --------------------------------- */
  if (PUBLIC_ROUTES.some((route) => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  /* --------------------------------
     6. EVERYTHING ELSE → 404
  --------------------------------- */
  return NextResponse.rewrite(
    new URL("/not-found", request.url)
  );
}

/* ===============================
   APPLY TO ALL ROUTES
================================ */

export const config = {
  matcher: ["/:path*"],
};
