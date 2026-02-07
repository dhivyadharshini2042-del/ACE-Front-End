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

// 🔐 SESSION AUTH
import { getAuthFromSession, isUserLoggedIn } from "../../../lib/auth";
import ConfirmModal from "../../../components/ui/Modal/ConfirmModal";
import { NO_IMAGE_FOUND_IMAGE } from "../../../const-value/config-message/page";

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

      toast.error("Failed to update like");
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

      toast.error("Failed to update save");
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

          return (
            <div key={e.identity} className="event-row-card floating-card">
              {/* IMAGE */}
              <div
                className="floating-image"
                onClick={() => handleClick(e.slug)}
              >
                <img
                  src={e.bannerImages?.[0] || NO_IMAGE_FOUND_IMAGE}
                  alt={e.title}
                />
              </div>

              {/* CONTENT */}
              <div className="event-content">
                <div className="event-title-row">
                  <h6 className="event-title">{e.title}</h6>

                  <div className="d-flex gap-3 like-save-section">
                    {/* LIKE */}
                    <span
                      onClick={() => handleLike(e)}
                      style={{ cursor: "pointer" }}
                    >
                      <div className="text-center">
                        <HEART_ICON active={likedCards[e.identity]} />
                        <div>{likeCounts[e.identity] ?? 0}</div>
                      </div>
                    </span>

                    {/* SAVE */}
                    <span
                      onClick={() => handleSave(e)}
                      style={{ cursor: "pointer" }}
                    >
                      <SAVEICON active={savedCards[e.identity]} />
                    </span>
                  </div>
                </div>
                <div className="d-flex gap-4">
                  <span className="tag networking">
                    {e.categoryName || "Networking"}
                  </span>
                  <span className="tag mode">{e.mode || "Offline"}</span>
                </div>

                <div className="event-meta-sub">
                  <span>
                    {DATEICON}{" "}
                    {new Date(startDate).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>

                <div className="event-meta mt-2">
                  <span>500 OnWards</span>
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
