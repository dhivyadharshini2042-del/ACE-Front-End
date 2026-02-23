"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { getJourneyStats } from "../../../../lib/api/user.api";
import styles from "./JourneyNumbers.module.css";

// ─── Animated counter ─────────────────────────────────────────────────────────
function Counter({ end, label, delay = 0 }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.4 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!visible || !end) return;
    const duration = 1500;
    const startTime = performance.now() + delay;

    function animate(time) {
      if (time < startTime) { requestAnimationFrame(animate); return; }
      const progress = Math.min((time - startTime) / duration, 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) requestAnimationFrame(animate);
    }

    requestAnimationFrame(animate);
  }, [visible, end, delay]);

  return (
    <div ref={ref} className={`${styles.item} ${visible ? styles.show : ""}`}>
      <h3>{count}</h3>
      <p>{label}</p>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function JourneyNumbers() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    getJourneyStats()
      .then((res) => {
        // res.data matches: { users, orgs, events }
        setStats(res?.data ?? null);
      })
      .catch((err) => {
        console.error("Failed to fetch journey stats:", err);
        setError("Failed to load stats");
      });
  }, []);

  return (
    <section className={styles.wrapper}>
      <h2 className={styles.heading}>
        Our Journey in <span>Numbers</span>
      </h2>

      <div className={styles.statsCard}>
        <Image
          src="/images/our_journey-bgframe.png"
          alt=""
          fill
          className={styles.bgImage}
          aria-hidden="true"
        />

        {error ? (
          <p className={styles.error}>{error}</p>
        ) : (
          <>
            <Counter
              end={stats?.orgs?.total ?? 0}
              label="Event Organizers"
              delay={0}
            />
            <Counter
              end={stats?.events?.total ?? 0}
              label="Events Conducted"
              delay={200}
            />
            <Counter
              end={stats?.users?.total ?? 0}
              label="Users"
              delay={400}
            />
          </>
        )}
      </div>
    </section>
  );
}