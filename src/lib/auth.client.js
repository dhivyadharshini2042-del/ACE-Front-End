"use client";

import Cookies from "js-cookie";

/* ========== SAVE AUTH (LOGIN) ========== */
export function setAuthCookie(token, identity, type) {
  Cookies.set("auth_token", token, { expires: 7 });
  Cookies.set("auth_identity", JSON.stringify(identity), { expires: 7 });
  Cookies.set("auth_type", type, { expires: 7 });
}

/* ========== GET AUTH ========== */
export function getAuthSession() {
  const token = Cookies.get("auth_token");
  const identity = Cookies.get("auth_identity");
  const type = Cookies.get("auth_type");

  return {
    token,
    identity: identity ? JSON.parse(identity) : null,
    type,
  };
}

/* ========== OLD NAMES (VERY IMPORTANT) ========== */
export function getAuthFromSession() {
  return getAuthSession();
}

export function isUserLoggedIn() {
  return !!Cookies.get("auth_token");
}

/* ========== LOGOUT ========== */
export function clearAuthSession() {
  Cookies.remove("auth_token");
  Cookies.remove("auth_identity");
  Cookies.remove("auth_type");
}
