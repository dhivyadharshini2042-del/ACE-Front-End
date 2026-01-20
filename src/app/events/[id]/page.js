"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import CommonEventDetails from "../../../components/global/CommonEventDetails/CommonEventDetails";
import { getEventByIdApi } from "../../../lib/api/event.api";
import { decodeId } from "../../../lib/utils/secureId";
import { useLoading } from "../../../context/LoadingContext";

export default function EventDetailsPage() {
  const { id } = useParams(); 
  const router = useRouter();

  const [event, setEvent] = useState(null);

  const { setLoading } = useLoading();

  useEffect(() => {
    if (!id) return;

    const realEventId = decodeId(id);

    if (!realEventId) {
      router.replace("/");
      return;
    }

    const fetchEvent = async () => {
      setLoading(true); 

      try {
        const res = await getEventByIdApi(realEventId);

        if (res?.status) {
          setEvent(res.data);
        } else {
          router.replace("/");
        }
      } catch (err) {
        router.replace("/");
      } finally {
        setLoading(false); 
      }
    };

    fetchEvent();
  }, [id, router, setLoading]);

  if (!event) return null;

  return (
    <CommonEventDetails
      event={event}
      onBack={() => router.back()}
    />
  );
}
