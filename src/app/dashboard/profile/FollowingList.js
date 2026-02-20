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

export default function FollowingList() {
  const { setLoading } = useLoading();
  const router = useRouter();
  const [following, setFollowing] = useState([]);

  useEffect(() => {
    async function loadFollowing() {
      try {
        setLoading(true);
        const res = await getFollowersFollowingApi();
        if (res?.status) {
          setFollowing(res.data.following || []);
        }
      } finally {
        setLoading(false);
      }
    }

    loadFollowing();
  }, []);

  const handleUnfollow = async (e, orgIdentity) => {
    e.stopPropagation();

    try {
      const res = await followOrganizerApi(orgIdentity);

      if (res?.status) {
        setFollowing((prev) =>
          prev.filter(
            (item) => item.followingOrg?.identity !== orgIdentity
          )
        );

        toast.success(res?.message || "Unfollowed successfully");
      } else {
        toast.error(res?.message || "Failed");
      }
    } catch {
      toast.error("Something went wrong");
    }
  };

  const handleCardClick = (org) => {
    if (!org?.slug) return;

    document.cookie = `orgIdentity=${org.identity}; path=/`;
    router.push(`/organization-details/${org.slug}`);
  };

  return (
    <div className={styles.wrapper}>
      <h2 className={styles.title}>Following</h2>

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
            const name = org?.name || "Unknown"; // ✅ FIXED
            const image = org?.profileImage;

            return (
              <div
                key={index}
                className={styles.card}
                onClick={() => handleCardClick(org)}
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
                      handleCardClick(org);
                    }}
                  >
                    View Profile
                  </span>

                  <h4 className={styles.name}>{name}</h4>

                  <div className={styles.bottomRow}>
                    <p className={styles.role}>Organization</p>

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
