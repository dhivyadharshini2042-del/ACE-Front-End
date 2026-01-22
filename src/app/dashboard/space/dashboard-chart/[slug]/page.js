"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import toast from "react-hot-toast";
import DashboardChart from "../DashboardChart";
import { getEventBySlugApi } from "../../../../../lib/api/event.api";
import { useLoading } from "../../../../../context/LoadingContext";
import { useRouter } from "next/navigation";


export default function DashboardChartPage() {
  const { slug } = useParams();
  const { setLoading } = useLoading();
  const [event, setEvent] = useState(null);
  const router = useRouter();


  useEffect(() => {
    async function loadEvent() {
      try {
        setLoading(true);
        const res = await getEventBySlugApi(slug);
        if (res?.status) {
          setEvent(res.data);
        } else {
          toast.error("Event not found");
        }
      } catch {
        toast.error("Something went wrong");
      } finally {
        setLoading(false);
      }
    }

    if (slug) loadEvent();
  }, [slug]);

  const handleBack = () => {
    router.back(); 
  };

  if (!event) return null;

  return <DashboardChart event={event} onBack={handleBack}/>;
}
