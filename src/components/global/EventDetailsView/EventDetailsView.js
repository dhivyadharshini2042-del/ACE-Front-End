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
import Footer from "../Footer/Footer";
import "./EventDetailsView.css";
import ConfirmModal from "../../ui/Modal/ConfirmModal";
import { addEventViewApi, likeEventApi, saveEventApi } from "../../../lib/api/event.api";
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

  // ── Like / Save ──
  const [isLiked, setIsLiked] = useState(false);
  const [auth, setAuth] = useState(null);
  const [likeCount, setLikeCount] = useState(0);
  const [isSaved, setIsSaved] = useState(event?.isSaved || false);
  const [showCollaborators, setShowCollaborators] = useState(false);

  // ── Collaborators ──
  // const [showAllCollaborators, setShowAllCollaborators] = useState(false);
  const organizerName = event?.org?.organizationName?.toLowerCase();
  const filteredCollaborators =
    event?.Collaborator?.filter(
      (col) => col?.member?.organizationName?.toLowerCase() !== organizerName
    ) || [];
  // const visibleCollaborators = showAllCollaborators
  //   ? filteredCollaborators
  //   : filteredCollaborators.slice(0, 1);

  useEffect(() => {
  }, [event]);

  /* ── Auth ── */
  useEffect(() => {
    if (isUserLoggedIn()) {
      setAuth(getAuthFromSession());
    }
  }, []);

  const images =
    Array.isArray(event?.bannerImages) && event.bannerImages.length > 0
      ? event.bannerImages
      : [NO_IMAGE_FOUND_IMAGE];

  /* ── Countdown ── */
  useEffect(() => {
    if (!calendar?.startDate || !calendar?.startTime) return;

    const interval = setInterval(() => {
      const eventDateTime = new Date(`${calendar.startDate} ${calendar.startTime}`);
      const now = new Date();
      const diff = eventDateTime - now;

      if (diff <= 0) {
        clearInterval(interval);
        setCountdown({ days: "00", hours: "00", mins: "00", secs: "00" });
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const secs = Math.floor((diff % (1000 * 60)) / 1000);

      setCountdown({
        days: String(days).padStart(2, "0"),
        hours: String(hours).padStart(2, "0"),
        mins: String(mins).padStart(2, "0"),
        secs: String(secs).padStart(2, "0"),
      });
    }, 1000);

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

  /* ── Init from event ── */
  useEffect(() => {
    if (!event || !event.identity) return;
    setIsLiked(Boolean(event.isLiked));
    setLikeCount(event.likeCount || 0);
  }, [event]);

  /* ── Like ── */
  const handleLike = async () => {
    if (!isUserLoggedIn()) {
      toast("Please login to like this event", { icon: "⚠️" });
      return;
    }
    const prevLiked = isLiked;
    setIsLiked(!prevLiked);

    const res = await likeEventApi({
      eventIdentity: event.identity,
      userIdentity: auth.identity.identity,
    });

    if (res?.status) {
      setLikeCount(res?.data?.likeCount ?? (prevLiked ? likeCount - 1 : likeCount + 1));
    } else {
      setIsLiked(prevLiked);
    }
  };

  /* ── Save ── */
  const handleSave = async () => {
    if (!isUserLoggedIn()) {
      toast("Please login to save this event", { icon: "⚠️" });
      return;
    }
    const prevSaved = isSaved;
    setIsSaved(!prevSaved);
    try {
      const res = await saveEventApi({
        eventIdentity: event.identity,
        userIdentity: auth.identity,
      });
      if (!res?.status) setIsSaved(prevSaved);
    } catch {
      setIsSaved(prevSaved);
    }
  };

  /* ── Carousel ── */
  const prevSlide = () =>
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));

  const nextSlide = () =>
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));

  const goToSlide = (index) => setCurrentIndex(index);

  /* ── Register ── */
  const handleRegisterClick = () => setOpenConfirm(true);
  const handleConfirm = () => {
    setOpenConfirm(false);
    window.open(event.paymentLink, "_blank", "noopener,noreferrer");
  };
  const handleCancel = () => setOpenConfirm(false);

  /* ── Ticket form sync ── */
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

  /* ── View count ── */
  useEffect(() => {
    if (!event?.slug || viewCalledRef.current) return;
    viewCalledRef.current = true;
    addEventViewApi(event.slug);
  }, [event?.slug]);

  useEffect(() => {
    setLoading(false);
  }, []);

  /* ── Ticket status helper ── */
  const getTicketStatus = (ticket) => {
    const now = new Date();
    const startDate = new Date(ticket.sellingFrom);
    const endDate = new Date(ticket.sellingTo);
    if (now < startDate) return { text: "Ticket is not yet started", cls: "not-started" };
    if (now >= startDate && now <= endDate) return { text: "Ticket is on live", cls: "live" };
    return { text: "Ticket closed", cls: "expired" };
  };

  /* ── Organizer contact rows (from event.organizers or fallback) ── */
  const organizerContacts = event?.organizers || [];

  return (
    <>
      <div className="container event-wrapper my-4">

        {/* ================= 1. HERO ================= */}
        <div className="hero-card">
          {/* Blurred Background */}
          <div
            className="blur-bg"
            style={{ backgroundImage: `url(${images[currentIndex]})` }}
          />

          {/* Main Image */}
          <div
            className="event-img"
            style={{ backgroundImage: `url(${images[currentIndex]})` }}
          />

          {/* Badge */}
          <span className="badge-upcoming">
            {event?.status || "Upcoming Event"}
          </span>
        </div>

        {/* Dots row (below hero, with chevron arrows flanking dots) */}
        {images.length > 1 && (
          <div className="slider-controls">
            <button className="dot-arrow" onClick={prevSlide} aria-label="Previous">
              {LEFTSIDEARROW_ICON}
            </button>
            <div className="slider-dots">
              {images.map((_, index) => (
                <span
                  key={index}
                  className={index === currentIndex ? "active" : ""}
                  onClick={() => goToSlide(index)}
                />
              ))}
            </div>
            <button className="dot-arrow" onClick={nextSlide} aria-label="Next">
              {RIGHTSIDEARROW_ICON}
            </button>
          </div>
        )}

        {/* ================= 2. TITLE + REGISTER ================= */}
        <div className="title-row">
          {/* Left: title + tags */}
          <div>
            <h1>{event?.title || "International Conference on ICRSEM II – 2025"}</h1>

            {/* Tags + views */}
            <div className="meta-row">
              <span className="tag yellow">{event?.categoryName || "Conference"}</span>
              <span className="tag purple">Paid</span>
              <span className="tag green">{event?.mode || "Online"}</span>
              <span className="views">
                {VIEW_ICON}&nbsp;{event?.viewCount}
              </span>
            </div>
          </div>

          {/* Right: register button + like/share/save */}
          <div className="title-right">
            <button className="btn-register" onClick={handleRegisterClick}>
              Register Now
            </button>

            <div className="soc-mediya">
              {/* Like */}
              <span className="like-pill" onClick={handleLike} style={{ cursor: "pointer" }}>
                <HEART_ICON filled={isLiked} />
                <span className="like-count">{likeCount}</span>
              </span>

              {/* Share */}
              <span className="icon-pill" onClick={() => setOpenShare(true)} style={{ cursor: "pointer" }}>
                {SINGELEVENTSHARE_ICON}
              </span>

              {/* Save */}
              <span className="icon-pill" onClick={handleSave} style={{ cursor: "pointer" }}>
                <SAVEICON active={isSaved} />
              </span>
            </div>
          </div>
        </div>

        {/* ================= 3. DESCRIPTION ================= */}
        <p className="description">
          {visibleText}
          {isLong && !expanded && "... "}
          {isLong && (
            <span className="readmore" onClick={() => setExpanded(!expanded)}>
              {expanded ? " Read less" : " Read more"}
            </span>
          )}
        </p>

        {/* ================= 4. VENUE + TICKETS ================= */}
        <div className="row g-4 py-3">

          {/* VENUE & DATE */}
          <div className="col-lg-6">
            <div className="card-box h-100">
              <h3>Venue &amp; Date</h3>

              <p>
                {LOCATION_ICON}&nbsp;
                {[location?.city, location?.state, location?.country, location?.venue]
                  .filter(Boolean)
                  .join(", ") || "Location not set"}
              </p>

              <p>
                {DATEICON}&nbsp;
                {calendar
                  ? `${calendar.startDate} (${calendar.startTime}) – ${calendar.endDate} (${calendar.endTime})`
                  : "Date not set"}
              </p>

              {location?.mapLink && (
                <button
                  className="map-btn"
                  onClick={() => window.open(location.mapLink, "_blank")}
                >
                  {MAPLOCATIONVIEWICON}&nbsp;View Map Location
                </button>
              )}

              {/* Countdown */}
              <div className="countdown">
                <span className="cd-days">
                  {countdown.days}
                  <small>Days</small>
                </span>
                <span className="cd-hours">
                  {countdown.hours}
                  <small>Hours</small>
                </span>
                <span className="cd-mins">
                  {countdown.mins}
                  <small>Mins</small>
                </span>
                <span className="cd-secs">
                  {countdown.secs}
                  <small>Secs</small>
                </span>
              </div>
            </div>
          </div>

          {/* TICKET AVAILABILITY */}

          <div className="col-lg-6">
            <div className="card-box edit-wrapper">
              <h4 className="section-title mb-4">Ticket Availability</h4>

              <div className="row g-4">
                {event?.tickets?.length > 0 ? (
                  event.tickets.map((ticket) => {
                    const { text, cls } = getTicketStatus(ticket);

                    const startDate = new Date(ticket.sellingFrom);
                    const endDate = new Date(ticket.sellingTo);

                    return (
                      <div className="col-md-6" key={ticket.identity}>
                        <div className="ticket-card">

                          <div className="ticket-top">
                            <img
                              src="/images/ticketIcon.png"
                              alt="Ticket Icon"
                              className="ticket-icon"
                            />
                            <h6 className="ticket-title">{ticket.name}</h6>
                          </div>

                          <div className="ticket-top">
                            <span>
                              {text === "Ticket is not yet started"
                                ? `Ticket starts on ${startDate.toLocaleDateString("en-IN")}`
                                : `Ticket ends on ${endDate.toLocaleDateString("en-IN")}`}
                            </span>

                            <span className="ticket-price">
                              {ticket.isPaid ? `₹${ticket.price}` : "Free"}
                            </span>
                          </div>

                          <span className={`ticket-status ${cls}`}>
                            {text}
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

        {/* ================= 5. HOST + SIDEBAR ================= */}
        <div className="row g-4 py-4">
          {/* LEFT: Host + Collaborators */}
          <div className="col-lg-8">
            <div className="card-box mt-3 edit-wrapper">
              {/* Event Host Details */}
              <h3>Event Host Details</h3>

              {[event?.org].filter(Boolean).map((org, idx) => (
                <div key={idx} className="host-grid mb-2">
                  <div>
                    <label>Organization Name</label>
                    <p>{org?.organizationName || "-"}</p>
                  </div>
                  <div>
                    <label>Organization Location</label>
                    <p>
                      {[event?.location?.city, event?.location?.state, event?.location?.country]
                        .filter(Boolean)
                        .join(", ") || "-"}
                    </p>
                  </div>
                  <div>
                    <label>Organizer Department</label>
                    <p>{event?.categoryName || "-"}</p>
                  </div>
                </div>
              ))}

              {/* Contact Details */}
              {(event?.org?.domainEmail || organizerContacts.length > 0) && (
                <>
                  <p className="contact-details-title">Contact Details</p>
                  {organizerContacts.length > 0 ? (
                    organizerContacts.map((contact, idx) => (
                      <div key={idx} className="contact-grid mb-2">
                        <div>
                          <label>Organizer Name</label>
                          <p>{contact?.name || "-"}</p>
                        </div>
                        <div>
                          <label>Organizer Contact</label>
                          <p>{contact?.phone || "-"}</p>
                        </div>
                        <div>
                          <label>Organizer Email ID</label>
                          <p>{contact?.email || event?.org?.domainEmail || "-"}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="contact-grid mb-2">
                      <div>
                        <label>Organizer Name</label>
                        <p>{event?.org?.organizationName || "-"}</p>
                      </div>
                      <div>
                        <label>Organizer Contact</label>
                        <p>{event?.org?.phone || "-"}</p>
                      </div>
                      <div>
                        <label>Organizer Email ID</label>
                        <p>{event?.org?.domainEmail || "-"}</p>
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* Collaborator Details - initially hidden */}
              {showCollaborators && filteredCollaborators.length > 0 && (
                <div className="card-box mt-2 edit-wrapper">
                  <h3>Collaborator Details</h3>
                  {filteredCollaborators.map((col) => (
                    <div key={col.identity} className="host-grid mb-2">
                      <div>
                        <label>Organization Name</label>
                        <p>{col.member.organizationName || "-"}</p>
                      </div>
                      <div>
                        <label>Organization Location</label>
                        <p>{col.member.location || "-"}</p>
                      </div>
                      <div>
                        <label>Department</label>
                        <p>{col.member.orgDept || "-"}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Toggle Button for Collaborators */}
              {filteredCollaborators.length > 0 && (
                <button
                  className="btn btn-link p-0 mt-1"
                  onClick={() => setShowCollaborators(!showCollaborators)}
                >
                  {showCollaborators ? "Show Less" : `View Collaborators (${filteredCollaborators.length})`}
                </button>
              )}
            </div>
          </div>

          {/* RIGHT: Discounts / Tags / Follow */}
          <div className="col-lg-4">
            <div className="card-box mt-3">
              {event?.offers && (
                <>
                  <h3>Discounts &amp; Offers</h3>
                  <div className="discount-section mb-3">
                    <img src="/images/discount.png" alt="Discount" />
                    <span style={{ fontSize: 13 }}>{event.offers}</span>
                  </div>
                  <hr />
                </>
              )}

              <h3 className="mt-2">Tags</h3>
              <div className="tag-wrap mb-3">
                {event?.tags && event.tags.length > 0 ? (
                  event.tags.map((tag, index) => (
                    <span key={`${tag}-${index}`}>#{tag}</span>
                  ))
                ) : (
                  <span>No tags</span>
                )}
              </div>

              <h3 className="mt-3">Follow us on</h3>
              <div className="social-icon-wrap">
                <span>{WHATSAPPICON}</span>
                <span>{INSTAGRAMICON}</span>
                <span>{YOUTUBEICON}</span>
                <span>{XICON}</span>
              </div>
            </div>
          </div>
        </div>

        {/* ================= 6. OTHER DETAILS ================= */}
        <div className="card-box mt-2 edit-wrapper">
          <h3>Other Details</h3>

          <div className="row">
            {/* Perks */}
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
                <ul className="icon-list">
                  <li>No perks available for this event</li>
                </ul>
              )}
            </div>

            {/* Certifications */}
            <div className="col-md-4">
              <strong>Certifications</strong>
              {event?.cert ? (
                <ul className="icon-list">
                  <li>{event.cert.certName}</li>
                </ul>
              ) : (
                <p style={{ marginTop: 8, fontSize: 13 }}>No Certifications available for this event</p>
              )}
            </div>

            {/* Accommodations */}
            <div className="col-md-4">
              <strong>Accommodations</strong>
              {event?.eventAccommodations && event.eventAccommodations.length > 0 ? (
                <ul className="icon-list">
                  {event.eventAccommodations.map((item, index) => (
                    <li key={item.accommodation?.eventIdentity || index}>
                      {item?.accommodation?.accommodationName || "-"}
                    </li>
                  ))}
                </ul>
              ) : (
                <p style={{ marginTop: 8, fontSize: 13 }}>No accommodations available for this event</p>
              )}
            </div>
          </div>
        </div>

        {/* ================= 7. ACTION BUTTONS ================= */}
        <div className="action-wrapper">
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
        </div>

        {/* ── Modals ── */}
        <ConfirmModal
          open={openConfirm}
          title="External Redirection"
          description="You're being redirected to an external website that is not managed by Allcollegeevent. For security reasons, we're unable to verify this link."
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

      {/* ================= FOOTER ================= */}
      <div>
        <Footer />
      </div>
    </>
  );
}