"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./Profile.module.css";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

/* APIs */
import { getOrganizationProfileApi } from "../../../lib/api/organizer.api";
import { getUserProfileApi } from "../../../lib/api/user.api";
import { updateAuthProfile } from "../../../lib/api/auth.api";

/* UI */
import ConfirmModal from "../../../components/ui/Modal/ConfirmModal";
import { useLoading } from "../../../context/LoadingContext";

/* AUTH */
import { getAuthFromSession, isUserLoggedIn } from "../../../lib/auth";
import {
  FACEBOOKICON,
  INSTAGRAMICON,
  LINKEDINICON,
  TELEGRAMICON,
  WEBSITEICON,
  XICON,
  YOUTUBEICON,
} from "../../../const-value/config-icons/page";

export default function ProfileClient() {
  const router = useRouter();
  const fileRef = useRef(null);
  const { setLoading } = useLoading();

  const [auth, setAuth] = useState(null);
  const [profile, setProfile] = useState(null);

  const [mode, setMode] = useState("view");
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    image: null,
    socialLinks: {
      instagram: "",
      linkedin: "",
      x: "",
      website: "",
    },
  });

  const [imagePreview, setImagePreview] = useState(null);

  const socialWithIcon = [
    { key: "linkedin", label: "LinkedIn", icon: LINKEDINICON },
    { key: "telegram", label: "Telegram", icon: TELEGRAMICON },
    { key: "youtube", label: "YouTube", icon: YOUTUBEICON },
    { key: "x", label: "X", icon: XICON },
    { key: "instagram", label: "Instagram", icon: INSTAGRAMICON },
    { key: "facebook", label: "Facebook", icon: FACEBOOKICON },
    { key: "website", label: "Website", icon: WEBSITEICON },
  ];

  /* ================= INIT ================= */
  useEffect(() => {
    if (!isUserLoggedIn()) return;

    const session = getAuthFromSession();
    setAuth(session);

    async function loadProfile() {
      try {
        setLoading(true);

        let res;
        if (session.type === "org") {
          res = await getOrganizationProfileApi(session.identity.identity);
        } else {
          res = await getUserProfileApi(session.identity.identity);
        }

        if (res?.status) {
          setProfile(res.data);
          setForm({
            name:
              session.type === "org"
                ? res.data.organizationName
                : res.data.name,
            email:
              session.type === "org" ? res.data.domainEmail : res.data.email,
            image: null,
            socialLinks: res.data.socialLinks || {
              instagram: "",
              linkedin: "",
              x: "",
              website: "",
            },
          });
        }
      } catch {
        toast.error("Failed to load profile");
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, []);

  /* ================= SAVE ================= */
  const saveProfile = async () => {
    try {
      if (!auth) return;

      setLoading(true);

      const payload = new FormData();
      payload.append("identity", auth.identity.identity);
      payload.append("type", auth.type);

      payload.append(
        auth.type === "org" ? "organizationName" : "name",
        form.name,
      );

      payload.append("socialLinks", JSON.stringify(form.socialLinks));

      if (form.image) {
        payload.append("profileImage", form.image);
      }

      const res = await updateAuthProfile(payload);

      if (res?.success) {
        toast.success("Profile updated successfully");
        setMode("view");
        setImagePreview(null);
      } else {
        toast.error(res?.message || "Update failed");
      }
    } catch {
      toast.error("Profile update failed");
    } finally {
      setLoading(false);
    }
  };

  if (!profile) return null;

  return (
    <div className={styles.card}>
      {form.name && <h2 className={styles.name}>{form.name}</h2>}
      {/* ================= TOP ================= */}
      <div className={styles.top}>
        <div className={styles.avatar}>
          {profile.profileImage ? (
            <img src={profile.profileImage} alt="profile" />
          ) : (
            <div className={styles.noImage}>{form.name?.charAt(0)}</div>
          )}
        </div>

        <div className={styles.topRight}>
          <div className={styles.stats}>
            {profile.organizationCategory && (
              <div>
                <span>Organization</span>
                <b>{profile.organizationCategory}</b>
              </div>
            )}
            <div>
              <span>Events Organized</span>
              <b>{profile.eventCount || 0}</b>
            </div>
            <div data-tooltip="View followers">
              <span>Followers</span>
              <b>{profile.followers || 0}</b>
            </div>
            <div data-tooltip="View following">
              <span>Following</span>
              <b>{profile.following || 0}</b>
            </div>
          </div>

          <div className={styles.meta}>
            {form.email && <span>{form.email}</span>}
            {profile.isVerified && (
              <span className={styles.verified}>✔ Verified</span>
            )}
          </div>
        </div>
      </div>

      {/* ================= SOCIAL VIEW ================= */}
      <div className={styles.socialRow}>
        {form.socialLinks.instagram && (
          <a
            href={form.socialLinks.instagram}
            target="_blank"
            className={`${styles.socialItem} ${styles.instagram}`}
          >
            {INSTAGRAMICON} Instagram
          </a>
        )}
        {form.socialLinks.linkedin && (
          <a
            href={form.socialLinks.linkedin}
            target="_blank"
            className={`${styles.socialItem} ${styles.linkedin}`}
          >
            {LINKEDINICON} LinkedIn
          </a>
        )}
        {form.socialLinks.x && (
          <a
            href={form.socialLinks.x}
            target="_blank"
            className={`${styles.socialItem} ${styles.x}`}
          >
            {XICON} Twitter
          </a>
        )}
        {form.socialLinks.website && (
          <a
            href={form.socialLinks.website}
            target="_blank"
            className={`${styles.socialItem} ${styles.website}`}
          >
            {WEBSITEICON} Website
          </a>
        )}
        {/* EXTRA SOCIALS (ADD ONLY) */}
        {form.socialLinks.facebook && (
          <a
            href={form.socialLinks.facebook}
            target="_blank"
            className={`${styles.socialItem} ${styles.facebook}`}
          >
            {FACEBOOKICON} Facebook
          </a>
        )}

        {form.socialLinks.youtube && (
          <a
            href={form.socialLinks.youtube}
            target="_blank"
            className={`${styles.socialItem} ${styles.youtube}`}
          >
            {YOUTUBEICON} YouTube
          </a>
        )}

        {form.socialLinks.telegram && (
          <a
            href={form.socialLinks.telegram}
            target="_blank"
            className={`${styles.socialItem} ${styles.telegram}`}
          >
            {TELEGRAMICON} Telegram
          </a>
        )}
      </div>

      <hr />

      {/* ================= VIEW ================= */}
      {mode === "view" && (
        <>
          <div className={styles.details}>
            {form.name && (
              <div>
                <label>Full Name</label>
                <p>{form.name}</p>
              </div>
            )}
            {form.email && (
              <div>
                <label>Email Address</label>
                <p>{form.email}</p>
              </div>
            )}
            {(profile.country || profile.state || profile.city) && (
              <div className={styles.addressBlock}>
                <label>Address</label>

                <p>
                  {profile.city && <span>{profile.city}</span>}
                  {profile.city && profile.state && <span>, </span>}
                  {profile.state && <span>{profile.state}</span>}
                  {(profile.city || profile.state) && profile.country && (
                    <span>, </span>
                  )}
                  {profile.country && <span>{profile.country}</span>}
                </p>
              </div>
            )}
          </div>

          <div className={styles.actions}>
            <button className={styles.editBtn} onClick={() => setMode("edit")}>
              Edit Profile
            </button>
            <span
              className={styles.link}
              onClick={() => setShowConfirmModal(true)}
            >
              Change Password
            </span>
          </div>
        </>
      )}

      {/* ================= EDIT ================= */}
      {mode === "edit" && (
        <>
          <div className={styles.details}>
            <div>
              <label>Full Name</label>
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>

            <div>
              <label>Email Address</label>
              <input value={form.email} disabled />
            </div>

            <div>
              <label>Profile Image</label>

              {/* PREVIEW BOX */}
              {imagePreview && (
                <div className={styles.previewBox}>
                  <img src={imagePreview} alt="preview" />
                  <button
                    type="button"
                    className={styles.removePreview}
                    onClick={() => {
                      setImagePreview(null);
                      setForm({ ...form, image: null });
                      if (fileRef.current) fileRef.current.value = "";
                    }}
                  >
                    ✕
                  </button>
                </div>
              )}

              {/* UPLOAD */}
              {!imagePreview && (
                <div
                  className={styles.uploadBox}
                  onClick={() => fileRef.current.click()}
                >
                  Upload Image
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

                  setForm({ ...form, image: file });
                  setImagePreview(URL.createObjectURL(file));
                }}
              />
            </div>
          </div>

          {/* SOCIAL EDIT */}
          {/* SOCIAL EDIT */}
          <div className={styles.socialEditSection}>
            <h4>Social Links</h4>

            {/* SOCIAL EDIT */}
            <div className={styles.socialEditSection}>
              <h4>Social Links</h4>

              <div className={styles.socialGrid}>
                {socialWithIcon.map((item) => (
                  <div key={item.key} className={styles.socialEditRow}>
                    <span className={styles.socialIcon}>{item.icon}</span>

                    <input
                      placeholder={`${item.label} URL`}
                      value={form.socialLinks[item.key] || ""}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          socialLinks: {
                            ...form.socialLinks,
                            [item.key]: e.target.value,
                          },
                        })
                      }
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className={styles.actions}>
            <button
              onClick={() => {
                setMode("view");
                setImagePreview(null);
                setForm({ ...form, image: null });
                if (fileRef.current) fileRef.current.value = "";
              }}
            >
              Cancel
            </button>

            <button className={styles.editBtn} onClick={saveProfile}>
              Save Changes
            </button>
          </div>
        </>
      )}

      <ConfirmModal
        open={showConfirmModal}
        title="Reset Password"
        description="Password reset link will be sent to your email."
        image="/images/logo.png"
        onCancel={() => setShowConfirmModal(false)}
        onConfirm={() => router.push("/auth/forgot-password")}
      />

      {/* ================= DELETE ACCOUNT ================= */}
      <div className={styles.dangerZone}>
        <h4>Danger Zone</h4>

        <div className={styles.deleteBox}>
          <div>
            <b>Delete Account</b>
            <p>
              Once you delete your account, all your data will be permanently
              removed. This action cannot be undone.
            </p>
          </div>

          <button
            className={styles.deleteBtn}
            onClick={() => setShowConfirmModal(true)}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
