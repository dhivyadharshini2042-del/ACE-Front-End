import { jwtDecode } from "jwt-decode";
import CryptoJS from "crypto-js";

const SECRET_KEY = "ACE_FRONTEND_SESSION_KEY_v1";

/* encrypt */
const encrypt = (data) =>
  CryptoJS.AES.encrypt(JSON.stringify(data), SECRET_KEY).toString();

/* decrypt */
const decrypt = (cipher) => {
  try {
    const bytes = CryptoJS.AES.decrypt(cipher, SECRET_KEY);
    const decoded = bytes.toString(CryptoJS.enc.Utf8);
    return decoded ? JSON.parse(decoded) : null;
  } catch {
    return null;
  }
};

/* COOKIE → LOCALSTORAGE */
export const saveAuthFromCookie = () => {
  if (typeof window === "undefined") return null;

  const cookie = document.cookie
    .split("; ")
    .find((row) => row.startsWith("authToken="));

  if (!cookie) return null;

  const token = decodeURIComponent(cookie.split("=")[1]);
  const decoded = jwtDecode(token);

  const authData = {
    token,
    identity: decoded?.data?.identity,
    email: decoded?.data?.email,
    roleId: decoded?.data?.roleId,
    type: decoded?.data?.type,
    exp: decoded?.exp,
  };

  const encrypted = encrypt(authData);
  localStorage.setItem("auth", encrypted);

  return authData;
};

/* GET (decrypt) */
export const getAuth = () => {
  if (typeof window === "undefined") return null;

  const cipher = localStorage.getItem("auth");
  if (!cipher) return saveAuthFromCookie();

  return decrypt(cipher);
};

/* GET TOKEN (for API) */
export const getAuthToken = () => {
  const auth = getAuth();
  return auth?.token || null;
};

/* LOGIN CHECK */
export const isUserLoggedIn = () => {
  const auth = getAuth();
  if (!auth) return false;

  const now = Math.floor(Date.now() / 1000);
  return auth.exp ? auth.exp > now : true;
};

/* LOGOUT */
export const clearAuth = () => {
  localStorage.removeItem("auth");
};
