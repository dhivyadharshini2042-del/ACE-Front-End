import { NextResponse } from "next/server";

const BACKEND_BASE_URL =
  "https://backend-allcollegeevent-version-1.onrender.com/api";

async function handler(req) {
  try {
    const pathname = req.nextUrl.pathname;
    const backendPath = pathname.replace("/api/proxy", "");
    const backendUrl = BACKEND_BASE_URL + backendPath;

    const headers = new Headers();
    headers.set("Content-Type", "application/json");

    // forward auth header if present
    const auth = req.headers.get("authorization");
    if (auth) headers.set("authorization", auth);

    const body =
      req.method === "GET" || req.method === "HEAD"
        ? null
        : await req.text();

    const backendRes = await fetch(backendUrl, {
      method: req.method,
      headers,
      body,
      credentials: "include", // 🔥 REQUIRED
      cache: "no-store",
    });

    /* 🔥 COPY ALL HEADERS */
    const responseHeaders = new Headers();

    // VERY IMPORTANT: forward Set-Cookie
    const setCookie = backendRes.headers.get("set-cookie");
    if (setCookie) {
      responseHeaders.append("set-cookie", setCookie);
    }

    const contentType =
      backendRes.headers.get("content-type") || "application/json";
    responseHeaders.set("Content-Type", contentType);

    const text = await backendRes.text();

    return new NextResponse(text, {
      status: backendRes.status,
      headers: responseHeaders,
    });
  } catch (error) {
    console.error("PROXY ERROR:", error);
    return NextResponse.json(
      {
        message: "Backend not responding",
        error: error.message,
      },
      { status: 503 }
    );
  }
}

export const GET = handler;
export const POST = handler;
export const PUT = handler;
export const DELETE = handler;
export const PATCH = handler;
