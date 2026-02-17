"use client";

import { useEffect, useState } from "react";
import styles from "./OrganizerLeaderboardTable.module.css";
import { followOrganizerApi } from "../../../lib/api/organizer.api";
import toast from "react-hot-toast";

export default function OrganizerLeaderboardTable({ data = [] }) {
  const [localData, setLocalData] = useState([]);
  const [loadingId, setLoadingId] = useState(null);

  useEffect(() => {
    setLocalData(data);
  }, [data]);

  const handleFollow = async (orgIdentity) => {
    try {
      const res = await followOrganizerApi(orgIdentity);

      if (res?.status) {
        setLocalData((prev) =>
          prev.map((org) =>
            org.orgIdentity === orgIdentity
              ? {
                  ...org,
                  isFollowingOrg: res?.data?.followed, // ✅ correct field
                }
              : org,
          ),
        );

        toast.success(res?.message || "Updated successfully");
      } else {
        toast.error(res?.message || "Action failed");
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  console.log("localData", localData);

  return (
    <section className={styles.container}>
      {/* ✅ HEADER ROW */}
      <div className={`${styles.row} ${styles.headerRow}`}>
        <div className={styles.org}>
          <span className={styles.rankBadge}>#</span>
          <div className={styles.name}>Name</div>
        </div>

        <span className={styles.number}>Event Count</span>
        <span className={styles.number}>Rate</span>

        {/* Invisible button to maintain alignment */}
        <button className={styles.followBtn} style={{ visibility: "hidden" }}>
          Follow
        </button>
      </div>

      {/* ✅ DATA ROWS */}
      {localData.map((org, idx) => {
        const rank = idx + 1;

        return (
          <div
            key={org.orgIdentity}
            className={`${styles.row} ${styles[`bg${idx % 5}`]}`}
          >
            <div className={styles.org}>
              <span className={styles.rankBadge}>
                {rank === 1
                  ? "🥇"
                  : rank === 2
                    ? "🥈"
                    : rank === 3
                      ? "🥉"
                      : rank}
              </span>

              <div className={styles.avatarFallback}>
                {org.organizationName?.charAt(0)}
              </div>

              <div>
                <div className={styles.name}>{org.organizationName}</div>
                <div className={styles.rating}>⭐ 4.7</div>
              </div>
            </div>

            <span className={styles.number}>{org.eventCount ?? 0}</span>

            <span className={styles.number}>4.7</span>

            <button
              disabled={loadingId === org.orgIdentity}
              className={`${styles.followBtn} ${
                org.isFollowingOrg ? styles.following : ""
              }`}
              onClick={() => handleFollow(org.orgIdentity)}
            >
              {loadingId === org.orgIdentity
                ? "..."
                : org.isFollowingOrg
                  ? "Following"
                  : "Follow"}
            </button>
          </div>
        );
      })}
    </section>
  );
}
