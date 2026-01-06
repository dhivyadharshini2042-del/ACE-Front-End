"use client";

import { useEffect, useState } from "react";

import styles from "./Booking.module.css";
import { useLoading } from "../../../../context/LoadingContext";
import EventSlider from "../../../../components/global/EventSlider/EventSlider";
import toast from "react-hot-toast";

export default function BookingEventsPage() {
  const [events, setEvents] = useState([]);
  const { setLoading: setGlobalLoading } = useLoading();

  const loadEvents = async () => {
    setGlobalLoading(true);

    try {
      const res = await getAllEventsApi();
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
      <EventSlider title="Booked Events" data={events} />
    </div>
  );
}
