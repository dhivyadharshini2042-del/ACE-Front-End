import { NextResponse } from "next/server";

const BACKEND_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

async function handler(req) {
  try {
    const pathname = req.nextUrl.pathname;

    // remove "/api/proxy" from path
    const backendPath = pathname.replace("/api/proxy", "");

    // FINAL BACKEND URL
    const backendUrl = `${BACKEND_BASE_URL}${backendPath}`;

    const headers = new Headers();
    headers.set("Content-Type", "application/json");

    // forward auth header
    const auth = req.headers.get("authorization");
    if (auth) headers.set("authorization", auth);

    const body =
      req.method === "GET" || req.method === "HEAD" ? null : await req.text();

    const backendRes = await fetch(backendUrl, {
      method: req.method,
      headers,
      body,
      credentials: "include",
      cache: "no-store",
    });

    // forward response headers
    const responseHeaders = new Headers();

    const setCookie = backendRes.headers.get("set-cookie");
    if (setCookie) responseHeaders.append("set-cookie", setCookie);

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
      { status: 503 },
    );
  }
}

export const GET = handler;
export const POST = handler;
export const PUT = handler;
export const DELETE = handler;
export const PATCH = handler;
