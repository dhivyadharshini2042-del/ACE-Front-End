"use client";

import styles from "./OrganizerLeaderboardTable.module.css";

export default function OrganizerLeaderboardTable({ data = [] }) {
  return (
    <section className={styles.container}>

      {data.map((org, idx) => {
        const rank = idx + 1;

        return (
          <div
            key={org.identity}
            className={`${styles.row} ${styles[`bg${idx % 5}`]}`}
          >
            <div className={styles.org}>
              <span className={styles.rankBadge}>
                {rank === 1 ? "🥇" : rank === 2 ? "🥈" : rank === 3 ? "🥉" : rank}
              </span>

              {org.profileImage ? (
                <img src={org.profileImage} className={styles.avatar} />
              ) : (
                <div className={styles.avatarFallback}>
                  {org.organizationName?.charAt(0)}
                </div>
              )}

              <div>
                <div className={styles.name}>{org.organizationName}</div>
                <div className={styles.rating}>⭐ 4.7</div>
              </div>
            </div>

            <span className={styles.number}>
              {org.eventCount ?? 0}
            </span>

            <span className={styles.number}>4.7</span>

            <button className={styles.followBtn}>Follow</button>
          </div>
        );
      })}
    </section>
  );
}