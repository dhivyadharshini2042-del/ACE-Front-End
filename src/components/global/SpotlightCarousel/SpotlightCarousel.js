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
function getCountdown(targetDate) {
  if (!targetDate) {
    return { days: 0, hours: 0, mins: 0, secs: 0 };
  }

  const diff = Math.max(new Date(targetDate) - new Date(), 0);

  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor(diff / (1000 * 60 * 60)) % 24,
    mins: Math.floor(diff / (1000 * 60)) % 60,
    secs: Math.floor(diff / 1000) % 60,
  };
}

/* -------- COMPONENT -------- */
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

  /* -------- FILTER UPCOMING EVENTS (ROBUST VERSION) -------- */
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

    return endDateObj >= now;
  });

  const spotlightEvents = upcomingEvents.slice(0, 10);
  const total = spotlightEvents.length;

  /* -------- AUTO SLIDE -------- */
  useEffect(() => {
    if (!total) return;
    const timer = setInterval(
      () => setCurrent((p) => (p + 1) % total),
      8000
    );
    return () => clearInterval(timer);
  }, [total]);


  useEffect(() => {
    console.log("First Event Location:", data?.[0]?.location);
  }, [data]);


  /* -------- COUNTDOWN REFRESH -------- */
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
              calendar?.startTime && calendar.startTime.trim() !== ""
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
            console.log("banner_image", banner);


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

                {/* RIGHT */}
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
                        className={`${styles.badge} ${event.mode.toLowerCase() === "online"
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
                      {SPOTLIGHT_LOCATION_ICON}{" "}
                      {[
                        event?.location?.venue,
                        // event?.location?.city,
                        // event?.location?.state,
                        // event?.location?.country,
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

                  {/* CIRCULAR COUNTDOWN */}
                  <div className={styles.countdown}>
                    {[
                      { value: days, label: "Days", max: 30, bg: "#EED2FF", inner: "#DCA0FF", progress: "#830DC8" },
                      { value: hours, label: "Hours", max: 24, bg: "#D1F8DB", inner: "#95C7A2", progress: "#0B822A" },
                      { value: mins, label: "Mins", max: 60, bg: "#FFF7D8", inner: "#F5DBA2", progress: "#F2B634" },
                      { value: secs, label: "Secs", max: 60, bg: "#D4E9FF", inner: "#6CB4F9", progress: "#0052A2" },
                    ].map((item, index) => {
                      const safeValue = Math.min(item.value, item.max);
                      const deg = (safeValue / item.max) * 360;

                      return (
                        <div
                          key={index}
                          className={styles.circle}
                          style={{
                            background: `conic-gradient(
                              ${item.progress} 0deg ${deg}deg,
                              ${item.inner} ${deg}deg 360deg
                            )`,
                          }}
                        >
                          <div
                            className={styles.circleInner}
                            style={{ background: item.bg }}
                          >
                            <span className={styles.num}>
                              {String(item.value).padStart(2, "0")}
                            </span>
                            <span className={styles.text}>
                              {item.label}
                            </span>
                          </div>
                        </div>
                      );
                    })}

                    {event?.paymentLink && (
                      <a
                        href={event.paymentLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.cta}
                      >
                        Get Ticket
                      </a>
                    )}
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