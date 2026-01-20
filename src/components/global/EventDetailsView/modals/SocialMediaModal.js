"use client";
import { useState } from "react";
import "./SocialMediaModal.css";

export default function SocialMediaModal({ value = {}, onClose, onSave }) {
  const [form, setForm] = useState({
    whatsapp: value.whatsapp || "",
    instagram: value.instagram || "",
    linkedin: value.linkedin || "",
  });

  const handleSave = () => {
    const payload = {
      socialLinks: {
        whatsapp: form.whatsapp,
        instagram: form.instagram,
        linkedin: form.linkedin,
      },
    };
    onSave(payload);
  };

  return (
    <div className="child-overlay" onClick={onClose}>
      <div className="child-modal" onClick={(e) => e.stopPropagation()}>
        {/* HEADER */}
        <div className="modal-header">
          <button className="back-btn" onClick={onClose}>←</button>
          <h3>Social Media Details</h3>
        </div>

        {/* BODY */}
        <div className="social-form">
          <div className="input-wrap whatsapp">
            <input
              placeholder="WhatsApp Channel Link"
              value={form.whatsapp}
              onChange={(e) =>
                setForm({ ...form, whatsapp: e.target.value })
              }
            />
          </div>

          <div className="input-wrap instagram">
            <input
              placeholder="Instagram Link"
              value={form.instagram}
              onChange={(e) =>
                setForm({ ...form, instagram: e.target.value })
              }
            />
          </div>

          <div className="input-wrap linkedin">
            <input
              placeholder="LinkedIn Link"
              value={form.linkedin}
              onChange={(e) =>
                setForm({ ...form, linkedin: e.target.value })
              }
            />
          </div>
        </div>

        {/* FOOTER */}
        <div className="modal-footer">
          <button className="outline-btn" onClick={onClose}>Reset</button>
          <button className="primary-btn" onClick={handleSave}>Save</button>
        </div>
      </div>
    </div>
  );
}
