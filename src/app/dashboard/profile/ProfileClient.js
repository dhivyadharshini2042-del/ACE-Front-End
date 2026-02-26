"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./Profile.module.css";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

/* ================= API IMPORTS ================= */
import { getOrganizationProfileApi } from "../../../lib/api/organizer.api";
import { getUserProfileApi } from "../../../lib/api/user.api";
import { updateAuthProfile } from "../../../lib/api/auth.api";

/* ================= UI COMPONENTS ================= */
import ConfirmModal from "../../../components/ui/Modal/ConfirmModal";
import { useLoading } from "../../../context/LoadingContext";
import OrgAnalyticsPanel from "../../../components/dashboard/OrgAnalyticsPanel";

/* ================= AUTH HELPERS ================= */
import { getAuthFromSession, isUserLoggedIn, saveEmail } from "../../../lib/auth";

/* ================= ICONS ================= */
import {
  FACEBOOKICON,
  INSTAGRAMICON,
  LINKEDINICON,
  TELEGRAMICON,
  WEBSITEICON,
  XICON,
  YOUTUBEICON,
} from "../../../const-value/config-icons/page";

/* ================= LOCATION APIs ================= */
import { getCountries, getStates, getCities } from "../../../lib/location.api";

/* ================= DELETE MODAL ================= */
import DeleteConfirmModal from "../../../components/ui/DeleteConfirmModal/DeleteConfirmModal";

import {
  TOAST_SUCCESS_ACCOUNT_DELETED,
  TOAST_ERROR_MSG_DELETE_ACCOUNT_FAILED,
  TOAST_ERROR_MSG_PROFILE_RELOAD_FAILED,
  TOAST_ERROR_AUTH_MISSING,
  TOAST_ERROR_MSG_UPDATE_FAILED,
  TOAST_ERROR_MSG_PROFILE_UPDATE_FAILED,
  TOAST_SUCCESS_PROFILE_UPDATED
} from "../../../const-value/config-message/page";

export default function ProfileClient() {
  const router = useRouter();
  // File input reference
  const fileRef = useRef(null);
  // Global loading state
  const { setLoading } = useLoading();

  /* ================= STATE ================= */

  // Profile data
  const [profile, setProfile] = useState(null);
  // Session auth info
  const [auth, setAuth] = useState(null);
  // UI mode (view or edit)
  const [mode, setMode] = useState("view");

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);

  // Location states (for user type)
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");

  // Editable form state
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

  // Image preview URL
  const [imagePreview, setImagePreview] = useState(null);

  /* ================= SOCIAL CONFIG ================= */

  const socialWithIcon = [
    { key: "linkedin", label: "LinkedIn", icon: LINKEDINICON },
    { key: "telegram", label: "Telegram", icon: TELEGRAMICON },
    { key: "youtube", label: "YouTube", icon: YOUTUBEICON },
    { key: "x", label: "X", icon: XICON },
    { key: "instagram", label: "Instagram", icon: INSTAGRAMICON },
    { key: "facebook", label: "Facebook", icon: FACEBOOKICON },
    { key: "website", label: "Website", icon: WEBSITEICON },
  ];

  /* ================= PROFILE FETCH ================= */

  const fetchProfile = async (session) => {
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
            session.type === "org" ? res.data.organizationName : res.data.name,
          email: session.type === "org" ? res.data.domainEmail : res.data.email,
          image: null,
          socialLinks: res.data.socialLinks || {},
        });
      }
    } catch {
      toast.error(TOAST_ERROR_MSG_PROFILE_RELOAD_FAILED);
    } finally {
      setLoading(false);
    }
  };

  /* ================= INITIALIZATION ================= */

  // Load session + profile on mount
  useEffect(() => {
    if (!isUserLoggedIn()) return;

    const session = getAuthFromSession();
    setAuth(session);
    fetchProfile(session);
  }, []);

  // Load countries for location dropdown
  useEffect(() => {
    async function loadCountries() {
      const data = await getCountries();
      setCountries(data || []);
    }

    loadCountries();
  }, []);

  /* ================= LOCATION HANDLERS ================= */

  const handleCountryChange = async (countryId) => {
    setSelectedCountry(countryId);
    setSelectedState("");
    setSelectedCity("");

    const data = await getStates(countryId);
    setStates(data || []);
  };

  const handleStateChange = async (stateId) => {
    setSelectedState(stateId);
    setSelectedCity("");

    const data = await getCities(stateId);
    setCities(data || []);
  };

  /* ================= SAVE PROFILE ================= */

  const saveProfile = async () => {
    try {
      if (!auth) {
        toast.error(TOAST_ERROR_AUTH_MISSING);
        return;
      }

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

      if (res?.status) {
        await fetchProfile(auth);
        toast.success(TOAST_SUCCESS_PROFILE_UPDATED);
        setMode("view");
        setImagePreview(null);
      } else {
        toast.error(res?.message || TOAST_ERROR_MSG_UPDATE_FAILED);
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || TOAST_ERROR_MSG_PROFILE_UPDATE_FAILED);
    } finally {
      setLoading(false);
    }
  };

  /* ================= DELETE ACCOUNT ================= */

  const handleDeleteAccount = async () => {
    try {
      setLoading(true);

      toast.success(TOAST_SUCCESS_ACCOUNT_DELETED);

      setShowDeleteModal(false);

      router.push("/");
    } catch (err) {
      toast.error(TOAST_ERROR_MSG_DELETE_ACCOUNT_FAILED);
    } finally {
      setLoading(false);
    }
  };

  if (!profile) return null;

  return (
    <div className={styles.card}>
      {/* ================= VIEW MODE ================= */}
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

            {/* Address block */}
            {(profile?.country || profile?.state || profile?.city) && (
              <div className={styles.addressBlock}>
                <label>Address</label>

                <p>
                  {profile?.city && <span>{profile.city}</span>}
                  {profile?.city && profile?.state && <span>, </span>}
                  {profile?.state && <span>{profile.state}</span>}
                  {(profile?.city || profile?.state) && profile?.country && (
                    <span>, </span>
                  )}
                  {profile?.country && <span>{profile.country}</span>}
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
            {auth?.type === "org" && (
              <button
                className={styles.analyticsIconBtn}
                onClick={() => setShowAnalytics(true)}
                title="View Analytics"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="20" x2="18" y2="10" />
                  <line x1="12" y1="20" x2="12" y2="4" />
                  <line x1="6" y1="20" x2="6" y2="14" />
                </svg>
                Analytics
              </button>
            )}
          </div>
        </>
      )}

      {/* ================= EDIT MODE ================= */}
      {mode === "edit" && (
        <>
          {/* Editable fields */}
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

            {/* Profile image upload */}
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

          {/* Social links section*/}
          {auth?.type === "org" && (
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
          )}

          {/* Location section*/}
          {auth?.type !== "org" && (
            <div className={styles.locationSection}>
              <h4>Location</h4>

              <div className={styles.locationGrid}>
                {/* Country */}
                <select
                  value={selectedCountry}
                  onChange={(e) => handleCountryChange(e.target.value)}
                >
                  <option value="">Select Country</option>
                  {countries.map((c) => (
                    <option key={c.identity} value={c.identity}>
                      {c.name}
                    </option>
                  ))}
                </select>

                {/* State */}
                <select
                  value={selectedState}
                  onChange={(e) => handleStateChange(e.target.value)}
                  disabled={!selectedCountry}
                >
                  <option value="">Select State</option>
                  {states.map((s) => (
                    <option key={s.identity} value={s.identity}>
                      {s.name}
                    </option>
                  ))}
                </select>

                {/* City */}
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  disabled={!selectedState}
                >
                  <option value="">Select City</option>
                  {cities.map((c) => (
                    <option key={c.identity} value={c.identity}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          <div className={styles.actions}>
            {/* Cancel edit */}
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

            {/* Save profile */}
            <button className={styles.editBtn} onClick={saveProfile}>
              Save Changes
            </button>
          </div>
        </>
      )}

      {/* ================= DANGER ZONE (DELETE ACCOUNT) ================= */}
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
            onClick={() => setShowDeleteModal(true)}
          >
            Delete
          </button>
        </div>
      </div>

      {/* Password reset confirmation modal */}
      <ConfirmModal
        open={showConfirmModal}
        title="Reset Password"
        description="Password reset link will be sent to your email."
        image="/images/logo.png"
        onCancel={() => setShowConfirmModal(false)}
        // onConfirm={() => router.push("/auth/forgot-password")}
        onConfirm={() => {
          saveEmail(form.email);
          router.push(`/auth/forgot-password?role=${auth?.type === "org" ? "organizer" : "user"}`);
        }}
      />

      {/* Delete confirmation modal */}
      <DeleteConfirmModal
        open={showDeleteModal}
        userEmail={form.email}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteAccount}
      />

      {/* Organizer Analytics slide-in panel */}
      {auth?.type === "org" && (
        <OrgAnalyticsPanel
          isOpen={showAnalytics}
          onClose={() => setShowAnalytics(false)}
          orgId={auth?.identity?.identity}
          orgName={form.name}
          avatarUrl={profile?.profileImage}
        />
      )}
    </div>
  );
}
