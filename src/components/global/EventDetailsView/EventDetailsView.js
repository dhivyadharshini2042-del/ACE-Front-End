"use client";
import { useEffect, useState } from "react";
import {
  DATEICON,
  INSTAGRAMICON,
  LEFTSIDEARROW_ICON,
  LIKE_ICON,
  LINKEDINICON,
  LOCATION_ICON,
  MAPLOCATIONVIEWICON,
  RIGHTSIDEARROW_ICON,
  SAVEDICON,
  SAVEICON,
  SHAREICON,
  SINGELEVENTSHARE_ICON,
  WHATSAPPICON,
  XICON,
  YOUTUBEICON,
} from "../../../const-value/config-icons/page";
import Footer from "../Footer/Footer";
import "./EventDetailsView.css";
import ConfirmModal from "../../ui/Modal/ConfirmModal";
import BannerImageModal from "./modals/BannerImageModal";
import EditOverlay from "./overlays/EditOverlay";
import TicketListModal from "./modals/TicketListModal";
import TicketModal from "../../ui/Modal/TicketModal";
import EventDetailsModal from "./modals/EventDetailsModal";
import OrganizationModal from "./modals/OrganizationModal";
import OfferModal from "./modals/OfferModal";
import SocialMediaModal from "./modals/SocialMediaModal";
import { updateEventApi } from "../../../lib/api/event.api";
import { toast } from "react-hot-toast";
import OtherDetailsModal from "./modals/OtherDetailsModal";

export default function EventDetailsView({ event = {}, onBack }) {
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
  const [openBannerModal, setOpenBannerModal] = useState(false);
  const [bannerImages, setBannerImages] = useState(images);
  const [openTicketListModal, setOpenTicketListModal] = useState(false);
  const [openTicketModal, setOpenTicketModal] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [otherDetails, setOtherDetails] = useState({
    certIdentity: null,
    perkIdentities: [],
    accommodationIdentities: [],
    website: "",
    videoLink: "",
  });

  const [ticketForm, setTicketForm] = useState({
    name: "",
    description: "",
    from: "",
    to: "",
    amount: "",
    total: "1000",
  });

  const [ticketType, setTicketType] = useState("FREE");
  const [openHostModal, setOpenHostModal] = useState(false);
  const [openOrgModal, setOpenOrgModal] = useState(false);
  const [openOfferModal, setOpenOfferModal] = useState(false);
  const [openSocialModal, setOpenSocialModal] = useState(false);
  const [openOtherModal, setOpenOtherModal] = useState(false);

  // data states (pre-populate)
  const [orgData, setOrgData] = useState(event.collaborators || []);
  const [offerData, setOfferData] = useState(event.offers || "");
  const [socialData, setSocialData] = useState(event.socialLinks || {});

  // imge move left and right

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

  /* ================= COUNTDOWN ================= */
  useEffect(() => {
    if (!selectedTicket) return;

    setTicketForm({
      name: selectedTicket.name || "",
      description: selectedTicket.description || "",
      from: selectedTicket.sellingFrom || "",
      to: selectedTicket.sellingTo || "",
      amount: selectedTicket.price || "",
      total: selectedTicket.total || "1000",
    });

    setTicketType(selectedTicket.isPaid ? "PAID" : "FREE");
  }, [selectedTicket]);

  useEffect(() => {
    if (!event) return;

    setOtherDetails({
      certIdentity: event.cert?.identity || null,
      perkIdentities: event.eventPerks?.map((p) => p.perk?.identity) || [],
      accommodationIdentities:
        event.eventAccommodations?.map((a) => a.accommodation?.identity) || [],
      website: event.eventLink || "",
      videoLink: event.videoLink || "",
    });
  }, [event]);

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

      setTicketType(selectedTicket.isPaid ? "PAID" : "FREE");
    }
  }, [selectedTicket]);

  const openEventDetailsAgain = () => {
    setOpenOfferModal(false);
    setOpenSocialModal(false);
    setOpenOrgModal(false);

    setTimeout(() => {
      setOpenHostModal(true);
    }, 0);
  };

  useEffect(() => {
    if (openOrgModal || openOfferModal || openSocialModal) {
      setOpenHostModal(false);
    }
  }, [openOrgModal, openOfferModal, openSocialModal]);

  // update organizers

  const handleOrganizationSave = async (payload) => {
    try {
      const formData = new FormData();
      formData.append("collaborators", JSON.stringify(payload.collaborators));

      const toastId = toast.loading("Updating organization details...");

      const res = await updateEventApi(event.identity, formData);

      toast.dismiss(toastId);

      if (res?.status) {
        toast.success("Organization details updated successfully");
        setOpenOrgModal(false);
      } else {
        toast.error(res?.data?.message || "Update failed ");
      }
    } catch (err) {
      console.error("Organization update error:", err);

      toast.error(
        err?.response?.data?.message || "Failed to update organization details"
      );
    }
  };
  // updated offer
  const handleOfferSave = async (offerValue) => {
    try {
      if (!offerValue || !offerValue.trim()) {
        toast.error("Offer cannot be empty");
        return;
      }

      const formData = new FormData();

      formData.append("offers", offerValue);

      const toastId = toast.loading("Updating offer...");

      const res = await updateEventApi(event.identity, formData);

      toast.dismiss(toastId);

      if (res?.status) {
        toast.success("Offer updated successfully");
        setOfferData(offerValue);
        setOpenOfferModal(false);
      } else {
        toast.error(res?.data?.message || "Failed to update offer");
      }
    } catch (err) {
      console.error("Offer update error:", err);
      toast.error("Something went wrong while updating offer");
    }
  };
  // updated social media
  const handleSocialSave = async (payload) => {
    try {
      const formData = new FormData();

      // MUST stringify
      formData.append("socialLinks", JSON.stringify(payload.socialLinks));

      const res = await updateEventApi(event.identity, formData);

      if (res?.status) {
        toast.success("Social media details updated");
      }

      setOpenSocialModal(false);
    } catch (err) {
      console.error(err);
      toast.error("Failed to update social media details");
    }
  };
  // updated banner images
  const handleBannerSave = async (previewImages) => {
    try {
      const formData = new FormData();

      //  existing images (URL)
      const existingImages = previewImages
        .filter((img) => !img.file)
        .map((img) => (typeof img === "string" ? img : img.url));

      //new uploaded files
      const newImages = previewImages.filter((img) => img.file);

      // IMPORTANT: stringify
      formData.append("existingBannerImages", JSON.stringify(existingImages));

      newImages.forEach((img) => {
        formData.append("bannerImages", img.file);
      });

      const res = await updateEventApi(event.identity, formData);

      if (res.data.success) {
        toast.success("Banner image updated successfully");
        setBannerImages(previewImages);
        setOpenBannerModal(false);
      }
    } catch (err) {
      console.error(err);
      toast.error("Banner image update failed");
    }
  };

  // updated tickets
  const handleTicketSave = async () => {
    try {
      if (!selectedTicket?.identity) {
        toast.error("Invalid ticket selected");
        return;
      }

      //EXISTING tickets copy pannrom
      const updatedTickets = event.tickets.map((t) => {
        // edited ticket
        if (t.identity === selectedTicket.identity) {
          return {
            identity: t.identity,
            name: ticketForm.name,
            description: ticketForm.description,
            sellingFrom: ticketForm.from,
            sellingTo: ticketForm.to,
            price: ticketType === "PAID" ? Number(ticketForm.amount) : 0,
            isPaid: ticketType === "PAID",
            totalQuantity: Number(ticketForm.total),
          };
        }

        // untouched tickets
        return {
          identity: t.identity,
          name: t.name,
          description: t.description,
          sellingFrom: t.sellingFrom,
          sellingTo: t.sellingTo,
          price: t.price,
          isPaid: t.isPaid,
          totalQuantity: t.totalQuantity,
        };
      });

      //  FormData build
      const formData = new FormData();

      // VERY IMPORTANT
      formData.append("tickets", JSON.stringify(updatedTickets));

      const toastId = toast.loading("Updating ticket...");

      const res = await updateEventApi(event.identity, formData);

      toast.dismiss(toastId);

      if (res?.status) {
        toast.success("Ticket updated successfully");

        setOpenTicketModal(false);
        setSelectedTicket(null);
      } else {
        toast.error(res?.data?.message || "Ticket update failed");
      }
    } catch (err) {
      console.error("Ticket update error:", err);
      toast.error(err?.response?.data?.message || "Failed to update ticket");
    }
  };

  // update other details

  const handleOtherDetailsSave = async (updatedValues) => {
    try {
      const formData = new FormData();

      // STATE update (important)
      setOtherDetails(updatedValues);

      if (updatedValues.certIdentity) {
        formData.append("certIdentity", updatedValues.certIdentity);
      }

      if (updatedValues.perkIdentities?.length) {
        formData.append(
          "perkIdentities",
          JSON.stringify(updatedValues.perkIdentities)
        );
      }

      if (updatedValues.accommodationIdentities?.length) {
        formData.append(
          "accommodationIdentities",
          JSON.stringify(updatedValues.accommodationIdentities)
        );
      }

      if (updatedValues.website) {
        formData.append("eventLink", updatedValues.website);
      }

      if (updatedValues.videoLink) {
        formData.append("videoLink", updatedValues.videoLink);
      }

      const toastId = toast.loading("Updating other details...");

      const res = await updateEventApi(event.identity, formData);

      toast.dismiss(toastId);

      if (res?.status) {
        toast.success("Other details updated successfully");
        setOpenOtherModal(false);
      } else {
        toast.error("Update failed");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to update other details");
    }
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
        <div className="hero-card edit-wrapper">
          {/* ALWAYS BLURRED BACKGROUND */}
          <div
            className="blur-bg"
            style={{ backgroundImage: `url(${images[currentIndex]})` }}
          />

          {/* CLEAR CENTER IMAGE */}
          <img
            className="event-img"
            alt="event"
            src={bannerImages[currentIndex]}
          />

          <EditOverlay
            onEdit={() => setOpenBannerModal(true)}
            eventOrgIdentity={event?.org?.identity}
          />
          <span className="badge-upcoming">
            {event?.status || "Upcoming Event"}
          </span>
          {/* SLIDER CONTROLS – BELOW IMAGE */}
        </div>
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
            </div>
          </div>
          <div >
            <button className="btn-register" onClick={handleRegisterClick}>
              Register Now
            </button>
            <div className="soc-mediya">
              {/* like , share , save */}
              <span>{LIKE_ICON} 123</span>
              <span>{SINGELEVENTSHARE_ICON}</span>
              <span>{SAVEICON}</span>
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
            <div className="card-box edit-wrapper">
              <h4 className="section-title mb-4">Ticket Availability</h4>
              <EditOverlay
                onEdit={() => setOpenTicketListModal(true)}
                eventOrgIdentity={event?.org?.identity}
              />
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
            <div className="card-box mt-4 edit-wrapper">
              <h3>Event Host Details</h3>
              <EditOverlay
                onEdit={() => setOpenHostModal(true)}
                eventOrgIdentity={event?.org?.identity}
              />

              <h4>
                {event.org?.organizationName || "-"}({event.org?.domainEmail})
              </h4>

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
          {/* EDIT ICON HERE */}
          <EditOverlay
            onEdit={() => setOpenOtherModal(true)}
            eventOrgIdentity={event?.org?.identity}
          />

          <div className="row">
            {/* ================= PERKS ================= */}
            <div className="col-md-4 other-strong-titel">
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
      {openBannerModal && (
        <BannerImageModal
          images={bannerImages}
          onClose={() => setOpenBannerModal(false)}
          onSave={handleBannerSave}
        />
      )}

      {openTicketListModal && (
        <TicketListModal
          tickets={event.tickets}
          onClose={() => setOpenTicketListModal(false)}
          onEditTicket={(ticket) => {
            setSelectedTicket(ticket);
            setOpenTicketListModal(false);
            setOpenTicketModal(true);
          }}
        />
      )}

      {openTicketModal && (
        <TicketModal
          open={openTicketModal}
          onClose={() => {
            setOpenTicketModal(false);
            setSelectedTicket(null);
          }}
          ticketForm={ticketForm}
          setTicketForm={setTicketForm}
          ticketType={ticketType}
          setTicketType={setTicketType}
          onSave={handleTicketSave}
        />
      )}

      {openHostModal && (
        <EventDetailsModal
          onClose={() => {
            // FULL CLOSE – no reopen
            setOpenHostModal(false);
          }}
          onOrgClick={() => {
            setOpenHostModal(false);
            setTimeout(() => setOpenOrgModal(true), 0);
          }}
          onOfferClick={() => {
            setOpenHostModal(false);
            setTimeout(() => setOpenOfferModal(true), 0);
          }}
          onSocialClick={() => {
            setOpenHostModal(false);
            setTimeout(() => setOpenSocialModal(true), 0);
          }}
        />
      )}

      {openOrgModal && (
        <OrganizationModal
          orgs={orgData}
          onClose={() => {
            setOpenOrgModal(false);
            setTimeout(() => setOpenHostModal(true), 0);
          }}
          onSave={handleOrganizationSave}
        />
      )}

      {openOfferModal && (
        <OfferModal
          value={offerData}
          onClose={openEventDetailsAgain}
          onSave={handleOfferSave}
        />
      )}

      {openSocialModal && (
        <SocialMediaModal
          value={socialData}
          onClose={() => {
            //Social Media close
            setOpenSocialModal(false);

            //Back to Event Host Details popup
            setTimeout(() => setOpenHostModal(true), 0);
          }}
          onSave={handleSocialSave}
        />
      )}

      {openOtherModal && (
        <OtherDetailsModal
          value={otherDetails}
          onClose={() => setOpenOtherModal(false)}
          onSave={handleOtherDetailsSave}
        />
      )}

      {/* ================= 10. FOOTER SECTION ================= */}
      <div>
        <Footer />
      </div>
    </>
  );
}
