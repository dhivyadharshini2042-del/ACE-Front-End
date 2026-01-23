"use client";

import styles from "./LeaderboardHero.module.css";

export default function LeaderboardHero() {
  return (
    <section className={styles.hero}>
      <p className={styles.topLine}>
        Follow Your Favourites For The Latest Buzz!
      </p>

      <h1 className={styles.heading}>
        <span className={styles.discover}>Discover</span>

        <span className={styles.avatarGroup}>
          <img src="/images/avatar1.jpg" alt="" />
          <img src="/images/avatar2.jpg" alt="" />
          <img src="/images/avatar3.jpg" alt="" />
        </span>

        <span className={styles.amazing}>Amazing</span>
      </h1>

      <h2 className={styles.subHeading}>
        Event Organizers
        <span className={styles.sparkle}><img src="/images/sparkles.png" alt="no"/></span>
      </h2>

      <div className={styles.searchWrapper}>
        {/* <img src="/images/Vector.png" alt="no"/> */}
        <span className={styles.searchIcon}>🔍</span>
        <input
          type="text"
          placeholder="Search event organizers name"
        />
      </div>

      <h3 className={styles.boardTitle}>
        Star Organizers Board <span><img src="/images/sparkles_s.png" alt="no"/></span>
      </h3>

      <p className={styles.boardSub}>
        Where brilliant organizers rise — your dedication builds the stage for every success!
      </p>
    </section>
  );
}
