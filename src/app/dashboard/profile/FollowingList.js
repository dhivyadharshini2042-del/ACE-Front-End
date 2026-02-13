"use client";

import { useEffect, useState } from "react";
import styles from "./FollowList.module.css";
import { getFollowersFollowingApi } from "../../../lib/api/organizer.api";
import { useLoading } from "../../../context/LoadingContext";

export default function FollowingList() {
  const { setLoading } = useLoading();
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

  return (
    <div className={styles.wrapper}>
      <h2 className={styles.title}>Following</h2>

      <div className={styles.grid}>
        {following.map((item, index) => {
          const name = item.followingOrg?.name || "Unknown";
          const image = item.followingOrg?.profileImage;
          const type = item.followerType === "USER" ? "User" : "Organization";

          return (
            <div key={index} className={styles.card}>
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
                <span className={styles.view}>View Profile</span>

                <h4 className={styles.name}>{name}</h4>
                <div className={styles.bottomRow}>
                  <p className={styles.role}>{type}</p>

                  <button className={styles.actionBtn}>Unfollow</button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
