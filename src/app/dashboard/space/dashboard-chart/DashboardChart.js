"use client";

import { useMemo, useState } from "react";
import { DATEICON } from "../../../../const-value/config-icons/page";
import styles from "./DashboardChart.module.css";
import { FaArrowLeft, FaMousePointer, FaEye, FaHeart } from "react-icons/fa";

export default function DashboardChart({ event, onBack }) {
  const [selected, setSelected] = useState("Click");
  const CURVE_TEMPLATE = [18, 20, 22, 19, 16, 16, 19, 22, 18, 19];

  console.log("88888888888", event);
  const stats = {
    click: event.viewCount ?? 0,
    view: event.viewCount ?? 0,
    like: event.likeCount ?? 0,
  };

  const chartData = useMemo(() => {
    const total =
      selected === "Click"
        ? stats.click
        : selected === "Views"
          ? stats.view
          : stats.like;

    // Small numbers → flat but correct line
    if (total < 20) {
      return Array(10).fill(total / 4);
    }

    // Normal flow for big numbers
    const CURVE_TEMPLATE = [18, 20, 22, 19, 16, 16, 19, 22, 18, 19];
    const baseSum = CURVE_TEMPLATE.reduce((a, b) => a + b, 0);

    return CURVE_TEMPLATE.map((v) => Math.round((v / baseSum) * total));
  }, [selected, stats]);

  const generatePath = (data) => {
    const stepX = 100 / (data.length - 1);

    let d = `M0,${40 - data[0] / 2}`;
    data.forEach((val, i) => {
      const x = i * stepX;
      const y = 40 - val / 2;
      d += ` L${x},${y}`;
    });

    return `${d} L100,40 L0,40 Z`;
  };

  const maxY = Math.max(...chartData, 10);

  return (
    <div className={styles.wrapper}>
      {/* HEADER */}
      <div className={styles.header}>
        <div className={styles.left}>
          <button className={styles.backBtn} onClick={onBack}>
            <FaArrowLeft />
          </button>
          <h2>{event.title}</h2>
        </div>

        <button className={styles.previewBtn}>Preview Event</button>
      </div>

      {/* STATS */}
      <div className={styles.cards}>
        <div className={`${styles.card} ${styles.click}`}>
          <div className={styles.cardTop}>
           <img src="/images/mouse-pointer.png" alt="no image" />
            <h3>Total Clicks</h3>
            <img src="/images/trending_arrow.png" alt="no image" />
          </div>
          <p>Since Last Week</p>
          <h3>{stats.view}</h3>
        </div>

        <div className={`${styles.card} ${styles.view}`}>
          <div className={styles.cardTop}>
            <img src="/images/eye.png" alt="no image" />
            <h3>Total Views</h3>
             <img src="/images/trending_arrow.png" alt="no image" />
          </div>
          <p>Since Last Week</p>
          <h3>{stats.view}</h3>
        </div>

        <div className={`${styles.card} ${styles.like}`}>
          <div className={styles.cardTop}>
            <img src="/images/mdi_heart.png" alt="no image" />
            <h3>Total Likes</h3>
             <img src="/images/trending_arrow.png" alt="no image" />
          </div>
          <p>Since Last Week</p>
          <h3>{stats.like}</h3>
        </div>
      </div>

      {/* CHART */}
      <div className={styles.chartBox}>
        <div className={styles.chartTop}>
          <div className={styles.selectBox}>
            <span>Select</span>
            <select
              value={selected}
              onChange={(e) => setSelected(e.target.value)}
            >
              <option>Click</option>
              <option>Views</option>
              <option>Likes</option>
            </select>
          </div>
          <div className={styles.calendar}>{DATEICON}</div>
        </div>

        <div className={styles.chartArea}>
          {/* Y AXIS */}
          <div className={styles.yAxis}>
            {[5, 4, 3, 2, 1].map((v) => (
              <span key={v}>{Math.round((maxY / 5) * v)}</span>
            ))}
          </div>

          {/* SVG */}
          <svg viewBox="0 0 100 40" preserveAspectRatio="none">
            <defs>
              <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#9B5CFF" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#9B5CFF" stopOpacity="0.05" />
              </linearGradient>
            </defs>

            <path d={generatePath(chartData)} fill="url(#grad)" />
          </svg>

          {/* X AXIS */}
          <div className={styles.xAxis}>
            {[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map((v) => (
              <span key={v}>{v}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
