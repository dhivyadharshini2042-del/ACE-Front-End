"use client";

import { useEffect, useState } from "react";
import styles from "./FollowList.module.css";
import { getFollowersFollowingApi } from "../../../lib/api/organizer.api";
import { useLoading } from "../../../context/LoadingContext";
import EmptyState from "../../../components/global/EmptyState/EmptyState";

export default function FollowersList() {
  const { setLoading } = useLoading();
  const [followers, setFollowers] = useState([]);

  useEffect(() => {
    async function loadFollowers() {
      try {
        setLoading(true);
        const res = await getFollowersFollowingApi();

        if (res?.status) {
          setFollowers(res.data.followers || []);
        }
      } finally {
        setLoading(false);
      }
    }

    loadFollowers();
  }, []);

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
            const name = item.follower?.name || "Unknown";
            const image = item.follower?.profileImage;
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
                    <button className={styles.actionBtn}>Remove</button>
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
