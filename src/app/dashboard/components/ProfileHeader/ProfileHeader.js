"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./ProfileHeader.module.css";

// GLOBAL LOADING
import { useLoading } from "../../../../context/LoadingContext";

// API
import { getOrganizationProfileApi } from "../../../../lib/api/organizer.api";
import { getUserProfileApi } from "../../../../lib/api/user.api";

// AUTH
import { getAuthFromSession, isUserLoggedIn } from "../../../../lib/auth";

export default function ProfileHeader() {
  const router = useRouter();
  const { setLoading } = useLoading();

  const [profile, setProfile] = useState(null);

  /* ================= LOAD PROFILE ================= */
  const loadProfile = async () => {
    try {

      if (!isUserLoggedIn()) {
        console.log("User not logged in");
        return;
      }

      const auth = getAuthFromSession();

      if (!auth?.identity || !auth?.type) {
        console.log(" Invalid auth data");
        return;
      }

      setLoading(true);

      let res;
      if (auth.type === "org") {
        res = await getOrganizationProfileApi(auth.identity);
      } else {
        res = await getUserProfileApi(auth.identity);
      }


      if (res?.status && res.data) {
        setProfile(res.data);
      }
    } catch (err) {
      console.error("ProfileHeader error:", err);
    } finally {
      setLoading(false);
    }
  };

  /* ================= EFFECT ================= */
  useEffect(() => {
    loadProfile();

    const onFocus = () => loadProfile();
    window.addEventListener("focus", onFocus);

    return () => {
      window.removeEventListener("focus", onFocus);
    };
  }, []);

  /* ================= IMPORTANT GUARD ================= */
  if (!profile) {
    console.log("Profile not loaded yet:", profile);
    return null; 
  }

  /* ================= SAFE ACCESS ================= */

  const displayName =
    profile.organizationName || profile.name || "User";

  const firstLetter = displayName.charAt(0).toUpperCase();

  const followersCount = profile.followersCount || 0;
  const followingCount = profile.followingCount || 0;
  const rank = profile.rank || 0;

  /* ================= UI ================= */
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
          <h2 className={styles.name}>{displayName}</h2>

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

          <div className={styles.rank}>#{rank} Rank</div>
        </div>
      </div>
    </div>
  );
}
