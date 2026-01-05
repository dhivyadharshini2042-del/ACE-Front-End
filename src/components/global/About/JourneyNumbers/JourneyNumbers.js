"use client";
import { useEffect, useRef, useState } from "react";
import styles from "./JourneyNumbers.module.css";

function Counter({ end, label, delay = 0 }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  // detect when visible
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

  // count animation
  useEffect(() => {
    if (!visible) return;

    let start = 0;
    const duration = 1500;
    const startTime = performance.now() + delay;

    function animate(time) {
      if (time < startTime) {
        requestAnimationFrame(animate);
        return;
      }

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

export default function JourneyNumbers() {
  return (
    <section className={styles.wrapper}>
      <h2 className={styles.heading}>
        Our Journey in <span>Numbers</span>
      </h2>

      <div className={styles.statsCard}>
        <Counter end={120} label="Event Organizers" />
        <Counter end={340} label="Events Conducted" delay={200} />
        <Counter end={45} label="Cities" delay={400} />
      </div>
    </section>
  );
}
