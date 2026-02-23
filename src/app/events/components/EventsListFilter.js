"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import {
  DATEICON,
  LOCATION_ICON,
  SAVEICON,
  HEART_ICON,
} from "../../../const-value/config-icons/page";

import { useLoading } from "../../../context/LoadingContext";
import { likeEventApi, saveEventApi } from "../../../lib/api/event.api";

// SESSION AUTH
import { getAuthFromSession, isUserLoggedIn } from "../../../lib/auth";
import ConfirmModal from "../../../components/ui/Modal/ConfirmModal";
import { NO_IMAGE_FOUND_IMAGE , TOAST_ERROR_MSG_LIKE_UPDATE_FAILED, TOAST_ERROR_MSG_SAVE_UPDATE_FAILED} from "../../../const-value/config-message/page";
import "../EventsModernCard.css";

const categoryColorMap = {
  Education: "#DBEAFE", // Light Blue
  Sports: "#DCFCE7", // Light Green
  Entertainment: "#E9D4FF", // Light Purple
  Networking: "#FEF3C7", // Light Orange
  Others: "#E5E7EB", // Light Gray
};

const categoryTextColorMap = {
  Education: "#1E40AF",
  Sports: "#166534",
  Entertainment: "#6B21A8",
  Networking: "#92400E",
  Others: "#374151",
};

export default function EventsListFilter({ events = [] }) {
  const router = useRouter();
  const { setLoading } = useLoading();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [pendingAction, setPendingAction] = useState(null); // "like" | "save"

  /* ================= AUTH (SESSION) ================= */
  const [auth, setAuth] = useState(null);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const ok = isUserLoggedIn();
    setLoggedIn(ok);

    if (ok) {
      setAuth(getAuthFromSession());
    }
  }, []);

  /* ================= STATES ================= */
  const [likedCards, setLikedCards] = useState({});
  const [likeCounts, setLikeCounts] = useState({});
  const [savedCards, setSavedCards] = useState({});

  /* ================= INIT FROM API DATA ================= */
  useEffect(() => {
    const liked = {};
    const counts = {};
    const saved = {};

    events.forEach((e) => {
      liked[e.identity] = !!e.isLiked;
      counts[e.identity] = e.likeCount || 0;
      saved[e.identity] = !!e.isSaved;
    });

    setLikedCards(liked);
    setLikeCounts(counts);
    setSavedCards(saved);
  }, [events]);

  /* ================= LIKE HANDLER ================= */
  const handleLike = async (e) => {
    if (!loggedIn || !auth?.identity) {
      setPendingAction("like");
      setShowLoginModal(true);
      return;
    }

    const eventId = e.identity;
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

      toast.error(TOAST_ERROR_MSG_LIKE_UPDATE_FAILED);
    }
  };

  /* ================= SAVE HANDLER ================= */
  const handleSave = async (e) => {
    if (!loggedIn || !auth?.identity) {
      setPendingAction("save");
      setShowLoginModal(true);
      return;
    }

    const eventId = e.identity;
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

      toast.error(TOAST_ERROR_MSG_SAVE_UPDATE_FAILED);
    }
  };

  /* ================= ROUTE ================= */
  const handleClick = (slug) => {
    if (!slug) return;
    setLoading(true);
    router.push(`/events/${slug}`);
  };

  /* ================= EMPTY ================= */
  if (!events.length) {
    return (
      <div className="events-empty">
        <img src="/images/no-event-image.png" alt="no image" />
        <p className="mt-5">No events found</p>
      </div>
    );
  }


  /* ================= UI (UNCHANGED) ================= */
  return (
    <>
      <div className="events-list">
        {events.map((e) => {
          const startDate = e.calendars?.[0]?.startDate || e.createdAt;
          const endDate = e.calendars?.[0]?.endDate;

          const formattedDate = new Date(startDate).toLocaleDateString(
            "en-IN",
            {
              day: "2-digit",
              month: "short",
              year: "numeric",
            },
          );

          return (
            <div key={e.identity} className="modern-card">
              {/* LEFT IMAGE */}
              <div className="modern-image" onClick={() => handleClick(e.slug)}>
                <img
                  src={e.bannerImages?.[0] || NO_IMAGE_FOUND_IMAGE}
                  alt={e.title}
                />
              </div>

              {/* RIGHT CONTENT */}
              <div className="modern-content">
                {/* TITLE + LIKE/SAVE */}
                <div className="modern-title-row">
                  <h4 className="modern-title">{e.title}</h4>

                  <div className="modern-actions">
                    <div onClick={() => handleLike(e)} className="action-box">
                      <HEART_ICON active={likedCards[e.identity]} />
                      <span>{likeCounts[e.identity] ?? 0}</span>
                    </div>

                    <div onClick={() => handleSave(e)} className="action-box">
                      <SAVEICON active={savedCards[e.identity]} />
                    </div>
                  </div>
                </div>

                {/* DESCRIPTION */}
                <div className="modern-desc">
               {e.description?.slice(0, 180)}...
                </div>

                {/* LOCATION + DATE */}
                <div className="modern-meta">
                  <span>
                    {" "}
                    {DATEICON} {e.location?.venue || "Location not specified"} |{" "}
                    {formattedDate} | Mode - {e.mode}
                  </span>
                </div>

                {/* CATEGORY + PRICE */}
                <div className="modern-footer">
                  <span
                    className="modern-category"
                    style={{
                      background: categoryColorMap[e.categoryName] || "#E9D4FF",
                      color: categoryTextColorMap[e.categoryName] || "#5B21B6",
                    }}
                  >
                    {e.categoryName || "Event"}
                  </span>

                  <span className="modern-price">
                    {e.tickets?.[0]?.isPaid
                      ? `₹ ${e.tickets?.[0]?.price || 0} onwards`
                      : "Free"}
                  </span>

                  <span className="modern-status ongoing">Upcoming</span>
                </div>
              </div>
            </div>
          );
        })}
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
    </>
  );
}
