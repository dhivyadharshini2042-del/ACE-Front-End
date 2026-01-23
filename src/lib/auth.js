import { jwtDecode } from "jwt-decode";

/* ================= TOKEN ================= */

export const saveToken = (token) => {
  if (typeof window === "undefined") return;

  localStorage.setItem("token", token);

  try {
    const decoded = jwtDecode(token);
    localStorage.setItem("userData", JSON.stringify(decoded.data));
  } catch (err) {
    console.error("Token decode failed", err);
  }
};

export const getToken = () => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
};

export const getUserData = () => {
  if (typeof window === "undefined") return null;
  const data = localStorage.getItem("userData");
  return data ? JSON.parse(data) : null;
};

export const clearToken = async () => {
  if (typeof window === "undefined") return;

  localStorage.removeItem("token");
  localStorage.removeItem("userData");

  await fetch("/api/logout", {
    method: "POST",
    credentials: "include",
  });
};


/* ================= EMAIL (FOR OTP FLOW) ================= */

export const saveEmail = (email) => {
  if (typeof window === "undefined") return;
  localStorage.setItem("userEmail", email);
};

export const getEmail = () => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("userEmail");
};

export const clearEmail = () => {
  if (typeof window === "undefined") return;
  localStorage.removeItem("userEmail");
};

/* ================= LOGIN CHECK ================= */

export const isUserLoggedIn = () => {
  if (typeof window === "undefined") return false;
  return !!getToken();
};
