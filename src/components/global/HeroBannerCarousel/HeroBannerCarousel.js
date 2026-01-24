"use client";

import { useEffect, useState, useRef } from "react";
import styles from "./HeroBannerCarousel.module.css";

export default function HeroBannerCarousel({ images = [], interval = 4500 }) {
  const n = images.length;
  const [centerIdx, setCenterIdx] = useState(0);
  const timerRef = useRef(null);

  useEffect(() => {
    if (!n) return;

    timerRef.current = setInterval(() => {
      setCenterIdx((prev) => (prev + 1) % n);
    }, interval);

    return () => clearInterval(timerRef.current);
  }, [n, interval]);

  const getPosClass = (imgIdx) => {
    if (n === 1) return styles.posCenter;

    const diff = (imgIdx - centerIdx + n) % n;

    if (diff === 0) return styles.posCenter;
    if (diff === 1) return styles.posRight;
    if (diff === 2) return styles.posRightFar;
    if (diff === 3) return styles.posRightXFar;

    if (diff === n - 1) return styles.posLeft;
    if (diff === n - 2) return styles.posLeftFar;
    if (diff === n - 3) return styles.posLeftXFar;

    return styles.posHidden;
  };

  return (
    <div className={styles.carouselRoot}>
      <div className={styles.cardsStage}>
        {images.map((src, idx) => (
          <div
            key={idx}
            className={`${styles.cardItem} ${getPosClass(idx)}`}
          >
            <img src={src} alt={`banner-${idx}`} draggable={false} />
          </div>
        ))}
      </div>
    </div>
  );
}
