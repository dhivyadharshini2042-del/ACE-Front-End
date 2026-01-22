"use client";

export const dynamic = "force-dynamic"; // THIS FIXES BUILD ERROR

import { useState } from "react";
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

import { getUserData } from "../../../../lib/auth";
// import api from "../../../../lib/api";

export default function DeleteProfilePage() {
  const [open, setOpen] = useState(false);
  const [deleted, setDeleted] = useState(false);


  const userData = getUserData();

  // SAFETY GUARD
  if (!userData) return null;

  const handleDelete = async () => {

    try {
      const res = await api.delete(
        `/v1/organizations/${userData.identity}`
      );

      if (res?.status === true) {
        toast.success(res.message);
        setDeleted(true);
        setOpen(false);
      } else {
        toast.error(res.message);
      }
    } catch (err) {
      toast.error(
        err?.response?.data?.message || "Delete failed"
      );
    } finally {
    }
  };

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
            <button className={styles.cancelBtn}>
              {BTN_CANCEL}
            </button>

            <button
              className={styles.deleteBtn}
              onClick={() => setOpen(true)}
            >
              {BTN_DELETE_ACCOUNT}
            </button>
          </div>
        </div>
      )}

      <DeleteConfirmModal
        open={open}
        onClose={() => setOpen(false)}
        onConfirm={handleDelete}
        userEmail={userData.email}
      />

      {deleted && (
        <div className={styles.successBox}>
          {MSG_DELETED_YOUR_ACCOUNT}
        </div>
      )}
    </div>
  );
}
