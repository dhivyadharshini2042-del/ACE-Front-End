"use client";

import { useEffect, useState } from "react";

import styles from "./Saved.module.css";
import EventSlider from "../../../../components/global/EventSlider/EventSlider";
import { useLoading } from "../../../../context/LoadingContext";
import toast from "react-hot-toast";

export default function SavedEventsPage() {
  const [events, setEvents] = useState([]);
  const { setLoading: setGlobalLoading } = useLoading();

  const loadEvents = async () => {
    setGlobalLoading(true);

    try {
      const res = await getAllEventsApi();
      console.log("check res", res);
      if (res?.status) {
        setEvents(res.data);
        setGlobalLoading(false);
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

  return (
    <div className={styles.wrapper}>
      <EventSlider title="Saved Events" data={events} />
    </div>
  );
}
