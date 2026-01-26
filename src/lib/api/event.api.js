import apiPublic from "../axiosPublic";
import apiPrivate from "../axiosPrivate";
import { API_ENDPOINTS } from "./endpoints";
import { handleApi } from "./apiHelper";
import { isUserLoggedIn } from "../auth";


/* =======================
   EVENTS (PUBLIC / PRIVATE)
   Try PRIVATE → fallback PUBLIC
======================= */

export const getAllEventsApi = async () => {
  if (!isUserLoggedIn()) {
    return handleApi(apiPublic.get(API_ENDPOINTS.EVENTS.ALL_PUBLIC));
  }
  return handleApi(apiPrivate.get(API_ENDPOINTS.EVENTS.ALL_PRIVATE));
};


/* =======================
   SINGLE EVENT
======================= */

export const getEventBySlugApi = async (slug) => {
  if (!isUserLoggedIn()) {
    return handleApi(apiPublic.get(API_ENDPOINTS.EVENTS.SINGLE_PUBLIC(slug)));
  }
  return handleApi(apiPrivate.get(API_ENDPOINTS.EVENTS.SINGLE_PRIVATE(slug)));
};


/* =======================
   LIKE / SAVE (AUTH ONLY)
======================= */

export const likeEventApi = async (payload) => {
  return handleApi(apiPrivate.post(API_ENDPOINTS.EVENTS.LIKE_EVENT , payload));
};

export const saveEventApi = async (payload) => {
 return handleApi(apiPrivate.post(API_ENDPOINTS.EVENTS.SAVE_EVENT , payload));
};

/* =======================
   EVENT VIEW (PUBLIC)
======================= */

export const addEventViewApi = async (slug) => {
  return handleApi(apiPublic.post(API_ENDPOINTS.EVENTS.VIEW(slug)));
};

/* =======================
   ORGANIZER EVENTS (PRIVATE)
======================= */

export const getOrganizerEventsApi = async (orgId) => {
  return handleApi(apiPrivate.get(API_ENDPOINTS.ORGANIZER.EVENTS(orgId)));
};

export const deleteEventApi = async (eventId) => {
  return handleApi(apiPrivate.delete(`/event/delete/${eventId}`));
};

export const updateEventApi = async (eventId, formData) => {
  return handleApi(
    apiPrivate.put(`/v1/events/${eventId}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),
  );
};

/* =======================
   MASTER DATA (PUBLIC)
======================= */

export const getOrgCategoriesApi = async () =>
  handleApi(apiPublic.get(API_ENDPOINTS.MASTER.ORG_CATEGORIES));

export const getExploreEventTypes = async () =>
  handleApi(apiPublic.get(API_ENDPOINTS.MASTER.EXPLORE_EVENT_TYPE));

export const getEventCategoriesApi = async () =>
  handleApi(apiPublic.get(API_ENDPOINTS.MASTER.CATEGORIES));

export const getEventTypesApi = async (categoryId) =>
  handleApi(apiPublic.get(API_ENDPOINTS.MASTER.EVENT_TYPES(categoryId)));

export const getAllEventTypesApi = async () =>
  handleApi(apiPublic.get(API_ENDPOINTS.MASTER.ALL_EVENT_TYPES));

export const getAccommodationsApi = async () =>
  handleApi(apiPublic.get(API_ENDPOINTS.MASTER.ACCOMMODATIONS));

export const getCertificationsApi = async () =>
  handleApi(apiPublic.get(API_ENDPOINTS.MASTER.CERTIFICATIONS));

export const getPerksApi = async () =>
  handleApi(apiPublic.get(API_ENDPOINTS.MASTER.PERKS));

export const getEligibleDepartmentsApi = async () =>
  handleApi(apiPublic.get(API_ENDPOINTS.MASTER.ELIGIBLE_DEPARTMENTS));

/* =======================
   FILTER EVENTS
======================= */

export const filterEventsApi = async (payload) => {
  if (!isUserLoggedIn()) {
    return handleApi(
      apiPublic.post(API_ENDPOINTS.EVENTS.FILTER_PUBLIC, payload),
    );
  }

  return handleApi(
    apiPrivate.post(API_ENDPOINTS.EVENTS.FILTER_PRIVATE, payload),
  );
};

/* =======================
   EVENT STATUS (PUBLIC)
======================= */

export const getEventStatusesApi = async () =>
  handleApi(apiPublic.get(API_ENDPOINTS.EVENTS.STATUSES));

/* =======================
   CREATE EVENT (ORGANIZER)
======================= */

export const createEventApi = async (orgId, formData) =>
  handleApi(
    apiPrivate.post(API_ENDPOINTS.ORGANIZER.CREATEVENTS(orgId), formData),
  );
