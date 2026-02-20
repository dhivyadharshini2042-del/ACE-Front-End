"use client";

import { useEffect, useState } from "react";
import styles from "./OrganizerLeaderboardTable.module.css";
import { followOrganizerApi } from "../../../lib/api/organizer.api";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { getAuthFromSession, isUserLoggedIn } from "../../../lib/auth";

export default function OrganizerLeaderboardTable({ data = [] }) {
  const [localData, setLocalData] = useState([]);
  const [loadingId, setLoadingId] = useState(null);
  const [auth, setAuth] = useState(null);

  const router = useRouter();

  useEffect(() => {
    if (isUserLoggedIn()) {
      setAuth(getAuthFromSession());
    }
  }, []);

  useEffect(() => {
    setLocalData(data);
  }, [data]);

  const handleFollow = async (orgIdentity) => {
    if (!auth?.identity) {
      toast("Please login to follow this organizer", {
        icon: "⚠️",
      });
      return;
    }

    try {
      setLoadingId(orgIdentity);

      const res = await followOrganizerApi(orgIdentity);

      if (res?.status) {
        setLocalData((prev) =>
          prev.map((org) =>
            org.orgIdentity === orgIdentity
              ? {
                  ...org,
                  isFollowingOrg: res?.data?.followed,
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
    } finally {
      setLoadingId(null);
    }
  };

  const handleRowClick = (org) => {
    console.log("lllllllllllll", org);
    if (!org?.slug) return;

    router.push(`/organization-details/${org.slug}`);
  };

  console.log("localData", localData);

  return (
    <section className={styles.container}>
      <div className={`${styles.row} ${styles.headerRow}`}>
        <div className={styles.org}>
          <span className={styles.rankBadge}></span>
          <div className={styles.name}>Name</div>
        </div>

        <span className={styles.number}>Event Count</span>
        <span className={styles.number}>Rate</span>

        {/* Invisible button to maintain alignment */}
        <button className={styles.followBtn} style={{ visibility: "hidden" }}>
          Follow
        </button>
      </div>

      {localData.map((org, idx) => {
        const rank = idx + 1;

        return (
          <div
            key={org.orgIdentity}
            className={`${styles.row} ${styles[`bg${idx % 5}`]}`}
            onClick={() => handleRowClick(org)}
            style={{ cursor: "pointer" }}
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
              onClick={(e) => {
                e.stopPropagation();
                handleFollow(org.orgIdentity);
              }}
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
