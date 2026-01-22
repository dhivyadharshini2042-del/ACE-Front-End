"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import "./reset-password.css";

import { toast } from "react-hot-toast";
import { resetPasswordApi } from "../../../lib/api/auth.api";
import { clearEmail, getEmail } from "../../../lib/auth";
import { userResetSchema } from "../../../components/validation";
import {
  PASSWORDHIDEICON,
  PASSWORDVIEWICON,
} from "../../../const-value/config-icons/page";
import {
  MSG_PASSWORD_UPDATED_SUCCESS,
  MSG_PASSWORD_UPDATED_FAILED,
  TITLE_SET_NEW_PASSWORD,
  SUB_TITLE_SET_NEW_PASSWORD,
  LABEL_SET_NEW_PASSWORD,
  LABEL_CONFIRM_PASSWORD,
  BTN_CONTINUE,
  TITLE_ALREADY_HAVE_ACCOUNT,
  TEXT_SIGNIN,
  ROLE_USER,
} from "../../../const-value/config-message/page";
import { useLoading } from "../../../context/LoadingContext";

export default function ResetPasswordPage() {
  const params = useSearchParams();
  const role = params.get("role") || ROLE_USER;

  const { setLoading } = useLoading(); 
  const email = getEmail();

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [show1, setShow1] = useState(false);
  const [show2, setShow2] = useState(false);

  // ROLE BASED CONFIG
  const config = {
    user: {
      image: "/images/auth-forgot.png",
      redirect: "/auth/success?role=user",
      login: "/auth/user/login",
    },
    organizer: {
      image: "/images/or_forgotpasswordnextimage.png",
      redirect: "/auth/success?role=organizer",
      login: "/auth/organization/login",
    },
  };

  const ui = config[role];

  async function onSubmit(e) {
    e.preventDefault();

    /* ===== VALIDATION ===== */
    try {
      await userResetSchema.validate(
        { password, confirmPassword: confirm },
        { abortEarly: false }
      );
    } catch (err) {
      return toast.error(err.errors[0]);
    }

    /* ===== API CALL ===== */
    try {
      setLoading(true); 

      await resetPasswordApi({
        email,
        password,
      });

      toast.success(MSG_PASSWORD_UPDATED_SUCCESS);
      clearEmail();
      window.location.href = ui.redirect;
    } catch (err) {
      toast.error(
        err?.response?.data?.message || MSG_PASSWORD_UPDATED_FAILED
      );
    } finally {
      setLoading(false); 
    }
  }

  return (
    <div className="org-shell">
      {/* LEFT IMAGE */}
      <aside className="org-left">
        <img src={ui.image} className="org-left-img" alt="reset" />
      </aside>

      {/* RIGHT FORM */}
      <main className="org-right">
        <div className="org-card">
          <h2 className="org-title">{TITLE_SET_NEW_PASSWORD}</h2>
          <p className="org-sub">{SUB_TITLE_SET_NEW_PASSWORD}</p>

          <form onSubmit={onSubmit}>
            {/* NEW PASSWORD */}
            <div className="form-group">
              <label className="form-label">{LABEL_SET_NEW_PASSWORD}</label>
              <div className="pass-wrap">
                <input
                  className="form-control"
                  type={show1 ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter new password"
                />
                <span
                  className="pass-toggle"
                  onClick={() => setShow1(!show1)}
                >
                  {show1 ? PASSWORDVIEWICON : PASSWORDHIDEICON}
                </span>
              </div>
            </div>

            {/* CONFIRM PASSWORD */}
            <div className="form-group">
              <label className="form-label">{LABEL_CONFIRM_PASSWORD}</label>
              <div className="pass-wrap">
                <input
                  className="form-control"
                  type={show2 ? "text" : "password"}
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  onPaste={(e) => e.preventDefault()}
                  onDrop={(e) => e.preventDefault()}
                  autoComplete="off"
                  placeholder="Re-enter password"
                />
                <span
                  className="pass-toggle"
                  onClick={() => setShow2(!show2)}
                >
                  {show2 ? PASSWORDVIEWICON : PASSWORDHIDEICON}
                </span>
              </div>
            </div>

            {/* SUBMIT */}
            <div className="form-actions">
              <button className="btn-primary-ghost" type="submit">
                {BTN_CONTINUE}
              </button>
            </div>

            {/* FOOTER */}
            <div className="org-foot">
              {TITLE_ALREADY_HAVE_ACCOUNT}{" "}
              <a href={ui.login}>{TEXT_SIGNIN}</a>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
