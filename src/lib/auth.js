import { jwtDecode } from "jwt-decode";
import CryptoJS from "crypto-js";

/* ======================================================
   CONFIG
   ====================================================== */

// ⚠️ Frontend secret (obfuscation only, not real security)
const SECRET_KEY = "ACE_FRONTEND_SESSION_KEY_v1";

/* ======================================================
   ENCRYPT / DECRYPT HELPERS
   ====================================================== */

const encrypt = (data) => {
  return CryptoJS.AES.encrypt(
    JSON.stringify(data),
    SECRET_KEY
  ).toString();
};

const decrypt = (cipherText) => {
  try {
    const bytes = CryptoJS.AES.decrypt(cipherText, SECRET_KEY);
    const decoded = bytes.toString(CryptoJS.enc.Utf8);
    return decoded ? JSON.parse(decoded) : null;
  } catch {
    return null;
  }
};

/* ======================================================
   AUTH SESSION (SECURE)
   ====================================================== */

/**
 * ✅ Save auth session (ENCRYPTED)
 * MUST be called after login success
 */
export const setAuthSession = (token) => {
  if (typeof window === "undefined") return null;

  try {
    const decoded = jwtDecode(token);

    const authPayload = {
      token, // 🔥 VERY IMPORTANT (Bearer token)
      identity: decoded?.data?.identity || null,
      email: decoded?.data?.email || null,
      type: decoded?.data?.type || null, // "user" | "org"
      roleId: decoded?.data?.roleId || null,
      exp: decoded?.exp || null,
    };

    const encrypted = encrypt(authPayload);

    sessionStorage.setItem("auth", encrypted);
    return authPayload;
  } catch (err) {
    console.error("Auth session save failed", err);
    return null;
  }
};

/**
 * ✅ Get auth session (DECRYPTED)
 */
export const getAuthFromSession = () => {
  if (typeof window === "undefined") return null;

  const cipher = sessionStorage.getItem("auth");
  if (!cipher) return null;

  return decrypt(cipher);
};

/**
 * ✅ Get RAW JWT token (for Bearer header)
 */
export const getAuthToken = () => {
  if (typeof window === "undefined") return null;

  const auth = getAuthFromSession();
  return auth?.token || null;
};

/**
 * ✅ Check login status
 * Used for PUBLIC / PRIVATE API switch
 */
export const isUserLoggedIn = () => {
  if (typeof window === "undefined") return false;

  const auth = getAuthFromSession();
  if (!auth) return false;

  if (auth?.exp) {
    const now = Math.floor(Date.now() / 1000);
    return auth.exp > now;
  }

  return true;
};

/**
 * ✅ Clear auth session (logout / 401)
 */
export const clearAuthSession = async () => {
  if (typeof window === "undefined") return;

  sessionStorage.removeItem("auth");

  // backend logout (cookie clear if any)
  await fetch("/api/logout", {
    method: "POST",
    credentials: "include",
  });
};

/* ======================================================
   EMAIL (OTP FLOW) – SESSION SAFE
   ====================================================== */

export const saveEmail = (email) => {
  if (typeof window === "undefined") return;
  sessionStorage.setItem("userEmail", encrypt(email));
};

export const getEmail = () => {
  if (typeof window === "undefined") return null;

  const cipher = sessionStorage.getItem("userEmail");
  return cipher ? decrypt(cipher) : null;
};

export const clearEmail = () => {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem("userEmail");
};
