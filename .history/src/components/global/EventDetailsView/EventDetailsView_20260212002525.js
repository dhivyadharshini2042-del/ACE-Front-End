"use client";
import { useEffect, useState, useRef } from "react";
import {
  DATEICON,
  INSTAGRAMICON,
  HEART_ICON,
  LOCATION_ICON,
  MAPLOCATIONVIEWICON,
  RIGHTSIDEARROW_ICON,
  SAVEICON,
  SINGELEVENTSHARE_ICON,
  VIEW_ICON,
  WHATSAPPICON,
  XICON,
  YOUTUBEICON,
  LEFTSIDEARROW_ICON,
  VIEWEVENTICON,
  VISIT_WEBSITE,
} from "../../../const-value/config-icons/page";
// import ticketIcon from "../../../assets/images/ticket-icon.png";

import Footer from "../Footer/Footer";
import "./EventDetailsView.css";
import ConfirmModal from "../../ui/Modal/ConfirmModal";
import { addEventViewApi, likeEventApi } from "../../../lib/api/event.api";
import { useLoading } from "../../../context/LoadingContext";
import ShareModal from "../../ui/ShareModal/ShareModal";
import { getAuthFromSession, isUserLoggedIn } from "../../../lib/auth";
import { toast } from "react-hot-toast";
import { NO_IMAGE_FOUND_IMAGE } from "../../../const-value/config-message/page";

export default function EventDetailsView({ event = {}, onBack }) {
  const { setLoading } = useLoading();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const [openConfirm, setOpenConfirm] = useState(false);
  const viewCalledRef = useRef(false);
  const [openShare, setOpenShare] = useState(false);

  const [countdown, setCountdown] = useState({
    days: "00",
    hours: "00",
    mins: "00",
    secs: "00",
  });

  const MAX_LENGTH = 120;
  const description = event?.description || "";
  const isLong = description.length > MAX_LENGTH;

  const visibleText = expanded ? description : description.slice(0, MAX_LENGTH);

  const calendar = event?.calendars?.[0];
  const location = event?.location;

  const [selectedTicket, setSelectedTicket] = useState(null);
  // ================= LIKE STATE =================
  const [isLiked, setIsLiked] = useState(false);
  const [auth, setAuth] = useState(null);
  const [likeCount, setLikeCount] = useState(0);
  const [isSaved, setIsSaved] = useState(event?.isSaved || false);


  /* ================= INIT AUTH ================= */
  useEffect(() => {
    if (isUserLoggedIn()) {
      setAuth(getAuthFromSession());
    }
  }, []);

  const images =
    Array.isArray(event?.bannerImages) && event.bannerImages.length > 0
      ? event.bannerImages
      : [NO_IMAGE_FOUND_IMAGE];

  useEffect(() => {
    // calendar data illa na stop
    if (!calendar?.startDate || !calendar?.startTime) return;

    const interval = setInterval(() => {
      // 1️⃣ Event start date + time
      const eventDateTime = new Date(
        `${calendar.startDate} ${calendar.startTime}`,
      );

      // 2️⃣ Current time
      const now = new Date();

      // 3️⃣ Difference (milliseconds)
      const diff = eventDateTime - now;

      // 4️⃣ Event start aagidicha?
      if (diff <= 0) {
        clearInterval(interval);
        setCountdown({
          days: "00",
          hours: "00",
          mins: "00",
          secs: "00",
        });
        return;
      }

      // 5️⃣ Days calculate
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));

      // 6️⃣ Hours calculate
      const hours = Math.floor(
        (diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
      );

      // 7️⃣ Minutes calculate
      const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

      // 8️⃣ Seconds calculate
      const secs = Math.floor((diff % (1000 * 60)) / 1000);

      // 9️⃣ UI update
      setCountdown({
        days: String(days).padStart(2, "0"),
        hours: String(hours).padStart(2, "0"),
        mins: String(mins).padStart(2, "0"),
        secs: String(secs).padStart(2, "0"),
      });
    }, 1000);

    // 10️⃣ Cleanup
    return () => clearInterval(interval);
  }, [calendar]);

  const [ticketForm, setTicketForm] = useState({
    name: "",
    description: "",
    from: "",
    to: "",
    amount: "",
    total: "1000",
  });

  /* ================= INIT FROM API DATA ================= */
  useEffect(() => {
    if (!event || !event.identity) return;
    console.log("event..>", event);

    setIsLiked(Boolean(event.isLiked));
    setLikeCount(event.likeCount || 0);
  }, [event]);



  /* ================= LIKE HANDLER ================= */
  const handleLike = async () => {
    if (!isUserLoggedIn()) {
      toast("Please login to like this event", { icon: "⚠️" });
      return;
    }

    const prevLiked = isLiked;
    setIsLiked(!prevLiked);

    const res = await likeEventApi({
      eventIdentity: event.identity,
      userIdentity: auth.identity,
    });

    if (res?.status) {
      // Update like count from response if available
      setLikeCount(res?.data?.likeCount ?? (prevLiked ? likeCount - 1 : likeCount + 1));
    } else {
      // rollback
      setIsLiked(prevLiked);
    }
  };
  const handleSave = async () => {
    if (!isUserLoggedIn()) {
      toast("Please login to save this event", { icon: "⚠️" });
      return;
    }

    const prevSaved = isSaved;
    setIsSaved(!prevSaved); // optimistic update

    try {
      // Call your save API (replace with actual API)
      const res = await saveEventApi({
        eventIdentity: event.identity,
        userIdentity: auth.identity,
      });

      if (!res?.status) {
        // rollback if API fails
        setIsSaved(prevSaved);
      }
    } catch (err) {
      setIsSaved(prevSaved);
    }
  };
  const prevSlide = () => {
    setCurrentIndex((prev) => {
      if (prev === 0) {
        return images.length - 1;
      } else {
        return prev - 1;
      }
    });
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => {
      if (prev === images.length - 1) {
        return 0;
      } else {
        return prev + 1;
      }
    });
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

  useEffect(() => {
    if (selectedTicket) {
      setTicketForm({
        name: selectedTicket.name || "",
        description: selectedTicket.description || "",
        from: selectedTicket.sellingFrom || "",
        to: selectedTicket.sellingTo || "",
        amount: selectedTicket.price || "",
        total: selectedTicket.total || "1000",
      });
    }
  }, [selectedTicket]);

  useEffect(() => {
    if (!event?.slug) return;

    if (viewCalledRef.current) return;

    viewCalledRef.current = true;

    addEventViewApi(event.slug);
  }, [event?.slug]);

  useEffect(() => {
    setLoading(false);
  }, []);

  console.log("dddddddddd", event);

  return (
    <>
      <div className="container event-wrapper my-4">
        <div className="event-details-wrapper">
          <button
            className="event-back-btn"
            onClick={() => {
              setLoading(true);
              onBack();
            }}
          >
            Back
          </button>

          {/* rest of your event details UI */}
        </div>
        {/* ================= 1. HERO ================= */}
        <div className="hero-card edit-wrapper">
          {/* ALWAYS BLURRED BACKGROUND */}
          <div
            className="blur-bg"
            style={{ backgroundImage: `url(${images[currentIndex]})` }}
          />

          {/* CLEAR CENTER IMAGE */}
          <img className="event-img" src={images[currentIndex]} alt="event" />
          <span className="badge-upcoming">
            {event?.status || "Upcoming Event"}
          </span>
          {/* SLIDER CONTROLS – BELOW IMAGE */}
        </div>

        {images.length > 1 && (
          <>
            <span onClick={prevSlide} className="arrow-side">
              {LEFTSIDEARROW_ICON}
            </span>

            <div className="slider-controls">
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
          </>
        )}

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

                <span className="views">
                  {VIEW_ICON} {event?.viewCount}
                </span>
                {/* BACKEND: event.views */}
              </div>
            </div>
          </div>
          <div>
            <button className="btn-register" onClick={handleRegisterClick}>
              Register Now
            </button>
            <div className="soc-mediya">
              {/* Like */}
              <span className="like-pill" onClick={handleLike} style={{ cursor: "pointer" }}>
                <HEART_ICON />
                <span className="like-count">{likeCount}</span>
              </span>

              {/* Share */}
              <span className="icon-pill" onClick={() => setOpenShare(true)} style={{ cursor: "pointer" }}>
                {SINGELEVENTSHARE_ICON}
              </span>

              {/* Save */}
              <span className="icon-pill" onClick={handleSave} style={{ cursor: "pointer" }}>
                <SAVEICON />
                {/* <SAVEICON active={isSaved} /> */}
              </span>
            </div>


          </div>
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
                {[
                  location?.city,
                  location?.state,
                  location?.country,
                  location?.venue,
                ]
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
            <div className="card-box edit-wrapper">
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
                            <img
                              src="/images/ticketIcon.png"
                              alt="Ticket Icon"
                              className="ticket-icon"
                            />

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
                                  },
                                )}`
                                : `Ticket ends on ${endDate.toLocaleDateString(
                                  "en-IN",
                                  {
                                    day: "2-digit",
                                    month: "short",
                                    year: "numeric",
                                  },
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
            <div className="card-box mt-4 edit-wrapper">
              <h3>Event Host Details</h3>

              <h4>
                {event.org?.organizationName || "-"}
                {/* ({event.org?.domainEmail}) */}
              </h4>

              {/* ================= CO - ORGANIZATION ================= */}
              {event.Collaborator && event.Collaborator.length > 0 && (
                <div className="host-section">
                  {/* MAP ONLY THE DETAILS */}
                  {event.Collaborator.map((item, index) => (
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
                      <span>{event.offers}</span>
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

                <h3 className="mt-3">Follow us on</h3>
                <div className="tag-wrap">
                  <span>{WHATSAPPICON}</span>
                  <span>{INSTAGRAMICON}</span>
                  <span>{YOUTUBEICON}</span>
                  <span>{XICON}</span>
                  {/* BACKEND: tags */}
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* ================= 8. OTHER DETAILS ================= */}
        <div className="card-box mt-4 edit-wrapper">
          <h3>Other Details</h3>

          <div className="row">
            {/* ================= PERKS ================= */}
            <div className="col-md-4 other-strong-titel">
              <strong>Perks</strong>

              {event?.eventPerks && event.eventPerks.length > 0 ? (
                <ul className="icon-list">
                  {event.eventPerks.map((item, index) => (
                    <li key={item.perk?.identity || index}>
                      {item.perk.perkName || "-"}
                    </li>
                  ))}
                </ul>
              ) : (
                //   <p>No perks available for this event</p>
                // )}
                <ul className="icon-list">
                  <li>No perks available for this event</li>
                </ul>
              )}
            </div>

            {/* ================= CERTIFICATIONS ================= */}
            <div className="col-md-4">
              <strong>Certifications</strong>

              {event?.cert ? (
                <ul className="icon-list">
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
                <ul className="icon-list">
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
        {/* <div className="action-row">
          <button className="btn-outline">View Event Video</button>
          <button className="btn-outline">Visit Website</button>
        </div> */}

        <div className="action-row">
          <button className="action-btn">
            <span className="icon">{VIEWEVENTICON}</span>
            View Event Video
          </button>

          <button className="action-btn">
            <span className="icon">{VISIT_WEBSITE}</span>
            Visit Website
          </button>
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
        <ShareModal
          open={openShare}
          onClose={() => setOpenShare(false)}
          title={event?.title}
        />
      </div>

      {/* ================= 10. FOOTER SECTION ================= */}
      <div>
        <Footer />
      </div>
    </>
  );
}
