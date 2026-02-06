"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";

import DashboardChart from "../DashboardChart";
import { getEventBySlugApi } from "../../../../../lib/api/event.api";
import { useLoading } from "../../../../../context/LoadingContext";

export default function DashboardChartPage() {
  const { slug } = useParams();
  const router = useRouter();
  const { setLoading } = useLoading();

  const [event, setEvent] = useState(null);

  useEffect(() => {
    if (!slug) return;

    const loadEvent = async () => {
      try {
        setLoading(true);

        //  FIX: await + res
        const res = await getEventBySlugApi(slug);

        if (res?.status && res.data) {
          setEvent(res.data);
        } else {
          toast.error("Event not found");
          router.back();
        }
      } catch (err) {
        console.error(" DashboardChartPage error:", err);
        toast.error("Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    loadEvent();
  }, [slug]);

  /* ================= SAFE GUARD ================= */
  if (!event) return null;

  return (
    <DashboardChart
      event={event}
      onBack={() => router.back()}
    />
  );
}
