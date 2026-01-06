"use client";
import { useEffect, useState } from "react";
import {
  DATEICON,
  INSTAGRAMICON,
  LEFTSIDEARROW_ICON,
  LINKEDINICON,
  LOCATION_ICON,
  MAPLOCATIONVIEWICON,
  RIGHTSIDEARROW_ICON,
  SAVEDICON,
  SHAREICON,
  WHATSAPPICON,
  XICON,
  YOUTUBEICON,
} from "../../../const-value/config-icons/page";
import Footer from "../Footer/Footer";
import "./CommonEventDetails.css";
import ConfirmModal from "../../ui/Modal/ConfirmModal";

export default function CommonEventDetails({ event = {}, onBack }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [countdown, setCountdown] = useState({
    days: "00",
    hours: "00",
    mins: "00",
    secs: "00",
  });
  const images =
    event?.bannerImages?.length > 0
      ? event.bannerImages
      : [
          "https://cloudinary-marketing-res.cloudinary.com/images/w_1000,c_scale/v1679921049/Image_URL_header/Image_URL_header-png?_i=AA",
        ];

  const MAX_LENGTH = 120;
  const isLong = event.description.length > MAX_LENGTH;
  const visibleText = expanded
    ? event.description
    : event.description.slice(0, MAX_LENGTH);

  const calendar = event?.calendars?.[0];
  const location = event?.location;

  /* ================= COUNTDOWN ================= */
  useEffect(() => {
    if (!calendar?.startDate || !calendar?.startTime) return;

    const targetDate = new Date(
      `${calendar.startDate}T${calendar.startTime}:00`
    );

    const timer = setInterval(() => {
      const now = new Date();
      const diff = targetDate - now;

      if (diff <= 0) {
        clearInterval(timer);
        setCountdown({
          days: "00",
          hours: "00",
          mins: "00",
          secs: "00",
        });
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const mins = Math.floor((diff / (1000 * 60)) % 60);
      const secs = Math.floor((diff / 1000) % 60);

      setCountdown({
        days: String(days).padStart(2, "0"),
        hours: String(hours).padStart(2, "0"),
        mins: String(mins).padStart(2, "0"),
        secs: String(secs).padStart(2, "0"),
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [calendar]);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  const handleRegisterClick = () => {
    setOpenConfirm(true);
  };

  const handleConfirm = () => {
    setOpenConfirm(false);
    window.open(event.paymentLink, "_blank", "noopener,noreferrer");
  };

  const handleCancel = () => {
    setOpenConfirm(false);
  };
  console.log("singel event value", event);

  const SOCIAL_ICON_MAP = {
    whatsapp: WHATSAPPICON,
    instagram: INSTAGRAMICON,
    linkedin: LINKEDINICON,
    youtube: YOUTUBEICON,
    x: XICON,
  };

  return (
    <>
      <div className="container event-wrapper my-4">
        <div className="event-details-wrapper">
          <button className="event-back-btn" onClick={onBack}>
            🔙 Back
          </button>

          {/* rest of your event details UI */}
        </div>
        {/* ================= 1. HERO ================= */}
        <div className="hero-card">
          <img src={images[currentIndex]} alt="event" className="event-img" />

          <span className="badge-upcoming">
            {event?.status || "Upcoming Event"}
          </span>

          {/* SLIDER CONTROLS – BELOW IMAGE */}
          {images.length > 1 && (
            <div className="slider-controls">
              <span onClick={prevSlide} className="arrow-side">
                {LEFTSIDEARROW_ICON}
              </span>

              <div className="slider-dots">
                {images.map((_, index) => (
                  <span
                    key={index}
                    className={index === currentIndex ? "active" : ""}
                    onClick={() => goToSlide(index)}
                  />
                ))}
              </div>

              <span onClick={nextSlide} className="arrow-side">
                {RIGHTSIDEARROW_ICON}
              </span>
            </div>
          )}
        </div>

        {/* ================= 2. TITLE + REGISTER ================= */}
        <div className="title-row">
          <div>
            <h1 className="mt-3">
              {event?.title || "International Conference on ICRSEM II – 2025"}
            </h1>

            {/* ================= 3. TAGS + VIEWS ================= */}
            <div className="meta-row">
              <div>
                <span className="tag yellow">
                  {event?.categoryName || "==========="}
                </span>

                <span className="tag purple">Paid</span>
                <span className="tag green">{event?.mode || "===="}</span>
                {/* BACKEND: event.tags */}

                <span className="views">👁 5678</span>
                {/* BACKEND: event.views */}
              </div>
              <div>
                {/* like , share , save */}
                <span>Like</span>
                <span>SAHRE</span>
                <span>SAVE</span>
              </div>
            </div>
          </div>

          <button className="btn-register" onClick={handleRegisterClick}>
            Register Now
          </button>
        </div>

        {/* ================= 4. DESCRIPTION ================= */}
        <p className="description">
          {visibleText}
          {isLong && !expanded && "... "}
          {isLong && (
            <span className="readmore" onClick={() => setExpanded(!expanded)}>
              {expanded ? " Read less" : " Read more"}
            </span>
          )}
        </p>

        {/* ================= 5. VENUE + TICKETS ================= */}
        <div className="row g-4 py-3">
          {/* ================= VENUE & DATE (LEFT 6) ================= */}
          <div className="col-lg-6">
            <div className="card-box h-100">
              <h3>Venue & Date</h3>

              {/* LOCATION */}
              <p>
                {LOCATION_ICON}{" "}
                {[location?.city, location?.state, location?.country]
                  .filter(Boolean)
                  .join(", ") || "Location not set"}
              </p>

              {/* DATE */}
              <p>
                {DATEICON}{" "}
                {calendar
                  ? `${calendar.startDate} (${calendar.startTime}) – ${calendar.endDate} (${calendar.endTime})`
                  : "Date not set"}
              </p>

              {/* MAP */}
              {location?.mapLink && (
                <button
                  className="map-btn"
                  onClick={() => window.open(location.mapLink, "_blank")}
                >
                  {MAPLOCATIONVIEWICON} View Map Location
                </button>
              )}

              {/* COUNTDOWN */}
              <div className="countdown">
                <span className="cd-days">
                  {countdown.days}
                  <br />
                  Days
                </span>
                <span className="cd-hours">
                  {countdown.hours}
                  <br />
                  Hours
                </span>
                <span className="cd-mins">
                  {countdown.mins}
                  <br />
                  Mins
                </span>
                <span className="cd-secs">
                  {countdown.secs}
                  <br />
                  Secs
                </span>
              </div>
            </div>
          </div>

          {/* ================= TICKET AVAILABILITY (RIGHT 6) ================= */}
          <div className="col-lg-6">
            <div className="card-box">
              <h4 className="section-title mb-4">Ticket Availability</h4>

              <div className="row g-4">
                {event?.tickets && event.tickets.length > 0 ? (
                  event.tickets.map((ticket) => {
                    const now = new Date();
                    const startDate = new Date(ticket.sellingFrom);
                    const endDate = new Date(ticket.sellingTo);

                    let statusText = "";
                    let statusClass = "";

                    if (now < startDate) {
                      statusText = "Ticket is not yet started";
                      statusClass = "not-started";
                    } else if (now >= startDate && now <= endDate) {
                      statusText = "Ticket is on live";
                      statusClass = "live";
                    } else {
                      statusText = "Ticket closed";
                      statusClass = "expired";
                    }

                    return (
                      <div className="col-md-6" key={ticket.identity}>
                        <div className="ticket-card">
                          {/* TOP */}
                          <div className="ticket-top">
                            <span className="ticket-icon">★</span>
                            <h6 className="ticket-title">{ticket.name}</h6>
                          </div>

                          {/* DATE + PRICE */}
                          <div className="ticket-top">
                            <span>
                              {now < startDate
                                ? `Ticket starts on ${startDate.toLocaleDateString(
                                    "en-IN",
                                    {
                                      day: "2-digit",
                                      month: "short",
                                      year: "numeric",
                                    }
                                  )}`
                                : `Ticket ends on ${endDate.toLocaleDateString(
                                    "en-IN",
                                    {
                                      day: "2-digit",
                                      month: "short",
                                      year: "numeric",
                                    }
                                  )}`}
                            </span>

                            <span className="ticket-price">
                              {ticket.isPaid ? `₹${ticket.price}` : "Free"}
                            </span>
                          </div>

                          {/* STATUS */}
                          <span className={`ticket-status ${statusClass}`}>
                            {statusText}
                          </span>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-muted">No tickets available</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ================= 6. HOST DETAILS ================= */}
        <div className="row g-4 py-5">
          <div className="col-lg-8">
            <div className="card-box mt-4">
              <h3>Event Host Details</h3>
              <h4>{event.org?.domainEmail || "-"}</h4>

              {/* ================= CO - ORGANIZATION ================= */}
              {event.collaborators && event.collaborators.length > 0 && (
                <div className="host-section">
                  {/* MAP ONLY THE DETAILS */}
                  {event.collaborators.map((item, index) => (
                    <div
                      key={item.identity || `${item.member?.identity}-${index}`}
                      className="mb-3 host-section"
                    >
                      <div className="host-grid ">
                        <div>
                          <label>organization Name</label>
                          <p>{item.member?.organizationName || "-"}</p>
                        </div>
                        <div>
                          <label>Organizer Name</label>
                          <p>{item.member?.organizerName || "-"}</p>
                        </div>

                        <div>
                          <label>Organizer Contact</label>
                          <p>{item.member?.organizerNumber || "-"}</p>
                        </div>

                        <div>
                          <label>Organizer Department</label>
                          <p>{item.member?.orgDept || "-"}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* ================= 7. DISCOUNTS + TAGS ================= */}
          <div className="col-lg-4">
            <div className="card-box mt-4">
              <div className="">
                {event?.offers && (
                  <>
                    <h3>Discounts & Offers</h3>
                    <div className="discount-section">
                      <img src="/images/discount.png" alt="Discount" />
                      <span>Get 50% off on Elite tickets</span>
                    </div>
                    <hr />
                  </>
                )}

                {/* BACKEND: offers */}

                <h3 className="mt-3">Tags</h3>

                <div className="tag-wrap">
                  {event?.tags && event.tags.length > 0 ? (
                    event.tags.map((tag, index) => (
                      <span key={`${tag}-${index}`}>#{tag}</span>
                    ))
                  ) : (
                    <span>No tags</span>
                  )}
                </div>

                {event?.socialLinks && (
                  <>
                    <hr />
                    <h3 className="mt-3">Follow us on</h3>

                    <div className="tag-wrap">
                      {Object.entries(event.socialLinks).map(([key, link]) => {
                        if (!link || !SOCIAL_ICON_MAP[key]) return null;

                        // whatsapp special handling
                        const finalLink =
                          key === "whatsapp" && !link.startsWith("http")
                            ? `https://wa.me/${link}`
                            : link;

                        return (
                          <a
                            key={key}
                            href={finalLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="social-icon"
                          >
                            {SOCIAL_ICON_MAP[key]}
                          </a>
                        );
                      })}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
        {/* ================= 8. OTHER DETAILS ================= */}
        <div className="card-box mt-4">
          <h3>Other Details</h3>

          <div className="row">
            {/* ================= PERKS ================= */}
            <div className="col-md-4">
              <strong>Perks</strong>

              {event?.eventPerks && event.eventPerks.length > 0 ? (
                <ul>
                  {event.eventPerks.map((item, index) => (
                    <li key={item.perk?.identity || index}>
                      {item.perk.perkName || "-"}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No perks available for this event</p>
              )}
            </div>

            {/* ================= CERTIFICATIONS ================= */}
            <div className="col-md-4">
              <strong>Certifications</strong>

              {event?.cert ? (
                <ul>
                  <li>{event.cert.certName}</li>
                </ul>
              ) : (
                <p>No Certifications available for this event</p>
              )}
            </div>

            {/* ================= ACCOMMODATIONS ================= */}
            <div className="col-md-4">
              <strong>Accommodations</strong>

              {event?.eventAccommodations &&
              event.eventAccommodations.length > 0 ? (
                <ul>
                  {event.eventAccommodations.map((item, index) => (
                    <li key={item.accommodation?.eventIdentity || index}>
                      {item?.accommodation?.accommodationName || "-"}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No accommodations available for this event</p>
              )}
            </div>
          </div>
        </div>

        {/* ================= 9. ACTION BUTTONS ================= */}
        <div className="action-row">
          <button className="btn-outline">View Event Video</button>
          <button className="btn-outline">Visit Website</button>
        </div>

        <ConfirmModal
          open={openConfirm}
          title="External Redirection"
          description={
            "You’re being redirected to an external website that is not managed by Allcollegeevent. For security reasons, we’re unable to verify this link."
          }
          image="/images/logo.png"
          onCancel={handleCancel}
          onConfirm={handleConfirm}
        />
      </div>
      {/* ================= 10. FOOTER SECTION ================= */}
      <div>
        <Footer />
      </div>
    </>
  );
}
