/* ======================================================
   GLOBAL REGEX COLLECTION
   Use this file for input validation across project
   ====================================================== */


/* ======================================================
   NAME
   - Only letters and spaces
   - 2 to 50 characters
====================================================== */
export const NAME_REGEX = /^[A-Za-z ]{2,50}$/;


/* ======================================================
   EMAIL
   - Standard email format
====================================================== */
export const EMAIL_REGEX =
   /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export const DOMAIN_EMAIL_REGEX =
   /^[^\s@]+@(?!gmail\.|yahoo\.|hotmail\.|outlook\.|rediffmail\.)[^\s@]+\.[^\s@]{2,}$/;


/* ======================================================
   PASSWORD (Strong)
   - Minimum 8 characters
   - At least:
     • 1 uppercase
     • 1 lowercase
     • 1 number
     • 1 special character
====================================================== */
export const PASSWORD_REGEX =
   /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;


/* ======================================================
   TEXT (General Text Field)
   - Letters + numbers
   - Basic punctuation allowed
   - 2 to 100 characters
====================================================== */
export const TEXT_REGEX =
   /^[A-Za-z0-9.,'"\-() ]{2,100}$/;


/* ======================================================
   NUMBER (Only Digits)
====================================================== */
export const NUMBER_REGEX =
   /^[0-9]+$/;


/* ======================================================
   PHONE NUMBER (India)
   - 10 digits
   - Starts with 6,7,8,9
====================================================== */
export const PHONE_REGEX =
   /^[6-9]\d{9}$/;


/* ======================================================
   OTP (4 digits)
====================================================== */
export const OTP_REGEX =
   /^\d{4}$/;


/* ======================================================
   TEXTAREA
   - Multiline allowed
   - 10 to 500 characters
====================================================== */
export const TEXTAREA_REGEX =
   /^[A-Za-z0-9.,'"\-()@\n\r ]{10,500}$/;