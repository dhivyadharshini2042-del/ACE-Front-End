"use client";

import { useEffect, useState, useCallback } from "react";
import toast from "react-hot-toast";
import "./explore-event.css";

import EventSlider from "../../components/global/EventSlider/EventSlider";
import ExploreHero from "../../components/global/ExploreHero/ExploreHero";
import WhyChoose from "../../components/global/WhyChoose/WhyChoose";
import Footer from "../../components/global/Footer/Footer";

import {
  getTrendingEventsApi,
  getUpcomingEventsApi,
  getVirtualEventsApi,
  getFeaturedEventsApi,
} from "../../lib/api/event.api";

import { useLoading } from "../../context/LoadingContext";
import { TOAST_ERROR_MSG_SOMETHING_WENT_WRONG, TOAST_ERROR_MSG_EVENTS_LOAD_FAILED } from "../../const-value/config-message/page";

export default function ExploreEventsPage() {
  const { setLoading } = useLoading();

  const [trendingEvents, setTrendingEvents] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [virtualEvents, setVirtualEvents] = useState([]);
  const [featuredEvents, setFeaturedEvents] = useState([]);

  const [offsets, setOffsets] = useState({
    trending: 0,
    upcoming: 0,
    virtual: 0,
    featured: 0,
  });

  /* ================= GENERIC LOAD EVENTS ================= */
  const loadEvents = useCallback(async (type, setter) => {
    try {
      setLoading(true);

      const apiMap = {
        trending: getTrendingEventsApi,
        upcoming: getUpcomingEventsApi,
        virtual: getVirtualEventsApi,
        featured: getFeaturedEventsApi,
      };

      const res = await apiMap[type]({
        offset: offsets[type],
        limit: 5,
      });

      if (res?.status) {
        setter((prev) => {
          const newUnique = res.data.filter(
            (n) => !prev.some((p) => p.identity === n.identity)
          );
          return [...prev, ...newUnique];
        });

        setOffsets((prev) => ({
          ...prev,
          [type]: prev[type] + 5,
        }));
      } else {
        toast.error(res?.message || TOAST_ERROR_MSG_EVENTS_LOAD_FAILED);
      }
    } catch (err) {
      console.error(err);
      toast.error(TOAST_ERROR_MSG_SOMETHING_WENT_WRONG);
    } finally {
      setLoading(false);
    }
  }, [offsets, setLoading]);

  /* ================= INITIAL LOAD ================= */
  useEffect(() => {
    loadEvents("featured", setFeaturedEvents);
    loadEvents("trending", setTrendingEvents);
    loadEvents("virtual", setVirtualEvents);
    loadEvents("upcoming", setUpcomingEvents);
  }, []);

  return (
    <>
      <ExploreHero />

      <EventSlider
        title="Featured Events"
        data={featuredEvents}
        onReachEnd={() => loadEvents("featured", setFeaturedEvents)}
      />

      <EventSlider
        title="Trending Events"
        data={trendingEvents}
        onReachEnd={() => loadEvents("trending", setTrendingEvents)}
      />

      <EventSlider
        title="Virtual Events"
        data={virtualEvents}
        onReachEnd={() => loadEvents("virtual", setVirtualEvents)}
      />

      <EventSlider
        title="Upcoming Events"
        data={upcomingEvents}
        onReachEnd={() => loadEvents("upcoming", setUpcomingEvents)}
      />

      <WhyChoose />
      <Footer />
    </>
  );
}
