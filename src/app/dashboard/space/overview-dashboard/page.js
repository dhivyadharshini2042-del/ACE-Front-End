"use client";

import { useEffect, useState } from "react";
import { useLoading } from "../../../../context/LoadingContext";
import toast from "react-hot-toast";

import OverviewDashboardChart from "./OverviewDashboardChart";
import { getApprovedOrganizerEventsApi } from "../../../../lib/api/organizer.api";
import { getOrganizationProfileApi } from "../../../../lib/api/organizer.api";
import { getUserData } from "../../../../lib/auth";

export default function OverviewDashboardPage() {
  const { setLoading } = useLoading();
  const [events, setEvents] = useState([]);

  useEffect(() => {
    async function loadEvents() {
      try {
        setLoading(true);

        const user = getUserData();
        if (!user?.identity) return;

        const profileRes = await getOrganizationProfileApi(user.identity);

        if (!profileRes?.status) {
          toast.error("Unable to load organization profile");
          return;
        }

        const orgIdentity = profileRes.data.slug; 

        const eventsRes = await getApprovedOrganizerEventsApi(orgIdentity);

        if (eventsRes?.status) {
          setEvents(eventsRes.data); 
        }
      } catch (err) {
        toast.error("Unable to load overview dashboard");
      } finally {
        setLoading(false);
      }
    }

    loadEvents();
  }, []);

  if (events.length === 0) return null;

  return <OverviewDashboardChart events={events} />;
}
