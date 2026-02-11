"use client";

export const dynamic = "force-dynamic";

import { useState, useEffect } from "react";
import styles from "./Delete.module.css";
import toast from "react-hot-toast";

import DeleteConfirmModal from "../../../../components/ui/DeleteConfirmModal/DeleteConfirmModal";
import {
  BTN_CANCEL,
  BTN_DELETE_ACCOUNT,
  IMAGE_ALT,
  MSG_DELETE_ACCOUNT,
  MSG_DELETED_YOUR_ACCOUNT,
  SUB_TITLE_DELETE_ACCOUNT,
  SUB_TITLE_DELETE_ACCOUNT_SUB_TEXT,
} from "../../../../const-value/config-message/page";

import { deleteOrganizationApi } from "../../../../lib/api/organizer.api";
import { deleteUserApi } from "../../../../lib/api/user.api";

// 🔐 SESSION AUTH
import {
  getAuthFromSession,
  isUserLoggedIn,
  clearAuthSession,
} from "../../../../lib/auth";

export default function DeleteProfilePage() {
  const [open, setOpen] = useState(false);
  const [deleted, setDeleted] = useState(false);

  // 🔐 SESSION STATE
  const [auth, setAuth] = useState(null);
  const [loggedIn, setLoggedIn] = useState(false);

  /* ================= INIT AUTH ================= */
  useEffect(() => {
    const ok = isUserLoggedIn();
    setLoggedIn(ok);

    if (ok) {
      setAuth(getAuthFromSession());
    }
  }, []);

  if (!loggedIn || !auth?.identity?.identity || !auth?.type) return null;

  const identityId = auth.identity.identity;
  const email = auth.identity.domainEmail || auth.identity.email;

  /* ================= DELETE ACCOUNT ================= */
  const handleDelete = async () => {
    try {
      let res;

      if (auth.type === "org") {
        res = await deleteOrganizationApi(identityId);
      } else {
        res = await deleteUserApi(identityId);
      }

      if (res?.status) {
        toast.success(res.message || "Account deleted");
        setDeleted(true);
        setOpen(false);

        // 🔐 CLEAR SESSION + COOKIE
        await clearAuthSession();

        // redirect home
        window.location.href = "/";
      } else {
        toast.error(res?.message || "Delete failed");
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Delete failed");
    }
  };

  /* ================= UI (UNCHANGED) ================= */
  return (
    <div className={styles.wrapper}>
      {!deleted && (
        <div className={styles.confirmBox}>
          <img
            src="/images/deleteprofileimage.png"
            alt={IMAGE_ALT}
            className={styles.icon}
          />

          <h2>{MSG_DELETE_ACCOUNT}</h2>

          <p>
            {SUB_TITLE_DELETE_ACCOUNT}
            <br />
            {SUB_TITLE_DELETE_ACCOUNT_SUB_TEXT}
          </p>

          <div className={styles.btnRow}>
            <button className={styles.cancelBtn} onClick={() => setOpen(false)}>
              {BTN_CANCEL}
            </button>

            <button className={styles.deleteBtn} onClick={() => setOpen(true)}>
              {BTN_DELETE_ACCOUNT}
            </button>
          </div>
        </div>
      )}

      <DeleteConfirmModal
        open={open}
        onClose={() => setOpen(false)}
        onConfirm={handleDelete}
        userEmail={email}
      />

      {deleted && (
        <div className={styles.successBox}>{MSG_DELETED_YOUR_ACCOUNT}</div>
      )}
    </div>
  );
}
