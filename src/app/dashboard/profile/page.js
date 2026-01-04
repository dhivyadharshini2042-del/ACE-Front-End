"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./Profile.module.css";
import toast from "react-hot-toast";

/* APIs */
import {
  getOrganizationProfileApi,
  updateOrganizationProfileApi,
} from "../../../lib/api/organizer.api";
import {
  getUserProfileApi,
  updateUserProfileApi,
} from "../../../lib/api/user.api";
import { forgotApi } from "../../../lib/api/auth.api";

/* Utils */
import { getUserData } from "../../../lib/auth";
import { useLoading } from "../../../context/LoadingContext";
import ConfirmModal from "../../../components/ui/Modal/ConfirmModal";


/* ================= ROLE BASED API ================= */
const getProfileApis = (user) => {
  if (user?.type === "org") {
    return {
      getProfile: getOrganizationProfileApi,
      updateProfile: updateOrganizationProfileApi,
      nameKey: "organizationName",
      emailKey: "domainEmail",
    };
  }

  return {
    getProfile: getUserProfileApi,
    updateProfile: updateUserProfileApi,
    nameKey: "name",
    emailKey: "email",
  };
};

export default function ProfilePage() {
  const { setLoading: setGlobalLoading } = useLoading();
  const fileRef = useRef(null);

  const [profile, setProfile] = useState(null);
  const [mode, setMode] = useState("view");
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    image: null,
  });

  /* ================= LOAD PROFILE ================= */
  useEffect(() => {
    const loadProfile = async () => {
      setGlobalLoading(true);
      try {
        const user = getUserData();
        if (!user?.identity) return;

        const api = getProfileApis(user);
        const res = await api.getProfile(user.identity);

        if (res?.status) {
          setProfile(res.data);
          setForm({
            name: res.data[api.nameKey] || "",
            email: res.data[api.emailKey] || "",
            image: null,
          });
        }
      } catch {
        toast.error("Failed to load profile");
      } finally {
        setGlobalLoading(false);
      }
    };

    loadProfile();
  }, [setGlobalLoading]);

  /* ================= SAVE PROFILE ================= */
  const saveProfile = async () => {
    setGlobalLoading(true);
    try {
      const user = getUserData();
      const api = getProfileApis(user);

      const payload = new FormData();
      payload.append(api.nameKey, form.name);
      payload.append(api.emailKey, form.email);
      if (form.image) payload.append("image", form.image);

      const res = await api.updateProfile(user.identity, payload);
      if (res?.status) {
        toast.success("Profile updated");
        setMode("view");
      } else {
        toast.error("Update failed");
      }
    } catch {
      toast.error("Update failed");
    } finally {
      setGlobalLoading(false);
    }
  };

  /* ================= SEND RESET MAIL ================= */
  const handleSendResetMail = async () => {
    setGlobalLoading(true);
    try {
      await forgotApi({ email: form.email });
      toast.success("Password reset email sent");
      setShowConfirmModal(false);
    } catch {
      toast.error("Failed to send reset email");
    } finally {
      setGlobalLoading(false);
    }
  };

  if (!profile) return null;

  return (
    <div className={styles.profileWrapper}>
      {/* ================= VIEW MODE ================= */}
      {mode === "view" && (
        <div className={styles.viewBox}>
          <div>
            <label>Full Name</label>
            <p>{form.name}</p>
          </div>

          <div>
            <label>Domain Email Id</label>
            <p>{form.email}</p>
          </div>

          <img
            src="/images/Pen.png"
            className={styles.editIcon}
            onClick={() => setMode("edit")}
            alt="edit"
          />
        </div>
      )}

      {/* ================= EDIT MODE ================= */}
      {mode === "edit" && (
        <div className={styles.editBox}>
          <div className={styles.left}>
            <label>Full Name</label>
            <input
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
            />

            <label>Domain Email Id</label>
            <input value={form.email} disabled />

            <span
              className={styles.changePassword}
              onClick={() => setShowConfirmModal(true)}
            >
              Change Password
            </span>
          </div>

          <div>
            <div
              className={styles.uploadBox}
              onClick={() => fileRef.current.click()}
            >
              Upload Profile picture (1:1) in PNG or JPEG Format
            </div>

            <input
              ref={fileRef}
              type="file"
              hidden
              accept="image/*"
              onChange={(e) =>
                setForm({ ...form, image: e.target.files[0] })
              }
            />

            <div className={styles.btnRow}>
              <button
                className={styles.cancelBtn}
                onClick={() => setMode("view")}
              >
                Cancel
              </button>
              <button
                className={styles.saveBtn}
                onClick={saveProfile}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= CONFIRM MODAL ================= */}
      <ConfirmModal
        open={showConfirmModal}
        title="Reset Password"
        description="A password reset link will be sent to your registered email address."
        image="/images/logo.png"
        onCancel={() => setShowConfirmModal(false)}
        onConfirm={handleSendResetMail}
      />
    </div>
  );
}
