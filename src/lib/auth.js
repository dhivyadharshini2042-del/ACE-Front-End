import Cookies from "js-cookie";

export function setAuthCookie(token, identity, type) {
  Cookies.set("auth_token", token, { expires: 7 });
  Cookies.set("auth_identity", JSON.stringify(identity), { expires: 7 });
  Cookies.set("auth_type", type, { expires: 7 });
}

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

export function clearAuthSession() {
  Cookies.remove("auth_token");
  Cookies.remove("auth_identity");
  Cookies.remove("auth_type");
}

export function getAuthFromSession() {
  return getAuthSession();
}

export function isUserLoggedIn() {
  return !!Cookies.get("auth_token");
}

/* THIS FIXES AXIOS ERROR */
export function getAuthToken() {
  return Cookies.get("auth_token");
}

/* EMAIL TEMP STORAGE FOR FORGOT PASSWORD FLOW */

export function saveEmail(email) {
  Cookies.set("reset_email", email, { expires: 1 }); // 1 day
}

export function getEmail() {
  return Cookies.get("reset_email");
}

export function clearEmail() {
  Cookies.remove("reset_email");
}
