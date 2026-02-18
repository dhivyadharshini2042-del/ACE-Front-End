"use client";

import { useEffect, useState } from "react";
import styles from "./FollowList.module.css";
import { getFollowersFollowingApi } from "../../../lib/api/organizer.api";
import { useLoading } from "../../../context/LoadingContext";
import EmptyState from "../../../components/global/EmptyState/EmptyState";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function FollowersList() {
  const { setLoading } = useLoading();
  const router = useRouter();
  const [followers, setFollowers] = useState([]);

  /* ================= LOAD FOLLOWERS ================= */
  useEffect(() => {
    async function loadFollowers() {
      try {
        setLoading(true);
        const res = await getFollowersFollowingApi();

        if (res?.status) {
          setFollowers(res.data.followers || []);
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to load followers");
      } finally {
        setLoading(false);
      }
    }

    loadFollowers();
  }, []);

  /* ================= REMOVE FOLLOWER ================= */
  const handleRemove = (e, followerIdentity) => {
    e.stopPropagation();

    setFollowers((prev) =>
      prev.filter(
        (item) => item.follower?.identity !== followerIdentity
      )
    );

    toast.success("Removed successfully");
  };

  /* ================= CARD CLICK ================= */
  const handleCardClick = (user) => {
    if (!user?.slug) return;

    document.cookie = `orgIdentity=${user.identity}; path=/`;
    router.push(`/organization-details/${user.slug}`);
  };

  return (
    <div className={styles.wrapper}>
      <h2 className={styles.title}>Followers</h2>

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
                <div className={styles.avatarWrapper}>
                  {image ? (
                    <img src={image} alt="profile" />
                  ) : (
                    <div className={styles.avatarFallback}>
                      {name.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>

                <div className={styles.content}>
                  <span
                    className={styles.view}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCardClick(user);
                    }}
                  >
                    View Profile
                  </span>

                  <h4 className={styles.name}>{name}</h4>

                  <div className={styles.bottomRow}>
                    <p className={styles.role}>User</p>

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
