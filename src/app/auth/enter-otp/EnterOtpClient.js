"use client";

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
  TOAST_SUCCESS_MSG_NEW_OTP_SEND ,
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
  const router = useRouter();
  const params = useSearchParams();
  const role = params.get("role") || ROLE_USER;

  const { setLoading } = useLoading();

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [resendLoading, setResendLoading] = useState(false);

  const inputs = [
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
  ];

  useEffect(() => {
    const storedEmail = getEmail();
    if (storedEmail) setEmail(storedEmail);
  }, []);

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

  function onChange(index, value) {
    if (!/^\d*$/.test(value)) return;

    const next = [...otp];
    next[index] = value.slice(-1);
    setOtp(next);

    if (value && index < 3) {
      inputs[index + 1].current?.focus();
    }
  }

  /* VERIFY OTP */
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

  /* RESEND OTP */
  async function resendCode() {
    try {
      setResendLoading(true);

      const res = await resendOtpApi({ email });

      if (res?.status) {
        toast.success(TOAST_SUCCESS_MSG_NEW_OTP_SEND );
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
                  onChange={(e) => onChange(i, e.target.value)}
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
