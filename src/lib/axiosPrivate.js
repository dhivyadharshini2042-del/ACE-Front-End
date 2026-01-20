import axios from "axios";
import { getToken } from "./auth";

const apiPrivate = axios.create({
  baseURL:
    typeof window === "undefined"
      ? process.env.NEXT_PUBLIC_API_URL
      : "/api/proxy",
  withCredentials: true,
});

/* ================= REQUEST INTERCEPTOR ================= */
apiPrivate.interceptors.request.use((config) => {
  const token = getToken();
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
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
        localStorage.removeItem("userData");
        window.location.href = "/unauthorized";
      }
    }
    return Promise.reject(err);
  }
);

export default apiPrivate;
