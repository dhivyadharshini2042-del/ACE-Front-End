"use client";
export const dynamic = "force-dynamic";


import "./organization.css";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { decodeId } from "../../../lib/utils/secureId";

import {
  getApprovedOrganizerEventsApi,
  getOrganizationProfileApi,
} from "../../../lib/api/organizer.api";

import EventSlider from "../../../components/global/EventSlider/EventSlider";
import {
  FACEBOOKICON,
  INSTAGRAMICON,
  LINKEDINICON,
  SHAREICON,
  START_ICON,
  TELEGRAMICON,
  TICKET_COLOR_ICON,
  XICON,
  YOUTUBEICON,
} from "../../../const-value/config-icons/page";
import Footer from "../../../components/global/Footer/Footer";

export default function OrganizationDetailsPage() {
  const { id } = useParams();
  const router = useRouter();

  const [org, setOrg] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const realOrgId = decodeId(id);

  /* SAFETY */
  useEffect(() => {
    if (!realOrgId) {
      router.replace("/");
    }
  }, [realOrgId]);

  /* FETCH ORG PROFILE + EVENTS */
  useEffect(() => {
    if (!realOrgId) return;

    const fetchData = async () => {
      try {
        const [orgRes, eventRes] = await Promise.all([
          getOrganizationProfileApi(realOrgId),
          getApprovedOrganizerEventsApi(realOrgId),
        ]);

        if (orgRes?.status) setOrg(orgRes.data);
        if (eventRes?.status) setEvents(eventRes.data || []);
      } catch {
        router.replace("/");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [realOrgId]);

  if (loading) return null;

  /* SPLIT EVENTS */
  const now = new Date();

  const upcomingEvents = events.filter(
    (e) => new Date(e.eventDate || e.createdAt) >= now
  );

  const pastEvents = events.filter(
    (e) => new Date(e.eventDate || e.createdAt) < now
  );

  return (
    <div className="container-fuiled px-5 py-5 org-page">
      {/* ===== HERO ===== */}
      <button
        className="btn btn-light rounded-pill mb-3 d-inline-flex align-items-center gap-2"
        onClick={() => router.back()}
      >
        🔙 Back
      </button>

      <div className="org-hero position-relative rounded-4 overflow-hidden">
        <img
          src={org?.bannerImage || "/images/event.png"}
          className="w-100 org-hero-img"
          alt={org?.organizationName || "Organization"}
        />

        <span className="badge bg-purple position-absolute top-0 start-0 m-3">
          Upcoming Event
        </span>

        <div className="org-hero-dots">
          <span className="dot active"></span>
          <span className="dot"></span>
          <span className="dot"></span>
          <span className="dot"></span>
        </div>
      </div>

      {/* ===== ORG INFO ===== */}
      <div className="org-info-card shadow-sm rounded-4 p-4 mt-4 d-flex justify-content-between align-items-center flex-wrap gap-3">
        <div className="d-flex align-items-center gap-3">
          {org?.logoUrl ? (
            <img src={org.logoUrl} className="org-logo" />
          ) : (
            <div
              className="org-logo d-flex align-items-center justify-content-center"
              style={{ background: "#1c1c1c", color: "#fff", fontWeight: 700 }}
            >
              {org?.organizationName?.charAt(0) || "O"}
            </div>
          )}

          <div>
            <h5 className="mb-1 fw-bold">
              {org?.organizationName || "Organization"}
            </h5>

            <div className="org-meta">
              <span>
                {TICKET_COLOR_ICON} {events.length} Events
              </span>
              <span>
                {START_ICON} {org?.rating || "0.0"} / {org?.reviewCount || 0}{" "}
                reviews
              </span>
              <span> {org?.rank ? `${org.rank} Rank` : "—"}</span>
            </div>
          </div>
        </div>
        <div>
          <div className="d-flex gap-3 align-items-center">
            {INSTAGRAMICON}
            {LINKEDINICON}
            {YOUTUBEICON}
            {FACEBOOKICON}
            {TELEGRAMICON}
            {XICON} {SHAREICON}
          </div>
          <button className="btn btn-purple px-4 rounded-pill">+ Follow</button>
        </div>
      </div>

      {/* ===== UPCOMING EVENTS (REUSE COMPONENT) ===== */}
      <div className="mt-5">
        <EventSlider
          title="Upcoming Events"
          data={events}
          des="Explore the complete event schedule to find sessions, speakers, and activities that match your interests and needs"
        />
      </div>

      {/* ===== PAST EVENTS (REUSE COMPONENT) ===== */}
      <div className="mt-4">
        <EventSlider title="Past Events" data={pastEvents} />
      </div>
      {/* ===== FOOTER SECTION  ===== */}
      <div className="mt-4">
        <Footer />
      </div>
    </div>
  );
}
