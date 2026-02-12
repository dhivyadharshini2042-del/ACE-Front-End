"use client";
// export const dynamic = "force-dynamic";

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
import PaginationBar from "../../events/components/PaginationBar";

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
  const [loading, setLoading] = useState(true);
  const [pastIndex, setPastIndex] = useState(0);
  const PAST_PER_PAGE = 5;
  const [page, setPage] = useState(1);
  const PER_PAGE = 15;

  /* ================= INIT AUTH ================= */
  useEffect(() => {
    if (isUserLoggedIn()) {
      setAuth(getAuthFromSession());
    }
  }, []);

  /* ================= FETCH EVENTS ================= */
  useEffect(() => {
    if (!slug) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await getOrganizationByEventsApi(slug);
        setData(res?.data || []);
      } catch (err) {
        setData([]);
      } finally {
        setLoading(false);
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
      userIdentity: auth.identity.identity,
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
      userIdentity: auth.identity.identity,
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

  const paginatedUpcoming = upcomingEvents.slice(
    (page - 1) * PER_PAGE,
    page * PER_PAGE,
  );

  const totalPages = Math.ceil(upcomingEvents.length / PER_PAGE);

  const pastEvents = events.filter(
    (e) => new Date(e.calendars?.[0]?.startDate) < now,
  );

  const visiblePastEvents = pastEvents.slice(
    pastIndex,
    pastIndex + PAST_PER_PAGE,
  );

  const handlePastPrev = () => {
    setPastIndex((prev) => Math.max(prev - PAST_PER_PAGE, 0));
  };

  const handlePastNext = () => {
    setPastIndex((prev) =>
      prev + PAST_PER_PAGE < pastEvents.length ? prev + PAST_PER_PAGE : prev,
    );
  };

  return (
    <>
      <div className="container-fuiled px-5 py-5 org-page">
        {/* <button
          className="btn btn-light rounded-pill mb-3"
          onClick={() => router.back()}
        >
          Back
        </button> */}

        {/* ===== HERO ===== */}
        <div className="org-hero position-relative overflow-hidden">
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

        {/* ================= ORG INFO ================= */}
        <div className="org-info-card rounded-4 p-4 mt-4">
          {/* ===== HEADER ===== */}
          <div className="org-header-row">
            <div>
              <h1 className="org-name d-flex align-items-center gap-2">
                {org?.organizationName}
                {org?.isVerified && (
                  <span className="verified-badge">✔ Verified</span>
                )}
              </h1>

              <p className="org-subtext">
                {org?.organizationCategory?.toUpperCase()} Organization
              </p>
            </div>

            <div className="org-header-actions">
              {org?.website && (
                <a
                  href={org.website}
                  target="_blank"
                  rel="noreferrer"
                  className="org-action-btn"
                >
                  Visit Website
                </a>
              )}
              <div onClick={() => setOpenShare(true)}>{SHAREICON}</div>
            </div>
          </div>

          {/* ===== META DETAILS ===== */}
          <div className="org-meta-grid">
            <div className="meta-chip">
              {org?.city}, {org?.state}
            </div>
            <div className="meta-chip">{org?.country}</div>
            <div className="meta-chip">{events.length} Events</div>
            <div className="meta-chip">
              Since {new Date(org?.createdAt).getFullYear()}
            </div>
          </div>

          {/* ===== STATS ===== */}
          <div className="org-stats-grid">
            <div className="stat-card primary">
              <strong>{events.length}</strong>
              <span>Total Events</span>
            </div>

            <div className="stat-card sec">
              <strong>{upcomingEvents.length}</strong>
              <span>Upcoming Events</span>
            </div>

            <div className="stat-card th">
              <strong>{pastEvents.length}</strong>
              <span>Past Events</span>
            </div>

            <div
              className={`stat-card ${org?.isActive ? "active" : "inactive"}`}
            >
              <strong>{org?.isActive ? "Active" : "Inactive"}</strong>
              <span>Status</span>
            </div>
          </div>

          {/* ===== SOCIAL ===== */}
          <div className="org-social-full">
            <span className="social-label">Follow us</span>
            <div className="social-icons">
              {INSTAGRAMICON}
              {FACEBOOKICON}
              {LINKEDINICON}
              {YOUTUBEICON}
              {TELEGRAMICON}
              {XICON}
            </div>
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
            {paginatedUpcoming.map((e, index) => (
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
                    {LOCATION_ICON}

                    {e.mode === "ONLINE" ? (
                      e.location?.onlineMeetLink ? (
                        <a
                          href={e.location.onlineMeetLink}
                          target="_blank"
                          rel="noreferrer"
                          className="online-link"
                        >
                          Online Event – Join Link
                        </a>
                      ) : (
                        <span>Online Event</span>
                      )
                    ) : (
                      <span>
                        {[
                          e.location?.venue,
                          e.location?.city,
                          e.location?.state,
                        ]
                          .filter(Boolean)
                          .join(", ")}
                      </span>
                    )}
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
        <PaginationBar page={page} total={totalPages} onChange={setPage} />

        {/* ================= PAST EVENTS ================= */}
        <section className="mt-5">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h3 className="event-heading">Past Events</h3>

            <div className="d-flex justify-content-end gap-4 mb-3">
              <button
                className="scroll-rounded-circle"
                onClick={handlePastPrev}
                disabled={pastIndex === 0}
              >
                ❮
              </button>
              <button
                className="scroll-rounded-circle"
                onClick={handlePastNext}
                disabled={pastIndex + PAST_PER_PAGE >= pastEvents.length}
              >
                ❯
              </button>
            </div>
          </div>

          <div className="past-grid">
            {pastEvents.length === 0 ? (
              <div className="text-center py-5">
                <img
                  src="/images/no-data-image.png"
                  alt="No past events"
                  style={{ width: "180px", opacity: 0.8 }}
                />
                <p className="mt-3 text-muted">No past events yet</p>
              </div>
            ) : (
              <div className="past-grid">
                {visiblePastEvents.map((e, index) => (
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
            )}
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
