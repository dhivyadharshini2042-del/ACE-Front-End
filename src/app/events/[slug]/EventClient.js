"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import EventDetailsView from "../../../components/global/EventDetailsView/EventDetailsView";
import { getEventBySlugApi } from "../../../lib/api/event.api";
import { isUserLoggedIn } from "../../../lib/auth";

export default function EventClient({ event }) {
  const router = useRouter();
  const [eventData, setEventData] = useState(event);

  useEffect(() => {
    // 🔐 ONLY CLIENT CAN CHECK LOGIN
    if (!isUserLoggedIn()) return;

    const loadPrivateEvent = async () => {
      const res = await getEventBySlugApi(event.slug);

      // 👇 now this will hit PRIVATE API
      if (res?.status) {
        setEventData(res.data);
      }
    };

    loadPrivateEvent();
  }, [event.slug]);

  return (
    <EventDetailsView
      event={eventData}
      onBack={() => router.back()}
    />
  );
}
