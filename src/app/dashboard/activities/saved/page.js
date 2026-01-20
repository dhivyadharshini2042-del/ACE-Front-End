"use client";

import { useEffect, useState } from "react";
import styles from "./Saved.module.css";
import EventSlider from "../../../../components/global/EventSlider/EventSlider";
import { useLoading } from "../../../../context/LoadingContext";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { getAllEventsApi } from "../../../../lib/api/event.api";

export default function SavedEventsPage() {
  const [events, setEvents] = useState([]);
  const { setLoading: setGlobalLoading } = useLoading();
  const router = useRouter();

  const loadEvents = async () => {
    setGlobalLoading(true);
    try {
      const res = await getAllEventsApi();
      if (res?.status) {
        setEvents(res.data || []);
      } else {
        toast.error(res?.message || "Failed to load events");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setGlobalLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  /* ================= EMPTY STATE ================= */
  if (!events || events.length === 0) {
    return (
      <div className={styles.wrapper}>
        <div className={styles.emptyState}>
          <img
            src="/images/no-event-image.png"
            alt="No Events"
            className={styles.emptyImg}
          />

          <h3>No Events Found</h3>
          <p>
            No saved events available. Start adding events to view them here.
          </p>

          <button
            className={styles.exploreBtn}
            onClick={() => router.push("/explore-events")}
          >
            Explore
          </button>
        </div>
      </div>
    );
  }

  /* ================= NORMAL ================= */
  return (
    <div className={styles.wrapper}>
      <EventSlider title="Saved Events" data={events} />
    </div>
  );
}
