"use client";
export const dynamic = "force-dynamic";

import "./organization.css";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { getOrganizationByEventsApi } from "../../../lib/api/organizer.api";

import EventSlider from "../../../components/global/EventSlider/EventSlider";
import {
  DATEICON,
  FACEBOOKICON,
  INSTAGRAMICON,
  LINKEDINICON,
  LOCATION_ICON,
  SHAREICON,
  SINGELEVENTSHARE_ICON,
  START_ICON,
  TELEGRAMICON,
  TICKET_COLOR_ICON,
  VIEW_ICON,
  XICON,
  YOUTUBEICON,
} from "../../../const-value/config-icons/page";
import Footer from "../../../components/global/Footer/Footer";
import { HEART_ICON, SAVEICON } from "../../../const-value/config-icons/page";
import { likeEventApi, saveEventApi } from "../../../lib/api/event.api";
import { getAuthFromSession, isUserLoggedIn } from "../../../lib/auth";
import toast from "react-hot-toast";
import { NO_IMAGE_FOUND_IMAGE } from "../../../const-value/config-message/page";
import ConfirmModal from "../../../components/ui/Modal/ConfirmModal";
import ShareModal from "../../../components/ui/ShareModal/ShareModal";

export default function OrganizationClient({ slug }) {
  const router = useRouter();

  const [data, setData] = useState([]);
  const [currentBanner, setCurrentBanner] = useState(0);
  const [likedMap, setLikedMap] = useState({});
  const [savedMap, setSavedMap] = useState({});
  const [likeCountMap, setLikeCountMap] = useState({});
  const [auth, setAuth] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [pendingAction, setPendingAction] = useState(null); // "like" | "save"
  const [openShare, setOpenShare] = useState(false);

  /* ================= INIT AUTH ================= */
  useEffect(() => {
    if (isUserLoggedIn()) {
      setAuth(getAuthFromSession());
    }
  }, []);

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
        prev === bannerImages.length - 1 ? 0 : prev + 1,
      );
    }, 4000);

    return () => clearInterval(interval);
  }, [bannerImages.length]);

  useEffect(() => {
    const liked = {};
    const saved = {};
    const counts = {};

    data.forEach((e) => {
      liked[e.identity] = !!e.isLiked;
      saved[e.identity] = !!e.isSaved;
      counts[e.identity] = e.likeCount || 0;
    });

    setLikedMap(liked);
    setSavedMap(saved);
    setLikeCountMap(counts);
  }, [data]);

  const handleLike = async (event) => {
    if (!auth?.identity) {
      setPendingAction("like");
      setShowLoginModal(true);
      return;
    }

    const eventId = event.identity;
    const wasLiked = likedMap[eventId];

    // optimistic UI
    setLikedMap((p) => ({ ...p, [eventId]: !wasLiked }));
    setLikeCountMap((p) => ({
      ...p,
      [eventId]: wasLiked ? p[eventId] - 1 : p[eventId] + 1,
    }));

    const res = await likeEventApi({
      eventIdentity: eventId,
      userIdentity: auth.identity,
    });

    if (!res?.status) {
      // rollback
      setLikedMap((p) => ({ ...p, [eventId]: wasLiked }));
      setLikeCountMap((p) => ({ ...p, [eventId]: p[eventId] }));
      toast.error("Failed to like event");
    }
  };

  const handleSave = async (event) => {
    if (!auth?.identity) {
      setPendingAction("save");
      setShowLoginModal(true);
      return;
    }

    const eventId = event.identity;
    const wasSaved = savedMap[eventId];

    setSavedMap((p) => ({ ...p, [eventId]: !wasSaved }));

    const res = await saveEventApi({
      eventIdentity: eventId,
      userIdentity: auth.identity,
    });

    if (!res?.status) {
      setSavedMap((p) => ({ ...p, [eventId]: wasSaved }));
      toast.error("Failed to save event");
    }
  };

  /* ================= UPCOMING / PAST ================= */
  const now = new Date();

  const upcomingEvents = events.filter(
    (e) => new Date(e.calendars?.[0]?.startDate) >= now,
  );

  const pastEvents = events.filter(
    (e) => new Date(e.calendars?.[0]?.startDate) < now,
  );

  return (
    <>
      <div className="container-fuiled px-5 py-5 org-page">
        <button
          className="btn btn-light rounded-pill mb-3"
          onClick={() => router.back()}
        >
          Back
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
            <h1 className="org-name">{org?.organizationName}</h1>
            <div className="org-meta">
              <h4>
                {TICKET_COLOR_ICON} {events.length} Events
              </h4>
              <span>{/* {START_ICON} {org?.rank || "0.0"} */}</span>
            </div>
          </div>

          <div className="d-flex gap-3 align-items-center">
            {INSTAGRAMICON}
            {LINKEDINICON}
            {YOUTUBEICON}
            {FACEBOOKICON}
            {TELEGRAMICON}
            {XICON}
            <span className="share-icon" onClick={() => setOpenShare(true)}>
              {SHAREICON}
            </span>
          </div>
        </div>
        {/* ================= UPCOMING EVENTS ================= */}
        <section className="mt-5">
          <h3 className="event-heading">Upcoming Events</h3>
          <p className="text-muted mb-4" style={{ fontSize: "13px" }}>
            Explore the complete event schedule to find sessions, speakers, and
            activities that match your interests and needs.
          </p>

          <div className="upcoming-grid">
            {upcomingEvents.map((e, index) => (
              <div
                key={e._id ?? `upcoming-${index}`}
                className="event-card-new"
              >
                <img
                  src={e.bannerImages?.[0] || NO_IMAGE_FOUND_IMAGE}
                  alt={e.title}
                  className="event-card-img"
                />

                <div className="event-card-body">
                  <div className="d-flex justify-content-between align-items-center">
                    <h6 className="event-title">{e.title}</h6>

                    <div className="d-flex gap-3">
                      {/* LIKE */}
                      <span
                        onClick={() => handleLike(e)}
                        style={{ cursor: "pointer" }}
                      >
                        <div className="d-flex flex-column align-items-center">
                          <HEART_ICON active={likedMap[e.identity]} />
                          <small>{likeCountMap[e.identity] ?? 0}</small>
                        </div>
                      </span>

                      {/* SAVE */}
                      <span
                        onClick={() => handleSave(e)}
                        style={{ cursor: "pointer" }}
                      >
                        <SAVEICON active={savedMap[e.identity]} />
                      </span>
                    </div>
                  </div>

                  <p className="event-meta location-text">
                    {LOCATION_ICON}{" "}
                    {[e.location?.venue, e.location?.country]
                      .filter(Boolean)
                      .join(", ")}
                  </p>
                  <div className="d-flex justify-content-between align-items-center">
                    <p className="event-meta">
                      {DATEICON}{" "}
                      {new Date(e.calendars?.[0]?.startDate).toDateString()}
                    </p>
                    <span className="view-badge">
                      {VIEW_ICON} {e.viewCount || 0}
                    </span>
                  </div>

                  <div className="event-footer">
                    <span className="badge-paid rounded-pill px-2 py-1">
                      {e.eventType || "Conference"}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ================= PAST EVENTS ================= */}
        <section className="mt-5">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h3 className="event-heading">Past Events</h3>

            <div className="d-flex gap-2">
              <button className="btn btn-light rounded-circle">‹</button>
              <button className="btn btn-light rounded-circle">›</button>
            </div>
          </div>

          <div className="past-grid">
            {upcomingEvents.map((e, index) => (
              <div key={e._id ?? `past-${index}`} className="past-card">
                <img
                  src={e.bannerImages?.[0] || NO_IMAGE_FOUND_IMAGE}
                  alt={e.title}
                />

                <div className="past-overlay">
                  <h6 className="past-title">{e.title}</h6>
                  <span className="past-date">
                    {new Date(e.calendars?.[0]?.startDate).toDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        <Footer />
      </div>
      <ConfirmModal
        open={showLoginModal}
        image="/images/logo.png"
        title="Login Required"
        description={
          pendingAction === "like"
            ? "You need to login to like this event."
            : "You need to login to save this event."
        }
        onCancel={() => {
          setShowLoginModal(false);
          setPendingAction(null);
        }}
        onConfirm={() => {
          setShowLoginModal(false);
          setPendingAction(null);
          router.push("/auth/user/login");
        }}
      />
      <ShareModal
        open={openShare}
        onClose={() => setOpenShare(false)}
        title={org?.organizationName || "Event"}
      />
    </>
  );
}
