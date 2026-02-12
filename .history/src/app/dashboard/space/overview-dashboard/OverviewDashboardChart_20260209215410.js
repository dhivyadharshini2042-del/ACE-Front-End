// "use client";

// import { useMemo, useState } from "react";
// import { DATEICON } from "../../../../const-value/config-icons/page";
// import styles from "./OverviewDashboardChart.module.css";

// export default function OverviewDashboardChart({ events }) {
//   /* ================= STATE ================= */
//   const [selectedEventId, setSelectedEventId] = useState("ALL");
//   const [selected, setSelected] = useState("Engagement");

//   /* ================= FILTER EVENTS ================= */
//   const selectedEvents =
//     selectedEventId === "ALL"
//       ? events
//       : events.filter((e) => e.identity === selectedEventId);

//   /* ================= STATS ================= */
//   const stats = useMemo(() => {
//     let view = 0;
//     let like = 0;
//     let click = 0;

//     selectedEvents.forEach((e) => {
//       view += e.viewCount || 0;
//       like += e.likeCount || 0;
//       click += e.clickCount || 0;
//     });

//     const engagement =
//       view === 0 ? 0 : Number(((view + like + click) / view).toFixed(2));

//     return { view, like, click, engagement };
//   }, [selectedEvents]);

//   /* ================= CHART DATA (SAME CURVE LOGIC) ================= */
//   const chartData = useMemo(() => {
//     let total = 0;

//     if (selected === "Views") total = stats.view;
//     else if (selected === "Likes") total = stats.like;
//     else if (selected === "Click") total = stats.click;
//     else if (selected === "Engagement") total = stats.engagement * 10;

//     if (total < 20) {
//       return Array(10).fill(Math.max(total / 4, 1));
//     }

//     const CURVE_TEMPLATE = [18, 20, 22, 19, 16, 16, 19, 22, 18, 19];
//     const baseSum = CURVE_TEMPLATE.reduce((a, b) => a + b, 0);

//     return CURVE_TEMPLATE.map((v) => Math.round((v / baseSum) * total));
//   }, [selected, stats]);

//   /* ================= SVG PATH ================= */
//   const generatePath = (data) => {
//     const stepX = 100 / (data.length - 1);
//     let d = `M0,${40 - data[0] / 2}`;

//     data.forEach((val, i) => {
//       const x = i * stepX;
//       const y = 40 - val / 2;
//       d += ` L${x},${y}`;
//     });

//     return `${d} L100,40 L0,40 Z`;
//   };

//   const maxY = Math.max(...chartData, 10);

//   /* ================= RENDER ================= */
//   return (
//     <div className={styles.wrapper}>
//       {/* HEADER */}
//       <div className={styles.header}>
//         <div className={styles.left}>
//           <h2 className="mt-5 mb-5">Organization Event Analytics</h2>
//         </div>

//         {/* <button className={styles.previewBtn}>Preview Event</button> */}
//       </div>

//       {/* EVENT SELECT */}
//       <div className={styles.chartTop}>
//         <div className={styles.selectBox}>
//           <span>Select Event :</span>
//           <select
//             value={selectedEventId}
//             onChange={(e) => setSelectedEventId(e.target.value)}
//           >
//             <option value="ALL">All Events</option>
//             {events.map((ev) => (
//               <option key={ev.identity} value={ev.identity}>
//                 {ev.title}
//               </option>
//             ))}
//           </select>
//         </div>

//         <div className={styles.selectBox}>
//           <span>Select : </span>
//           <select
//             value={selected}
//             onChange={(e) => setSelected(e.target.value)}
//           >
//             <option>Engagement</option>
//             <option>Views</option>
//             <option>Likes</option>
//             <option>Click</option>
//           </select>
//         </div>

//         {/* <div className={styles.calendar}>{DATEICON}</div> */}
//       </div>

//       {/* STATS CARDS (SAME UI) */}
//       <div className={styles.cards}>
//         <div className={`${styles.card} ${styles.click}`}>
//           <div className={styles.cardTop}>
//             <img src="/images/mouse-pointer.png" alt="" />
//             <h3>Total Clicks</h3>
//             <img src="/images/trending_arrow.png" alt="" />
//           </div>
//           <p>Since Last Week</p>
//           <h3 className="text-end">{stats.click}</h3>
//         </div>

//         <div className={`${styles.card} ${styles.view}`}>
//           <div className={styles.cardTop}>
//             <img src="/images/eye.png" alt="" />
//             <h3>Total Views</h3>
//             <img src="/images/trending_arrow.png" alt="" />
//           </div>
//           <p>Since Last Week</p>
//           <h3 className="text-end">{stats.view}</h3>
//         </div>

//         <div className={`${styles.card} ${styles.like}`}>
//           <div className={styles.cardTop}>
//             <img src="/images/mdi_heart.png" alt="" />
//             <h3>Total Likes</h3>
//             <img src="/images/trending_arrow.png" alt="" />
//           </div>
//           <p>Since Last Week</p>
//           <h3 className="text-end">{stats.like}</h3>
//         </div>
//         <div className={`${styles.card} ${styles.click}`}>
//           <div className={styles.cardTop}>
//             <img src="/images/mouse-pointer.png" alt="engagement" />
//             <h3>Engagement</h3>
//             <img src="/images/trending_arrow.png" alt="" />
//           </div>
//           <p>Overall Performance</p>
//           <h3 className="text-end">{stats.engagement}</h3>
//         </div>
//       </div>

//       {/* CHART */}
//       <div className={styles.chartBox}>
//         <div className={styles.chartArea}>
//           {/* Y AXIS */}
//           <div className={styles.yAxis}>
//             {[5, 4, 3, 2, 1].map((v) => (
//               <span key={v}>{Math.round((maxY / 5) * v)}</span>
//             ))}
//           </div>

//           {/* SVG */}
//           <svg viewBox="0 0 100 40" preserveAspectRatio="none">
//             <defs>
//               <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
//                 <stop offset="0%" stopColor="#9B5CFF" stopOpacity="0.8" />
//                 <stop offset="100%" stopColor="#9B5CFF" stopOpacity="0.05" />
//               </linearGradient>
//             </defs>

//             <path d={generatePath(chartData)} fill="url(#grad)" />
//           </svg>

//           {/* X AXIS */}
//           <div className={styles.xAxis}>
//             {[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map((v) => (
//               <span key={v}>{v}</span>
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";

import { useMemo, useState } from "react";
// import ProfileHeader from "../../../dashboard/components/ProfileHeader";
// import ProfileHeader from "../../components/ProfileHeader";
import ProfileHeader from "../../components/ProfileHeader/ProfileHeader";



// import ProfileHeader from "../;
// import ProfileHeader from "./src\app\dashboard\components\ProfileHeader\ProfileHeader.js";
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
      {/* HEADER — full width, no constraints */}
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

