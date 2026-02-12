"use client";

import { SEARCH_ICON } from "../../../const-value/config-icons/page";
import styles from "./LeaderboardHero.module.css";

export default function LeaderboardHero({
  search,
  onSearchChange,
  rankingType,
  onRankingChange,
}) {
  return (
    <section className={styles.hero}>
      <p className={styles.topLine}>
        Follow Your Favourites For The Latest Buzz!
      </p>

      <h1 className={styles.heading}>
        <span className={styles.discover}>Discover</span>

        <span className={styles.avatarGroup}>
          <img src="/images/meetUpsCategories.png" />
          <img src="/images/culturaleventsCategories.png" />
          <img src="/images/concertsCategories.png" />
        </span>

        <span className={styles.amazing}>Amazing</span>
      </h1>

      <h2 className={styles.subHeading}>
        Event Organizers
        <span className={styles.subImg}>
          <img src="/images/sparkles.png" />
        </span>
      </h2>

      <div className={styles.searchWrapper}>
        <span className={styles.searchIcon}>{SEARCH_ICON}</span>
        <input
          placeholder="Search event organizers name"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      <div className={styles.toggleWrap}>
        <button
          className={`${styles.toggleBtn} ${
            rankingType === "monthly" ? styles.active : ""
          }`}
          onClick={() => onRankingChange("monthly")}
        >
          Monthly Ranking
        </button>

        <button
          className={`${styles.toggleBtn} ${
            rankingType === "overall" ? styles.active : ""
          }`}
          onClick={() => onRankingChange("overall")}
        >
          Overall Ranking
        </button>
      </div>
    </section>
  );
}