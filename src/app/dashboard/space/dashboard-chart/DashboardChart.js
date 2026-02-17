"use client";

import { useMemo, useState } from "react";
import { DATEICON } from "../../../../const-value/config-icons/page";
import styles from "./DashboardChart.module.css";
import { FaArrowLeft } from "react-icons/fa";

export default function DashboardChart({ event, onBack }) {
  const [selected, setSelected] = useState("Click");

  if (!event) return null;

  /* ================= CORRECT STATS ================= */
  const stats = {
    click: event?.viewCount ?? 0, // if you have separate clickCount use that
    view: event?.viewCount ?? 0,
    like: event?.likeCount ?? 0,
  };

  /* ================= CHART DATA ================= */
  const chartData = useMemo(() => {
    const total =
      selected === "Click"
        ? stats.click
        : selected === "Views"
          ? stats.view
          : stats.like;

    // if zero → show small baseline so UI not broken
    if (!total) {
      return Array(10).fill(2);
    }

    const CURVE = [18, 20, 22, 19, 16, 16, 19, 22, 18, 19];
    const baseSum = CURVE.reduce((a, b) => a + b, 0);

    return CURVE.map((v) => Math.max(2, Math.round((v / baseSum) * total)));
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

  return (
    <div className={styles.wrapper}>
      {/* HEADER */}
      <div className={styles.header}>
        <div className={styles.left}>
          <button className={styles.backBtn} onClick={onBack}>
            <FaArrowLeft />
          </button>
          <h2>{event?.title}</h2>
        </div>
      </div>

      {/* STATS */}
      <div className={styles.cards}>
        <div className={`${styles.card} ${styles.click}`}>
          <h3>Event Clicks</h3>
          <p className={styles.subText}>Since Published</p>
          <h2>{stats.click}</h2>
        </div>

        <div className={`${styles.card} ${styles.view}`}>
          <h3>Event Views</h3>
          <p className={styles.subText}>Since Published</p>
          <h2>{stats.view}</h2>
        </div>

        <div className={`${styles.card} ${styles.like}`}>
          <h3>Event Likes</h3>
          <p className={styles.subText}>Since Published</p>
          <h2>{stats.like}</h2>
        </div>
      </div>

      {/* CHART */}
      <div className={styles.chartBox}>
        <div className={styles.chartTop}>
          <select
            value={selected}
            onChange={(e) => setSelected(e.target.value)}
          >
            <option>Click</option>
            <option>Views</option>
            <option>Likes</option>
          </select>

          <div>{DATEICON}</div>
        </div>

        <div className={styles.chartArea}>
          {/* Y AXIS */}
          <div className={styles.yAxis}>
            {[50, 40, 30, 20, 10, 0].map((val) => (
              <span key={val}>{val}</span>
            ))}
          </div>

          {/* SVG GRAPH */}
          <svg viewBox="0 0 100 40" preserveAspectRatio="none">
            <path d={generatePath(chartData)} fill="#9B5CFF" />
          </svg>

          {/* X AXIS */}
          <div className={styles.xAxis}>
            {[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map((val) => (
              <span key={val}>{val}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
