"use client";

import { useRouter } from "next/navigation";
import EventDetailsView from "../../../components/global/EventDetailsView/EventDetailsView";

export default function EventClient({ event }) {
  const router = useRouter();

  return (
    <EventDetailsView
      event={event}
      onBack={() => router.back()}
    />
  );
}
