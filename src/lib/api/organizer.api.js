import apiPrivate from "../axiosPrivate";
import apiPublic from "../axiosPublic";
import { API_ENDPOINTS } from "./endpoints";
import { handleApi } from "./apiHelper";
import { isUserLoggedIn } from "../auth";

/* ================= ORGANIZATION ================= */

export const getAllOrganizationsApi = () =>
  handleApi(apiPrivate.get(API_ENDPOINTS.ORGANIZER.ALL));

export const getOrganizationProfileApi = (orgId) =>
  handleApi(apiPrivate.get(API_ENDPOINTS.ORGANIZER.PROFILE(orgId)));

export const updateOrganizationProfileApi = (orgId, data) =>
  handleApi(apiPrivate.put(API_ENDPOINTS.ORGANIZER.UPDATE(orgId), data));

export const deleteOrganizationApi = (orgId) =>
  handleApi(apiPrivate.delete(API_ENDPOINTS.ORGANIZER.DELETE(orgId)));

/* ================= ORGANIZER EVENTS ================= */

export const getApprovedOrganizerEventsApi = (orgId) =>
  handleApi(apiPublic.get(API_ENDPOINTS.ORGANIZER.APPROVEDEVENTS(orgId)));

/* ================= ORGANIZATION EVENTS (PUBLIC / PRIVATE) ================= */

export const getOrganizationByEventsApi = async (slug) => {
  // 👤 NOT LOGGED IN → PUBLIC
  if (!isUserLoggedIn()) {
    return handleApi(
      apiPublic.get(API_ENDPOINTS.ORGANIZER.ORG_EVENTS_PUBLIC(slug)),
    );
  }

  // 🔐 LOGGED IN → PRIVATE
  return handleApi(
    apiPrivate.get(API_ENDPOINTS.ORGANIZER.ORG_EVENTS_PRIVATE(slug)),
  );
};

/* ================= FOLLOW ORGANIZER ================= */

export const followOrganizerApi = (orgIdentity) =>
  handleApi(
    apiPrivate.post(API_ENDPOINTS.ORGANIZER.FOLLOW, {
      orgIdentity,
    }),
  );
/* ================= FOLLOWERS / FOLLOWING ================= */

export const getFollowersFollowingApi = () =>
  handleApi(apiPrivate.get(API_ENDPOINTS.ORGANIZER.FOLLOWERS_FOLLOWING));

/* ================= ORGANIZER RANKING ================= */

export const getOrganizerRankingApi = (page = 1) =>
  handleApi(apiPublic.get(API_ENDPOINTS.ORGANIZER.RANKING(page)));

