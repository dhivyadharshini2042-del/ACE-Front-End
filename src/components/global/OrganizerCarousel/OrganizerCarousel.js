"use client";

import styles from "./OrganizerCarousel.module.css";
import { useRouter } from "next/navigation";
import { useLoading } from "../../../context/LoadingContext";

export default function OrganizersCarousel({ data = [] }) {
  const router = useRouter();
  const { setLoading } = useLoading();

  if (!Array.isArray(data) || data.length === 0) return null;

  const handleOrgClick = (slug) => {
    if (!slug) return;
    setLoading(true);
    router.push(`/organization-details/${slug}`);
  };

  const handleLeaderboardClick = () => {
    setLoading(true);
    router.push("/leaderboard");
  };

  return (
    <section className={styles.root}>
      {/* HEADER */}
      <div className={styles.header}>
        <div>
          <h2 className={styles.title}>Our Top Organizers</h2>
          <p className={styles.sub}>
            Find the Organizations you're looking for quickly.
            <span className={styles.more} onClick={handleLeaderboardClick}> You can see more.</span>
          </p>
        </div>

        <button
          className={styles.seeAllBtn}
          onClick={handleLeaderboardClick}
        >
          See all
        </button>
      </div>

      {/* CARD GRID */}
      <div className={styles.list}>
        {data.slice(0, 5).map((org, index) => (
          <div
            key={org.identity || index}
            className={styles.card}
            onClick={() => handleOrgClick(org.slug)}
          >
            <div className={styles.cardContent}>
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

              <div className={styles.name}>
                {org.organizationName}
              </div>

              <div className={styles.events}>
                {org._count?.events || 0} Events
              </div>
            </div>

            <button className={styles.followBtn}>Follow</button>
          </div>
        ))}
      </div>
    </section>
  );
}