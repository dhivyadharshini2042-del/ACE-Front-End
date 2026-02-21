"use client";

/**
 * MediaTickets Component
 * Handles event media uploads, social links, perks, certification,
 * accommodation selection, ticket management, and final submission.
 */

// React and library imports
import { useEffect, useRef, useState } from "react";

// CSS module for styling
import styles from "./MediaTickets.module.css";

// Icon imports
import {
  DELETICON,
  EDITICON,
  IMAGEICON,
  INSTAGRAMICON,
  LINKEDINICON,
  VIDEOICON,
  WEBSITEICON,
  WHATSAPP,
} from "../../../../../const-value/config-icons/page";

// API calls to fetch dropdown options for perks, certifications, accommodations
import {
  getAccommodationsApi,
  getCertificationsApi,
  getPerksApi,
} from "../../../../../lib/api/event.api";

// Modal components for ticket creation/editing and submission confirmation
import TicketModal from "../../../../../components/ui/Modal/TicketModal";
import ConfirmModal from "../../../../../components/ui/Modal/ConfirmModal";

// Utility for image processing (compression, validation)
import { processImage } from "../../../../../lib/utils/imageProcessor";

// Validation schema for ticket form
import { ticketSchema } from "../../../../../components/validation";

// Toast library for user feedback on actions and errors
import toast from "react-hot-toast";

export default function MediaTickets({
  data,
  setData,
  onBack,
  onSubmit,
  resetSignal,
  ticketMinDate,
  ticketMaxDate,
}) {
  /* ================= LOCAL UI STATE ================= */
  /* Initializes component state using parent data (supports edit/prefill mode) */
  const [tickets, setTickets] = useState(data?.tickets || []);
  const [perks, setPerks] = useState(data?.perks?.[0] || "");
  const [certification, setCertification] = useState(data?.certification || "");
  const [accommodation, setAccommodation] = useState(
    data?.accommodation?.[0] || "",
  );

  const [paymentLink, setPaymentLink] = useState(data?.paymentLink || "");

  /* ================= DROPDOWN DATA ================= */
  /* Stores API-loaded master data for selectable options */
  const [perksList, setPerksList] = useState([]);
  const [certList, setCertList] = useState([]);
  const [accommodationList, setAccommodationList] = useState([]);
  
  /* ================= MODAL & EDITING STATE ================= */
  const [openTicketModal, setOpenTicketModal] = useState(false);
  const [openSuccessModal, setOpenSuccessModal] = useState(false);
  const [ticketType, setTicketType] = useState("FREE");
  const [editingIndex, setEditingIndex] = useState(null);

  /* ================= TICKET FORM STATE ================= */
  /* Stores temporary ticket form data for create/edit operations */
  const [ticketForm, setTicketForm] = useState({
    name: "",
    description: "",
    from: "",
    to: "",
    amount: "",
    total: "1000",
  });

  // state and ref used for uploading banner images
  const fileInputRef = useRef(null);
  const [images, setImages] = useState([]);

  // process selected files, compress and validate types/limits
  const handleFileSelect = async (e) => {
    const files = Array.from(e.target.files || []);
    let updatedImages = [...images];

    for (let file of files) {
      // image type check
      if (!file.type.startsWith("image/")) {
        toast.error("Only image files allowed");
        continue;
      }

      // Process/compress image (optimized for mobile uploads)
      const processedImage = await processImage(file);

      // max 4 images limit
      if (updatedImages.length >= 4) {
        toast.error("Maximum 4 images allowed");
        break;
      }

      // Process/compress image (optimized for mobile uploads)
      updatedImages.push(processedImage);
    }

    setImages(updatedImages);
    e.target.value = "";
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  // reset all form fields when parent triggers resetSignal
  useEffect(() => {
    // reset local UI states
    setTickets([]);
    setPerks("");
    setCertification("");
    setAccommodation("");
    setPaymentLink("");
    setImages([]);
    setTicketType("FREE");

    // reset ticket form
    setTicketForm({
      name: "",
      description: "",
      from: "",
      to: "",
      amount: "",
      total: "1000",
    });

    // reset parent media data
    setData({
      bannerImages: [],
      perks: [],
      certification: "",
      accommodation: [],
      tickets: [],
      paymentLink: "",
      whatsapp: "",
      instagram: "",
      linkedin: "",
      website: "",
    });
  }, [resetSignal]);

  // propagate internal state changes back to parent data object
  useEffect(() => {
    setData({
      ...data,
      perks: perks ? [perks] : [],
      certification: certification || "",
      accommodation: accommodation ? [accommodation] : [],
      paymentLink,
      tickets,
      bannerImages: images,
    });
  }, [perks, certification, accommodation, paymentLink, tickets, images]);

  // load dropdown options for perks, certifications, accommodations
  useEffect(() => {
    getPerksApi().then((res) => res?.status && setPerksList(res.data));
    getCertificationsApi().then((res) => res?.status && setCertList(res.data));
    getAccommodationsApi().then(
      (res) => res?.status && setAccommodationList(res.data),
    );
  }, []);

  /* ================= TICKET ================= */

  // open empty ticket modal for creating new ticket
  const handleAddTicket = () => {
    setEditingIndex(null);
    setTicketForm({
      name: "",
      description: "",
      from: "",
      to: "",
      amount: "",
      total: "1000",
    });
    setTicketType("FREE");
    setOpenTicketModal(true);
  };

  // populate modal with existing ticket for editing
  const handleEditTicket = (ticket, index) => {
    setEditingIndex(index);
    setTicketForm(ticket);
    setTicketType(ticket.type);
    setOpenTicketModal(true);
  };

  const handleSaveTicket = async () => {
    try {
      await ticketSchema.validate(
        {
          ...ticketForm,
          ticketType,
        },
        { abortEarly: false },
      );

      const payload = {
        ...ticketForm,
        type: ticketType,
      };

      if (editingIndex !== null) {
      // replace existing ticket when editing
        const updated = [...tickets];
        updated[editingIndex] = payload;
        setTickets(updated);
      } else {
        setTickets([...tickets, payload]);
      }

      // close modal after save
      setOpenTicketModal(false);
      setEditingIndex(null);
    } catch (err) {
      toast.error(err?.errors?.[0] || "Invalid ticket data");
    }
  };

  useEffect(() => {
    console.log("CONFIRM MODAL:", openSuccessModal);
  }, [openSuccessModal]);

  return (
    <>
      {/* ================= MEDIA & LINKS - images/video and social URLs */}
      <div className={styles.card}>
        <h3 className={styles.title}>Media & Links</h3>

        <div className={styles.grid2}>
          {/* ================= FILE UPLOAD SECTION ================= */}
          {/* Handles image uploads (max 4), preview display, removal, and optional video link */}
          <div className={styles.field}>
            <label>
              Files <span>*</span>
            </label>

            <div className={styles.uploadBox}>
              {/* Hidden native file input (triggered programmatically) */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                style={{ display: "none" }}
                onChange={handleFileSelect}
              />

              {/* Custom upload trigger UI */}
              <div
                className={styles.fileUpload}
                style={{ cursor: "pointer" }}
                onClick={() => fileInputRef.current?.click()}
              >
                {IMAGEICON}
                <p>Choose file or drag here (up to 4 images)</p>
              </div>

              {/* Image preview section */}
              <div className={styles.previewRow}>
                {/* Placeholder previews when no images are selected */}
                {images.length === 0 &&
                  [1, 2, 3, 4].map((i) => (
                    <div key={i} className={styles.previewImg}>
                      <img src="/images/file.png" alt="preview" />
                    </div>
                  ))}

                {/* Render selected image previews */}
                {images.map((img, index) => (
                  <div
                    key={index}
                    className={styles.previewImg}
                    style={{ position: "relative" }}
                  >
                    <img src={URL.createObjectURL(img)} alt="preview" />
                
                    {/* Remove selected image */}
                    <span
                      onClick={() => removeImage(index)}
                      style={{
                        position: "absolute",
                        top: "-6px",
                        right: "-6px",
                        background: "#000",
                        color: "#fff",
                        width: 20,
                        height: 20,
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 12,
                        cursor: "pointer",
                      }}
                    >
                      ✕
                    </span>
                  </div>
                ))}
              </div>
            </div>
              
            {/* Optional event video URL input */}
            <div className={styles.iconInput}>
              <span className={styles.icon}>{VIDEOICON}</span>
              <input className={styles.input} placeholder="Event Video Link" />
            </div>
          </div>

          {/* ================= SOCIAL LINKS - external platform inputs */}
          <div className={styles.field}>
            <label>Social Media Links</label>

            {/* Whatsapp */}
            <div className={styles.iconInput}>
              <span className={styles.icon}>{WHATSAPP}</span>
              <input
                className={styles.input}
                placeholder="Whatsapp Channel Link"
              />
            </div>

            {/* Instagram */}
            <div className={styles.iconInput}>
              <span className={styles.icon}>{INSTAGRAMICON}</span>
              <input className={styles.input} placeholder="Instagram Link" />
            </div>

            {/* LinkedIn */}
            <div className={styles.iconInput}>
              <span className={styles.icon}>{LINKEDINICON}</span>
              <input className={styles.input} placeholder="LinkedIn Link" />
            </div>

            {/* Website */}
            <div className={styles.iconInput}>
              <span className={styles.icon}>{WEBSITEICON}</span>
              <input className={styles.input} placeholder="Website Link" />
            </div>
          </div>
        </div>
      </div>

      {/* ================= PERKS ================= */}
      <div className={styles.card}>
        <h3 className={styles.title}>Perks & Add-ons</h3>

        <div className={styles.grid3}>
          {/* perks dropdown field */}
          <div className={styles.field}>
            <label>Perks</label>

            <select
              className={styles.input}
              value={perks}
              onChange={(e) => {
                setPerks(e.target.value);
              }}
            >
              <option value="">Select Perk</option>
              {perksList.map((p) => (
                <option key={p.id} value={p.identity}>
                  {p.perkName}
                </option>
              ))}
            </select>
          </div>

          {/* certification selector */}
          <div className={styles.field}>
            <label>
              Certification <span>*</span>
            </label>

            <select
              className={styles.input}
              value={certification}
              onChange={(e) => setCertification(e.target.value)}
            >
              <option value="">Select Certification</option>
              {certList.map((c) => (
                <option key={c.id} value={c.identity}>
                  {c.certName}
                </option>
              ))}
            </select>
          </div>

          {/* accommodation choice dropdown */}
          <div className={styles.field}>
            <label>Accommodation</label>

            <select
              className={styles.input}
              value={accommodation}
              onChange={(e) => {
                setAccommodation(e.target.value);
              }}
            >
              <option value="">Select Accommodation</option>
              {accommodationList.map((a) => (
                <option key={a.id} value={a.identity}>
                  {a.accommodationName}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* ================= TICKETS & PAYMENT SECTION ================= */}
      {/* Handles payment link input and ticket management (add, edit, delete) */}
      <div className={styles.card}>
        <h3 className={styles.title}>Tickets & Payment</h3>

        {/* external payment URL */}
        <div className={styles.field}>
          <label>
            Payment Link <span>*</span>
          </label>
          <input
            className={styles.input}
            placeholder="Enter payment link"
            value={paymentLink}
            onChange={(e) => setPaymentLink(e.target.value)}
          />
        </div>

        {/* Ticket section header with add action */}
        <div className={styles.ticketHeader}>
          <label>
            Tickets <span>*</span>
          </label>
          <button className={styles.addBtn} onClick={handleAddTicket}>
            + Add
          </button>
        </div>

        {/* Empty state message when no tickets exist */}
        {tickets.length === 0 && (
          <p className={styles.empty}>
            Ticket is empty! Click to create ticket
          </p>
        )}

        {/* Render ticket list when available */}
        {tickets.length > 0 && (
          <table className={styles.table}>
            <tbody>
              {tickets.map((t, i) => (
                <tr key={i}>
                  {/* Ticket name */}
                  <td>{t.name}</td>
              
                  {/* Ticket pricing (Free or Paid) */}
                  <td>{t.type === "FREE" ? "Free" : `₹ ${t.amount}`}</td>
              
                  {/* Total ticket quantity */}
                  <td>{t.total}</td>
              
                  {/* Edit ticket action */}
                  <td
                    style={{ cursor: "pointer" }}
                    onClick={() => handleEditTicket(t, i)}
                  >
                    {EDITICON}
                  </td>
              
                  {/* Delete ticket action */}
                  <td
                    style={{ cursor: "pointer" }}
                    onClick={() =>
                      setTickets(tickets.filter((_, index) => index !== i)) // Removes selected ticket
                    }
                  >
                    {DELETICON}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* ================= ACTIONS - navigation and submit controls */}
      <div className={styles.footer}>
        <button className={styles.outlineBtn} onClick={onBack}>
          Back
        </button>
        <button
          className={styles.primaryBtn}
          onClick={() => setOpenSuccessModal(true)}
        >
          Submit
        </button>
      </div>
      {/* ticket creation/edit modal */}
      <TicketModal
        open={openTicketModal}
        onClose={() => setOpenTicketModal(false)}
        ticketForm={ticketForm}
        setTicketForm={setTicketForm}
        ticketType={ticketType}
        setTicketType={setTicketType}
        onSave={handleSaveTicket}
        minDate={ticketMinDate}
        maxDate={ticketMaxDate}
      />

      {/* confirmation modal shown before final submit */}
      <ConfirmModal
        open={openSuccessModal}
        image="/images/logo.png"
        title="Event Submitted Successfully"
        description="Your event details are complete.
Review them and click Confirm to submit for approval.
Once approved, your event will be published.
Submit now?"
        onCancel={() => setOpenSuccessModal(false)}
        onConfirm={() => {
          setOpenSuccessModal(false);
          onSubmit();
        }}
      />
    </>
  );
}
