export const API_ENDPOINTS = {
  /* ================= EVENTS ================= */
  EVENTS: {
    ALL: "/v1/events",
    SINGLE: (eventId) => `/v1/events/${eventId}`,
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
    CREATEVENTS: (orgId) => `/v1/organizations/${orgId}/events`,
  },

  /* ================= MASTER DATA ================= */
  MASTER: {
    ORG_CATEGORIES: "/v1/master/org-categories",
    ACCOMMODATIONS: "/v1/master/accommodations",
    EVENT_TYPES: (categoryId) => `/v1/master/event-types/${categoryId}`,
    CATEGORIES: "/v1/master/categories",
    CERTIFICATIONS: "/v1/master/certifications",
    PERKS: "/v1/master/perks",
  },
};
