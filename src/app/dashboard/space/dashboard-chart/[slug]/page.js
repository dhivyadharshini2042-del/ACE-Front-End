"use client";

import { useEffect, useState, Suspense } from "react";
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

        const res = await getEventBySlugApi(slug);
        console.log("xxxxxxxxxxxxxxxxx",res)

        if (res?.status && res.data) {
          setEvent(res.data);
        } else {
          toast.error("Event not found");
          router.back();
        }
      } catch (err) {
        console.error("DashboardChartPage error:", err);
        toast.error("Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    loadEvent();
  }, [slug]);

  if (!event) return null;

  return (
    <Suspense fallback={null}>
      <DashboardChart
        event={event}
        onBack={() => router.back()}
      />
    </Suspense>
  );
}
