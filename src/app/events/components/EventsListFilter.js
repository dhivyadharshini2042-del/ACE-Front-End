"use client";

import { useRouter } from "next/navigation";
import { encodeId } from "../../../lib/utils/secureId";
import {
  DATEICON,
  LIKE_ICON,
  LOCATION_ICON,
  SAVEICON,
} from "../../../const-value/config-icons/page";
import { useLoading } from "../../../context/LoadingContext";

export default function EventsListFilter({ events = [] }) {
  const router = useRouter();
  const { setLoading } = useLoading();

  const handleClick = (slug) => {
    if (!slug) return;

    try {
      setLoading(true);
      router.push(`/events/${slug}`);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  /* ===== EVENT STATUS LOGIC ===== */
  const getEventStatus = (startDate, endDate) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);

    const end = endDate ? new Date(endDate) : null;
    if (end) end.setHours(0, 0, 0, 0);

    // Ongoing (range event)
    if (end && today >= start && today <= end) {
      return { label: "Ongoing", type: "ongoing" };
    }

    // Today
    if (today.getTime() === start.getTime()) {
      return { label: "Today", type: "today" };
    }

    // Upcoming
    if (today < start) {
      const diffDays = Math.ceil((start - today) / (1000 * 60 * 60 * 24));
      return {
        label: `${diffDays} day${diffDays > 1 ? "s" : ""} to go`,
        type: "upcoming",
      };
    }

    // Past
    const diffDays = Math.floor((today - start) / (1000 * 60 * 60 * 24));
    return {
      label: `${diffDays} day${diffDays > 1 ? "s" : ""} ago`,
      type: "past",
    };
  };

  /* ===== EMPTY ===== */
  if (!events.length) {
    return (
      <div className="events-empty">
        <img src="/images/no-event-image.png" alt="no image" />
        <p className="mt-5">No events found</p>
      </div>
    );
  }
  /* ===== LIST ===== */
  return (
    <div className="events-list">
      {events.map((e) => {
        const startDate = e.calendars?.[0]?.startDate || e.createdAt;
        const endDate = e.calendars?.[0]?.endDate;

        const status = getEventStatus(startDate, endDate);

        const eventImage = e.bannerImages?.[0];

        return (
          <div key={e.identity} className="event-row-card floating-card">
            {/* FLOATING IMAGE */}
            <div className="floating-image" onClick={() => handleClick(e.slug)}>
              {eventImage ? (
                <img src={eventImage} alt={e.title} />
              ) : (
                <div className="no-image">
                  <img src="/images/no-image.png" alt="no image" />
                </div>
              )}

              {e.offers && <span className="event-offer">Offers</span>}
            </div>

            {/* CONTENT */}
            <div className="event-content">
              {/* TITLE + ACTIONS */}
              <div className="event-title-row">
                <h6 className="event-title" title={e.title}>
                  {e.title}
                </h6>

                <div className="d-flex gap-3 like-save-section">
                  <div>
                    <LIKE_ICON />
                  </div>
                  <div> {SAVEICON}</div>
                </div>
              </div>

              {/* TAG */}
              <span className="tag networking">
                {e.categoryName || "Networking"}
              </span>

              {/* DATE + STATUS */}
              <div className="event-meta-sub">
                <span>
                  {DATEICON}{" "}
                  {new Date(startDate).toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                    weekday: "long",
                  })}
                </span>

                <div className="event-status">
                  <span className={`badge ${status.type}`}>{status.label}</span>
                </div>
              </div>

              {/* LOCATION */}
              <div className="event-meta">
                <span>
                  {LOCATION_ICON} {e.location?.city || "N/A"}
                </span>

                <span
                  className={`mode-text ${e.mode?.toLowerCase() || "offline"}`}
                >
                  <span className="mode-dot" />
                  {e.mode || "Offline"}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
