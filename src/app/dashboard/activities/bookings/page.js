"use client";

import { useEffect, useState } from "react";
import styles from "./Booking.module.css";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

import { useLoading } from "../../../../context/LoadingContext";
import {
  COLOR_SAVED_ICON,
  DATEICON,
  LOCATION_ICON,
  TICKET_ICON,
  VIEW_ICON,
} from "../../../../const-value/config-icons/page";

import { getSavedEventsApi } from "../../../../lib/api/auth.api";

// 🔐 SESSION AUTH
import { getAuth, isUserLoggedIn } from "../../../../lib/auth";

const PAGE_SIZE = 6;

export default function BookingEventsPage() {
  const { setLoading } = useLoading();
  const router = useRouter();

  const [events, setEvents] = useState([]);
  const [localLoading, setLocalLoading] = useState(true);
  const [page, setPage] = useState(1);

  // 🔐 SESSION AUTH STATE
  const [auth, setAuth] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  /* ================= STOP GLOBAL LOADER ON PAGE LOAD ================= */
  useEffect(() => {
    setLoading(false);

    const loggedIn = isUserLoggedIn();
    setIsLoggedIn(loggedIn);

    if (loggedIn) {
      const authData = getAuth();
      setAuth(authData);
    } else {
      setAuth(null);
    }
  }, []);

  /* ================= LOAD BOOKED EVENTS ================= */
  const loadEvents = async () => {
    try {
      setLocalLoading(true);

      if (!isLoggedIn || !auth?.identity) {
        setEvents([]);
        return;
      }

      const res = await getSavedEventsApi(auth.identity);

      if (res?.status) {
        setEvents(res.data?.events || []);
      } else {
        toast.error(res?.message || "Failed to load booked events");
        setEvents([]);
      }
    } catch {
      toast.error("Something went wrong");
      setEvents([]);
    } finally {
      setLocalLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, [isLoggedIn, auth?.identity]);

  /* ================= PAGINATION ================= */
  const totalPages = Math.ceil(events.length / PAGE_SIZE);
  const start = (page - 1) * PAGE_SIZE;
  const visibleEvents = events.slice(start, start + PAGE_SIZE);

  /* ================= LOCAL LOADING ================= */
  if (localLoading) {
    return (
      <div className={styles.wrapper}>
        <p className="text-center mt-5">Loading booked events...</p>
      </div>
    );
  }

  /* ================= EMPTY STATE ================= */
  if (!events.length) {
    return (
      <div className={styles.wrapper}>
        <div className={styles.emptyState}>
          <img src="/images/no-event-image.png" alt="No Events" />
          <h3>No Booked Events</h3>
          <p>You haven’t booked any events yet</p>
          <button onClick={() => router.push("/events")}>Explore Events</button>
        </div>
      </div>
    );
  }

  /* ================= UI (UNCHANGED) ================= */
  return (
    <div className={styles.wrapper}>
      <h2 className={styles.title}>Booked Events</h2>

      <div className={styles.grid}>
        {visibleEvents.map((e) => (
          <div
            key={e.identity}
            className={styles.card}
            onClick={() => router.push(`/events/${e.slug}`)}
          >
            <div className={styles.imageWrap}>
              <img
                src={e.bannerImages?.[0] || "/images/event.png"}
                alt={e.title}
              />
              {e.offers && <span className={styles.offer}>Offers</span>}
            </div>

            <div className={styles.content}>
              <div className={styles.topcontent}>
                <h4 title={e.title}>{e.title}</h4>
                <div>{COLOR_SAVED_ICON}</div>
              </div>

              <div className={styles.meta}>
                <span>
                  {LOCATION_ICON} {e.location?.city || "N/A"}
                </span>
                <span>
                  {TICKET_ICON} {e.tickets?.[0]?.price || "Free"}
                </span>
              </div>

              <div className={styles.bottom}>
                <span>
                  {DATEICON}{" "}
                  {new Date(
                    e.calendars?.[0]?.startDate || e.createdAt,
                  ).toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </span>

                <span className={styles.badge}>
                  <div>{VIEW_ICON}</div>
                  <div>{e.viewCount || "0"}</div>
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ================= PAGINATION ================= */}
      {totalPages > 1 && (
        <div className={styles.pagination}>
          <button disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
            Prev
          </button>

          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              className={page === i + 1 ? styles.active : ""}
              onClick={() => setPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}

          <button
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
