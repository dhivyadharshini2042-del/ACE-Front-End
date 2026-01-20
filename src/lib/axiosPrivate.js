import axios from "axios";
import { getToken } from "./auth";

const apiPrivate = axios.create({
  baseURL: "/api/proxy", // proxy
  withCredentials: true, // 🔥 cookie send aagum
});

/* ================= REQUEST INTERCEPTOR ================= */
apiPrivate.interceptors.request.use((config) => {
  const token = getToken(); // localStorage helper
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/* ================= RESPONSE INTERCEPTOR ================= */
apiPrivate.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      // 🔥 token invalid / expired / deleted
      localStorage.removeItem("token");
      localStorage.removeItem("userData");

      if (typeof window !== "undefined") {
        window.location.href = "/unauthorized";
      }
    }
    return Promise.reject(err);
  }
);

export default apiPrivate;
