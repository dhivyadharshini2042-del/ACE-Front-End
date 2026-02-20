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
import { TOAST_ERROR_MSG_ONLY_IMAGE_FILES_ALLOWED,
  TOAST_ERROR_MSG_MAX_4_IMAGES_ALLOWED, 
  TOAST_ERROR_MSG_INVALID_TICKET_DATA } from "../../../../../const-value/config-message/page";

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
  const [perks, setPerks] = useState(data?.perks?.[0] || "");
  const [certification, setCertification] = useState(data?.certification || "");
  const [accommodation, setAccommodation] = useState(
    data?.accommodation?.[0] || "",
  );

  const [paymentLink, setPaymentLink] = useState(data?.paymentLink || "");

  const [perksList, setPerksList] = useState([]);
  const [certList, setCertList] = useState([]);
  const [accommodationList, setAccommodationList] = useState([]);
  const [openTicketModal, setOpenTicketModal] = useState(false);
  const [openSuccessModal, setOpenSuccessModal] = useState(false);
  const [ticketType, setTicketType] = useState("FREE");
  const [editingIndex, setEditingIndex] = useState(null);
  const [ticketForm, setTicketForm] = useState({
    name: "",
    description: "",
    from: "",
    to: "",
    amount: "",
    total: "1000",
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
        toast.error(TOAST_ERROR_MSG_ONLY_IMAGE_FILES_ALLOWED);
        continue;
      }

      //  compress if needed (mobile logic)
      const processedImage = await processImage(file);

      //max 4 images limit
      if (updatedImages.length >= 4) {
        toast.error(TOAST_ERROR_MSG_MAX_4_IMAGES_ALLOWED);
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

  /* ================= SYNC TO PARENT ================= */
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

  /* ================= API LOADS ================= */
  useEffect(() => {
    getPerksApi().then((res) => res?.status && setPerksList(res.data));
    getCertificationsApi().then((res) => res?.status && setCertList(res.data));
    getAccommodationsApi().then(
      (res) => res?.status && setAccommodationList(res.data),
    );
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
      total: "1000",
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
      toast.error(err?.errors?.[0] || TOAST_ERROR_MSG_INVALID_TICKET_DATA);
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

        {tickets.length === 0 && (
          <p className={styles.empty}>
            Ticket is empty! Click to create ticket
          </p>
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
