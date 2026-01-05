"use client";
import styles from "./StandFor.module.css";

export default function StandFor() {
  return (
    <section className={styles.wrapper}>
      <h2 className={styles.heading}>
        What We <span>Stand For</span>
      </h2>

      <div className={styles.cards}>
        {/* Mission */}
        <div className={`${styles.card} ${styles.mission}`}>
          <div className={styles.icon}>🎯</div>
          <h3>Mission</h3>
          <p>
            To connect college students and event organizers through a unified
            platform that promotes collaboration and creativity.
          </p>
        </div>

        {/* Vision */}
        <div className={`${styles.card} ${styles.vision}`}>
          <div className={styles.icon}>👁️</div>
          <h3>Vision</h3>
          <p>
            To become the most trusted ecosystem for student events across
            academic, cultural, and technical institutions.
          </p>
        </div>

        {/* Value */}
        <div className={`${styles.card} ${styles.value}`}>
          <div className={styles.icon}>💎</div>
          <h3>Value</h3>
          <p>
            Transparency, inclusivity, and innovation in every experience we
            deliver.
          </p>
        </div>
      </div>
    </section>
  );
}
