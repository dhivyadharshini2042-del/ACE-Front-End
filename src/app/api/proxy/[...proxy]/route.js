// Next.js response utility
import { NextResponse } from "next/server";

// Base backend API URL from environment variables
const BACKEND_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// Generic request handler for proxying API calls
async function handler(req) {
  try {
    // Extract pathname and query string from incoming request
    const { pathname, search } = req.nextUrl;

    // remove "/api/proxy" from path
    const backendPath = pathname.replace("/api/proxy", "");

    // FINAL BACKEND URL (with query params)
    const backendUrl = `${BACKEND_BASE_URL}${backendPath}${search}`;

    /* ================= FORWARD HEADERS ================= */
    // Clone incoming request headers
    const headers = new Headers(req.headers);

    // Remove host & length related headers (fetch safety)
    headers.delete("host");
    headers.delete("content-length");

    /* ================= BODY ================= */
    // Forward request body for non-GET/HEAD methods
    let body = null;
    if (req.method !== "GET" && req.method !== "HEAD") {
      body = await req.arrayBuffer();
    }

    /* ================= BACKEND FETCH ================= */
    // Send request to backend server
    const backendRes = await fetch(backendUrl, {
      method: req.method,
      headers,
      body,
      credentials: "include", // Preserve cookies
      cache: "no-store", // Disable caching for proxy requests
    });

    /* ================= RESPONSE HEADERS ================= */
    // Prepare headers for client response
    const responseHeaders = new Headers();

    // FORWARD ALL SET-COOKIE HEADERS
    backendRes.headers.forEach((value, key) => {
      if (key.toLowerCase() === "set-cookie") {
        responseHeaders.append("set-cookie", value);
      }
    });

    // Forward content-type
    const contentType = backendRes.headers.get("content-type");
    if (contentType) {
      responseHeaders.set("content-type", contentType);
    }

    /* ================= RESPONSE BODY ================= */
    // Read backend response as binary data
    const responseBody = await backendRes.arrayBuffer();

    // Return proxied response to client
    return new NextResponse(responseBody, {
      status: backendRes.status,
      headers: responseHeaders,
    });
  } catch (error) {
    // Log proxy errors for debugging
    console.error("PROXY ERROR:", error);

    // Return service unavailable response
    return NextResponse.json(
      {
        message: "Backend not responding",
        error: error.message,
      },
      { status: 503 },
    );
  }
}

/* ================= EXPORT METHODS ================= */
// Map HTTP methods to shared handler
export const GET = handler;
export const POST = handler;
export const PUT = handler;
export const DELETE = handler;
export const PATCH = handler;
