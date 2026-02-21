import apiPrivate from "../axiosPrivate";
import apiPublic from "../axiosPublic";
import { API_ENDPOINTS } from "./endpoints";
import { handleApi } from "./apiHelper";

/* ================= AUTH ================= */

// SIGNUP
export const signupApi = (data) =>
  handleApi(apiPublic.post(API_ENDPOINTS.AUTH.SIGNUP, data));

export const organizerSignupApi = signupApi;

// LOGIN (User / Organizer)
export const loginApi = (data) =>
  handleApi(apiPublic.post(API_ENDPOINTS.AUTH.LOGIN, data));

// GOOGLE LOGIN
export const googleAuthLoginApi = (data) =>
  handleApi(apiPublic.post(API_ENDPOINTS.AUTH.GOOGLE_LOGIN, data));

// FORGOT PASSWORD
export const forgotApi = (data) =>
  handleApi(apiPublic.post(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, data));

// VERIFY OTP
export const verifyOtpApi = (data) =>
  handleApi(apiPublic.post(API_ENDPOINTS.AUTH.VERIFY_OTP, data));

// RESEND OTP
export const resendOtpApi = (data) =>
  handleApi(apiPublic.post(API_ENDPOINTS.AUTH.RESEND_OTP, data));

// RESET PASSWORD
export const resetPasswordApi = (data) =>
  handleApi(apiPublic.post(API_ENDPOINTS.AUTH.RESET_PASSWORD, data));

// UPDATE PROFILE (COOKIE REQUIRED)
export const updateAuthProfile = (data) =>
  handleApi(apiPrivate.post(API_ENDPOINTS.AUTH.UPDATEPROFILE, data));

// SAVED EVENTS (COOKIE REQUIRED)
export const getSavedEventsApi = (userId) =>
  handleApi(apiPrivate.get(API_ENDPOINTS.AUTH.SAVED_EVENTS(userId)));

export const saveUserRoleApi = async (data) => {
  return apiHelper.post("/auth/save-role", data);
};


// VERIFY ORGANIZER EMAIL
export const verifyEmailApi = (token) =>
  handleApi(
    apiPublic.get(
      `${API_ENDPOINTS.AUTH.ORG_VERIFY}?token=${encodeURIComponent(token)}`
    )
  );
