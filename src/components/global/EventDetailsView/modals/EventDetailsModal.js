"use client";
import "./EventDetailsModal.css";

export default function EventDetailsModal({
  onClose,
  onOrgClick,
  onOfferClick,
  onSocialClick,
}) {
  return (
    <div className="host-overlay" onClick={onClose}>
      <div
        className="host-modal"
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <div className="host-header">
          <h3>Event Host Details</h3>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        {/* LIST */}
        <div className="host-list">
          <div className="host-item" onClick={onOrgClick}>
            <span>Organization Details</span>
            <span className="arrow">›</span>
          </div>

          <div className="host-item" onClick={onOfferClick}>
            <span>Offer Details</span>
            <span className="arrow">›</span>
          </div>

          <div className="host-item" onClick={onSocialClick}>
            <span>Social Media Details</span>
            <span className="arrow">›</span>
          </div>
        </div>

        {/* FOOTER */}
        <div className="host-footer">
          <button className="save-btn">Save</button>
        </div>
      </div>
    </div>
  );
}
