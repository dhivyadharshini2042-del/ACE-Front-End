import * as Yup from "yup";

/* =====================================================
   COMMON FIELD RULES
===================================================== */

export const nameField = Yup.string()
  .trim()
  .min(2, "Name must be at least 2 characters")
  .required("Name is required");

export const emailField = Yup.string()
  .trim()
  .email("Invalid email format")
  .required("Email is required");

export const passwordField = Yup.string()
  .min(8, "Password must be at least 8 characters")
  .required("Password is required");

export const confirmPasswordField = (ref) =>
  Yup.string()
    .required("Confirm password is required")
    .oneOf([Yup.ref(ref)], "Passwords do not match");

/* =====================================================
   ORGANIZER AUTH
===================================================== */

export const organizerLoginSchema = Yup.object({
  email: emailField,
  password: passwordField,
});

export const organizerSignupSchema = Yup.object({
  email: emailField,
  password: passwordField,
  confirmPassword: confirmPasswordField("password"),
});

export const organizerForgotSchema = Yup.object({
  email: emailField,
});

export const organizerResetSchema = Yup.object({
  password: passwordField,
  confirmPassword: confirmPasswordField("password"),
});

/* =====================================================
   USER AUTH
===================================================== */

export const userSignupSchema = Yup.object({
  name: nameField,
  email: emailField,
  password: passwordField,
  confirmPassword: confirmPasswordField("password"),
});

export const userLoginSchema = Yup.object({
  email: emailField,
  password: passwordField,
});

export const userForgotSchema = Yup.object({
  email: emailField,
});

export const userResetSchema = Yup.object({
  password: passwordField,
  confirmPassword: confirmPasswordField("password"),
});

/* =====================================================
   OTP
===================================================== */

export const otpSchema = Yup.object({
  otp: Yup.string()
    .length(4, "OTP must be 4 digits")
    .required("OTP is required"),
});

/* =====================================================
   ORGANIZATION PROFILE
===================================================== */

export const organizationProfileSchema = Yup.object({
  organizationName: nameField,
  domainEmail: emailField,
});

/* =====================================================
   EVENT CREATION
===================================================== */

export const eventSchema = Yup.object({
  eventTitle: Yup.string().required("Event Title is required"),
  description: Yup.string().required("Description is required"),
  eventDate: Yup.string().required("Event Date is required"),
  eventTime: Yup.string().required("Event Time is required"),
  mode: Yup.string().required("Mode is required"),

  venue: Yup.string().when("mode", {
    is: (val) => val === "offline" || val === "hybrid",
    then: (schema) => schema.required("Venue is required"),
    otherwise: (schema) => schema.nullable(),
  }),
});