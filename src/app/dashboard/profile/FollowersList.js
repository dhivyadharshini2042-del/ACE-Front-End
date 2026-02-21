"use client";

import { useEffect, useState } from "react";
import styles from "./FollowList.module.css";
import { getFollowersFollowingApi } from "../../../lib/api/organizer.api";
import { useLoading } from "../../../context/LoadingContext";
import EmptyState from "../../../components/global/EmptyState/EmptyState";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

/**
 * FollowersList Component
 * ------------------------
 * Displays the list of followers for the organizer.
 * Handles data fetching, navigation, and local removal.
 */
export default function FollowersList() {
  // Global loading state handler
  const { setLoading } = useLoading();
  // Next.js router instance
  const router = useRouter();
  // Followers state
  const [followers, setFollowers] = useState([]);

  /* ================= LOAD FOLLOWERS ================= */
  useEffect(() => {
    /**
     * Fetch followers when component mounts.
     * Updates state only if API response is successful.
     */
    async function loadFollowers() {
      try {
        // Start loader
        setLoading(true);
        const res = await getFollowersFollowingApi();

        if (res?.status) {
          setFollowers(res.data.followers || []);
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to load followers");
      } finally {
        // Stop loader
        setLoading(false);
      }
    }

    loadFollowers();
  }, []);

  /* ================= REMOVE FOLLOWER ================= */
  /**
   * Removes follower from UI state.
   * Stops propagation to prevent triggering card navigation.
   */
  const handleRemove = (e, followerIdentity) => {
    // Prevent card click event
    e.stopPropagation();

    // Filter out the removed follower
    setFollowers((prev) =>
      prev.filter(
        (item) => item.follower?.identity !== followerIdentity
      )
    );

    toast.success("Removed successfully");
  };

  /* ================= CARD CLICK ================= */
  /**
   * Navigates to selected follower's profile page.
   * Stores identity in cookie for downstream usage.
   */
  const handleCardClick = (user) => {
    // Guard clause
    if (!user?.slug) return;

    // Store selected identity
    document.cookie = `orgIdentity=${user.identity}; path=/`;

    // Navigate to organization details page
    router.push(`/organization-details/${user.slug}`);
  };

  return (
    <div className={styles.wrapper}>
      <h2 className={styles.title}>Followers</h2>

      {/* Show empty state if no followers */}
      {followers.length === 0 ? (
        <EmptyState
          img="/images/no-event-image.png"
          title="No followers yet"
          subtitle="Once users follow you, they will appear here"
        />
      ) : (
        <div className={styles.grid}>
          {followers.map((item, index) => {
            const user = item.follower;

            // Skip rendering if follower data is missing
            if (!user) return null;

            const name = user?.name || "Unknown";
            const image = user?.profileImage;

            return (
              <div
                key={index}
                className={styles.card}
                onClick={() => handleCardClick(user)}
                style={{ cursor: user?.slug ? "pointer" : "default" }}
              >
                {/* Avatar Section */}
                <div className={styles.avatarWrapper}>
                  {image ? (
                    <img src={image} alt="profile" />
                  ) : (
                    // Fallback to first character of name
                    <div className={styles.avatarFallback}>
                      {name.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>

                {/* Content Section */}
                <div className={styles.content}>
                  {/* Profile navigation shortcut */}
                  <span
                    className={styles.view}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCardClick(user);
                    }}
                  >
                    View Profile
                  </span>

                  {/* User name */}
                  <h4 className={styles.name}>{name}</h4>

                  <div className={styles.bottomRow}>
                    <p className={styles.role}>User</p>

                    {/* Remove follower button */}
                    <button
                      className={styles.actionBtn}
                      onClick={(e) =>
                        handleRemove(e, user.identity)
                      }
                    >
                      Remove
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
