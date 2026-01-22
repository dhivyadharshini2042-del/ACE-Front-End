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
import { forgotApi, updateAuthProfile } from "../../../lib/api/auth.api";

/* Utils */
import { getUserData } from "../../../lib/auth";
import ConfirmModal from "../../../components/ui/Modal/ConfirmModal";
import { useRouter } from "next/navigation";
import { useLoading } from "../../../context/LoadingContext";

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
  const fileRef = useRef(null);
  const { setLoading } = useLoading();
  const [profile, setProfile] = useState(null);
  const [mode, setMode] = useState("view");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    email: "",
    image: null,
  });

  // IMAGE PREVIEW STATE
  const [imagePreview, setImagePreview] = useState(null);

  /* ================= LOAD PROFILE ================= */

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true); 

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
        setLoading(false); 
      }
    };

    loadProfile();
  }, []);

  /* ================= SAVE PROFILE ================= */
  const saveProfile = async () => {
    try {
      setLoading(true);

      const user = getUserData();
      if (!user?.identity) return;

      const payload = new FormData();

      payload.append("identity", user.identity);
      payload.append("type", user.type);

      // ROLE BASED NAME
      if (user.type === "org") {
        payload.append("organizationName", form.name);
      } else {
        payload.append("name", form.name);
      }

      // IMAGE (optional)
      if (form.image) {
        payload.append("profileImage", form.image);
      }

      const res = await updateAuthProfile(payload);

      if (res?.success) {
        toast.success("Profile updated successfully");

        setMode("view");
        setImagePreview(null);
        setForm((prev) => ({ ...prev, image: null }));
      } else {
        toast.error(res?.message || "Update failed");
      }
    } catch (err) {
      toast.error("Profile update failed");
    } finally {
      setLoading(false);
    }
  };

  /* ================= SEND RESET MAIL ================= */
  const handleSendResetMail = async () => {
    try {
      router.push("/auth/forgot-password");
      setShowConfirmModal(false);
    } catch {
      toast.error("Failed to send reset email");
    } finally {
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
            <label>Email</label>
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
              onChange={(e) => setForm({ ...form, name: e.target.value })}
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
            {/* ===== IMAGE UPLOAD (UI UNCHANGED) ===== */}
            {!imagePreview ? (
              <div
                className={styles.uploadBox}
                onClick={() => fileRef.current.click()}
              >
                Upload Profile picture (1:1) in PNG or JPEG Format
              </div>
            ) : (
              <div
                style={{ position: "relative", width: "100%", height: "250px" }}
              >
                <img
                  src={imagePreview}
                  alt="preview"
                  className={styles.imgpreview}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    borderRadius: "5%",
                  }}
                />
                <span
                  onClick={() => {
                    setForm({ ...form, image: null });
                    setImagePreview(null);
                    fileRef.current.value = "";
                  }}
                  style={{
                    position: "absolute",
                    top: 5,
                    right: 5,
                    background: "#000",
                    color: "#fff",
                    width: 22,
                    height: 22,
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 12,
                    cursor: "pointer",
                  }}
                >
                  ✕
                </span>
              </div>
            )}

            <input
              ref={fileRef}
              type="file"
              hidden
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files[0];
                if (!file) return;

                if (!file.type.startsWith("image/")) {
                  toast.error("Only image files allowed");
                  return;
                }

                setForm({ ...form, image: file });
                setImagePreview(URL.createObjectURL(file));
              }}
            />

            <div className={styles.btnRow}>
              <button
                className={styles.cancelBtn}
                onClick={() => {
                  setMode("view");
                  setImagePreview(null);
                  setForm((prev) => ({ ...prev, image: null }));
                }}
              >
                Cancel
              </button>
              <button className={styles.saveBtn} onClick={saveProfile}>
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
