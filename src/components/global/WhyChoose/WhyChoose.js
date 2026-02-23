"use client";

import { useEffect, useState } from "react";
import "./WhyChoose.css";

import { getAllEventsApi } from "../../../lib/api/event.api";
import { NO_IMAGE_FOUND_IMAGE } from "../../../const-value/config-message/page";
import { likeEventApi, saveEventApi } from "../../../lib/api/event.api";
import { getAuthFromSession, isUserLoggedIn } from "../../../lib/auth";
import ConfirmModal from "../../ui/Modal/ConfirmModal";
import toast from "react-hot-toast";

import {
  HEART_ICON,
  SAVEICON,
  LOCATION_ICON,
  DATEICON,
  VIEW_ICON,
  OUR_JOURNEY_BG
} from "../../../const-value/config-icons/page";

import{ TOAST_ERROR_MSG_LIKE_UPDATE_FAILED,TOAST_ERROR_MSG_EVENT_SAVE_FAILED} from "../../../const-value/config-message/page";

export default function WhyChoose() {
  const [events, setEvents] = useState([]);
  const [likedCards, setLikedCards] = useState({});
  const [savedCards, setSavedCards] = useState({});
  const [likeCounts, setLikeCounts] = useState({});

  const [auth, setAuth] = useState(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);

  useEffect(() => {
    const ok = isUserLoggedIn();
    setLoggedIn(ok);
    if (ok) {
      setAuth(getAuthFromSession());
    }
  }, []);

  useEffect(() => {
    const liked = {};
    const saved = {};
    const counts = {};
    events.forEach((event) => {
      liked[event.identity] = Boolean(event.isLiked);
      saved[event.identity] = Boolean(event.isSaved);
      counts[event.identity] = event.likeCount || 0;
    });
    setLikedCards(liked);
    setSavedCards(saved);
    setLikeCounts(counts);
  }, [events]);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    const res = await getAllEventsApi({ offset: 0, limit: 20 });
    if (res?.status) {
      setEvents(res.data);
    }
  };

  const handleLike = async (event, e) => {
    e.stopPropagation();
    if (!loggedIn || !auth?.identity) {
      setPendingAction("like");
      setShowLoginModal(true);
      return;
    }
    const eventId = event.identity;
    const wasLiked = likedCards[eventId];
    setLikedCards((prev) => ({ ...prev, [eventId]: !wasLiked }));
    setLikeCounts((prev) => ({
      ...prev,
      [eventId]: wasLiked ? (prev[eventId] || 1) - 1 : (prev[eventId] || 0) + 1,
    }));
    const res = await likeEventApi({
      eventIdentity: eventId,
      userIdentity: auth.identity.identity,
    });
    if (!res?.status) toast.error("Failed to update like");
  };

  const handleSave = async (event, e) => {
    e.stopPropagation();
    if (!loggedIn || !auth?.identity) {
      setPendingAction("save");
      setShowLoginModal(true);
      return;
    }
    const eventId = event.identity;
    const wasSaved = savedCards[eventId];
    setSavedCards((prev) => ({ ...prev, [eventId]: !wasSaved }));
    const res = await saveEventApi({
      eventIdentity: eventId,
      userIdentity: auth.identity.identity,
    });
    if (!res?.status) toast.error("Failed to save event");
  };

  const formatDate = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <>
      {/* ================= WHY CHOOSE ================= */}
      <section className="why-ace container-xl">

        {/* HEADER */}
        <div className="text-center mb-5">
          <h2 className="why-title">
            <span className="text-purple">Why Choose</span> AllCollegeEvent ?
          </h2>
          <p className="why-sub">
            Enjoy a seamless and delightful ticketing experience with these powerful benefits
          </p>
        </div>

        {/* GRID */}
        <div className="why-grid">

          {/* LEFT TOP — Accessible Anywhere */}
          <div className="why-card horizontal card-accessible">
            <div className="why-img-left">
              <img src="/images/businesswomanImage.svg" alt="Accessible Anywhere" />
            </div>
            <div className="why-text">
              <h5>Accessible Anywhere</h5>
              <p>
                Access the platform from any device. All College Event makes
                discovering and joining events quick and convenient whenever
                and wherever you are.
              </p>
            </div>
          </div>

          {/* RIGHT — All-in-One Event Hub (spans 2 rows) */}
          <div className="why-card vertical">
            <h5>All-in-One Event Hub</h5>
            <p>
              From technical conferences to cultural celebrations,
              Allcollegeevent centralizes college events from multiple campuses
              into a single, easy-to-use platform for effortless discovery.
            </p>
            <div className="why-img-bottom">
              <img src="/images/recruitmentSalesImage.svg" alt="All-in-One Event Hub" />
            </div>
          </div>

          {/* LEFT BOTTOM — Built for Students & Organizers */}
          <div className="why-card horizontal card-students">
            <div className="why-img-left">
              <img src="/images/parent-volunteersImage.svg" alt="Built for Students & Organizers" />
            </div>
            <div className="why-text">
              <h5>Built for Students &amp; Organizers</h5>
              <p>
                Students can explore and track events, while organizers can
                publish, manage their events to the right audience efficiently.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* ================= ALL EVENTS SECTION ================= */}
      {/* <section className="all-events-section">
        <h5 className="fw-bold mb-0 land-title mb-4 px-5">All Events</h5>

        <div className="events-scroll-container">
          <div className="events-grid">
            {events.map((event) => {
              const calendar = event.calendars?.[0];
              const lowestPrice = event.tickets?.length
                ? Math.min(...event.tickets.map((t) => t.price || 0))
                : null;

              return (
                <div
                  key={event.identity}
                  className="card event-card clickable-card"
                  onClick={() => handleClick(event.slug)}
                >
                  <div className="event-img-wrapper">
                    <img
                      src={event.bannerImages?.[0] || NO_IMAGE_FOUND_IMAGE}
                      className="event-img"
                      alt={event.title}
                    />
                    <span
                      className="save-on-image"
                      onClick={(e) => handleSave(event, e)}
                    >
                      <SAVEICON active={savedCards[event.identity]} />
                    </span>
                  </div>

                  <div className="card-body p-3">
                    <div className="title-like-row">
                      <span className="fw-semibold card-titel">
                        {event.title}
                      </span>
                      <div
                        className="like-inline"
                        onClick={(e) => handleLike(event, e)}
                      >
                        <HEART_ICON active={likedCards[event.identity]} />
                        <span>{likeCounts[event.identity] ?? 0}</span>
                      </div>
                    </div>

                    <div className="mt-2 event-details">
                      <div className="d-flex justify-content-between">
                        <span>
                          {LOCATION_ICON}{" "}
                          {event.location?.city ||
                            (event.mode === "ONLINE" ? "Online Event" : "N/A")}
                        </span>
                        <span>
                          {lowestPrice === null
                            ? "N/A"
                            : lowestPrice === 0
                              ? "Free"
                              : `₹${lowestPrice}`}
                        </span>
                      </div>

                      <div className="mt-2 d-flex justify-content-between align-items-center">
                        <span>
                          {DATEICON} {formatDate(calendar?.startDate)}
                        </span>
                        <span className="mode-text online">
                          <span className="mode-dot"></span>
                          {event.mode || "ONLINE"}
                        </span>
                      </div>
                    </div>

                    <div className="d-flex justify-content-between align-items-center mt-3">
                      <span className="view-badge">
                        {VIEW_ICON} {event.viewCount || 0}
                      </span>
                      <span className="badge-paid">
                        {event.categoryName || "No category"}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section> */}

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
    </>
  );
}