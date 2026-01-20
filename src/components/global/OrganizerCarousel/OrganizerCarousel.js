"use client";

import styles from "./OrganizerCarousel.module.css";
import { useRouter } from "next/navigation";
import { encodeId } from "../../../lib/utils/secureId";

export default function OrganizersCarousel({ onOpenLeaderboard, data = [] }) {
  const router = useRouter();

  if (!Array.isArray(data) || data.length === 0) return null;

  const handleOrgClick = (orgId) => {
    const encryptedId = encodeId(orgId);
    router.push(`/organization-details/${encryptedId}`);
  };

  return (
    <section className={styles.topOrganizersroot}>
      {/* Header */}
      <div className={styles.header}>
        <div>
          <h2 className={styles.title}>Our Top Organizers</h2>
          <p className={styles.sub}>
            Find the Organizations you're looking for quickly.
            <span className={styles.more}> You can see more.</span>
          </p>
        </div>

        <button className={styles.leaderboardBtn} onClick={onOpenLeaderboard}>
          View Leaderboard &gt;&gt;&gt;
        </button>
      </div>

      {/* Organizer Cards */}
      <div className={styles.row}>
        <div className={styles.list}>
          {data.map((org, index) => (
            <div
              key={org.identity || index}
              className={styles.card}
              onClick={() => handleOrgClick(org.identity)}
              style={{ cursor: "pointer" }}
            >
              <div className={styles.avatarWrap}>
                {org.profileImage ? (
                  <img
                    src={org.profileImage}
                    alt={org.organizationName}
                    className={styles.avatar}
                  />
                ) : (
                  <div className={styles.avatarFallback}>
                    {org.organizationName?.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>

              <div className={styles.name}>{org.organizationName}</div>
              <div className={styles.events}>
                {org._count.events || 0} events
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
