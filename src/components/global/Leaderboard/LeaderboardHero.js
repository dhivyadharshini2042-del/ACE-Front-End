"use client";

import { SEARCH_ICON } from "../../../const-value/config-icons/page";
import styles from "./LeaderboardHero.module.css";

export default function LeaderboardHero({ search, onSearchChange }) {
  return (
    <section className={styles.hero}>
      <p className={styles.topLine}>
        Follow Your Favourites For The Latest Buzz!
      </p>

      <h1 className={styles.heading}>
        <span className={styles.discover}>Discover</span>

        <span className={styles.avatarGroup}>
          <img src="/images/meetUpsCategories.png" alt="" />
          <img src="/images/culturaleventsCategories.png" alt="" />
          <img src="/images/concertsCategories.png" alt="" />
        </span>

        <span className={styles.amazing}>Amazing</span>
      </h1>

      <h2 className={styles.subHeading}>
        Event Organizers
        <div className={styles.subImg}>
          <img src="/images/sparkles.png" alt="no" />
        </div>
      </h2>

      {/* 🔥 SEARCH */}
      <div className={styles.searchWrapper}>
        <span className={styles.searchIcon}>{SEARCH_ICON}</span>
        <input
          type="text"
          placeholder="Search event organizers name"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      <h3 className={styles.boardTitle}>
        <span className={styles.boardimg}>
          <img src="/images/sparkles_s.png" alt="no" />
        </span>
        Star Organizers Board{" "}
      </h3>

      <p className={styles.boardSub}>
        Where brilliant organizers rise — your dedication builds the stage for
        every success!
      </p>
    </section>
  );
}
