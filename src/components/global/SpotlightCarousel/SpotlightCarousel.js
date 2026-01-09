"use client";

import { useEffect, useState } from "react";
import styles from "./SpotlightCarousel.module.css";
import {
  DATEICON,
  LOCATION_ICON,
  SHAREICON,
  SPOTLIGHT_DATE_ICON,
  SPOTLIGHT_LOCATION_ICON,
} from "../../../const-value/config-icons/page";
import { encodeId } from "../../../lib/utils/secureId";
import { useRouter } from "next/navigation";

/* -------- DATE FORMAT -------- */
function formatDate(date, time) {
  if (!date) return "TBA";
  return `${date} ${time || ""}`;
}

/* -------- COUNTDOWN -------- */
function getCountdown(targetIso) {
  if (!targetIso) {
    return { days: 0, hours: 0, mins: 0, secs: 0 };
  }

  const diff = Math.max(new Date(targetIso) - new Date(), 0);

  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor(diff / (1000 * 60 * 60)) % 24,
    mins: Math.floor(diff / (1000 * 60)) % 60,
    secs: Math.floor(diff / 1000) % 60,
  };
}

/* -------- COMPONENT -------- */
export default function SpotlightCarousel({ data = [] }) {
  const [current, setCurrent] = useState(0);
  const [, forceUpdate] = useState(0);
  const total = data.length;
  const router = useRouter();

  const handleClick = (eventId) => {
    router.push(`/events/${encodeId(eventId)}`);
  };

  /* Auto slide */
  useEffect(() => {
    if (!total) return;
    const timer = setInterval(() => setCurrent((p) => (p + 1) % total), 8000);
    return () => clearInterval(timer);
  }, [total]);

  /* Countdown refresh */
  useEffect(() => {
    const timer = setInterval(() => {
      forceUpdate((n) => n + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  if (!Array.isArray(data) || data.length === 0) return null;

  const goto = (i) => setCurrent((i + total) % total);

  return (
    <section className={styles.root}>
      <h2 className={styles.title}>Top Spotlights</h2>

      <div className={styles.wrapper}>
        <div
          className={styles.track}
          style={{ transform: `translateX(-${current * 100}%)` }}
        >
          {data.map((event) => {
            const calendar = event.calendars?.[0];
            const eventStartISO = calendar
              ? `${calendar.startDate}T${calendar.startTime}:00`
              : null;

            const { days, hours, mins, secs } = getCountdown(eventStartISO);

            const banner = event.bannerImages?.[0] || "/images/event.png";

            return (
              <article className={styles.slide} key={event.identity}>
                {/* LEFT */}
                <div
                  className={styles.left}
                  onClick={() => handleClick(event.identity)}
                >
                  <img
                    src={banner}
                    alt={event.title}
                    className={styles.image}
                  />
                </div>

                {/* RIGHT */}
                <div className={styles.right}>
                  <div className={styles.header}>
                    <h3>{event.title}</h3>
                    <button className={styles.share}>{SHAREICON}</button>
                  </div>

                  <div className={styles.meta}>
                    <p className={styles.location}>
                      {SPOTLIGHT_LOCATION_ICON}{" "}
                      {[
                        event?.location?.city,
                        event?.location?.state,
                        event?.location?.country,
                      ]
                        .filter(Boolean)
                        .join(", ") || "Location not set"}
                    </p>

                    <p>
                      {SPOTLIGHT_DATE_ICON}{" "}
                      {formatDate(calendar?.startDate, calendar?.startTime)}
                    </p>
                  </div>

                  <div className={styles.startsIn}>Event Starts In</div>

                  <div className={styles.countdown}>
                    <span className={`${styles["cd-days"]}`}>
                      {String(days).padStart(2, "0")}
                      <br />
                      Days
                    </span>

                    <span className={`${styles["cd-hours"]}`}>
                      {String(hours).padStart(2, "0")}
                      <br />
                      Hours
                    </span>

                    <span className={`${styles["cd-mins"]}`}>
                      {String(mins).padStart(2, "0")}
                      <br />
                      Mins
                    </span>

                    <span className={`${styles["cd-secs"]}`}>
                      {String(secs).padStart(2, "0")}
                      <br />
                      Secs
                    </span>

                    <a
                      href={event.paymentLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.cta}
                    >
                      Register
                    </a>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>

      {/* CONTROLS */}
      <div className={styles.controls}>
        <button onClick={() => goto(current - 1)}>❮</button>

        <div className={styles.dots}>
          {data.map((_, i) => (
            <span
              key={i}
              className={i === current ? styles.activeDot : styles.dot}
              onClick={() => goto(i)}
            />
          ))}
        </div>

        <button onClick={() => goto(current + 1)}>❯</button>
      </div>
    </section>
  );
}
