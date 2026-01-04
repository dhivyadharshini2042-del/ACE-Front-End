"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./ProfileHeader.module.css";

// USER API
import { getOrganizationProfileApi } from "../../../../lib/api/organizer.api";
import { getUserProfileApi } from "../../../../lib/api/user.api";
import { getUserData } from "../../../../lib/auth";
import { useLoading } from "../../../../context/LoadingContext";

// ORGANIZER API

export default function ProfileHeader() {
  const router = useRouter();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true); 

  const { setLoading: setGlobalLoading } = useLoading(); 

  /* ================= LOAD PROFILE ================= */
  useEffect(() => {
    async function loadProfile() {
      setGlobalLoading(true); 

      try {
        const user = getUserData();
        if (!user?.identity) return;

        // ROLE DETECTION
        const role =
          user.role || (user.type === "org" ? "organizer" : "user");

        let res;

        if (role === "organizer") {
          res = await getOrganizationProfileApi(user.identity);
        } else {
          res = await getUserProfileApi(user.identity);
        }

        if (res?.status) {
          setProfile(res.data);
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

  if (loading || !profile) return null;

  /* ================= FALLBACK LETTER ================= */
  const displayName =
    profile.organizationName || profile.name || "User";

  const firstLetter = displayName.charAt(0).toUpperCase();

  console.log("profile",profile)

  return (
    <div className={styles.wrapper}>
      {/* COVER */}
      <div
        className={styles.cover}
      />

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
              {profile.followersCount || 0} Followers
            </span>

            <span
              onClick={() =>
                router.push("/dashboard/profile/following")
              }
            >
              {profile.followingCount || 0} Following
            </span>
          </div>

          <div className={styles.rank}>
            #{profile.rank || 0} Rank
          </div>
        </div>
      </div>
    </div>
  );
}
