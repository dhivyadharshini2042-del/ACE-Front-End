"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";

import DashboardChart from "./DashboardChart";
import { getEventBySlugApi } from "../../../../lib/api/event.api";
import { useLoading } from "../../../../context/LoadingContext";
import { TOAST_ERROR_MSG_SOMETHING_WENT_WRONG,TOAST_ERROR_MSG_EVENT_NOT_FOUND } from "../../../../const-value/config-message/page";

export default function DashboardChartPage() {
  const { slug } = useParams();
  const router = useRouter();
  const { setLoading } = useLoading();

  const [event, setEvent] = useState(null);

  useEffect(() => {
    console.log("xxxxxxxxx",slug)
    if (!slug) return;

    const loadEvent = async () => {
      try {
        setLoading(true);

        const res = await getEventBySlugApi(slug);

        if (res?.status && res.data) {
          setEvent(res.data);
        } else {
          toast.error(TOAST_ERROR_MSG_EVENT_NOT_FOUND);
        }
      } catch (err) {
        console.log("API Error:", err);
        toast.error(TOAST_ERROR_MSG_SOMETHING_WENT_WRONG);
      } finally {
        setLoading(false);
      }
    };

    loadEvent();
  }, [slug]);

  if (!event) return null;

  return <DashboardChart event={event} onBack={() => router.back()} />;
}
