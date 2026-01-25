"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import styles from "./ProfileHeader.module.css";

// GLOBAL LOADING
import { useLoading } from "../../../../context/LoadingContext";

// API
import { getOrganizationProfileApi } from "../../../../lib/api/organizer.api";
import { getUserProfileApi } from "../../../../lib/api/user.api";

// JWT FALLBACK
import { getAuthFromToken } from "../../../../lib/auth";

export default function ProfileHeader() {
  const router = useRouter();
  const { setLoading } = useLoading();
  const [profile, setProfile] = useState({});

  // REDUX (may be empty)
  const reduxAuth = useSelector((state) => state.auth);

  /* ================= LOAD PROFILE ================= */
  useEffect(() => {
    async function loadProfile() {
      try {
        // 1️⃣ Try redux first
        let identity =
          reduxAuth?.role === "organizer"
            ? reduxAuth?.organizer?.identity
            : reduxAuth?.user?.identity;

        let role = reduxAuth?.role;
        let isLoggedIn = reduxAuth?.isLoggedIn;

        // 2️⃣ Fallback to JWT
        if (!identity || !role || !isLoggedIn) {
          const tokenAuth = getAuthFromToken();
          if (!tokenAuth) return;

          identity = tokenAuth.identity;
          role = tokenAuth.role;
          isLoggedIn = tokenAuth.isLoggedIn;
        }

        if (!identity || !isLoggedIn) return;

        setLoading(true);

        let res;
        if (role === "organizer") {
          res = await getOrganizationProfileApi(identity);
        } else {
          res = await getUserProfileApi(identity);
        }

        if (res?.status && res.data) {
          setProfile(res.data);
        }
      } catch (err) {
        console.error("ProfileHeader error:", err);
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, [reduxAuth?.isLoggedIn, reduxAuth?.role]);

  /* ================= UI SAFE FALLBACKS ================= */
  const displayName =
    profile.organizationName || profile.name || "User";
  const firstLetter = displayName.charAt(0).toUpperCase();

  const followersCount = profile.followersCount || 0;
  const followingCount = profile.followingCount || 0;
  const rank = profile.rank || 0;

  return (
    <div className={styles.wrapper}>
      <div className={styles.cover} />

      <div className={styles.content}>
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

        <div className={styles.info}>
          <h2 className={styles.name}>
            {displayName}
            <span className={styles.role}>
              ({profile.type === "org" ? "Organization" : "User"})
            </span>
          </h2>

          <div className={styles.followInfo}>
            <span onClick={() => router.push("/dashboard/profile/followers")}>
              {followersCount} Followers
            </span>
            <span onClick={() => router.push("/dashboard/profile/following")}>
              {followingCount} Following
            </span>
          </div>

          <div className={styles.rank}>#{rank} Rank</div>
        </div>
      </div>
    </div>
  );
}
