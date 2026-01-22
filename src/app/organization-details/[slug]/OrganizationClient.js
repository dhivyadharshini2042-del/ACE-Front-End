"use client";
export const dynamic = "force-dynamic";

import "./organization.css";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { getOrganizationByEventsApi } from "../../../lib/api/organizer.api";

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

export default function OrganizationClient({ slug }) {
  const router = useRouter();

  const [data, setData] = useState([]);
  const [currentBanner, setCurrentBanner] = useState(0);

  /* ================= FETCH EVENTS ================= */
  useEffect(() => {
    if (!slug) return;

    console.log("Slug received:", slug);

    const fetchData = async () => {

      try {
        const res = await getOrganizationByEventsApi(slug);
        console.log("API response:", res);

        setData(res?.data || []);
      } catch (err) {
        console.error("API error:", err);
        setData([]);
      } finally {
      }
    };

    fetchData();
  }, [slug]);

  const org = data?.[0]?.org || null;
  const events = data;

  /* ================= BANNER IMAGES ================= */
  const bannerImages =
    events.flatMap((e) => e.bannerImages || []).length > 0
      ? events.flatMap((e) => e.bannerImages || [])
      : ["/images/event.png"];

  /* ================= AUTO SLIDE ================= */
  useEffect(() => {
    if (bannerImages.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentBanner((prev) =>
        prev === bannerImages.length - 1 ? 0 : prev + 1
      );
    }, 4000);

    return () => clearInterval(interval);
  }, [bannerImages.length]);

  /* ================= UPCOMING / PAST ================= */
  const now = new Date();

  const upcomingEvents = events.filter(
    (e) => new Date(e.calendars?.[0]?.startDate) >= now
  );

  const pastEvents = events.filter(
    (e) => new Date(e.calendars?.[0]?.startDate) < now
  );

  return (
    <div className="container-fuiled px-5 py-5 org-page">
      <button
        className="btn btn-light rounded-pill mb-3"
        onClick={() => router.back()}
      >
        🔙 Back
      </button>

      {/* ===== HERO ===== */}
      <div className="org-hero position-relative rounded-4 overflow-hidden">
        <img
          src={bannerImages[currentBanner]}
          className="w-100 org-hero-img"
          alt={org?.organizationName || "Organization"}
        />

        <div className="org-hero-dots">
          {bannerImages.map((_, i) => (
            <span
              key={i}
              className={`dot ${i === currentBanner ? "active" : ""}`}
              onClick={() => setCurrentBanner(i)}
            />
          ))}
        </div>
      </div>

      {/* ===== ORG INFO ===== */}
      <div className="org-info-card shadow-sm rounded-4 p-4 mt-4 d-flex justify-content-between">
        <div>
          <h5 className="fw-bold">{org?.organizationName}</h5>
          <div className="org-meta">
            <span>
              {TICKET_COLOR_ICON} {events.length} Events
            </span>
            <span>
              {START_ICON} {org?.rating || "0.0"}
            </span>
          </div>
        </div>

        <div className="d-flex gap-3 align-items-center">
          {INSTAGRAMICON}
          {LINKEDINICON}
          {YOUTUBEICON}
          {FACEBOOKICON}
          {TELEGRAMICON}
          {XICON} {SHAREICON}
        </div>
      </div>

      <div className="mt-5">
        <EventSlider title="Upcoming Events" data={upcomingEvents} />
      </div>

      <div className="mt-4">
        <EventSlider title="Past Events" data={pastEvents} />
      </div>

      <Footer />
    </div>
  );
}
