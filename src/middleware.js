import { NextResponse } from "next/server";

/* ================= CONFIG ================= */

const BLOCKED_USER_AGENTS = [
  "curl",
  "wget",
  "python",
  "scrapy",
  "postman",
  "httpclient",
];

const SENSITIVE_PATHS = [
  "/.env",
  "/.git",
  "/.next",
  "/config",
];

const PROTECTED_ROUTES = [
  "/dashboard",
  "/profile",
  "/settings",
  "/space",
];

/* ================= HELPERS ================= */

function getToken(req) {
  // 🔥 MUST MATCH BACKEND COOKIE NAME
  return req.cookies.get("authToken")?.value || null;
}

function isPathSafe(pathname) {
  return (
    !pathname.includes("..") &&
    !pathname.includes("//") &&
    !pathname.includes("%2e")
  );
}

/* ================= MIDDLEWARE ================= */

export default function middleware(req) {
  const { pathname } = req.nextUrl;

  /* ✅ API ROUTES – ALWAYS ALLOW */
  if (pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  const token = getToken(req);
  const userAgent = req.headers.get("user-agent")?.toLowerCase() || "";
  const fetchMode = req.headers.get("sec-fetch-mode");

  console.log("Middleware:", pathname, "| mode:", fetchMode);

  /* ❌ BLOCK SENSITIVE PATHS */
  if (SENSITIVE_PATHS.some((p) => pathname.startsWith(p))) {
    return NextResponse.rewrite(new URL("/not-found", req.url));
  }

  /* ❌ SANITIZE PATH */
  if (!isPathSafe(pathname)) {
    return NextResponse.rewrite(new URL("/not-found", req.url));
  }

  /* ❌ BLOCK BOTS */
  if (BLOCKED_USER_AGENTS.some((ua) => userAgent.includes(ua))) {
    return NextResponse.rewrite(new URL("/not-found", req.url));
  }

  /* 🔐 PROTECTED ROUTES
     - ONLY block manual URL typing
     - Allow router.push / Link navigation
  */
  if (
    PROTECTED_ROUTES.some((route) => pathname.startsWith(route)) &&
    fetchMode === "navigate" &&
    !token
  ) {
    return NextResponse.redirect(
      new URL("/auth/user/login", req.url)
    );
  }

  return NextResponse.next();
}

/* ================= MATCHER ================= */

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|images|fonts).*)",
  ],
};
