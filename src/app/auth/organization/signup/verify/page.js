"use client";

/**
 * Account Verification Page
 * Displays confirmation message after signup,
 * instructing the user to verify their email.
 */

import { useEffect } from "react";

/** UI text constants */
import {
  TITLE_VERIFY_ACCOUNT,
  MSG_VERIFY_EMAIL_SENT,
} from "../../../../../const-value/config-message/page";

/** Shared authentication styles */
import "../../../organization/auth-common.css";

export default function Page() {

  /**
   * Static confirmation UI
   */
  return (
    <div className="verify-overlay">
      <div className="verify-modal">
        <img src="/images/ace-logo.png" className="verify-logo" />
        <h2>{TITLE_VERIFY_ACCOUNT}</h2>
        <p>{MSG_VERIFY_EMAIL_SENT}</p>
      </div>
    </div>
  );
}
