"use client";

import { useEffect, useState } from "react";
import styles from "./SpotlightCarousel.module.css";
import {
  SHAREICON,
  SPOTLIGHT_DATE_ICON,
  SPOTLIGHT_LOCATION_ICON,
} from "../../../const-value/config-icons/page";
import { useRouter } from "next/navigation";
import { useLoading } from "../../../context/LoadingContext";

/* -------- DATE FORMAT -------- */
function formatDate(date, time) {
  if (!date) return "TBA";
  if (!time || time.trim() === "") return date;
  return `${date} ${time}`;
}

/* -------- COUNTDOWN -------- */
function getCountdown(targetIso) {
  if (!targetIso) return { days: 0, hours: 0, mins: 0, secs: 0 };

  const diff = Math.max(new Date(targetDate) - new Date(), 0);

  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor(diff / (1000 * 60 * 60)) % 24,
    mins: Math.floor(diff / (1000 * 60)) % 60,
    secs: Math.floor(diff / 1000) % 60,
  };
}

export default function SpotlightCarousel({ data = [] }) {
  const { setLoading } = useLoading();
  const [current, setCurrent] = useState(0);
  const [, forceUpdate] = useState(0);
  const router = useRouter();

  const handleClick = (slug) => {
    if (!slug) return;
    try {
      setLoading(true);
      router.push(`/events/${slug}`);
    } catch (error) {
      console.error("Navigation failed", error);
      setLoading(false);
    }
  };

  const now = new Date();

  /* -------- FILTER UPCOMING EVENTS CORRECTLY -------- */
  const upcomingEvents = data.filter((event) => {
    const calendar = event.calendars?.[0];
    if (!calendar?.startDate) return false;

    const startDateObj = new Date(calendar.startDate);
    const endDateObj = calendar.endDate
      ? new Date(calendar.endDate)
      : new Date(calendar.startDate);

    const startTime =
      calendar.startTime && calendar.startTime.trim() !== ""
        ? calendar.startTime
        : "00:00";

    const [hours, minutes] = startTime.split(":");

    startDateObj.setHours(Number(hours));
    startDateObj.setMinutes(Number(minutes));
    startDateObj.setSeconds(0);

    endDateObj.setHours(23, 59, 59);

    return endDateObj >= now; // remove finished events
  });

  const spotlightEvents = upcomingEvents.slice(0, 10);
  const total = spotlightEvents.length;

  /* Auto Slide */
  useEffect(() => {
    if (!total) return;
    const timer = setInterval(
      () => setCurrent((p) => (p + 1) % total),
      8000
    );
    return () => clearInterval(timer);
  }, [total]);

  /* Countdown Refresh */
  useEffect(() => {
    const timer = setInterval(() => {
      forceUpdate((n) => n + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  if (!spotlightEvents.length) return null;

  const goto = (i) => setCurrent((i + total) % total);

  return (
    <section className={styles.root}>
      <h2 className={styles.title}>Top Spotlights</h2>

      <div className={styles.wrapper}>
        <div
          className={styles.track}
          style={{ transform: `translateX(-${current * 100}%)` }}
        >
          {spotlightEvents.map((event) => {
            const calendar = event.calendars?.[0];

            const startTime =
              calendar?.startTime?.trim() !== ""
                ? calendar.startTime
                : "00:00";

            let eventStartDate = null;

            if (calendar?.startDate) {
              eventStartDate = new Date(calendar.startDate);
              const [h, m] = startTime.split(":");
              eventStartDate.setHours(Number(h));
              eventStartDate.setMinutes(Number(m));
              eventStartDate.setSeconds(0);
            }

            const { days, hours, mins, secs } =
              getCountdown(eventStartDate);

            const banner =
              event.bannerImages?.[0] || "/images/event.png";

            return (
              <article
                className={styles.slide}
                key={event.identity}
              >
                {/* LEFT */}
                <div
                  className={styles.left}
                  onClick={() => handleClick(event.slug)}
                >
                  <img
                    src={banner}
                    alt={event.title}
                    className={styles.image}
                  />
                </div>

                <div className={styles.right}>
                  <div className={styles.header}>
                    <h3>{event.title}</h3>
                    <button className={styles.share}>
                      {SHAREICON}
                    </button>
                  </div>

                  {/* BADGES */}
                  <div className={styles.badges}>
                    {event?.eventTypeName && (
                      <span
                        className={`${styles.badge} ${styles.conference}`}
                      >
                        {event.eventTypeName}
                      </span>
                    )}

                    {event?.mode && (
                      <span
                        className={`${styles.badge} ${
                          event.mode.toLowerCase() === "online"
                            ? styles.online
                            : styles.offline
                        }`}
                      >
                        {event.mode}
                      </span>
                    )}
                  </div>

                  {/* META */}
                  <div className={styles.meta}>
                    <p className={styles.location}>
                      {SPOTLIGHT_LOCATION_ICON}
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
                      {formatDate(
                        calendar?.startDate,
                        calendar?.startTime
                      )}
                    </p>
                  </div>

                  <div className={styles.startsIn}>
                    Event Starts In
                  </div>

                  {/* COUNTDOWN */}
                  <div className={styles.countdown}>
                    <span>
                      {String(days).padStart(2, "0")}
                      <br />
                      Days
                    </span>

                    <span>
                      {String(hours).padStart(2, "0")}
                      <br />
                      Hours
                    </span>

                    <span>
                      {String(mins).padStart(2, "0")}
                      <br />
                      Mins
                    </span>

                    <span>
                      {String(secs).padStart(2, "0")}
                      <br />
                      Secs
                    </span>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>

      <div className={styles.controls}>
        <button onClick={() => goto(current - 1)}>❮</button>

        <div className={styles.dots}>
          {spotlightEvents.map((_, i) => (
            <span
              key={i}
              className={
                i === current
                  ? styles.activeDot
                  : styles.dot
              }
              onClick={() => goto(i)}
            />
          ))}
        </div>

        <button onClick={() => goto(current + 1)}>❯</button>
      </div>
    </section>
  );
}
