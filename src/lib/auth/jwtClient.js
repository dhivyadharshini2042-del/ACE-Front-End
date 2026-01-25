import { jwtDecode } from "jwt-decode";

/**
 * Read cookie by name
 */
export function getCookie(name) {
  if (typeof document === "undefined") return null;

  const match = document.cookie
    .split("; ")
    .find((row) => row.startsWith(name + "="));

  return match ? decodeURIComponent(match.split("=")[1]) : null;
}

/**
 * Decode authToken from cookie
 */
export function getAuthFromCookie() {
  try {
    const token = getCookie("authToken");
    if (!token) return null;

    const decoded = jwtDecode(token);

    return {
      identity: decoded?.data?.identity || null,
      email: decoded?.data?.email || null,
      type: decoded?.data?.type || null, // "org" | "user"
      roleId: decoded?.data?.roleId || null,
      exp: decoded?.exp,
    };
  } catch (err) {
    console.error("JWT decode failed", err);
    return null;
  }
}
