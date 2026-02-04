"use client";

import styles from "./TopThreeBoard.module.css";
import { useRouter } from "next/navigation";

export default function TopThreeBoard() {
  const router = useRouter();
  return (
    <section className={styles.wrapper}>
      <div className={styles.ticket}>
        {/* LEFT SIDE */}
        <div className={styles.left}>
          <h3>
            Get Started <span>✨</span>
          </h3>

          <p>
            Join All College Event for free and experience the easiest way to
            explore, create, and manage events with your peers. Build meaningful
            connections, host exciting programs, and make your college community
            more active and engaged — all in one place.
          </p>

          <button
            className={styles.cta}
            onClick={() => router.push("/auth/organization/login")}
          >
            Become an Organizer
          </button>
        </div>

        {/* RIGHT SIDE */}
        <div className={styles.right}>
          <img src="/images/getstarted.png" alt="Get Started" />
        </div>
      </div>
    </section>
  );
}
