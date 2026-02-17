"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import "./explore-event.css";

import EventSlider from "../../components/global/EventSlider/EventSlider";
import ExploreHero from "../../components/global/ExploreHero/ExploreHero";
import { getAllEventsApi } from "../../lib/api/event.api";
import WhyChoose from "../../components/global/WhyChoose/WhyChoose";
import Footer from "../../components/global/Footer/Footer";
import { useLoading } from "../../context/LoadingContext";

export default function ExploreEventsPage() {
  const { setLoading } = useLoading();

  const [events, setEvents] = useState([]);
  const [offset, setOffset] = useState(0);
  const [hasNext, setHasNext] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  /* ================= INITIAL LOAD ================= */
  const loadEvents = async () => {
    try {
      setLoading(true);

      const res = await getAllEventsApi({ offset: 0, limit: 5 });

      if (res?.status) {
        setEvents(res.data);
        setHasNext(res.meta?.hasNext);
        setOffset(5);
      } else {
        toast.error(res?.message || "Failed to load events");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  /* ================= LOAD MORE ================= */
  const loadMoreEvents = async () => {
    if (!hasNext || loadingMore) return;

    try {
      setLoadingMore(true);

      const res = await getAllEventsApi({ offset, limit: 5 });

      if (res?.status) {
        setEvents((prev) => [...prev, ...res.data]);
        setHasNext(res.meta?.hasNext);
        setOffset((prev) => prev + 5);
      }
    } catch {
      toast.error("Failed to load more events");
    } finally {
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  return (
    <>
      <ExploreHero />

      <EventSlider
        title="Featured Events"
        data={events}
        onReachEnd={loadMoreEvents}
      />
      <EventSlider
        title="Trending Events"
        data={events}
        onReachEnd={loadMoreEvents}
      />
      <EventSlider
        title="Virtual Events"
        data={events}
        onReachEnd={loadMoreEvents}
      />

      <WhyChoose />
      <Footer />
    </>
  );
}
