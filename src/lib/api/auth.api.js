import apiPrivate from "../axiosPrivate";
import apiPublic from "../axiosPublic";
import { API_ENDPOINTS } from "./endpoints";
import { handleApi } from "./apiHelper";

/* ================= AUTH ================= */

export const signupApi = (data) =>
  handleApi(apiPublic.post(API_ENDPOINTS.AUTH.SIGNUP, data));

export const organizerSignupApi = signupApi;

export const loginApi = (data) =>
  handleApi(apiPublic.post(API_ENDPOINTS.AUTH.LOGIN, data));

export const googleAuthLoginApi = (data) =>
  handleApi(apiPublic.post(API_ENDPOINTS.AUTH.GOOGLE_LOGIN, data));

export const forgotApi = (data) =>
  handleApi(apiPublic.post(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, data));

export const verifyOtpApi = (data) =>
  handleApi(apiPublic.post(API_ENDPOINTS.AUTH.VERIFY_OTP, data));

export const resendOtpApi = (data) =>
  handleApi(apiPublic.post(API_ENDPOINTS.AUTH.RESEND_OTP, data));

export const resetPasswordApi = (data) =>
  handleApi(apiPublic.post(API_ENDPOINTS.AUTH.RESET_PASSWORD, data));

export const updateAuthProfile = (data) =>
  handleApi(apiPrivate.post(API_ENDPOINTS.AUTH.UPDATEPROFILE, data));

export const getSavedEventsApi = (userId) =>
  handleApi(apiPrivate.get(API_ENDPOINTS.AUTH.SAVED_EVENTS(userId)));


export const verifyEmailApi = (token) =>
  handleApi(
    apiPublic.get(
      `${API_ENDPOINTS.AUTH.ORG_VERIFY}?token=${encodeURIComponent(token)}`,
    ),
  );
