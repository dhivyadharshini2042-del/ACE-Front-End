"use client";

import { useEffect, useState } from "react";
import styles from "./FollowList.module.css";
import {
  getFollowersFollowingApi,
  followOrganizerApi,
} from "../../../lib/api/organizer.api";
import { useLoading } from "../../../context/LoadingContext";
import EmptyState from "../../../components/global/EmptyState/EmptyState";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { TOAST_ERROR_MSG_SOMETHING_WENT_WRONG,TOAST_SUCCESS_UNFOLLOW, TOAST_ERROR_GENERIC } from "../../../const-value/config-message/page";

/**
 * FollowingList Component
 * ------------------------
 * Displays organizations the user is currently following.
 * Handles data retrieval, navigation, and unfollow actions.
 */
export default function FollowingList() {
  // Global loading state controller
  const { setLoading } = useLoading();
  // Next.js navigation
  const router = useRouter();
  // Following list state
  const [following, setFollowing] = useState([]);

  /* ================= LOAD FOLLOWING ================= */
  useEffect(() => {
    /**
     * Fetch following data on component mount.
     * Updates state if API call succeeds.
     */
    async function loadFollowing() {
      try {
        // Start loader
        setLoading(true);
        const res = await getFollowersFollowingApi();
        if (res?.status) {
          setFollowing(res.data.following || []);
        }
      } finally {
        // Stop loader
        setLoading(false);
      }
    }

    loadFollowing();
  }, []);

  /* ================= UNFOLLOW ORGANIZATION ================= */
  /**
   * Handles unfollow action.
   * Prevents card click propagation and updates UI on success.
   */
  const handleUnfollow = async (e, orgIdentity) => {
    // Prevent triggering card navigation
    e.stopPropagation();

    try {
      const res = await followOrganizerApi(orgIdentity);

      if (res?.status) {
        // Remove unfollowed organization from state
        setFollowing((prev) =>
          prev.filter(
            (item) => item.followingOrg?.identity !== orgIdentity
          )
        );

        toast.success(res?.message || TOAST_SUCCESS_UNFOLLOW);
      } else {
        toast.error(res?.message || TOAST_ERROR_GENERIC);
      }
    } catch {
      toast.error(TOAST_ERROR_MSG_SOMETHING_WENT_WRONG);
    }
  };

  /* ================= CARD CLICK ================= */
  /**
   * Navigates to selected organization profile.
   * Stores organization identity in cookie.
   */
  const handleCardClick = (org) => {
    // Guard clause for missing slug
    if (!org?.slug) return;

    document.cookie = `orgIdentity=${org.identity}; path=/`;
    router.push(`/organization-details/${org.slug}`);
  };

  return (
    <div className={styles.wrapper}>
      <h2 className={styles.title}>Following</h2>

      {/* Display empty state if no following data */}
      {following.length === 0 ? (
        <EmptyState
          img="/images/no-event-image.png"
          title="You are not following anyone yet"
          subtitle="Start following organizations to see them here"
        />
      ) : (
        <div className={styles.grid}>
          {following.map((item, index) => {
            const org = item.followingOrg;
            const name = org?.name || "Unknown"; 
            const image = org?.profileImage;

            return (
              <div
                key={index}
                className={styles.card}
                onClick={() => handleCardClick(org)}
              >
                {/* Avatar Section */}
                <div className={styles.avatarWrapper}>
                  {image ? (
                    <img src={image} alt="profile" />
                  ) : (
                    // Fallback to first letter of organization name
                    <div className={styles.avatarFallback}>
                      {name.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>

                {/* Content Section */}
                <div className={styles.content}>
                  {/* Direct profile navigation link */}
                  <span
                    className={styles.view}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCardClick(org);
                    }}
                  >
                    View Profile
                  </span>

                  {/* Organization name */}
                  <h4 className={styles.name}>{name}</h4>

                  <div className={styles.bottomRow}>
                    <p className={styles.role}>Organization</p>

                    {/* Unfollow button */}
                    <button
                      className={styles.actionBtn}
                      onClick={(e) =>
                        handleUnfollow(e, org.identity)
                      }
                    >
                      Unfollow
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
