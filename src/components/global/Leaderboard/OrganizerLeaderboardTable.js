"use client";

import styles from "./OrganizerLeaderboardTable.module.css";

export default function OrganizerLeaderboardTable({ data = [] }) {
  return (
    <section className={styles.container}>
      <h3>List of Top Organizers</h3>
      <p>You don’t just host events; you shape experiences.</p>

      {data.length === 0 && (
        <p style={{ textAlign: "center", marginTop: 30 }}>
          No organizers found
        </p>
      )}

      {data.map((org) => (
        <div key={org.identity} className={styles.row}>
          <span>{org.organizationName}</span>
          <span>{org.totalEvents}</span>
          <span>{org.totalViews}</span>
          <span className={styles.rank}>{org.rank}</span>
        </div>
      ))}
    </section>
  );
}
