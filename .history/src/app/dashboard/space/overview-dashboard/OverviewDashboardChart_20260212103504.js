"use client";

import { useMemo, useState } from "react";
import ProfileHeader from "../../components/ProfileHeader/ProfileHeader";
import styles from "./OverviewDashboardChart.module.css";

export default function OverviewDashboardChart({ events }) {
  const [selectedEventId, setSelectedEventId] = useState("ALL");
  const [selected, setSelected] = useState("Click");

  const selectedEvents =
    selectedEventId === "ALL"
      ? events
      : events.filter((e) => e.identity === selectedEventId);

  const stats = useMemo(() => {
    let view = 0,
      like = 0,
      click = 0;

    selectedEvents.forEach((e) => {
      view += e.viewCount || 0;
      like += e.likeCount || 0;
      click += e.clickCount || 0;
    });

    return { view, like, click };
  }, [selectedEvents]);

  const chartData = useMemo(() => {
    const total =
      selected === "Views"
        ? stats.view
        : selected === "Likes"
          ? stats.like
          : stats.click;

    if (total < 20) return Array(10).fill(5);

    const CURVE = [20, 24, 18, 28, 22, 30, 26, 34, 28, 32];
    const sum = CURVE.reduce((a, b) => a + b, 0);

    return CURVE.map((v) => Math.round((v / sum) * total));
  }, [selected, stats]);

  const generatePath = (data) => {
    const stepX = 100 / (data.length - 1);
    let d = `M0 ${40 - data[0] / 2}`;

    data.forEach((val, i) => {
      if (i === 0) return;

      const prevX = (i - 1) * stepX;
      const prevY = 40 - data[i - 1] / 2;
      const x = i * stepX;
      const y = 40 - val / 2;

      d += ` Q ${prevX} ${prevY} ${(prevX + x) / 2} ${(prevY + y) / 2}`;
    });

    d += ` T 100 ${40 - data[data.length - 1] / 2}`;
    return d;
  };

  const areaPath = `${generatePath(chartData)} L100 40 L0 40 Z`;
  const linePath = generatePath(chartData);
  const maxY = Math.max(...chartData, 10);

  return (
    <div className={styles.pageWrapper}>
      {/* HEADER */}
      <ProfileHeader />

      {/* CHART CARD ONLY */}
      <div className={styles.chartCard}>
        {/* TOP CONTROLS */}
        <div className={styles.chartTop}>
          <div className={styles.selectBox}>
            <span>Select</span>
            <select value={selected} onChange={(e) => setSelected(e.target.value)}>
              <option>Click</option>
              <option>Views</option>
              <option>Likes</option>
            </select>
          </div>

          <div className={styles.selectBox}>
            <span>Select Event</span>
            <select
              value={selectedEventId}
              onChange={(e) => setSelectedEventId(e.target.value)}
            >
              <option value="ALL">All Events</option>
              {events.map((ev) => (
                <option key={ev.identity} value={ev.identity}>
                  {ev.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* CHART */}
        <div className={styles.chartBox}>
          <div className={styles.chartArea}>
            <div className={styles.yAxis}>
              {[5, 4, 3, 2, 1].map((v) => (
                <span key={v}>{Math.round((maxY / 5) * v)}</span>
              ))}
            </div>

            <svg viewBox="0 0 100 40" preserveAspectRatio="none">
              <defs>
                <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#9B5CFF" stopOpacity="0.35" />
                  <stop offset="70%" stopColor="#9B5CFF" stopOpacity="0.15" />
                  <stop offset="100%" stopColor="#9B5CFF" stopOpacity="0" />
                </linearGradient>
              </defs>

              <path d={areaPath} fill="url(#grad)" />
              <path d={linePath} fill="none" stroke="#9B5CFF" strokeWidth="0.6" />
            </svg>

            <div className={styles.xAxis}>
              {[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map((v) => (
                <span key={v}>{v}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

