import { API_ENDPOINTS } from "./endpoints";
import { handleApi } from "./apiHelper";
import apiPrivate from "../axiosPrivate";

/* ================= REGISTER FCM TOKEN ================= */
export const registerFcmTokenApi = (data) =>
  handleApi(apiPrivate.post(API_ENDPOINTS.NOTIFICATION.REGISTER_FCM, data));

/* ================= UNREGISTER FCM TOKEN ================= */
export const unregisterFcmTokenApi = (data) =>
  handleApi(apiPrivate.post(API_ENDPOINTS.NOTIFICATION.UNREGISTER_FCM, data));

/* ================= UPDATE NOTIFICATION PREFERENCES ================= */
export const updateNotificationPreferencesApi = (data) =>
  handleApi(
    apiPrivate.patch(API_ENDPOINTS.NOTIFICATION.UPDATE_PREFERENCES, data),
  );
/* ================= GET NOTIFICATION PREFERENCES ================= */
export const getNotificationPreferencesApi = () =>
  handleApi(apiPrivate.get(API_ENDPOINTS.NOTIFICATION.GET_PREFERENCES));
/* ================= GET NOTIFICATIONS LIST ================= */
export const getNotificationsApi = (page = 1, limit = 20) =>
  handleApi(
    apiPrivate.get(API_ENDPOINTS.NOTIFICATION.GET_NOTIFICATIONS(page, limit)),
  );

/* ================= MARK ONE AS READ ================= */
export const markAsOneReadApi = (id) =>
  handleApi(apiPrivate.patch(API_ENDPOINTS.NOTIFICATION.MARK_ONE_READ(id)));

/* ================= MARK ALL AS READ ================= */
export const markAsAllReadApi = () =>
  handleApi(apiPrivate.patch(API_ENDPOINTS.NOTIFICATION.MARK_ALL_READ));
