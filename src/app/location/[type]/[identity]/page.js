"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import styles from "./LocationPage.module.css";
import PaginationBar from "../../../events/components/PaginationBar";
import { getLocationEvents } from "../../../../lib/location.api";

export default function LocationPage() {
  const { type, identity } = useParams();

  const [events, setEvents] = useState([]);
  const [meta, setMeta] = useState(null);
  const [page, setPage] = useState(1);

  useEffect(() => {
    setPage(1);
  }, [identity]);

  useEffect(() => {
    loadEvents();
  }, [identity, page]);

  const loadEvents = async () => {
    const res = await getLocationEvents({
      countryId: type === "country" ? identity : null,
      cityId: type === "city" ? identity : null,
      page,
    });

    if (res) {
      setEvents(res.data);
      setMeta(res.meta);
    }
  };

  return (
    <div className={styles.wrapper}>
      
      {/* HERO SECTION */}
      <section className={styles.hero}>
        <div className={styles.heroLeft}>
          <span className={styles.tag}>Explore the World</span>
          <h1 className={styles.title}>
            Explore to <br />
            <span className={styles.big}>
              {type === "country" ? "Country" : "City"}
            </span>
          </h1>
          <p className={styles.desc}>
            Discover exciting events happening in this location. 
            Join conferences, workshops and networking events near you.
          </p>
        </div>

        <div className={styles.heroRight}>
          <div className={styles.imageBox}></div>
          <div className={styles.imageBox}></div>
          <div className={styles.imageBox}></div>
          <div className={styles.imageBox}></div>
        </div>
      </section>

      {/* SEARCH */}
      <div className={styles.searchWrap}>
        <input
          type="text"
          placeholder="Search Events"
          className={styles.search}
        />
      </div>

      {/* ALL EVENTS */}
      <section className={styles.eventsSection}>
        <h2>All Events</h2>

        <div className={styles.grid}>
          {events.map((event) => (
            <div key={event.identity} className={styles.card}>
              <img
                src={
                  event.bannerImages?.[0] ||
                  "/images/placeholder.png"
                }
                alt={event.title}
              />

              <div className={styles.cardContent}>
                <h3>{event.title}</h3>

                <p className={styles.meta}>
                  {event.location?.venue} •{" "}
                  {event.calendars?.[0]?.startDate}
                </p>

                <span className={styles.category}>
                  {event.categoryName}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* PAGINATION */}
        {meta && (
          <PaginationBar
            page={meta.page}
            total={meta.totalPages}
            onChange={(p) => setPage(p)}
          />
        )}
      </section>
    </div>
  );
}
