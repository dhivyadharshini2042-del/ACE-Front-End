"use client";

import styles from "./TopThreeBoard.module.css";

export default function TopThreeBoard() {
  return (
    <section className={styles.wrapper}>
      {/* 2nd */}
      <div className={`${styles.card} ${styles.second}`}>
        <img src="/images/trophy-silver.png" alt="2nd" />
        <h4>Noise and Grains</h4>
        <div className={styles.stars}>★★★★★</div>
        <p>Events created <b>1710</b></p>
        <p>User views <b>2508</b></p>
      </div>

      {/* 1st */}
      <div className={`${styles.card} ${styles.first}`}>
        <img src="/images/trophy-gold.png" alt="1st" />
        <h4>Swaram Academy</h4>
        <div className={styles.stars}>★★★★★</div>
        <p>Events created <b>1725</b></p>
        <p>User views <b>2517</b></p>
      </div>

      {/* 3rd */}
      <div className={`${styles.card} ${styles.third}`}>
        <img src="/images/trophy-bronze.png" alt="3rd" />
        <h4>Noise and Grains</h4>
        <div className={styles.stars}>★★★★★</div>
        <p>Events created <b>1700</b></p>
        <p>User views <b>2508</b></p>
      </div>
    </section>
  );
}
