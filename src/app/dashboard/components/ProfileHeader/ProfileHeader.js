"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./ProfileHeader.module.css";

// USER API
import { getOrganizationProfileApi } from "../../../../lib/api/organizer.api";
import { getUserProfileApi } from "../../../../lib/api/user.api";
import { getUserData } from "../../../../lib/auth";
import { useLoading } from "../../../../context/LoadingContext";

export default function ProfileHeader() {
  const router = useRouter();

  // profile default-aa empty object
  const [profile, setProfile] = useState({});
  const [loading, setLoading] = useState(true);

  const { setLoading: setGlobalLoading } = useLoading();

  /* ================= LOAD PROFILE ================= */
  useEffect(() => {
    async function loadProfile() {
      setGlobalLoading(true);

      try {
        const user = getUserData();
        if (!user?.identity) return;

        const role =
          user.role || (user.type === "org" ? "organizer" : "user");

        let res;
        if (role === "organizer") {
          res = await getOrganizationProfileApi(user.identity);
        } else {
          res = await getUserProfileApi(user.identity);
        }

        if (res?.status && res.data) {
          setProfile(res.data); // real data replace
        }
      } catch (err) {
        console.error("ProfileHeader error:", err);
      } finally {
        setLoading(false);
        setGlobalLoading(false);
      }
    }

    loadProfile();
  }, [setGlobalLoading]);

  /* ================= SAFE FALLBACK VALUES ================= */

  const displayName =
    profile.organizationName ||
    profile.name ||
    "User";

  const firstLetter = displayName.charAt(0).toUpperCase();

  const followersCount = profile.followersCount || 0;
  const followingCount = profile.followingCount || 0;
  const rank = profile.rank || 0;

  /* ================= UI (UNCHANGED) ================= */

  return (
    <div className={styles.wrapper}>
      {/* COVER */}
      <div className={styles.cover} />

      {/* CONTENT */}
      <div className={styles.content}>
        {/* AVATAR */}
        {profile.profileImage ? (
          <img
            src={profile.profileImage}
            alt="profile"
            className={styles.avatar}
          />
        ) : (
          <div className={styles.avatarFallback}>
            {firstLetter}
          </div>
        )}

        {/* INFO */}
        <div className={styles.info}>
          <h2 className={styles.name}>
            {displayName}
            <span className={styles.role}>
              ({profile.domainEmail ? "Organization" : "User"})
            </span>
          </h2>

          <div className={styles.followInfo}>
            <span
              onClick={() =>
                router.push("/dashboard/profile/followers")
              }
            >
              {followersCount} Followers
            </span>

            <span
              onClick={() =>
                router.push("/dashboard/profile/following")
              }
            >
              {followingCount} Following
            </span>
          </div>

          <div className={styles.rank}>
            #{rank} Rank
          </div>
        </div>
      </div>
    </div>
  );
}
