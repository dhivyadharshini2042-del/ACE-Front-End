"use client";

import styles from "./AppLandingHero.module.css";

export default function AppLandingHero() {
  return (
    <section className={styles.root}>
      {/* FULL IMAGE DESIGN */}
      <img
        src="/images/appimg.png"
        alt="App Landing"
        className={styles.bgImage}
      />

      {/* CLICKABLE TITLE */}
      <div>
        <a href="#" className={styles.title}>
          <span>Everything</span> you need to plan and <br />
          manage events in <span>One App!</span>
        </a>
        <div className={styles.subtitle}>
          Download Now! <span>Available On</span>
        </div>
      </div>

      {/* STORE BUTTONS */}

      <div className={styles.stores}>
        <div className="d-flex align-items-center gap-3 fw-bold text-dark">
          <a
            href="https://play.google.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src="/images/app-play.png" alt="Play Store" />
          </a>
          <div>Play Store</div>
        </div>
        <div className="d-flex align-items-center gap-3 fw-bold text-dark">
          <a
            href="https://www.apple.com/app-store/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src="/images/apps-img.png" alt="App Store" />
          </a>
          <div>App Store</div>
        </div>
      </div>
    </section>
  );
}
