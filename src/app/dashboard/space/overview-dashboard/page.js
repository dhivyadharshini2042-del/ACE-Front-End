"use client";

import { useEffect, useState } from "react";
import { useLoading } from "../../../../context/LoadingContext";
import toast from "react-hot-toast";

import OverviewDashboardChart from "./OverviewDashboardChart";
import {
  getApprovedOrganizerEventsApi,
  getOrganizationProfileApi,
} from "../../../../lib/api/organizer.api";

// 🔐 SESSION AUTH
import {
  getAuthFromSession,
  isUserLoggedIn,
} from "../../../../lib/auth";

export default function OverviewDashboardPage() {
  const { setLoading } = useLoading();
  const [events, setEvents] = useState([]);

  // 🔐 SESSION STATE
  const [auth, setAuth] = useState(null);
  const [loggedIn, setLoggedIn] = useState(false);

  /* ================= INIT AUTH ================= */
  useEffect(() => {
    const ok = isUserLoggedIn();
    setLoggedIn(ok);

    if (ok) {
      setAuth(getAuthFromSession());
    }
  }, []);

  /* ================= LOAD EVENTS ================= */
  useEffect(() => {
    async function loadEvents() {
      try {
        setLoading(true);

        // 🔐 Organizer only
        if (!loggedIn || auth?.type !== "org") {
          setEvents([]);
          return;
        }

        const orgId = auth.identity.identity;

        if (!orgId) {
          setEvents([]);
          return;
        }

        // 1️⃣ Load organization profile
        const profileRes = await getOrganizationProfileApi(orgId);

        if (!profileRes?.status) {
          toast.error("Unable to load organization profile");
          return;
        }

        // slug needed for approved events API
        const orgSlug = profileRes.data.slug;

        // 2️⃣ Load approved events
        const eventsRes = await getApprovedOrganizerEventsApi(orgSlug);

        if (eventsRes?.status) {
          setEvents(eventsRes.data || []);
        }
      } catch (err) {
        toast.error("Unable to load overview dashboard");
        setEvents([]);
      } finally {
        setLoading(false);
      }
    }

    loadEvents();
  }, [loggedIn, auth?.identity, auth?.type]);

  if (!events.length) return null;

  /* ================= UI (UNCHANGED) ================= */
  return <OverviewDashboardChart events={events} />;
}
