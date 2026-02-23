import apiPrivate from "../axiosPrivate";
import { API_ENDPOINTS } from "./endpoints";
import { handleApi } from "./apiHelper";

/* ================= USERS ================= */

export const getAllUsersApi = () =>
  handleApi(apiPrivate.get(API_ENDPOINTS.USER.ALL));

export const getUserProfileApi = (userId) =>
  handleApi(apiPrivate.get(API_ENDPOINTS.USER.SINGLE(userId)));

export const updateUserProfileApi = (userId, data) =>
  handleApi(apiPrivate.put(API_ENDPOINTS.USER.UPDATE(userId), data));

export const deleteUserApi = (userId) =>
  handleApi(apiPrivate.delete(API_ENDPOINTS.USER.DELETE(userId)));

export const getJourneyStats = () =>
  handleApi(apiPrivate.get(API_ENDPOINTS.ABOUT.STATS));