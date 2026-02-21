"use client";

import styles from "./AppLandingHero.module.css";

export default function AppLandingHero() {
  return (
    <section className={styles.root}>
      {/* Background Image */}
      <img
        src="/images/appimg.png"
        alt="App Landing"
        className={styles.bgImage}
      />

      {/* Content Wrapper */}
      <div className={styles.content}>
        <a href="#" className={styles.title}>
          <span>Everything</span> you need to plan and <br />
          manage events in <span>One App!</span>
        </a>

        <div className={styles.subtitle}>
          Download Now! <span>Available On</span>
        </div>

        <div className={styles.stores}>
          <a
            href="https://play.google.com/store/apps/details?id=com.all_college_event"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.storeItem}
          >
            <img src="/images/app-play.png" alt="Play Store" />

            <div className={styles.storeText}>
              <span className={styles.smallText}>Get It On</span>
              <span className={styles.bigText}>Google Play</span>
            </div>
          </a>

          {/* <a
            href="https://www.apple.com/app-store/"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.storeItem}
          >
            <img src="/images/apps-img.png" alt="App Store" />
            <span>App Store</span>
          </a> */}
        </div>
      </div>
    </section>
  );
}
