"use client";
import { DELETICON, EDITICON } from "../../../../const-value/config-icons/page";
import "./TicketListModal.css";

export default function TicketListModal({
  tickets = [],
  onClose,
  onEditTicket,
  onDeleteTicket,
}) {
  const formatDateOnly = (iso) => {
    if (!iso) return "-";

    return new Date(iso).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="banner-modal-overlay">
      <div className="ticket-modal">
        {/* HEADER */}
        <div className="modal-header">
          <h3>Ticket List</h3>
          <button className="close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        {/* TABLE */}
        <div className="ticket-table">
          <div className="ticket-row header">
            <span>Ticket Name</span>
            <span>sellingFrom</span>
            <span>sellingTo</span>
            <span>Total</span>
            <span>Action</span>
          </div>

          {tickets.map((t) => (
            <div className="ticket-row" key={t.identity}>
              <span>{t.name}</span>
              <span>{formatDateOnly(t.sellingFrom)}</span>
              <span>{formatDateOnly(t.sellingTo)}</span>
              <span>{t.totalQuantity}</span>
              <div className="d-flex gap-5 pe-auto">
                <span onClick={() => onEditTicket(t)}>{EDITICON}</span>
                <span
                  onClick={() => onDeleteTicket(t.identity)}
                  style={{ display: "none" }}
                >
                  {DELETICON}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* FOOTER */}
        <div className="modal-footer text-end">
          <button className="btn-save">Update</button>
        </div>
      </div>
    </div>
  );
}
