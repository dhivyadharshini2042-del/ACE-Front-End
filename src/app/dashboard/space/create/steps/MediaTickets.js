"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./MediaTickets.module.css";
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
import {
  getAccommodationsApi,
  getCertificationsApi,
  getPerksApi,
} from "../../../../../lib/api/event.api";
import TicketModal from "../../../../../components/ui/Modal/TicketModal";
import ConfirmModal from "../../../../../components/ui/Modal/ConfirmModal";
import { processImage } from "../../../../../lib/utils/imageProcessor";
import { ticketSchema } from "../../../../../components/validation";
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
  /* ================= LOCAL STATE (WITH PREFILL) ================= */
  const [tickets, setTickets] = useState(data?.tickets || []);
  const [perks, setPerks] = useState(data?.perks?.[0] ?? "");
const [certification, setCertification] = useState(data?.certification ?? "");
const [accommodation, setAccommodation] = useState(Array.isArray(data?.accommodation) ? data.accommodation : []);
const [paymentLink, setPaymentLink] = useState(data?.paymentLink ?? "");

  const [accomSearch, setAccomSearch] = useState("");
  const [accomOpen, setAccomOpen] = useState(false);
  const accomRef = useRef(null);

  const [perksList, setPerksList] = useState([]);
  const [certList, setCertList] = useState([]);
  const [accommodationList, setAccommodationList] = useState([]);
  const [openTicketModal, setOpenTicketModal] = useState(false);
  const [openSuccessModal, setOpenSuccessModal] = useState(false);
  const [ticketType, setTicketType] = useState("FREE");
  const [editingIndex, setEditingIndex] = useState(null);
  const isFirstRender = useRef(true);
  const [ticketForm, setTicketForm] = useState({
    name: "",
    description: "",
    from: "",
    to: "",
    amount: "",
    total: "",
  });

  /* ================= IMAGE UPLOAD STATE ================= */
  const fileInputRef = useRef(null);
  const [images, setImages] = useState([]);

  const handleFileSelect = async (e) => {
    const files = Array.from(e.target.files || []);
    let updatedImages = [...images];

    for (let file of files) {
      // image type check
      if (!file.type.startsWith("image/")) {
        toast.error("Only image files allowed");
        continue;
      }

      //  compress if needed (mobile logic)
      const processedImage = await processImage(file);

      //max 4 images limit
      if (updatedImages.length >= 4) {
        toast.error("Maximum 4 images allowed");
        break;
      }

      updatedImages.push(processedImage);
    }

    setImages(updatedImages);
    e.target.value = "";
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  useEffect(() => {

      if (!resetSignal) return;
  
  isFirstRender.current = true;
    // reset local UI states
    setTickets([]);
    setPerks("");
    setCertification("");
    setAccommodation([]);
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
      total: "",
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

  /* ================= SYNC TO PARENT ================= */
  // useEffect(() => {
  //   setData({
  //     ...data,
  //     perks: perks ? [perks] : [],
  //     certification: certification || "",
  //     // accommodation: accommodation ? [accommodation] : [],
  //     accommodation: accommodation,
  //     paymentLink,
  //     tickets,
  //     bannerImages: images,
  //   });
  // }, [perks, certification, accommodation, paymentLink, tickets, images]);

useEffect(() => {
  if (isFirstRender.current) {
    isFirstRender.current = false;
    return;
  }
  setData((prev) => ({
    ...prev,
    perks: perks ? [perks] : [],
    certification: certification || "",
    accommodation: accommodation,
    paymentLink,
    tickets,
    bannerImages: images,
  }));
}, [perks, certification, accommodation, paymentLink, tickets, images]);



// ADD THESE TEMPORARILY
console.log("MediaTickets MOUNTED with data:", data);
console.log("perks init:", data?.perks?.[0]);
console.log("certification init:", data?.certification);
console.log("accommodation init:", data?.accommodation);
console.log("paymentLink init:", data?.paymentLink);

  /* ================= API LOADS ================= */
  useEffect(() => {
    getPerksApi().then((res) => res?.status && setPerksList(res.data));
    getCertificationsApi().then((res) => res?.status && setCertList(res.data));
    getAccommodationsApi().then(
      (res) => res?.status && setAccommodationList(res.data),
    );
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (accomRef.current && !accomRef.current.contains(e.target))
        setAccomOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  /* ================= TICKET ================= */

  const handleAddTicket = () => {
    setEditingIndex(null);
    setTicketForm({
      name: "",
      description: "",
      from: "",
      to: "",
      amount: "",
      total: "",
    });
    setTicketType("FREE");
    setOpenTicketModal(true);
  };

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
        const updated = [...tickets];
        updated[editingIndex] = payload;
        setTickets(updated);
      } else {
        setTickets([...tickets, payload]);
      }

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
      {/* ================= MEDIA & LINKS ================= */}
      <div className={styles.card}>
        <h3 className={styles.title}>Media & Links</h3>

        <div className={styles.grid2}>
          <div className={styles.field}>
            <label>
              Files <span>*</span>
            </label>

            <div className={styles.uploadBox}>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                style={{ display: "none" }}
                onChange={handleFileSelect}
              />

              <div
                className={styles.fileUpload}
                style={{ cursor: "pointer" }}
                onClick={() => fileInputRef.current?.click()}
              >
                {IMAGEICON}
                <p>Choose file or drag here (up to 4 images)</p>
              </div>

              <div className={styles.previewRow}>
                {images.length === 0 &&
                  [1, 2, 3, 4].map((i) => (
                    <div key={i} className={styles.previewImg}>
                      <img src="/images/file.png" alt="preview" />
                    </div>
                  ))}

                {images.map((img, index) => (
                  <div
                    key={index}
                    className={styles.previewImg}
                    style={{ position: "relative" }}
                  >
                    <img src={URL.createObjectURL(img)} alt="preview" />

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

            <div className={styles.iconInput}>
              <span className={styles.icon}>{VIDEOICON}</span>
              <input className={styles.input} placeholder="Event Video Link" />
            </div>
          </div>

          {/* ================= SOCIAL LINKS ================= */}
          <div className={styles.field}>
            <label>Social Media Links</label>

            <div className={styles.iconInput}>
              <span className={styles.icon}>{WHATSAPP}</span>
              <input
                className={styles.input}
                placeholder="Whatsapp Channel Link"
              />
            </div>

            <div className={styles.iconInput}>
              <span className={styles.icon}>{INSTAGRAMICON}</span>
              <input className={styles.input} placeholder="Instagram Link" />
            </div>

            <div className={styles.iconInput}>
              <span className={styles.icon}>{LINKEDINICON}</span>
              <input className={styles.input} placeholder="LinkedIn Link" />
            </div>

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
          {/* ================= PERKS ================= */}
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

          {/* ================= CERTIFICATION ================= */}
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

          {/* ================= ACCOMMODATION ================= */}
          <div className={styles.field} ref={accomRef} style={{ position: "relative" }}>
            <label>Accommodation</label>

            {/* Input box with chips */}
            <div
              style={{
                minHeight: "42px",
                border: `1px solid ${accomOpen ? "#6366f1" : "#d1d5db"}`,
                borderRadius: "8px",
                padding: "6px 10px",
                display: "flex",
                flexWrap: "wrap",
                gap: "6px",
                alignItems: "center",
                background: "#fff",
                cursor: "text",
                boxShadow: accomOpen ? "0 0 0 3px rgba(99,102,241,0.1)" : "none",
                transition: "border-color 0.2s",
              }}
              onClick={() => setAccomOpen(true)}
            >
              {/* Selected chips */}
              {accommodation.map((val) => (
                <span
                  key={val}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "4px",
                    background: "#ede9fe",
                    color: "#4f46e5",
                    borderRadius: "999px",
                    padding: "2px 10px",
                    fontSize: "13px",
                    fontWeight: 500,
                  }}
                >
                  {accommodationList.find((a) => a.identity === val)?.accommodationName || val}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setAccommodation(accommodation.filter((v) => v !== val));
                    }}
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      color: "#7c3aed",
                      fontSize: "11px",
                      padding: 0,
                      lineHeight: 1,
                    }}
                  >
                    ✕
                  </button>
                </span>
              ))}

              {/* Search input */}
              <input
                style={{
                  border: "none",
                  outline: "none",
                  flex: 1,
                  minWidth: "120px",
                  fontSize: "14px",
                  background: "transparent",
                }}
                placeholder={accommodation.length === 0 ? "Select Accommodation..." : ""}
                value={accomSearch}
                onChange={(e) => { setAccomSearch(e.target.value); setAccomOpen(true); }}
                onClick={(e) => { e.stopPropagation(); setAccomOpen(true); }}
              />
            </div>

            {/* Dropdown */}
            {accomOpen && (
              <div
                style={{
                  position: "absolute",
                  top: "100%",
                  left: 0,
                  right: 0,
                  background: "#fff",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                  boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
                  zIndex: 100,
                  maxHeight: "200px",
                  overflowY: "auto",
                  marginTop: "4px",
                }}
              >
                {accommodationList
                  .filter(
                    (a) =>
                      !accommodation.includes(a.identity) &&
                      a.accommodationName.toLowerCase().includes(accomSearch.toLowerCase())
                  )
                  .map((a) => (
                    <div
                      key={a.id}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        setAccommodation([...accommodation, a.identity]);
                        setAccomSearch("");
                      }}
                      style={{
                        padding: "10px 14px",
                        fontSize: "14px",
                        cursor: "pointer",
                        color: "#374151",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "#f5f3ff")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "#fff")}
                    >
                      {a.accommodationName}
                    </div>
                  ))}

                {accommodationList.filter(
                  (a) =>
                    !accommodation.includes(a.identity) &&
                    a.accommodationName.toLowerCase().includes(accomSearch.toLowerCase())
                ).length === 0 && (
                    <div style={{ padding: "12px 14px", fontSize: "13px", color: "#9ca3af" }}>
                      No options found
                    </div>
                  )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ================= TICKETS ================= */}
      <div className={styles.card}>
        <h3 className={styles.title}>Tickets & Payment</h3>

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

        <div className={styles.ticketHeader}>
          <label>
            Tickets <span>*</span>
          </label>
          <button className={styles.addBtn} onClick={handleAddTicket}>
            + Add
          </button>
        </div>

        {/* {tickets.length === 0 && (
          <p className={styles.empty}>
            Ticket is empty! Click to create ticket
          </p>
        )} */}

        {tickets.length === 0 && (
  <div style={{
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "32px",
    gap: "8px"
  }}>
    <div style={{
      width: 48,
      height: 48,
      borderRadius: "50%",
      background: "#f3f0ff",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: 22
    }}>
      🎟️
    </div>
    <p style={{ color: "#374151", fontWeight: 600, margin: 0, fontSize: 15 }}>
      No tickets yet
    </p>
    <p style={{ color: "#9ca3af", margin: 0, fontSize: 13 }}>
      Click <strong>+ Add</strong> to create ticket
    </p>
  </div>
)}

        {tickets.length > 0 && (
          <table className={styles.table}>
            <tbody>
              {tickets.map((t, i) => (
                <tr key={i}>
                  <td>{t.name}</td>
                  <td>{t.type === "FREE" ? "Free" : `₹ ${t.amount}`}</td>
                  <td>{t.total}</td>
                  <td
                    style={{ cursor: "pointer" }}
                    onClick={() => handleEditTicket(t, i)}
                  >
                    {EDITICON}
                  </td>
                  <td
                    style={{ cursor: "pointer" }}
                    onClick={() =>
                      setTickets(tickets.filter((_, index) => index !== i))
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

      {/* ================= ACTIONS ================= */}
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
