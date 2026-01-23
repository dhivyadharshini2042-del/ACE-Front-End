import apiPublic from "../axiosPublic";
import apiPrivate from "../axiosPrivate";
import { API_ENDPOINTS } from "./endpoints";
import { handleApi } from "./apiHelper";

/* =======================
   EVENTS (PUBLIC)
======================= */

export const getAllEventsApi = async (isLoggedIn = false) => {
  try {
    const api = isLoggedIn ? apiPrivate : apiPublic;

    const url = isLoggedIn
      ? API_ENDPOINTS.EVENTS.ALL_PRIVATE
      : API_ENDPOINTS.EVENTS.ALL_PUBLIC;

    return await handleApi(api.get(url));
  } catch (error) {
    console.error("getAllEventsApi error:", error);
    return {
      status: false,
      message: "Failed to fetch events",
    };
  }
};

//KEEP ONLY IF ADMIN NEEDS IT
export const getEventBySlugApi = async (slug) => {
  try {
    const res = await apiPublic.get(API_ENDPOINTS.EVENTS.SINGLE(slug));
    return handleApi(res);
  } catch (error) {
    console.error("getEventBySlugApi error:", error);
    return {
      status: false,
      message: "Failed to fetch event",
      error,
    };
  }
};

export const likeEventApi = async (payload) => {
  try {
    return await handleApi(apiPrivate.post("/v1/events/like", payload));
  } catch {
    return { status: false };
  }
};

export const saveEventApi = async (payload) => {
  try {
    return await handleApi(apiPrivate.post("/v1/events/save", payload));
  } catch {
    return { status: false };
  }
};
// EVENT VIEW COUNT
export const addEventViewApi = async (slug) => {
  try {
    return await apiPublic.post(`/v1/events/${slug}/view`);
  } catch (error) {
    console.error("View API error:", error);
    return {
      status: false,
      message: "Failed to add view",
      error,
    };
  }
};

/* =======================
   EVENTS (ORGANIZER)
======================= */

export const getOrganizerEventsApi = async (orgId) => {
  try {
    return await handleApi(
      apiPrivate.get(API_ENDPOINTS.ORGANIZER.EVENTS(orgId)),
    );
  } catch (error) {
    console.error("getOrganizerEventsApi error:", error);
    return {
      status: false,
      message: "Failed to fetch organizer events",
      error,
    };
  }
};

export const deleteEventApi = async (eventId) => {
  try {
    return await handleApi(apiPrivate.delete(`/event/delete/${eventId}`));
  } catch (error) {
    console.error("deleteEventApi error:", error);
    return {
      status: false,
      message: "Failed to delete event",
      error,
    };
  }
};

export const updateEventApi = async (eventId, formData) => {
  try {
    return await apiPrivate.put(`/v1/events/${eventId}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  } catch (error) {
    console.error("updateEventApi error:", error);
    return {
      status: false,
      message: "Failed to update event",
      error,
    };
  }
};

/* =======================
   MASTER DATA
======================= */

export const getOrgCategoriesApi = async () => {
  try {
    return await handleApi(apiPublic.get(API_ENDPOINTS.MASTER.ORG_CATEGORIES));
  } catch (error) {
    console.error("getOrgCategoriesApi error:", error);
    return { status: false, error };
  }
};

export const getExploreEventTypes = async () => {
  try {
    return await handleApi(
      apiPublic.get(API_ENDPOINTS.MASTER.EXPLORE_EVENT_TYPE),
    );
  } catch (error) {
    console.error("getExploreEventTypes error:", error);
    return { status: false, error };
  }
};

export const getEventCategoriesApi = async () => {
  try {
    return await handleApi(apiPublic.get(API_ENDPOINTS.MASTER.CATEGORIES));
  } catch (error) {
    console.error("getEventCategoriesApi error:", error);
    return { status: false, error };
  }
};

export const getEventTypesApi = async (categoryId) => {
  try {
    return await handleApi(
      apiPublic.get(API_ENDPOINTS.MASTER.EVENT_TYPES(categoryId)),
    );
  } catch (error) {
    console.error("getEventTypesApi error:", error);
    return { status: false, error };
  }
};
export const getAllEventTypesApi = async () => {
  try {
    return await handleApi(apiPublic.get(API_ENDPOINTS.MASTER.ALL_EVENT_TYPES));
  } catch (error) {
    console.error("getEventTypesApi error:", error);
    return { status: false, error };
  }
};

export const getAccommodationsApi = async () => {
  try {
    return await handleApi(apiPublic.get(API_ENDPOINTS.MASTER.ACCOMMODATIONS));
  } catch (error) {
    console.error("getAccommodationsApi error:", error);
    return { status: false, error };
  }
};

export const getCertificationsApi = async () => {
  try {
    return await handleApi(apiPublic.get(API_ENDPOINTS.MASTER.CERTIFICATIONS));
  } catch (error) {
    console.error("getCertificationsApi error:", error);
    return { status: false, error };
  }
};

export const getPerksApi = async () => {
  try {
    return await handleApi(apiPublic.get(API_ENDPOINTS.MASTER.PERKS));
  } catch (error) {
    console.error("getPerksApi error:", error);
    return { status: false, error };
  }
};

// ELIGIBLE DEPARTMENTS
export const getEligibleDepartmentsApi = async () => {
  try {
    return await handleApi(
      apiPublic.get(API_ENDPOINTS.MASTER.ELIGIBLE_DEPARTMENTS),
    );
  } catch (error) {
    console.error("getEligibleDepartmentsApi error:", error);
    return {
      status: false,
      message: "Failed to fetch eligible departments",
      error,
    };
  }
};

/* =======================
   FILTER EVENT
======================= */
export const filterEventsApi = async (payload) => {
  try {
    return await handleApi(
      apiPublic.post(API_ENDPOINTS.EVENTS.FILTER, payload),
    );
  } catch (error) {
    console.error("filterEventsApi error:", error);
    return {
      status: false,
      message: "Failed to fetch event",
      error,
    };
  }
};
/* =======================
    EVENT STATUS
======================= */
export const getEventStatusesApi = async () => {
  try {
    return await handleApi(apiPublic.get(API_ENDPOINTS.EVENTS.STATUSES));
  } catch (error) {
    console.error("filterEventsApi error:", error);
    return {
      status: false,
      message: "Failed to fetch event",
      error,
    };
  }
};

/* =======================
   CREATE EVENT (ORGANIZER)
======================= */

export const createEventApi = async (orgId, formData) => {
  try {
    return await handleApi(
      apiPrivate.post(API_ENDPOINTS.ORGANIZER.CREATEVENTS(orgId), formData),
    );
  } catch (error) {
    console.error("createEventApi error:", error);
    return {
      status: false,
      message: "Failed to create event",
      error,
    };
  }
};
