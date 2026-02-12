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
          <span className={styles.pin}>📌</span>
          <h3>Mission</h3>
          <p>
            Our mission is to connect learners and organizers through a single
            platform that simplifies event discovery, participation, and
            collaboration.
          </p>
        </div>

        {/* Vision */}
        <div className={`${styles.card} ${styles.vision}`}>
          <span className={styles.pin}>📌</span>
          <h3>Vision</h3>
          <p>
            Our vision is to be the world’s most trusted platform for academic
            and professional event engagement.
          </p>
        </div>

        {/* Value */}
        <div className={`${styles.card} ${styles.value}`}>
          <span className={styles.pin}>📌</span>
          <h3>Value</h3>
          <p>
            Built on trust, accessibility, and innovation to empower learning
            and collaboration.
          </p>
        </div>
      </div>
    </section>
  );
}
