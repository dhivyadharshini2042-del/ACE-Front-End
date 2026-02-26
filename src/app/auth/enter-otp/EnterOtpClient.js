"use client";

/**
 * EnterOtpClient
 * --------------
 * Client-side component responsible for handling the OTP (One-Time Password)
 * verification step within the authentication flow.
 *
 * Core Responsibilities:
 * - Resolve user role from query parameters.
 * - Retrieve persisted email from authentication storage.
 * - Manage OTP digit inputs with controlled state.
 * - Perform schema-based validation prior to submission.
 * - Integrate with verification and resend OTP APIs.
 * - Handle conditional navigation after successful verification.
 * - Coordinate with global loading context for async states.
 */

import { useState, useRef, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-hot-toast";
import "./enter-otp.css";

/* VALIDATION */
import { otpSchema } from "../../../components/validation";

/* API */
import { verifyOtpApi, resendOtpApi } from "../../../lib/api/auth.api";

/* AUTH */
import { getEmail } from "../../../lib/auth";

/* CONSTANTS */
import {
  TITLE_ENTER_OTP,
  SUB_TITLE_ENTER_OTP,
  BTN_CONTINUE,
  BTN_OTP_RESEND,
  TOAST_ERROR_MSG_GENERIC_ERROR,
  TOAST_SUCCESS_MSG_NEW_OTP_SEND,
  TOAST_ERROR_MSG_NEW_OTP_FAILED_TO_SEND,
  TOAST_ERROR_MSG_OTP_INVALID,
  TOAST_SUCCESS_MSG_OTP_VERIFIED,
  SUB_TITLE_OTP_NOT_RECEIVE,
  CONDITION_OTP_SEND,
  ROLE_USER,
} from "../../../const-value/config-message/page";

/* GLOBAL LOADING */
import { useLoading } from "../../../context/LoadingContext";

export default function EnterOtpClient() {
  /**
   * Router and search parameter handling.
   * Determines the active role and corresponding UI configuration.
   */
  const router = useRouter();
  const params = useSearchParams();
  const role = params.get("role") || ROLE_USER;

  /**
   * Global loading state controller used to display
   * application-wide loading indicators during async operations.
   */
  const { setLoading } = useLoading();

  /**
   * Local state management:
   * - email: persisted user email.
   * - otp: controlled array representing each OTP digit.
   * - resendLoading: UI state for resend action.
   */
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [resendLoading, setResendLoading] = useState(false);

  /**
   * References for OTP inputs to support programmatic focus control.
   */
  const inputs = [
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
  ];

  /**
   * On component mount, retrieve stored email from
   * authentication utilities to avoid reliance on URL parameters.
   */
  useEffect(() => {
    const storedEmail = getEmail();
    if (storedEmail) setEmail(storedEmail);
    inputs[0].current?.focus();
  }, []);

  /**
   * Role-based configuration object.
   * Controls:
   * - Illustration displayed in the layout.
   * - Redirect destination after successful verification.
   */
  const config = {
    user: {
      image: "/images/auth-forgot.png",
      redirect: "/auth/reset-password?role=user",
    },
    organizer: {
      image: "/images/or_forgotpassword.png",
      redirect: "/auth/reset-password?role=organizer",
    },
  };

  const ui = config[role];

  /**
   * Handles OTP input changes.
   *
   * Logic:
   * - Restricts input to numeric characters.
   * - Enforces single-digit entry.
   * - Automatically shifts focus to the next field when applicable.
   */
  function onChange(index, value) {
    if (!/^\d*$/.test(value)) return;

    const next = [...otp];
    next[index] = value.slice(-1);
    setOtp(next);

    if (value && index < 3) {
      inputs[index + 1].current?.focus();
    }
  }

  function onKeyDown(index, e) {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputs[index - 1].current?.focus();
    }
  }

  function onPaste(e) {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 4);
    if (!pasted) return;
    const next = ["", "", "", ""];
    pasted.split("").forEach((char, i) => (next[i] = char));
    setOtp(next);
    const focusIndex = Math.min(pasted.length, 3);
    inputs[focusIndex].current?.focus();
  }

  /**
   * OTP verification submission handler.
   *
   * Flow:
   * 1. Combine digit array into a single code string.
   * 2. Validate against defined schema.
   * 3. Trigger global loading indicator.
   * 4. Invoke verification API.
   * 5. Display feedback and redirect on success.
   */
  async function onSubmit(e) {
    e.preventDefault();
    const code = otp.join("");

    try {
      await otpSchema.validate({ otp: code }, { abortEarly: false });
    } catch (err) {
      return toast.error(err.errors[0]);
    }

    try {
      setLoading(true);

      const res = await verifyOtpApi({ email, otp: code });

      if (res?.status) {
        toast.success(TOAST_SUCCESS_MSG_OTP_VERIFIED);
        router.push(ui.redirect);
      } else {
        toast.error(res?.message || TOAST_ERROR_MSG_OTP_INVALID);
      }
    } catch {
      toast.error(TOAST_ERROR_MSG_GENERIC_ERROR);
    } finally {
      setLoading(false);
    }
  }

  /**
   * Resend OTP handler.
   *
   * Invokes resend API and provides user feedback
   * while managing a localized loading state.
   */
  async function resendCode() {
    try {
      setResendLoading(true);

      const res = await resendOtpApi({ email });

      if (res?.status) {
        toast.success(TOAST_SUCCESS_MSG_NEW_OTP_SEND);
      } else {
        toast.error(res?.message || TOAST_ERROR_MSG_NEW_OTP_FAILED_TO_SEND);
      }
    } catch {
      toast.error(TOAST_ERROR_MSG_GENERIC_ERROR);
    } finally {
      setResendLoading(false);
    }
  }

  return (
    <div className="org-shell">
      <aside className="org-left">
        <img className="org-left-img" src={ui.image} alt="otp" />
      </aside>

      <main className="org-right">
        <div className="org-card">
          <h2 className="org-title">{TITLE_ENTER_OTP}</h2>

          <div className="org-sub">
            {SUB_TITLE_ENTER_OTP} {email || "your email"}
          </div>

          <form className="org-form" onSubmit={onSubmit}>
            <div className="otp-row">
              {otp.map((val, i) => (
                <input
                  key={i}
                  ref={inputs[i]}
                  className="otp-input"
                  maxLength={1}
                  value={val}
                  inputMode="numeric"
                  placeholder=" "
                  onChange={(e) => onChange(i, e.target.value)}
                  onKeyDown={(e) => onKeyDown(i, e)}
                  onPaste={onPaste}
                />
              ))}
            </div>

            <div className="form-actions">
              <button className="btn-primary-ghost" type="submit">
                {BTN_CONTINUE}
              </button>
            </div>

            <div className="org-foot" style={{ marginTop: 10 }}>
              {SUB_TITLE_OTP_NOT_RECEIVE}{" "}
              <button
                type="button"
                className="resendCondeText"
                onClick={resendCode}
                disabled={resendLoading}
              >
                {resendLoading ? CONDITION_OTP_SEND : BTN_OTP_RESEND}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
