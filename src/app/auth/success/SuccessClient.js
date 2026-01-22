"use client";

import { useSearchParams } from "next/navigation";
import "./success.css";
import {
  BTN_EMAIL_VERIFY_SUCCESS,
  IMAGE_ALT,
  ROLE_USER,
  SUB_TITLE_DOMAIN_MAIL_VERIFY,
  SUB_TITLE_PASSWORD_UPDATE_SUCCESS,
  TEXT_SIGNIN,
  TITLE_ALREADY_HAVE_ACCOUNT,
} from "../../../const-value/config-message/page";

export default function SuccessClient() {
  const params = useSearchParams();
  const role = params.get("role") || ROLE_USER;


  const config = {
    user: {
      image: "/images/auth-forgot.png",
      title: "Password Changed!",
      subtitle: SUB_TITLE_PASSWORD_UPDATE_SUCCESS,
      loginLink: "/auth/user/login",
    },
    organizer: {
      image: "/images/or_passwordsuccess.png",
      title: "Verify your Account",
      subtitle: SUB_TITLE_DOMAIN_MAIL_VERIFY,
      loginLink: "/auth/organization/login",
    },
  };

  const ui = config[role];

  return (
    <div className="org-shell">
      <aside className="org-left">
        <img className="org-left-img" src={ui.image} alt={IMAGE_ALT} />
      </aside>

      <main className="org-right">
        <div className="org-card org-success">
          <h2 className="org-title">{ui.title}</h2>
          <div className="org-sub">{ui.subtitle}</div>

          <div className="form-actions">
            <a href={ui.loginLink} className="btn-primary-ghost">
              {BTN_EMAIL_VERIFY_SUCCESS}
            </a>
          </div>

          <div className="org-foot">
            {TITLE_ALREADY_HAVE_ACCOUNT}{" "}
            <a href={ui.loginLink}>{TEXT_SIGNIN}</a>
          </div>
        </div>
      </main>
    </div>
  );
}
