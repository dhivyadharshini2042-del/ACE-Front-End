export const API_ENDPOINTS = {
  /* ================= EVENTS ================= */
  EVENTS: {
    ALL_PUBLIC: (offset = 0, limit = 5) =>
      `/v1/events?offset=${offset}&limit=${limit}`,
    ALL_PRIVATE: (offset = 0, limit = 5) =>
      `/v1/events_protec?offset=${offset}&limit=${limit}`,

    // events api

    TRENDING: (offset = 0, limit = 5) =>
      `/v1/trending_events?offset=${offset}&limit=${limit}`,
    UPCOMING: (offset = 0, limit = 5) =>
      `/v1/upcoming_events?offset=${offset}&limit=${limit}`,
    VIRTUAL: (offset = 0, limit = 5) =>
      `/v1/virtual_events?offset=${offset}&limit=${limit}`,
    FEATURED: (offset = 0, limit = 5) =>
      `/v1/featured_events?offset=${offset}&limit=${limit}`,
    LIKE_EVENT: "/v1/events/like",
    SAVE_EVENT: "/v1/events/save",
    SINGLE_PUBLIC: (slug) => `/v1/events/${slug}`,
    SINGLE_PRIVATE: (slug) => `/v1/events_protec/${slug}`,

    VIEW: (slug) => `/v1/events/${slug}/view`,

    FILTER_PUBLIC: "/v1/filter",
    FILTER_PRIVATE: "/v1/filter_protec",

    STATUSES: "/v1/event/statuses",
  },
  PAID: {
    BANNER_IMAGES: "/v1/paid/banner_images",
  },

  /* ================= AUTH ================= */
  AUTH: {
    SIGNUP: "/v1/auth/signup",
    LOGIN: "/v1/auth/login",
    GOOGLE_LOGIN: "/v1/auth/google-login",
    FORGOT_PASSWORD: "/v1/auth/forgot-password",
    VERIFY_OTP: "/v1/auth/verify-otp",
    RESEND_OTP: "/v1/auth/resend-otp",
    RESET_PASSWORD: "/v1/auth/reset-password",
    ORG_VERIFY: "/v1/auth/org/verify",
    UPDATEPROFILE: "/v1/auth/update-profile",
    SAVED_EVENTS: (userId) => `/v1/user/saved/${userId}`,
  },
  /* ================= LOCATIONS ================= */
  LOCATIONS: {
    ALL_COUNTRIES: "/v1/location/countries",
    COUNTRIES_STATES: (statesId) => `/v1/location/countries/${statesId}/states`,
    STATES_CITIES: (citiesId) => `/v1/location/states/${citiesId}/cities`,
  },
  ANALYTICS: {
    LOCATION_COUNTS: "/v1/analytics/location-counts",
    LOCATION_EVENTS: "/v1/analytics/location",
  },

  /* ================= USERS ================= */
  USER: {
    ALL: "/v1/users",
    SINGLE: (userId) => `/v1/users/${userId}`,
    UPDATE: (userId) => `/v1/user/${userId}`,
    DELETE: (userId) => `/v1/user/${userId}`,
    USER_TYPE: "/v1/user/user_type",
    SELECT_TYPE: "/v1/user/select_type",
  },
  /* ================= NOTIFICATIONS ================= */
  NOTIFICATION: {
    REGISTER_FCM: "/v1/notifications/fcm/register",
    UNREGISTER_FCM: "/v1/notifications/fcm/unregister",
    UPDATE_PREFERENCES: "/v1/notifications/preferences",
    GET_PREFERENCES: "/v1/notifications/preferences",
    GET_NOTIFICATIONS: (page = 1, limit = 20) =>
      `/v1/notifications?page=${page}&limit=${limit}`,
    MARK_ONE_READ: (id) => `/v1/notifications/${id}/read`,
    MARK_ALL_READ: "/v1/notifications/read-all",
  },

  /* ================= ORGANIZATIONS ================= */
  ORGANIZER: {
    ALL: "/v1/organizations",
    PROFILE: (orgId) => `/v1/organizations/${orgId}`,
    UPDATE: (orgId) => `/v1/organizations/${orgId}`,
    DELETE: (orgId) => `/v1/organizations/${orgId}`,
    EVENTS: (orgId) => `/v1/organization/${orgId}/events`,
    CREATEVENTS: (orgId) => `/v1/organizations/${orgId}/events`,
    APPROVEDEVENTS: (orgId) => `/v1/organizations/${orgId}/events`,
    FOLLOW: "/v1/organizations/follow-org",
    FOLLOWERS_FOLLOWING: "/v1/organizations/followers-following",
    RANKING: (page = 1) => `/v1/organizations/Ranking?page=${page}`,
    ORG_DETAILS: (orgId) => `/v1/organizations/${orgId}`,
    UPCOMING_PUBLIC: (slug, page = 1) =>
      `/v1/organizations/${slug}/events?page=${page}`,
    UPCOMING_PRIVATE: (slug, page = 1) =>
      `/v1/organizations/${slug}/events_protec?page=${page}`,
    PAST_EVENTS: (slug, offset = 0, limit = 5) =>
      `/v1/organizations/${slug}/past-events?offset=${offset}&limit=${limit}`,
  },

  /* ================= MASTER DATA ================= */
  MASTER: {
    ORG_CATEGORIES: "/v1/master/org-categories",
    EXPLORE_EVENT_TYPE: "/v1/master/event-types",
    ACCOMMODATIONS: "/v1/master/accommodations",
    EVENT_TYPES: (categoryId) =>
      `/v1/master/event-types/category/${categoryId}`,
    ALL_EVENT_TYPES: `/v1/master/event-types`,
    CATEGORIES: "/v1/master/categories",
    CERTIFICATIONS: "/v1/master/certifications",
    PERKS: "/v1/master/perks",
    ELIGIBLE_DEPARTMENTS: "/v1/master/eligible-departments",
    DEPARTMENTS: "/v1/master/departments",
  },
};
