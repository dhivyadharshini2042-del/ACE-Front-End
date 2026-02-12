"use client";

import { useRef, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import {
  DATEICON,
  HEART_ICON,
  LOCATION_ICON,
  SAVEICON,
  TICKET_ICON,
  VIEW_ICON,
} from "../../../const-value/config-icons/page";

import "./EventSlider.css";
import { useLoading } from "../../../context/LoadingContext";

import { likeEventApi, saveEventApi } from "../../../lib/api/event.api";

/* 🔐 SESSION AUTH */
import { getAuthFromSession, isUserLoggedIn } from "../../../lib/auth";
import ConfirmModal from "../../ui/Modal/ConfirmModal";
import { NO_IMAGE_FOUND_IMAGE } from "../../../const-value/config-message/page";
import Tooltip from "../../ui/Tooltip/Tooltip";

/* ================= HELPER ================= */
const getLowestTicketPrice = (tickets = []) => {
  if (!Array.isArray(tickets) || tickets.length === 0) return null;

  const prices = tickets
    .filter((t) => typeof t.price === "number")
    .map((t) => t.price);

  return prices.length ? Math.min(...prices) : null;
};

export default function EventSlider({
  title,
  data = [],
  des,
  loading = false,
}) {
  const router = useRouter();
  const sliderRef = useRef(null);
  const { setLoading } = useLoading();

  /* ================= AUTH (SESSION) ================= */
  const [auth, setAuth] = useState(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [pendingAction, setPendingAction] = useState(null); // "like" | "save"

  useEffect(() => {
    const ok = isUserLoggedIn();
    setLoggedIn(ok);

    if (ok) {
      setAuth(getAuthFromSession());
    }
  }, []);

  /* ================= STATE ================= */
  const [likedCards, setLikedCards] = useState({});
  const [savedCards, setSavedCards] = useState({});
  const [likeCounts, setLikeCounts] = useState({});

  /* ================= INIT FROM API DATA ================= */
  useEffect(() => {
    const liked = {};
    const saved = {};
    const counts = {};

    data.forEach((event) => {
      liked[event.identity] = Boolean(event.isLiked);
      saved[event.identity] = Boolean(event.isSaved);
      counts[event.identity] = event.likeCount || 0;
    });

    setLikedCards(liked);
    setSavedCards(saved);
    setLikeCounts(counts);
  }, [data]);

  /* ================= LIKE ================= */
  const handleLike = async (event) => {
    if (!loggedIn || !auth?.identity) {
      setPendingAction("like");
      setShowLoginModal(true);
      return;
    }

    const eventId = event.identity;
    const wasLiked = likedCards[eventId];

    // optimistic UI
    setLikedCards((prev) => ({
      ...prev,
      [eventId]: !wasLiked,
    }));

    setLikeCounts((prev) => ({
      ...prev,
      [eventId]: wasLiked ? (prev[eventId] || 1) - 1 : (prev[eventId] || 0) + 1,
    }));

    const res = await likeEventApi({
      eventIdentity: eventId,
      userIdentity: auth.identity.identity,
    });

    if (!res?.status) {
      // rollback
      setLikedCards((prev) => ({
        ...prev,
        [eventId]: wasLiked,
      }));

      setLikeCounts((prev) => ({
        ...prev,
        [eventId]: prev[eventId],
      }));

      toast.error("Failed to update like");
    }
  };

  /* ================= SAVE ================= */
  const handleSave = async (event) => {
    if (!loggedIn || !auth?.identity) {
      setPendingAction("save");
      setShowLoginModal(true);
      return;
    }

    const eventId = event.identity;
    const wasSaved = savedCards[eventId];

    // optimistic UI
    setSavedCards((prev) => ({
      ...prev,
      [eventId]: !wasSaved,
    }));

    const res = await saveEventApi({
      eventIdentity: eventId,
      userIdentity: auth.identity.identity,
    });

    if (!res?.status) {
      // rollback
      setSavedCards((prev) => ({
        ...prev,
        [eventId]: wasSaved,
      }));

      toast.error("Failed to save event");
    }
  };

  /* ================= SLIDER ================= */
  const slideLeft = () => {
    sliderRef.current?.scrollBy({
      left: -350,
      behavior: "smooth",
    });
  };

  const slideRight = () => {
    sliderRef.current?.scrollBy({
      left: 350,
      behavior: "smooth",
    });
  };

  const handleClick = (slug) => {
    setLoading(true);
    router.push(`/events/${slug}`);
  };

  const handleCardClick = () => {
    router.push(`/events`);
  };

  const formatDate = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getModeClass = (mode) => {
    if (!mode) return "online";

    switch (mode.toUpperCase()) {
      case "ONLINE":
        return "online";
      case "OFFLINE":
        return "offline";
      case "HYBRID":
        return "hybrid";
      default:
        return "online";
    }
  };

  /* ================= LOADING ================= */
  if (loading) {
    return (
      <section className="container-fluid mt-4 px-5">
        <h5 className="fw-bold">{title}</h5>
        <p className="text-center py-5">Loading events...</p>
      </section>
    );
  }

  /* ================= EMPTY ================= */
  if (!loading && data.length === 0) {
    return (
      <section className="container-fluid mt-4 px-5">
        <h5 className="fw-bold">{title}</h5>
        <p className="text-center text-muted py-4">No events found</p>
      </section>
    );
  }

  /* ================= UI (UNCHANGED) ================= */
  return (
    <>
      <section className="container-fluid mt-4 px-5">
        {/* HEADER */}
        <div className="d-flex justify-content-between align-items-center mb-2">
          <div>
            <h5 className="fw-bold mb-0 land-title">{title}</h5>
            {des && <p className="mt-2">{des}</p>}
          </div>
          <Tooltip text="View All Events">
            <button className="see-all-btn" onClick={handleCardClick}>
              See all
            </button>
          </Tooltip>
        </div>

        <hr />

        {/* NAV */}
        <div className="d-flex justify-content-end gap-4 mb-3">
          <Tooltip text="Scroll Left">
            <button className="scroll-rounded-circle" onClick={slideLeft}>
              ❮
            </button>
          </Tooltip>

          <Tooltip text="Scroll Right">
            <button className="scroll-rounded-circle" onClick={slideRight}>
              ❯
            </button>
          </Tooltip>
        </div>

        {/* SLIDER */}
        <div
          className="d-flex gap-3 overflow-hidden"
          ref={sliderRef}
          style={{ scrollBehavior: "smooth" }}
        >
          {data.map((event) => {
            const calendar = event.calendars?.[0];
            const isLiked = likedCards[event.identity];
            const isSaved = savedCards[event.identity];
            const lowestPrice = getLowestTicketPrice(event.tickets);

            return (
              <div key={event.identity} className="card event-card">
                {/* IMAGE */}
                <div className="event-img-wrapper">
                  <img
                    src={event.bannerImages?.[0] || NO_IMAGE_FOUND_IMAGE}
                    className="event-img"
                    alt={event.title}
                    onClick={() => handleClick(event.slug)}
                  />

                  {/* SAVE ICON – image top right */}
                  <span
                    className="save-on-image"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSave(event);
                    }}
                  >
                    <SAVEICON active={isSaved} />
                  </span>
                </div>

                {/* BODY */}
                <div className="card-body p-3">
                  {/* TITLE + LIKE */}
                  <div className="title-like-row">
                    <span className="fw-semibold card-titel">
                      {event.title}
                    </span>
                    <Tooltip text={isLiked ? "Unlike Event" : "Like Event"}>
                      <div
                        className="like-inline"
                        onClick={() => handleLike(event)}
                      >
                        <HEART_ICON active={isLiked} />
                        <span>{likeCounts[event.identity] ?? 0}</span>
                      </div>
                    </Tooltip>
                  </div>

                  {/* DETAILS */}
                  <div className="mt-2 event-details">
                    <div className="d-flex justify-content-between">
                      <span>
                        {LOCATION_ICON}{" "}
                        {event.location?.city ||
                          event.org?.city ||
                          (event.mode === "ONLINE" ? "Online Event" : "N/A")}
                      </span>

                      <span>
                        {TICKET_ICON}{" "}
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

                      <span className={`mode-text ${getModeClass(event.mode)}`}>
                        <span className="mode-dot"></span>
                        {event.mode || "ONLINE"}
                      </span>
                    </div>
                  </div>

                  <div className="d-flex justify-content-between align-items-center mt-3">
                    <Tooltip text="Total Views">
                      <span className="view-badge">
                        {VIEW_ICON} {event.viewCount || 0}
                      </span>
                    </Tooltip>

                    <span className="badge-paid">
                      {event.categoryName || "No category"}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
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
