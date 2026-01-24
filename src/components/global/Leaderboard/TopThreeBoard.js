"use client";

import styles from "./TopThreeBoard.module.css";

export default function TopThreeBoard({ data = [] }) {
  if (!Array.isArray(data) || data.length === 0) return null;

  const sorted = [...data].sort((a, b) => a.rank - b.rank);

  const first = sorted.find((o) => o.rank === 1);
  const second = sorted.find((o) => o.rank === 2);
  const third = sorted.find((o) => o.rank === 3);

  const getEventsCount = (org) => org?.eventCount ?? org?._count?.events ?? 0;

  const Avatar = ({ org }) => {
    if (org?.profileImage) {
      return (
        <img
          src={org.profileImage}
          alt={org.organizationName}
          className={styles.avatarImg}
        />
      );
    }

    return (
      <div className={styles.avatarFallbackSection}>
        <div className={styles.avatarFallback}>
          {org?.organizationName?.charAt(0).toUpperCase()}
        </div>
      </div>
    );
  };

  return (
    <section className={styles.wrapper}>
      {/* 🥈 SECOND */}
      {second && (
        <div className={`${styles.card} ${styles.second}`}>
          <Avatar org={second} />
          <h4 className="text-uppercase">{second.organizationName}</h4>
          <div className={styles.stars}>★★★★★</div>
          <p>
            Events created <b>{getEventsCount(second)}</b>
          </p>
          <p>
            Rank <b>#{second.rank}</b>
          </p>
        </div>
      )}

      {/* 🥇 FIRST */}
      {first && (
        <div className={`${styles.card} ${styles.first}`}>
          <Avatar org={first} />
          <h4 className="text-uppercase">{first.organizationName}</h4>
          <div className={styles.stars}>★★★★★</div>
          <p>
            Events created <b>{getEventsCount(first)}</b>
          </p>
          <p>
            Rank <b>#{first.rank}</b>
          </p>
        </div>
      )}

      {/* 🥉 THIRD */}
      {third && (
        <div className={`${styles.card} ${styles.third}`}>
          <Avatar org={third} />
          <h4 className="text-uppercase">{third.organizationName}</h4>
          <div className={styles.stars}>★★★★★</div>
          <p>
            Events created <b>{getEventsCount(third)}</b>
          </p>
          <p>
            Rank <b>#{third.rank}</b>
          </p>
        </div>
      )}
    </section>
  );
}
