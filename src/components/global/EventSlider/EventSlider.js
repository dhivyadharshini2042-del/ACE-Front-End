"use client";

import { useRef, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

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

import { getUserData, isUserLoggedIn } from "../../../lib/auth";
import { likeEventApi, saveEventApi } from "../../../lib/api/event.api";
import toast from "react-hot-toast";

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
      liked[event.identity] = event.isLiked;
      saved[event.identity] = event.isSaved;
      counts[event.identity] = event.likeCount || 0;
    });

    setLikedCards(liked);
    setSavedCards(saved);
    setLikeCounts(counts);
  }, [data]);

  /* ================= ACTIONS ================= */

  const handleLike = async (event) => {
    if (!isUserLoggedIn()) {
      toast("Please login to like events", {
        icon: "⚠️",
        className: "toast-warning",
      });
      return;
    }

    const user = getUserData();
    const eventId = event.identity;

    const payload = {
      eventIdentity: eventId,
      userIdentity: user.identity,
    };

    const wasLiked = likedCards[eventId];

    setLikedCards((prev) => ({
      ...prev,
      [eventId]: !wasLiked,
    }));

    setLikeCounts((prev) => ({
      ...prev,
      [eventId]: wasLiked
        ? prev[eventId] - 1 
        : prev[eventId] + 1, 
    }));

    const res = await likeEventApi(payload);

    if (res?.status) {
      toast.success(wasLiked ? "Like removed" : "Event liked successfully", {
        className: "toast-success",
      });
    } else {
      setLikedCards((prev) => ({
        ...prev,
        [eventId]: wasLiked,
      }));

      setLikeCounts((prev) => ({
        ...prev,
        [eventId]: prev[eventId],
      }));

      toast.error("Failed to update like", {
        className: "toast-error",
      });
    }
  };

  const handleSave = async (event) => {
    if (!isUserLoggedIn()) {
      toast("Please login to save events", {
        icon: "⚠️",
        className: "toast-warning",
      });
      return;
    }

    const user = getUserData();

    const payload = {
      eventIdentity: event.identity,
      userIdentity: user.identity,
    };

    setSavedCards((prev) => ({
      ...prev,
      [event.identity]: !prev[event.identity],
    }));

    const res = await saveEventApi(payload);

    if (res?.status) {
      toast.success("Event saved successfully", {
        className: "toast-success",
      });
    } else {
      setSavedCards((prev) => ({
        ...prev,
        [event.identity]: !prev[event.identity],
      }));

      toast.error("Failed to save event", {
        className: "toast-error",
      });
    }
  };

  /* ================= SLIDER ================= */
  const slideLeft = () => {
    sliderRef.current?.scrollBy({ left: -350, behavior: "smooth" });
  };

  const slideRight = () => {
    sliderRef.current?.scrollBy({ left: 350, behavior: "smooth" });
  };

  const handleClick = (slug) => {
    setLoading(true);
    router.push(`/events/${slug}`);
  };

  const formatDate = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
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

  /* ================= UI ================= */
  return (
    <section className="container-fluid mt-4 px-5">
      {/* HEADER */}
      <div className="d-flex justify-content-between align-items-center mb-2">
        <div>
          <h5 className="fw-bold mb-0 land-title">{title}</h5>
          {des && <p className="mt-2">{des}</p>}
        </div>
      </div>

      <hr />

      {/* NAV */}
      <div className="d-flex justify-content-end gap-4 mb-3">
        <button className="scroll-rounded-circle" onClick={slideLeft}>
          ❮
        </button>
        <button className="scroll-rounded-circle" onClick={slideRight}>
          ❯
        </button>
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
              <img
                src={event.bannerImages?.[0] || "/images/event.png"}
                className="event-img"
                alt={event.title}
                onClick={() => handleClick(event.slug)}
              />

              <div className="card-body p-3">
                <div className="d-flex justify-content-between align-items-start mt-2">
                  <span className="fw-semibold card-titel">{event.title}</span>
                  {/* SAVE */}
                  <span
                    onClick={() => handleSave(event)}
                    className={isSaved ? "save-active" : "save-inactive"}
                  >
                    <SAVEICON active={isSaved} />
                  </span>
                  {/* LIKE */}
                  <div
                    onClick={() => handleLike(event)}
                    className="text-center"
                  >
                    <HEART_ICON active={isLiked} />
                    <p>{likeCounts[event.identity] ?? 0}</p>
                  </div>
                </div>

                <div className="mt-2 event-details">
                  <div className="d-flex justify-content-between">
                    <span>
                      {LOCATION_ICON} {event.location?.city || "N/A"}
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

                  <div className="mt-2">
                    {DATEICON} {formatDate(calendar?.startDate)}
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
    </section>
  );
}
