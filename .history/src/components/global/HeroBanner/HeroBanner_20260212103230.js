"use client";

import styles from "./HeroBanner.module.css";

export default function HeroBanner({ text }) {
  const words = text.split(" ");

  return (
    <>
      <h1 className={`${styles.title} ${styles.center}`}>
        {words.map((word, i) => (
          <span
            key={i}
            className={styles.word}
            style={{ animationDelay: `${i * 0.35}s` }}
          >
            {word}&nbsp;
          </span>
        ))}
      </h1>

      <p className={styles.subtitle}>
        Discover Events that Match your Vibe — Anytime, Anywhere.
      </p>
    </>
  );
}
