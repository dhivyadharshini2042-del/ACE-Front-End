"use client";

import "./organizer-login.css";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

/* ICONS */
import {
  PAGEMOVEICON,
  PASSWORDHIDEICON,
  PASSWORDVIEWICON,
} from "../../../../const-value/config-icons/page";

/* API */
import { loginApi } from "../../../../lib/api/auth.api";

/* AUTH */
import { saveToken } from "../../../../lib/auth";

/* VALIDATION */
import { organizerLoginSchema } from "../../../../components/validation";

/* CONSTANTS */
import {
  ROLE_ORGANIZER,
  INPUT_TEXT,
  INPUT_PASSWORD,
  TITLE_ORG_LOGIN_MAIN,
  SUBTITLE_ORG_LOGIN,
  LABEL_ORG_EMAIL,
  LABEL_PASSWORD,
  PH_ORG_EMAIL,
  PH_PASSWORD,
  TEXT_FORGOT_PASSWORD,
  TEXT_SIGNIN,
  TEXT_NO_ACCOUNT,
  TEXT_SIGNUP,
  MSG_INVALID_CREDENTIALS,
  MSG_LOGIN_SUCCESS_ORGANIZER,
  MSG_LOGIN_FAILED,
} from "../../../../const-value/config-message/page";
import { useLoading } from "../../../../context/LoadingContext";

export default function OrganizerLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  // GLOBAL LOADING
  const { setLoading } = useLoading();

  // -----------------------------
  // SUBMIT
  // -----------------------------
  async function onSubmit(e) {
    e.preventDefault();
    setLoading(true);

    // validation
    try {
      await organizerLoginSchema.validate(
        { email, password },
        { abortEarly: false }
      );
    } catch (err) {
      toast.error(err.errors[0]);
      setLoading(false);
      return;
    }

    try {
      const res = await loginApi({
        email,
        password,
        type: ROLE_ORGANIZER,
      });

      if (!res?.status || !res?.token) {
        toast.error(res?.message || MSG_INVALID_CREDENTIALS);
        setLoading(false);
        return;
      }

      saveToken(res.token);

      document.cookie = `token=${res.token}; path=/; max-age=${
        60 * 60 * 24 * 7
      }`;
      document.cookie = `role=organizer; path=/;`;

      toast.success(MSG_LOGIN_SUCCESS_ORGANIZER);
      router.push("/dashboard");
    } catch (err) {
      toast.error(MSG_LOGIN_FAILED);
    } finally {
      setLoading(false);
    }
  }

  const handleUserLogin = () => {
    router.push("/auth/user/login");
  };

  return (
    <div className="org-login-shell">
      {/* LEFT IMAGE */}
      <div className="org-login-left">
        <img src="/images/or_login.png" alt="Organizer Login" />
      </div>

      {/* RIGHT FORM */}
      <div className="org-login-right">
        <div className="org-login-card">
          <div className="organization-sections mt-5">
            <div className="Switch-to-Organizer" onClick={handleUserLogin}>
              Switch to User Sign In
            </div>
            <div>{PAGEMOVEICON}</div>
          </div>
          <h1 className="org-title mt-5">{TITLE_ORG_LOGIN_MAIN}</h1>
          <p className="org-sub">{SUBTITLE_ORG_LOGIN}</p>

          <form onSubmit={onSubmit}>
            {/* EMAIL */}
            <label>{LABEL_ORG_EMAIL}</label>
            <input
              type={INPUT_TEXT}
              placeholder={PH_ORG_EMAIL}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            {/* PASSWORD */}
            <label>{LABEL_PASSWORD}</label>
            <div className="pass-wrap">
              <input
                type={showPass ? INPUT_TEXT : INPUT_PASSWORD}
                placeholder={PH_PASSWORD}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <span onClick={() => setShowPass(!showPass)}>
                {showPass ? PASSWORDVIEWICON : PASSWORDHIDEICON}
              </span>
            </div>

            {/* FORGOT */}
            <div className="forgot">
              <a href="/auth/forgot-password">{TEXT_FORGOT_PASSWORD}</a>
            </div>

            {/* SUBMIT */}
            <button type="submit" className="auth-btn">
              {TEXT_SIGNIN}
            </button>

            <p className="org-foot">
              {TEXT_NO_ACCOUNT}{" "}
              <a href="/auth/organization/signup/category">{TEXT_SIGNUP}</a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
