"use client";
import "./TicketEditModal.css";

export default function TicketEditModal({ open, ticket, onClose, onSave }) {
  if (!open || !ticket) return null;

  const [form, setForm] = React.useState(ticket);

  return (
    <div className="modal-overlay">
      <div className="ticket-edit-modal">
        {/* HEADER */}
        <div className="modal-header">
          <h3>Edit Ticket</h3>
          <button onClick={onClose}>✕</button>
        </div>

        {/* FORM */}
        <div className="modal-body">
          <div className="field">
            <label>Ticket Name</label>
            <input
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
            />
          </div>

          <div className="field">
            <label>Price</label>
            <input
              value={form.price}
              onChange={(e) =>
                setForm({ ...form, price: e.target.value })
              }
            />
          </div>

          <div className="field">
            <label>Total Tickets</label>
            <input
              value={form.total || ""}
              onChange={(e) =>
                setForm({ ...form, total: e.target.value })
              }
            />
          </div>
        </div>

        {/* FOOTER */}
        <div className="modal-footer">
          <button className="btn-cancel" onClick={onClose}>
            Cancel
          </button>
          <button
            className="btn-save"
            onClick={() => onSave(form)}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
