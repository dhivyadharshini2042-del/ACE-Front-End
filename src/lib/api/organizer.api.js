import apiPrivate from "../axiosPrivate";
import { API_ENDPOINTS } from "./endpoints";
import { handleApi } from "./apiHelper";
import apiPublic from "../axiosPublic";

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

export const getOrganizerEventsApi = (orgId) =>
  handleApi(apiPrivate.get(API_ENDPOINTS.ORGANIZER.EVENTS(orgId)));

export const getApprovedOrganizerEventsApi = (orgId) =>
  handleApi(apiPublic.get(API_ENDPOINTS.ORGANIZER.APPROVEDEVENTS(orgId)));

export const getOrganizationByEventsApi = (slug) =>
  handleApi(apiPublic.get(API_ENDPOINTS.ORGANIZER.ORGEVENTS(slug)));

export const createOrganizerEventApi = (orgId, data) =>
  handleApi(apiPrivate.post(API_ENDPOINTS.ORGANIZER.EVENTS(orgId), data));

export const getOrganizerSingleEventApi = (orgId, eventId) =>
  handleApi(
    apiPrivate.get(
      API_ENDPOINTS.ORGANIZER.EVENT_BY_ID(orgId, eventId)
    )
  );

export const updateOrganizerSingleEventApi = (orgId, eventId, data) =>
  handleApi(
    apiPrivate.put(
      API_ENDPOINTS.ORGANIZER.EVENT_BY_ID(orgId, eventId),
      data
    )
  );
