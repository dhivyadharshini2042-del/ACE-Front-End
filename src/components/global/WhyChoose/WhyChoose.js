"use client";

import { useEffect, useState } from "react";
import "./WhyChoose.css";

import { getAllEventsApi } from "../../../lib/api/event.api";
import { NO_IMAGE_FOUND_IMAGE } from "../../../const-value/config-message/page";

import {
  HEART_ICON,
  SAVEICON,
  LOCATION_ICON,
  DATEICON,
  VIEW_ICON,
} from "../../../const-value/config-icons/page";

export default function WhyChoose() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    const res = await getAllEventsApi({ offset: 0, limit: 20 });
    if (res?.status) {
      setEvents(res.data);
    }
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
      {/* ================= WHY CHOOSE (UNCHANGED) ================= */}
      <section className="why-ace container-xl">
        {/* HEADER */}
        <div className="text-center mb-5">
          <h2 className="why-title">Why Choose AllCollegeEvent ?</h2>
          <p className="why-sub">
            Enjoy a seamless and delightful ticketing experience with these
            powerful benefits
          </p>
        </div>

        {/* GRID */}
        <div className="why-grid">
          {/* LEFT – TOP */}
          <div className="why-card horizontal">
            <div className="why-img-left">
              <img src="/images/fast-secure-payments.png" alt="" />
            </div>

            <div className="why-text">
              <h5>Fast & Secure Payments</h5>
              <p>
                Experience quick transactions with advanced security to protect
                your data. Pay in minutes with seamless processing and instant
                confirmation.
              </p>
            </div>
          </div>

          {/* RIGHT – BIG */}
          <div className="why-card vertical">
            <h5>Book Anytime!</h5>
            <p>
              Enjoy 24/7 booking flexibility reserve your tickets at your
              convenience with no time restrictions. Access events anytime with
              a hassle-free booking experience.
            </p>

            <div className="why-img-bottom">
              <img src="/images/book-anytime.png" alt="" />
            </div>
          </div>

          {/* LEFT – BOTTOM */}
          <div className="why-card horizontal">
            <div className="why-img-left">
              <img src="/images/smart-deals.png" alt="" />
            </div>

            <div className="why-text">
              <h5>Smart Deals</h5>
              <p>
                Unlock exclusive offers and discounts. Save more while enjoying
                premium event experiences.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= ALL EVENTS SECTION ================= */}
      <section className="all-events-section container-xl">
        <h5 className="fw-bold mb-0 land-title mb-4">All Events</h5>

        <div className="events-scroll-container">
          <div className="events-grid">
            {events.map((event) => {
              const calendar = event.calendars?.[0];
              const lowestPrice = event.tickets?.length
                ? Math.min(...event.tickets.map((t) => t.price || 0))
                : null;

              return (
                <div key={event.identity} className="card event-card">
                  {/* IMAGE */}
                  <div className="event-img-wrapper">
                    <img
                      src={event.bannerImages?.[0] || NO_IMAGE_FOUND_IMAGE}
                      className="event-img"
                      alt={event.title}
                    />

                    <span className="save-on-image">
                      <SAVEICON />
                    </span>
                  </div>

                  {/* BODY */}
                  <div className="card-body p-3">
                    <div className="title-like-row">
                      <span className="fw-semibold card-titel">
                        {event.title}
                      </span>

                      <div className="like-inline">
                        <HEART_ICON />
                        <span>{event.likeCount || 0}</span>
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
      </section>
    </>
  );
}
