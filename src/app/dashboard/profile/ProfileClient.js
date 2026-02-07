"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./Profile.module.css";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

/* APIs */
import { getOrganizationProfileApi } from "../../../lib/api/organizer.api";
import { getUserProfileApi } from "../../../lib/api/user.api";
import { updateAuthProfile } from "../../../lib/api/auth.api";

/* UI */
import ConfirmModal from "../../../components/ui/Modal/ConfirmModal";
import { useLoading } from "../../../context/LoadingContext";

// 🔐 SESSION AUTH
import { getAuthFromSession, isUserLoggedIn } from "../../../lib/auth";

export default function ProfilePage() {
  const fileRef = useRef(null);
  const router = useRouter();
  const { setLoading } = useLoading();

  // 🔐 SESSION STATE
  const [auth, setAuth] = useState(null);
  const [loggedIn, setLoggedIn] = useState(false);

  const [profile, setProfile] = useState(null);
  const [mode, setMode] = useState("view");
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    image: null,
  });

  const [imagePreview, setImagePreview] = useState(null);

  /* ================= INIT AUTH ================= */
  useEffect(() => {
    const ok = isUserLoggedIn();
    setLoggedIn(ok);

    if (ok) {
      setAuth(getAuthFromSession());
    }
  }, []);

  /* ================= LOAD PROFILE ================= */
  useEffect(() => {
    async function loadProfile() {
      try {
        if (!loggedIn || !auth?.identity || !auth?.type) return;

        setLoading(true);

        let res;
        if (auth.type === "org") {
          res = await getOrganizationProfileApi(auth.identity.identity);
        } else {
          res = await getUserProfileApi(auth.identity.identity);
        }

        if (res?.status) {
          setProfile(res.data);
          setForm({
            name:
              auth.type === "org" ? res.data.organizationName : res.data.name,
            email: auth.type === "org" ? res.data.domainEmail : res.data.email,
            image: null,
          });
        }
      } catch {
        toast.error("Failed to load profile");
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, [loggedIn, auth?.identity, auth?.type]);

  /* ================= SAVE PROFILE ================= */
  const saveProfile = async () => {
    try {
      if (!loggedIn || !auth?.identity || !auth?.type) return;

      setLoading(true);

      const payload = new FormData();
      payload.append("identity", auth.identity.identity);
      payload.append("type", auth.type);

      if (auth.type === "org") {
        payload.append("organizationName", form.name);
      } else {
        payload.append("name", form.name);
      }

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
    } catch {
      toast.error("Profile update failed");
    } finally {
      setLoading(false);
    }
  };

  const handleSendResetMail = () => {
    setShowConfirmModal(false);
    router.push("/auth/forgot-password");
  };

  if (!profile) return null;

  /* ================= UI (UNCHANGED) ================= */
  return (
    <div className={styles.profileWrapper}>
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

      {mode === "edit" && (
        <div className={styles.editBox}>
          <div className={styles.left}>
            <label>Full Name</label>
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />

            <label>Email</label>
            <input value={form.email} disabled />

            <span
              className={styles.changePassword}
              onClick={() => setShowConfirmModal(true)}
            >
              Change Password
            </span>
          </div>

          <div>
            {!imagePreview ? (
              <div
                className={styles.uploadBox}
                onClick={() => fileRef.current.click()}
              >
                Upload Profile picture
              </div>
            ) : (
              <img
                src={imagePreview}
                alt="preview"
                className={styles.imgpreview}
              />
            )}

            <input
              ref={fileRef}
              type="file"
              hidden
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files[0];
                if (!file) return;
                setForm({ ...form, image: file });
                setImagePreview(URL.createObjectURL(file));
              }}
            />

            <div className={styles.btnRow}>
              <button
                className={styles.cancelBtn}
                onClick={() => setMode("view")}
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

      <ConfirmModal
        open={showConfirmModal}
        title="Reset Password"
        description="Password reset link will be sent to your email."
        image="/images/logo.png"
        onCancel={() => setShowConfirmModal(false)}
        onConfirm={handleSendResetMail}
      />
    </div>
  );
}
