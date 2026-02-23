"use client";

/**
 * Organizer Signup - Client Component
 * Handles organization account creation with validation and API integration.
 */

import "../../auth-common.css";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-hot-toast";

/** UI text constants */
import {
  TITLE_ORG_ACCOUNT_CREATION,
  SUBTITLE_ORG_ACCOUNT_CREATION,
  LABEL_ORG_EMAIL,
  LABEL_PASSWORD,
  LABEL_CONFIRM_PASSWORD,
  PH_ORG_EMAIL,
  PH_PASSWORD,
  PH_CONFIRM_PASSWORD,
  BTN_VERIFY_DOMAIN,
  TOAST_ERROR_MSG_FILL_ALL_FIELDS,
  TOAST_ERROR_MSG_PASSWORD_MISMATCH,
  TOAST_ERROR_MSG_CATEGORY_MISSING,
  ROLE_ORGANIZER,
  INPUT_TEXT,
  INPUT_PASSWORD,
  TOAST_ERROR_MSG_SIGNUP_FAILED,
  TOAST_SUCCESS_MSG_SIGNUP_SUCCESS,
  TITLE_ORGA_ACCOUNT_CREATION,
  TEXT_NO_ACCOUNT,
  TEXT_SIGNIN,
  TITLE_ALREADY_HAVE_ACCOUNT,
  TOAST_ERROR_MSG_SOMETHING_WENT_WRONG

} from "../../../../../const-value/config-message/page";

/** Icon constants */
import {
  PASSWORDHIDEICON,
  PASSWORDVIEWICON,
} from "../../../../../const-value/config-icons/page";

/** API and Context */
import { signupApi } from "../../../../../lib/api/auth.api";
import { useLoading } from "../../../../../context/LoadingContext";

/**
 * SignupAccountClient Component
 * - Reads organization details from query parameters
 * - Validates form inputs
 * - Calls signup API
 * - Handles success/error feedback
 */
export default function SignupAccountClient() {
  const router = useRouter();
  const params = useSearchParams();
  const { setLoading } = useLoading();

  /** Extract organization details from query parameters */
  const category = params.get("cat");
  const country = params.get("country");
  const state = params.get("state");
  const city = params.get("city");
  const orgName = params.get("orgName");

  /** Local state for form inputs */
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  /** Password visibility toggle states */
  const [showPass1, setShowPass1] = useState(false);
  const [showPass2, setShowPass2] = useState(false);

  /**
   * Handles form submission
   * - Performs client-side validation
   * - Calls signup API
   * - Displays success or error notifications
   */
  async function onSubmit(e) {
    e.preventDefault();

    // Validate required fields
    if (!email || !password || !confirm)
      return toast.error(TOAST_ERROR_MSG_FILL_ALL_FIELDS);

    // Validate password match
    if (password !== confirm)
      return toast.error(TOAST_ERROR_MSG_PASSWORD_MISMATCH);

    // Validate required category parameter
    if (!category)
      return toast.error(TOAST_ERROR_MSG_CATEGORY_MISSING);

    try {
      setLoading(true);

      // Call signup API
      const res = await signupApi({
        org_cat: category,
        country,
        state,
        city,
        org_name: orgName,
        email,
        password,
        type: ROLE_ORGANIZER,
        platform: "web",
      });

      // Handle API failure response
      if (!res?.status) {
        toast.error(res?.message || TOAST_ERROR_MSG_SIGNUP_FAILED);
        return;
      }

      toast.success(res.message || TOAST_SUCCESS_MSG_SIGNUP_SUCCESS);
      router.push("/auth/organization/login");
    } catch (err) {
      toast.error(TOAST_ERROR_MSG_SOMETHING_WENT_WRONG);
    } finally {
      // Ensure loading state is cleared
      setLoading(false);
    }
  }

  return (
    <div className="org-shell">
      {/* LEFT SECTION - Visual Branding */}
      <aside
        className="org-left"
        style={{ backgroundImage: "url('/images/organizer-bg-circles.png')" }}
      >
        <img
          src="/images/organizer-rocket.png"
          alt="rocket"
          className="org-left-img"
        />
      </aside>

      {/* RIGHT SECTION - Signup Form */}
      <main className="org-right">
        <div className="org-card">
          <h2 className="org-title">{TITLE_ORGA_ACCOUNT_CREATION}</h2>
          {/* <p className="org-sub">{SUBTITLE_ORG_ACCOUNT_CREATION}</p> */}

          <form className="org-form" onSubmit={onSubmit}>
            {/* EMAIL FIELD */}
            <div className="form-group">
              <label className="form-label">{LABEL_ORG_EMAIL}</label>
              <input
                className="form-control"
                type={INPUT_TEXT}
                placeholder={PH_ORG_EMAIL}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* PASSWORD FIELD */}
            <div className="form-group">
              <label className="form-label">{LABEL_PASSWORD}</label>
              <div className="pass-wrap">
                <input
                  className="form-control"
                  type={showPass1 ? INPUT_TEXT : INPUT_PASSWORD}
                  placeholder={PH_PASSWORD}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <span
                  className="pass-toggle"
                  onClick={() => setShowPass1(!showPass1)}
                >
                  {showPass1 ? PASSWORDVIEWICON : PASSWORDHIDEICON}
                </span>
              </div>
            </div>

            {/* CONFIRM PASSWORD FIELD */}
            <div className="form-group">
              <label className="form-label">{LABEL_CONFIRM_PASSWORD}</label>
              <div className="pass-wrap">
                <input
                  className="form-control"
                  type={showPass2 ? INPUT_TEXT : INPUT_PASSWORD}
                  placeholder={PH_CONFIRM_PASSWORD}
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  onPaste={(e) => e.preventDefault()}   // Prevent paste for security
                  onDrop={(e) => e.preventDefault()}    // Prevent drag-drop for security
                  autoComplete="off"
                />
                <span
                  className="pass-toggle"
                  onClick={() => setShowPass2(!showPass2)}
                >
                  {showPass2 ? PASSWORDVIEWICON : PASSWORDHIDEICON}
                </span>
              </div>
            </div>

            {/* SUBMIT ACTION */}
            <div className="org-actions">
              <button type="submit" className="btn-primary-ghost">
                {BTN_VERIFY_DOMAIN}
              </button>
            </div>
          </form>

          {/* Redirect to Login */}
          <div className="text-center mt-3">
            <small>
              {TITLE_ALREADY_HAVE_ACCOUNT}{" "}
              <a href="/auth/organization/login" className="text-primary fw-bold">
                {TEXT_SIGNIN}
              </a>
            </small>
          </div>
        </div>
      </main>
    </div>
  );
}
