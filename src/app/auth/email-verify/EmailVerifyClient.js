/**
 * Client-side email verification page.
 *
 * Reads token from URL, calls verification API,
 * manages global loading state, and renders
 * loading/success/failed UI states.
 */

"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import {
  BTN_EMAIL_VERIFY_FAILED,
  BTN_EMAIL_VERIFY_SUCCESS,
  MSG_EMAIL_VERIFY_FAILED,
  MSG_EMAIL_VERIFY_LOADING,
  MSG_EMAIL_VERIFY_SUCCESS,
  STORAGE_TOKEN,
  SUB_TITLE_EMAIL_VERIFY,
  SUB_TITLE_EMAIL_VERIFY_FAILED,
  SUB_TITLE_EMAIL_VERIFY_SUCCESS,
  TITLE_EMAIL_VERIFY,
  TITLE_EMAIL_VERIFY_FAILED,
  TITLE_EMAIL_VERIFY_SUCCESS,
} from "../../../const-value/config-message/page";

import { verifyEmailApi } from "../../../lib/api/auth.api";
import { useLoading } from "../../../context/LoadingContext"; 

/**
 * EmailVerifyClient
 *
 * Flow:
 * - Extract token from query.
 * - If missing → failed.
 * - Call verifyEmailApi(token).
 * - On success → optionally deep link (mobile) + show success.
 * - On error → show failed.
 */
export default function EmailVerifyClient() {
  // Read token from URL
  const searchParams = useSearchParams();
  const token = searchParams.get(STORAGE_TOKEN);

  // Global loading controller
  const { setLoading } = useLoading(); 

  // UI state: loading | success | failed
  const [status, setStatus] = useState(MSG_EMAIL_VERIFY_LOADING);

  useEffect(() => {
    // Fail immediately if token not present
    if (!token) {
      setStatus(MSG_EMAIL_VERIFY_FAILED);
      return;
    }

    async function verify() {
      try {
        // Start global loader
        setLoading(true); 

        // API call to verify email
        const res = await verifyEmailApi(token);

        if (res?.status) {
          // Mobile deep link on success
          const isMobile = /Android|iPhone|iPad|iPod/i.test(
            navigator.userAgent
          );

          if (isMobile) {
            window.location.href = "myapp://email-verify?status=success";
          }

          setStatus(MSG_EMAIL_VERIFY_SUCCESS);
        } else {
          setStatus(MSG_EMAIL_VERIFY_FAILED);
        }
      } catch (err) {
        // Network or unexpected error
        setStatus(MSG_EMAIL_VERIFY_FAILED);
      } finally {
        // Stop global loader
        setLoading(false); 
      }
    }

    verify();
  }, [token, setLoading]);

  return (
    <div className="container min-vh-100 d-flex justify-content-center align-items-center">
      <div
        className="card shadow-lg p-4 text-center"
        style={{ maxWidth: "420px", width: "100%" }}
      >
        {/* Logo */}
        <div className="mb-3">
          <img src="/images/logo.png" alt="logo" style={{ height: 60 }} />
        </div>

        {/* Loading state */}
        {status === MSG_EMAIL_VERIFY_LOADING && (
          <>
            <div className="spinner-border text-primary mb-3" />
            <h5 className="fw-bold">{TITLE_EMAIL_VERIFY}</h5>
            <p className="text-muted">{SUB_TITLE_EMAIL_VERIFY}</p>
          </>
        )}

        {/* Success state */}
        {status === MSG_EMAIL_VERIFY_SUCCESS && (
          <>
            <h4 className="fw-bold text-success">
              {TITLE_EMAIL_VERIFY_SUCCESS}
            </h4>
            <p className="text-muted">{SUB_TITLE_EMAIL_VERIFY_SUCCESS}</p>

            <a
              href="/auth/organization/login"
              className="btn btn-success w-100 mt-3"
            >
              {BTN_EMAIL_VERIFY_SUCCESS}
            </a>
          </>
        )}

        {/* Failed state */}
        {status === MSG_EMAIL_VERIFY_FAILED && (
          <>
            <h4 className="fw-bold text-danger">
              {TITLE_EMAIL_VERIFY_FAILED}
            </h4>
            <p className="text-muted">{SUB_TITLE_EMAIL_VERIFY_FAILED}</p>

            <button
              className="btn btn-outline-secondary w-100 mt-3"
              onClick={() => window.location.reload()}
            >
              {BTN_EMAIL_VERIFY_FAILED}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
