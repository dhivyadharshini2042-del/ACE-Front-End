"use client";

/**
 * ProfileHeader
 *
 * Displays user or organization profile info at the top of the dashboard.
 * Features:
 * - Shows profile image, name, email, and social links
 * - Displays stats: events organized, followers/following, active status
 * - Handles both "user" and "org" roles
 * - Fetches profile data via API using session auth
 * - Supports tab highlighting and routing for followers/following/events
 * - Shows verified status for users and organizations
 */

import { useEffect, useRef, useState } from "react";
import styles from "./ProfileHeader.module.css";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import { getOrganizationProfileApi } from "../../../../lib/api/organizer.api";
import { getUserProfileApi } from "../../../../lib/api/user.api";
import { getAuthFromSession, isUserLoggedIn } from "../../../../lib/auth";
import { useLoading } from "../../../../context/LoadingContext";

import {
  FACEBOOKICON,
  INSTAGRAMICON,
  LINKEDINICON,
  TELEGRAMICON,
  WEBSITEICON,
  XICON,
  YOUTUBEICON,
} from "../../../../const-value/config-icons/page";

export default function ProfileHeader({ activeTab = "profile" }) {
  const router = useRouter();
  // const searchParams = useSearchParams();
  // const activeTab = searchParams.get("tab") || "profile";

  const fileRef = useRef(null);
  const { setLoading } = useLoading();

  // Session and profile state
  const [auth, setAuth] = useState(null);
  const [profile, setProfile] = useState(null);

  // Form-like state to hold displayable info
  const [form, setForm] = useState({
    name: "",
    email: "",
    socialLinks: {
      instagram: "",
      linkedin: "",
      x: "",
      website: "",
    },
  });

  /* ================= INIT PROFILE ================= */
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

  /* ================= Wait until profile is loaded ================= */
  if (!profile) {
    return null;
  }

  return (
    <div className={styles.card}>
      {/* ================= NAME ================= */}
      {form.name && <h2 className={styles.name}>{form.name}</h2>}

      {/* ================= TOP SECTION ================= */}
      <div className={styles.top}>
        {/* Profile Avatar */}
        <div className={styles.avatar}>
          {profile.profileImage ? (
            <img src={profile.profileImage} alt="profile" />
          ) : (
            <div className={styles.noImage}>{form.name?.charAt(0)}</div>
          )}
        </div>

        {/* Stats & Email */}
        <div className={styles.topRight}>
          <div className={styles.stats}>
            {/* Organization Category */}
            {auth?.type === "org" && profile.organizationCategory && (
              <div>
                <span>Organization Category</span>
                <b>{profile.organizationCategory}</b>
              </div>
            )}

            {/* EVENTS ORGANIZED */}
            <div
              style={{ cursor: "pointer" }}
              onClick={() => router.push("/dashboard/space/my-events")}
            >
              <span>Events Organized</span>
              <b>{profile.eventCount || 0}</b>
            </div>

            {/* Followers (Only Org) */}
            {auth?.type === "org" && (
              <div
                className={activeTab === "followers" ? styles.active : ""}
                onClick={() => router.push("/dashboard/profile?tab=followers")}
                style={{ cursor: "pointer" }}
              >
                <span>Followers</span>
                <b>
                  {profile.followersCount > 0
                    ? profile.followersCount
                    : "No Followers Yet"}
                </b>
              </div>
            )}

            {/* Following (Org + User) */}
            <div
              className={activeTab === "following" ? styles.active : ""}
              onClick={() => router.push("/dashboard/profile?tab=following")}
              style={{ cursor: "pointer" }}
            >
              <span>Following</span>
              <b>
                {profile.followingCount > 0
                  ? profile.followingCount
                  : auth?.type === "org"
                    ? "Not Following Anyone"
                    : "No Connections"}
              </b>
            </div>

            {/* Active Status (Only User) */}
            {auth?.type !== "org" && (
              <div className={styles.activeStatus}>
                <span>Status</span>
                <b>{profile.isActive ? "Active" : "Inactive"}</b>
              </div>
            )}
          </div>

          {/* Email & Verified */}
          <div className={styles.meta}>
            {form.email && <span>{form.email}</span>}
            {auth?.type !== "org" ? (
              <span className={styles.verified}>✔ Verified</span>
            ) : (
              profile.isVerified && (
                <span className={styles.verified}>✔ Verified</span>
              )
            )}
          </div>
        </div>
      </div>

      {/* ================= SOCIAL LINKS ================= */}
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

      <hr style={{ margin: "20px 0" }} />
    </div>
  );
}
