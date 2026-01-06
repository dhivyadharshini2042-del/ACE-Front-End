import * as Yup from "yup";

/* ===========================
   COMMON HELPERS
=========================== */

export const required = (name) => Yup.string().required(`${name} is required`);

export const email = Yup.string()
  .email("Invalid email format")
  .required("Email is required");

export const password8 = Yup.string()
  .min(8, "Password must be at least 8 characters")
  .required("Password is required");

export const confirmPassword = (ref) =>
  Yup.string()
    .required("Confirm password is required")
    .oneOf([Yup.ref(ref)], "Passwords do not match");

/* ===========================
   ORGANIZER VALIDATIONS
=========================== */

export const organizerLoginSchema = Yup.object({
  email,
  password: password8,
});

export const organizerForgotSchema = Yup.object({
  email,
});

export const organizerResetSchema = Yup.object({
  password: password8,
  confirmPassword: confirmPassword("password"),
});

export const organizerSignupSchema = Yup.object({
  email,
  password: password8,
  confirmPassword: confirmPassword("password"),
});

/* ===========================
   ORGANIZATION PROFILE
=========================== */

export const organizationProfileSchema = Yup.object({
  organizationName: required("Organization Name"),
  domainEmail: email,
});

/* ===========================
   PASSWORD CHANGE
=========================== */

export const changePasswordSchema = Yup.object({
  otp: Yup.string()
    .length(4, "OTP must be 4 digits")
    .required("OTP is required"),

  password: password8,
  confirmPassword: confirmPassword("password"),
});

/* ===========================
   EVENT CREATION
=========================== */

export const eventSchema = Yup.object({
  eventTitle: required("Event Title"),
  description: required("Description"),
  eventDate: required("Event Date"),
  eventTime: required("Event Time"),
  mode: required("Mode"),

  venue: Yup.string().when("mode", (mode, schema) => {
    if (mode === "offline" || mode === "hybrid") {
      return schema.required("Venue is required");
    }
    return schema.nullable();
  }),
});

/* ===========================
   USER VALIDATIONS
=========================== */

export const userSignupSchema = Yup.object({
  name: required("Name"),
  email,
  password: password8,
  confirmPassword: confirmPassword("password"),
});

export const userLoginSchema = Yup.object({
  email,
  password: password8,
});

export const userForgotSchema = Yup.object({
  email,
});

export const otpSchema = Yup.object({
  otp: Yup.string()
    .length(4, "OTP must be 4 digits")
    .required("OTP is required"),
});

export const userResetSchema = Yup.object({
  password: password8,
  confirmPassword: confirmPassword("password"),
});

/* ===========================
   CREATE EVENT – STEP WISE
=========================== */

// STEP 1 – Organizer
export const createEventStep1Schema = Yup.object({
  organizations: Yup.array()
    .min(1, "At least one organization is required")
    .of(
      Yup.object({
        hostBy: required("Event Host By"),
        orgName: required("Organization Name"),
        location: required("Location"),
        organizerName: required("Organizer Name"),
        organizerNumber: required("Organizer Number"),
        // department: required("Department"),
      })
    ),
});

// STEP 2 – Event Details
export const createEventStep2Schema = Yup.object({
  title: required("Event Title"),
  category: required("Category"),
  eventType: required("Event Type"),
  about: required("About Event"),
  tags: Yup.array().min(1, "At least one tag is required"),
  calendar: Yup.array().min(1, "Please add calendar schedule"),
});

// STEP 3 – Media & Tickets
// STEP 3
export const ticketSchema = Yup.object({
  ticketType: Yup.string()
    .oneOf(["FREE", "PAID"])
    .required("Ticket type is required"),

  ticketName: Yup.string().required("Ticket name is required"),

  quantity: Yup.number()
    .typeError("Quantity must be a number")
    .min(1, "Minimum 1 ticket required")
    .required("Quantity is required"),

  price: Yup.number().when("ticketType", {
    is: "PAID",
    then: (schema) =>
      schema
        .typeError("Price must be a number")
        .min(1, "Price must be greater than 0")
        .required("Price is required"),
    otherwise: (schema) => schema.notRequired(),
  }),

  description: Yup.string().required("Ticket description is required"),
});

export const createEventStep3Schema = Yup.object({
  certification: Yup.string().required("Certification is required"),
  paymentLink: Yup.string().required("Payment link is required"),
  tickets: Yup.array()
    .of(ticketSchema) 
    .min(1, "At least one ticket required"),
});

/* ===========================
   TICKET MODEL (COMMON)
=========================== */
