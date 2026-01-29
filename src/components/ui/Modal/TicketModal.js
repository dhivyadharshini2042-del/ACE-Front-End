"use client";

import styles from "./Modal.module.css";

export default function TicketModal({
  open,
  onClose,
  ticketForm,
  setTicketForm,
  ticketType,
  setTicketType,
  onSave,
  minDate,
  maxDate,
}) {
  if (!open) return null;

  return (
    <div className={styles.modalBackdrop}>
      <div className={styles.modal}>
        {/* Header */}
        <div className={styles.modalHeader}>
          <h3 className={styles.modalTitle}>Ticket</h3>
          <span className={styles.closeBtn} onClick={onClose}>
            ✕
          </span>
        </div>

        {/* Free / Paid Switch */}
        <div className={styles.switchRow}>
          <span
            className={ticketType === "FREE" ? styles.active : ""}
            onClick={() => setTicketType("FREE")}
          >
            Free
          </span>
          <span
            className={ticketType === "PAID" ? styles.active : ""}
            onClick={() => setTicketType("PAID")}
          >
            Paid
          </span>
        </div>

        {/* Form */}
        <div className={styles.grid2}>
          <div className={styles.field}>
            <label>
              Ticket Name <span>*</span>
            </label>
            <input
              className={styles.input}
              value={ticketForm.name}
              onChange={(e) =>
                setTicketForm({ ...ticketForm, name: e.target.value })
              }
            />
          </div>

          <div className={styles.field}>
            <label>Description </label>
            <input
              className={styles.input}
              value={ticketForm.description}
              onChange={(e) =>
                setTicketForm({ ...ticketForm, description: e.target.value })
              }
            />
          </div>

          <div className={styles.field}>
            <label>
              From Date<span>*</span>
            </label>
            <input
              type="date"
              className={styles.input}
              min={minDate}
              max={maxDate}
              value={ticketForm.from?.split("T")[0] || ""}
              onChange={(e) =>
                setTicketForm({
                  ...ticketForm,
                  from: new Date(
                    `${e.target.value}T00:00:00.000Z`,
                  ).toISOString(),
                })
              }
            />
          </div>

          <div className={styles.field}>
            <label>
              To Date <span>*</span>
            </label>
            <input
              type="date"
              className={styles.input}
              min={ticketForm.from?.split("T")[0] || minDate}
              max={maxDate}
              value={ticketForm.to?.split("T")[0] || ""}
              onChange={(e) =>
                setTicketForm({
                  ...ticketForm,
                  to: new Date(`${e.target.value}T23:59:59.000Z`).toISOString(),
                })
              }
            />
          </div>

          {ticketType === "PAID" && (
            <div className={styles.field}>
              <label>
                Amount <span>*</span>
              </label>
              <input
                className={styles.input}
                value={ticketForm.amount}
                onChange={(e) =>
                  setTicketForm({ ...ticketForm, amount: e.target.value })
                }
              />
            </div>
          )}

          <div className={styles.field}>
            <label>Total Tickets </label>
            <select
              className={styles.input}
              value={ticketForm.total}
              onChange={(e) =>
                setTicketForm({ ...ticketForm, total: e.target.value })
              }
            >
              <option value="1000">1000</option>
              <option value="2000">2000</option>
              <option value="5000">5000</option>
            </select>
          </div>
        </div>

        {/* Footer */}
        <div className={styles.modalFooter}>
          <button className={styles.outlineBtn} onClick={onClose}>
            Close
          </button>
          <button className={styles.primaryBtn} onClick={onSave}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
