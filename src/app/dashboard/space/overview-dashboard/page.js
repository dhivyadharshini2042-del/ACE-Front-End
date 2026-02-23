"use client";

import { useEffect, useState } from "react";
import { useLoading } from "../../../../context/LoadingContext";
import toast from "react-hot-toast";

import OverviewDashboardChart from "./OverviewDashboardChart";
import {
  getApprovedOrganizerEventsApi,
  getOrganizationProfileApi,
} from "../../../../lib/api/organizer.api";

// SESSION AUTH
import {
  getAuthFromSession,
  isUserLoggedIn,
} from "../../../../lib/auth";
import { TOAST_ERROR_MSG_ORGANIZATION_PROFILE_LOAD_FAILED,TOAST_ERROR_MSG_OVERVIEW_DASHBOARD_LOAD_FAILED } from "../../../../const-value/config-message/page";

export default function OverviewDashboardPage() {
  const { setLoading } = useLoading();
  const [events, setEvents] = useState([]);

  // SESSION STATE
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

        // Organizer only
        if (!loggedIn || auth?.type !== "org") {
          setEvents([]);
          return;
        }

        const orgId = auth.identity.identity;

        if (!orgId) {
          setEvents([]);
          return;
        }

        // Load organization profile
        const profileRes = await getOrganizationProfileApi(orgId);

        if (!profileRes?.status) {
          toast.error(TOAST_ERROR_MSG_ORGANIZATION_PROFILE_LOAD_FAILED);
          return;
        }

        // slug needed for approved events API
        const orgSlug = profileRes.data.slug;

        // Load approved events
        const eventsRes = await getApprovedOrganizerEventsApi(orgSlug);

        if (eventsRes?.status) {
          setEvents(eventsRes.data || []);
        }
      } catch (err) {
        toast.error(TOAST_ERROR_MSG_OVERVIEW_DASHBOARD_LOAD_FAILED);
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
