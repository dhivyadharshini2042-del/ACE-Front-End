"use client";

import styles from "./OrganizerCarousel.module.css";
import { useRouter } from "next/navigation";
import { useLoading } from "../../../context/LoadingContext";

export default function OrganizersCarousel({ data = [] }) {
  const router = useRouter();
  const { setLoading } = useLoading();

  if (!Array.isArray(data) || data.length === 0) return null;

  /* ================= ORGANIZER CLICK ================= */
  const handleOrgClick = (slug) => {
    if (!slug) return;

    try {
      setLoading(true);
      router.push(`/organization-details/${slug}`);
    } catch (error) {
      console.error("Navigation failed", error);
      setLoading(false);
    }
  };

  /* ================= LEADERBOARD CLICK ================= */
  const handleLeaderboardClick = () => {
    try {
      setLoading(true);
      router.push("/leaderboard");
    } catch (error) {
      console.error("Leaderboard navigation failed", error);
      setLoading(false);
    }
  };

  return (
    <section className={styles.topOrganizersroot}>
      {/* HEADER */}
      <div className={styles.header}>
        <div>
          <h2 className={styles.title}>Our Top Organizers</h2>
          <p className={styles.sub}>
            Find the Organizations you're looking for quickly.
            <span className={styles.more}> You can see more.</span>
          </p>
        </div>

        {/*ROUTE TO LEADERBOARD PAGE */}
        <button
          className={styles.leaderboardBtn}
          onClick={handleLeaderboardClick}
        >
          View Leaderboard &gt;&gt;&gt;
        </button>
      </div>

      {/* ORGANIZER CARDS */}
      <div className={styles.row}>
        <div className={styles.list}>
          {data.map((org, index) => (
            <div
              key={org.identity || index}
              className={styles.card}
              onClick={() => handleOrgClick(org.slug)}
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

              <div className={styles.name}>
                {org.organizationName}
              </div>

              <div className={styles.events}>
                {org._count?.events || 0} events
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
