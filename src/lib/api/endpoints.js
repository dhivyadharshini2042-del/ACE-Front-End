export const API_ENDPOINTS = {
  /* ================= EVENTS ================= */
  EVENTS: {
    ALL: "/v1/events",
    SINGLE: (slug) => `/v1/events/${slug}`,
    VIEW: (slug) => `/v1/events/${slug}/view`,
    FILTER: "/v1/filter",
    STATUSES: "/v1/event/statuses",
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

  /* ================= USERS ================= */
  USER: {
    ALL: "/v1/users",
    SINGLE: (userId) => `/v1/users/${userId}`,
    UPDATE: (userId) => `/v1/user/${userId}`,
    DELETE: (userId) => `/v1/user/${userId}`,
  },

  /* ================= ORGANIZATIONS ================= */
  ORGANIZER: {
    ALL: "/v1/organizations",
    PROFILE: (orgId) => `/v1/organizations/${orgId}`,
    UPDATE: (orgId) => `/v1/organizations/${orgId}`,
    DELETE: (orgId) => `/v1/organizations/${orgId}`,
    EVENTS: (orgId) => `/v1/organization/${orgId}/events`,
    APPROVEDEVENTS: (orgId) => `/v1/organizations/${orgId}/events`,
    ORGEVENTS: (slug) => `/v1/organizations/${slug}/events`,
  },

  /* ================= MASTER DATA ================= */
  MASTER: {
    ORG_CATEGORIES: "/v1/master/org-categories",
    EXPLORE_EVENT_TYPE: "/v1/master/event-types",
    ACCOMMODATIONS: "/v1/master/accommodations",
    EVENT_TYPES: (categoryId) => `/v1/master/event-types/${categoryId}`,
    ALL_EVENT_TYPES: `/v1/master/event-types`,
    CATEGORIES: "/v1/master/categories",
    CERTIFICATIONS: "/v1/master/certifications",
    PERKS: "/v1/master/perks",
    ELIGIBLE_DEPARTMENTS: "/v1/master/eligible-departments",
  },
};
