import { NextResponse } from "next/server";

/* ===============================
   ROUTES
================================ */

const PUBLIC_EXACT = ["/", "/unauthorized"];

const PUBLIC_PREFIX = [
  "/about",
  "/contact",
  "/faq",
  "/terms-and-conditions",
  "/events",
  "/explore-events",
  "/explore-categories",
  "/organization-details",
  "/auth",              
];

const PROTECTED_PREFIX = ["/dashboard"];

/* ===============================
   MIDDLEWARE
================================ */

export function middleware(request) {
  const { pathname } = request.nextUrl;

  /* --------------------------------
     Ignore static & API
  --------------------------------- */
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api/proxy") ||
    pathname.startsWith("/images") ||
    pathname.match(/\.(png|jpg|jpeg|svg|css|js|ico)$/)
  ) {
    return NextResponse.next();
  }

  /* --------------------------------
     Allow unauthorized page
  --------------------------------- */
  if (pathname === "/unauthorized") {
    return NextResponse.next();
  }

  /* --------------------------------
     Public exact routes
  --------------------------------- */
  if (PUBLIC_EXACT.includes(pathname)) {
    return NextResponse.next();
  }

  /* --------------------------------
     Public prefix routes (IMPORTANT)
  --------------------------------- */
  if (PUBLIC_PREFIX.some((route) => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  /* --------------------------------
     Protected routes
  --------------------------------- */
  if (PROTECTED_PREFIX.some((route) => pathname.startsWith(route))) {
    const token = request.cookies.get("auth_token")?.value;

    if (!token) {
      return NextResponse.redirect(
        new URL("/unauthorized", request.url),
      );
    }
  }

  return NextResponse.next();
}

/* ===============================
   MATCHER
================================ */

export const config = {
  matcher: ["/((?!api/proxy).*)"],
};
