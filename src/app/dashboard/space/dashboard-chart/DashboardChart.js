"use client";

import styles from "./DashboardChart.module.css";

export default function DashboardChart() {
  return (
    <div className={styles.wrapper}>
      {/* Header */}
      <div className={styles.topRow}>
        <h2>Dashboard</h2>

        <div className={styles.eventSelect}>
          <span>Select Event</span>
          <select>
            <option>All Events</option>
          </select>
        </div>
      </div>

      {/* Card */}
      <div className={styles.card}>
        {/* Filters */}
        <div className={styles.filterRow}>
          <div className={styles.leftFilters}>
            <select>
              <option>Click</option>
              <option>Views</option>
              <option>Likes</option>
            </select>
          </div>

          <div className={styles.rightFilters}>
            <span>Last 7 days</span>
            <span>Last 30 days</span>
            <span className={styles.active}>Last 3 months</span>
          </div>
        </div>

        {/* Chart */}
        <div className={styles.chartWrapper}>
          <svg
            viewBox="0 0 100 40"
            preserveAspectRatio="none"
            className={styles.chart}
          >
            <defs>
              <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#7a12ff" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#7a12ff" stopOpacity="0.05" />
              </linearGradient>
            </defs>

            <path
              d="M0,20 
                 C10,10 20,30 30,20 
                 S50,10 60,20 
                 S80,30 100,15
                 L100,40 L0,40 Z"
              fill="url(#gradient)"
            />
          </svg>

          {/* Axis labels */}
          <div className={styles.yAxis}>No. of Counts</div>
          <div className={styles.xAxis}>No. of Days</div>
        </div>
      </div>
    </div>
  );
}
