"use client";

import styles from "./OrganizerLeaderboardTable.module.css";

const DATA = [
  { name: "Coimbatore Chetti Club", events: 25, views: 1900, rank: 4 },
  { name: "Ticket9", events: 24, views: 1900, rank: 5 },
  { name: "SNS College of Engineering", events: 24, views: 1900, rank: 6 },
  { name: "Media Mesons", events: 25, views: 1900, rank: 7 },
  { name: "Sri Krishna College", events: 25, views: 1900, rank: 8 },
];

export default function OrganizerLeaderboardTable() {
  return (
    <section className={styles.container}>
      <h3>List of Top Organizers</h3>
      <p>You don’t just host events; you shape experiences.</p>

      {DATA.map((o) => (
        <div key={o.rank} className={styles.row}>
          <span>{o.name}</span>
          <span>{o.events}</span>
          <span>{o.views}</span>
          <span className={styles.rank}>{o.rank}</span>
        </div>
      ))}
    </section>
  );
}
