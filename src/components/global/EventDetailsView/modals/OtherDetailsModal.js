"use client";

import { useEffect, useState } from "react";
import {
  getCertificationsApi,
  getPerksApi,
  getAccommodationsApi,
} from "../../../../lib/api/event.api";
import "./OtherDetailsModal.css";

export default function OtherDetailsModal({
  value, 
  onClose,
  onSave,
}) {
  /* ================= MASTER DATA ================= */
  const [certifications, setCertifications] = useState([]);
  const [perks, setPerks] = useState([]);
  const [accommodations, setAccommodations] = useState([]);

  /* ================= FORM STATE ================= */
  const [form, setForm] = useState({
    certIdentity: "",
    perkIdentities: [],
    accommodationIdentities: [],
    website: "",
    videoLink: "",
  });

  /* ================= LOAD MASTER APIs ================= */
  useEffect(() => {
    async function loadMasters() {
      try {
        const [certRes, perkRes, accRes] = await Promise.all([
          getCertificationsApi(),
          getPerksApi(),
          getAccommodationsApi(),
        ]);

        if (certRes?.success) setCertifications(certRes.data || []);
        if (perkRes?.success) setPerks(perkRes.data || []);
        if (accRes?.success) setAccommodations(accRes.data || []);
      } catch (err) {
        console.error("Failed to load master data", err);
      }
    }

    loadMasters();
  }, []);

  /* ================= PREPOPULATE FROM SINGLE EVENT ================= */
  useEffect(() => {
    if (!value) return;

    setForm({
      certIdentity: value.certIdentity || "",
      perkIdentities: value.perkIdentities || [],
      accommodationIdentities: value.accommodationIdentities || [],
      website: value.website || "",
      videoLink: value.videoLink || "",
    });
  }, [value]);

  return (
    <div className="other-overlay">
      <div className="other-modal">
        {/* ================= HEADER ================= */}
        <div className="other-header">
          <h3>Other Details</h3>
          <span className="close-btn" onClick={onClose}>✕</span>
        </div>

        {/* ================= BODY ================= */}
        <div className="other-grid">

          {/* ===== CERTIFICATION (SINGLE VALUE) ===== */}
          <div>
            <label>Certification</label>
            <select
              value={form.certIdentity}
              onChange={(e) =>
                setForm({ ...form, certIdentity: e.target.value })
              }
            >
              <option value="">Select Certification</option>
              {certifications.map((c) => (
                <option key={c.identity} value={c.identity}>
                  {c.certName}
                </option>
              ))}
            </select>
          </div>

          {/* ===== ACCOMMODATION ===== */}
          <div>
            <label>Accommodation</label>
            <select
              value={form.accommodationIdentities[0] || ""} 
              onChange={(e) =>
                setForm({
                  ...form,
                  accommodationIdentities: e.target.value
                    ? [e.target.value] 
                    : [],
                })
              }
            >
              <option value="">Select Accommodation</option>
              {accommodations.map((a) => (
                <option key={a.identity} value={a.identity}>
                  {a.accommodationName}
                </option>
              ))}
            </select>
          </div>

          {/* ===== PERKS (ARRAY STORE, SINGLE SELECT UI) ===== */}
          <div>
            <label>Perks</label>
            <select
              value={form.perkIdentities[0] || ""} 
              onChange={(e) =>
                setForm({
                  ...form,
                  perkIdentities: e.target.value
                    ? [e.target.value]
                    : [],
                })
              }
            >
              <option value="">Select Perk</option>
              {perks.map((p) => (
                <option key={p.identity} value={p.identity}>
                  {p.perkName}
                </option>
              ))}
            </select>
          </div>

          {/* ===== WEBSITE ===== */}
          <div>
            <label>Website</label>
            <input
              placeholder="Enter website link"
              value={form.website}
              onChange={(e) =>
                setForm({ ...form, website: e.target.value })
              }
            />
          </div>

          {/* ===== VIDEO ===== */}
          <div className="full">
            <label>Event Video</label>
            <input
              placeholder="Enter video link"
              value={form.videoLink}
              onChange={(e) =>
                setForm({ ...form, videoLink: e.target.value })
              }
            />
          </div>
        </div>

        {/* ================= FOOTER ================= */}
        <div className="other-footer">
          <button onClick={() => onSave(form)}>
            Update
          </button>
        </div>
      </div>
    </div>
  );
}
