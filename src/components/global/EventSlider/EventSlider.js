"use client";

import { useRef } from "react";
import { useRouter } from "next/navigation";
import { encodeId } from "../../../lib/utils/secureId";

import {
  DATEICON,
  LOCATION_ICON,
  SAVEICON,
  TICKET_ICON,
  VIEW_ICON,
} from "../../../const-value/config-icons/page";

import "./EventSlider.css";

export default function EventSlider({ title, data = [], des }) {
  const router = useRouter();
  const sliderRef = useRef(null);

  const slideLeft = () => {
    sliderRef.current?.scrollBy({ left: -350, behavior: "smooth" });
  };

  const slideRight = () => {
    sliderRef.current?.scrollBy({ left: 350, behavior: "smooth" });
  };

  const handleClick = (eventId) => {
    router.push(`/events/${encodeId(eventId)}`);
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

  return (
    <section className="container-fluid mt-4 px-5">
      {/* HEADER */}
      <div className="d-flex justify-content-between align-items-center mb-2">
        <div>
          <h5 className="fw-bold mb-0 land-title">{title}</h5>
          <p className="mt-4">{des}</p>
        </div>
        <button className="see-all-btn" onClick={handleCardClick}>
          See all
        </button>
      </div>

      <hr />

      {/* NAV BUTTONS */}
      <div className="d-flex justify-content-end gap-2 mb-2">
        <button className="btn btn-light rounded-circle" onClick={slideLeft}>
          ❮
        </button>
        <button className="btn btn-light rounded-circle" onClick={slideRight}>
          ❯
        </button>
      </div>

      {data.length === 0 ? (
        <p className="text-center text-muted py-4">No events found</p>
      ) : (
        <div
          className="d-flex gap-3 overflow-hidden"
          ref={sliderRef}
          style={{ scrollBehavior: "smooth" }}
        >
          {data.map((event, index) => {
            const calendar = event.calendars?.[0];

            return (
              <div
                key={event.identity ?? index}
                className="card event-card"
                onClick={() => handleClick(event.identity)}
              >
                {/* IMAGE */}
                <img
                  src={event.bannerImages?.[0]}
                  className="event-img"
                  alt="Event"
                />

                <div className="card-body p-3">
                  {/* TITLE */}
                  <div className="d-flex justify-content-between align-items-center mt-2">
                    <span className="fw-semibold card-titel">
                      {event.title || "Untitled Event"}
                    </span>
                    {SAVEICON}
                  </div>

                  {/* DETAILS */}
                  <div className="mt-2 event-details">
                    <div className="d-flex justify-content-between">
                      <span className="ellipsis">
                        {LOCATION_ICON} {event.location?.city || "N/A"}
                      </span>

                      <span>{TICKET_ICON} 500</span>
                    </div>

                    {/* DATE */}
                    <div className="mt-2">
                      {DATEICON} {formatDate(calendar?.startDate)}
                    </div>
                  </div>

                  {/* FOOTER */}
                  <div className="d-flex justify-content-between align-items-center mt-3">
                    <span className="view-badge">{VIEW_ICON} 456</span>
                    <span className="badge-paid">{event.categoryName}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
