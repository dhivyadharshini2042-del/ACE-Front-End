import apiPublic from "../axiosPublic";
import apiPrivate from "../axiosPrivate";
import { API_ENDPOINTS } from "./endpoints";
import { handleApi } from "./apiHelper";

/* =======================
   EVENTS (PUBLIC)
======================= */

// ALL EVENTS (Landing page, sliders)
export const getAllEventsApi = () =>
  handleApi(apiPublic.get(API_ENDPOINTS.EVENTS.ALL));

//KEEP ONLY IF ADMIN NEEDS IT
export const getEventBySlugApi = (slug) =>
  handleApi(apiPublic.get(API_ENDPOINTS.EVENTS.SINGLE(slug)));

/* =======================
   EVENTS (ORGANIZER)
======================= */

export const getOrganizerEventsApi = (orgId) =>
  handleApi(apiPrivate.get(API_ENDPOINTS.ORGANIZER.EVENTS(orgId)));

export const deleteEventApi = (eventId) =>
  handleApi(apiPrivate.delete(`/event/delete/${eventId}`));

export const updateEventApi = (eventId, formData) => {
  return apiPrivate.put(`/v1/events/${eventId}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};


/* =======================
   MASTER DATA
======================= */

export const getOrgCategoriesApi = () =>
  handleApi(apiPublic.get(API_ENDPOINTS.MASTER.ORG_CATEGORIES));

export const getEventCategoriesApi = () =>
  handleApi(apiPublic.get(API_ENDPOINTS.MASTER.CATEGORIES));

export const getEventTypesApi = (categoryId) =>
  handleApi(apiPublic.get(API_ENDPOINTS.MASTER.EVENT_TYPES(categoryId)));

export const getAccommodationsApi = () =>
  handleApi(apiPublic.get(API_ENDPOINTS.MASTER.ACCOMMODATIONS));

export const getCertificationsApi = () =>
  handleApi(apiPublic.get(API_ENDPOINTS.MASTER.CERTIFICATIONS));

export const getPerksApi = () =>
  handleApi(apiPublic.get(API_ENDPOINTS.MASTER.PERKS));

/* =======================
   CREATE EVENT (ORGANIZER)
======================= */

export const createEventApi = (orgId, formData) =>
  handleApi(
    apiPrivate.post(API_ENDPOINTS.ORGANIZER.CREATEVENTS(orgId), formData)
  );
