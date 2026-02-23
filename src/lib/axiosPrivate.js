import axios from "axios";
import { getAuthToken, clearAuthSession } from "./auth";

const apiPrivate = axios.create({
  baseURL:
    typeof window === "undefined"
      ? process.env.NEXT_PUBLIC_API_URL
      : "/api/proxy",
  withCredentials: true, // cookie support (if backend uses it)
});

/* ================= REQUEST INTERCEPTOR ================= */
apiPrivate.interceptors.request.use(
  (config) => {
    // GET JWT TOKEN FROM SESSION
    const token = getAuthToken();

    // ATTACH BEARER TOKEN
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

/* ================= RESPONSE INTERCEPTOR ================= */
apiPrivate.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status = error?.response?.status;

    if (status === 401 && typeof window !== "undefined") {
      // clear session + redirect
      await clearAuthSession();
      window.location.href = "/unauthorized";
    }

    return Promise.reject(error);
  },
);

export default apiPrivate;
