"use client";
import { useState } from "react";
import "./OfferModal.css";

export default function OfferModal({ value = "", onClose, onSave }) {
  const [offer, setOffer] = useState(value);

  return (
    <div className="child-overlay" onClick={onClose}>
      <div className="child-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <button className="back-btn" onClick={onClose}>←</button>
          <h3>Offer Details</h3>
        </div>

        <div className="modal-body">
          <label>Offers </label>
          
          <textarea
            placeholder="Enter offers"
            value={offer}
            maxLength={50}
            onChange={(e) => setOffer(e.target.value)}
          />
          <div className="char-count">{offer.length}/50</div>
        </div>

        <div className="modal-footer">
          <button className="outline-btn" onClick={onClose}>Reset</button>
          <button
            className="primary-btn"
            onClick={() => onSave(offer)}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
