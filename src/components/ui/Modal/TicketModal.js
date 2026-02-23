"use client";

import { useState, useEffect } from "react";
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
  const [errors, setErrors] = useState({});

  // Reset errors when modal closes
  useEffect(() => {
    if (!open) setErrors({});
  }, [open]);

  if (!open) return null;

  // ─── Validation ───────────────────────────────────────────
  const validate = () => {
    const newErrors = {};
    const trimmedName = ticketForm.name?.trim();
    const trimmedDesc = ticketForm.description?.trim();
    const total_Ticket = ticketForm.total?.trim();

    // Ticket Name
    if (!trimmedName) {
      newErrors.name = "Ticket name is required.";
    }else if (trimmedName.length > 50) {
      newErrors.name = "Ticket name must not exceed 50 characters.";
    } else if (!/^[a-zA-Z0-9][a-zA-Z0-9\- ]*[a-zA-Z0-9]$|^[a-zA-Z0-9]$/.test(trimmedName)) {
      newErrors.name = "Only letters, numbers, hyphens and spaces are allowed.";
    } else if (/^\d+$/.test(trimmedName)) {
      newErrors.name = "Ticket name must contain at least one letter.";
    }
        // Description — required
if (!trimmedDesc) {
  newErrors.description = "Description is required.";
} else if (trimmedDesc.length > 200) {
  newErrors.description = "Description must not exceed 200 characters.";
} else if (/[<>{}\[\]]/.test(trimmedDesc)) {
  newErrors.description = "Special characters < > { } [ ] are not allowed.";
}

if (!ticketForm.total) {
  newErrors.total = "Total ticket is required.";
}

    // From Date
    if (!ticketForm.from) newErrors.from = "From date is required.";

    // To Date
    if (!ticketForm.to) newErrors.to = "To date is required.";

    // Amount (PAID only)
    if (ticketType === "PAID" && !ticketForm.amount) {
      newErrors.amount = "Amount is required.";
    }

    // Total Tickets — optional, only validate if filled
    if (ticketForm.total && !/^\d+$/.test(ticketForm.total)) {
      newErrors.total = "Total tickets must be a valid number.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ─── Close handler ────────────────────────────────────────
  const handleClose = () => {
    setErrors({});
    onClose();
  };

  // ─── Helpers ──────────────────────────────────────────────
  const clearError = (field) =>
    setErrors((prev) => ({ ...prev, [field]: null }));

  // ─── Field Handlers ───────────────────────────────────────
  const handleNameChange = (e) => {
    const value = e.target.value;
    if (/[<>{}\[\]@#$%^&*()!=+/\\|~`]/.test(value)) return;
    if (/\s{2,}/.test(value)) return;
    setTicketForm({ ...ticketForm, name: value });
    if (errors.name) clearError("name");
  };

  const handleDescriptionChange = (e) => {
    const value = e.target.value;
    if (/[<>{}\[\]]/.test(value)) return;
    setTicketForm({ ...ticketForm, description: value });
    if (errors.description) clearError("description");
  };

  const handleAmountChange = (e) => {
    const value = e.target.value;
    if (!/^\d*$/.test(value)) return;
    if (value.length > 7) return;
    if (value.startsWith("0")) return;
    setTicketForm({ ...ticketForm, amount: value });
    if (errors.amount) clearError("amount");
  };

  const handleTotalChange = (e) => {
    const value = e.target.value;
    if (!/^\d*$/.test(value)) return;
    if (value.length > 7) return;
    if (value.startsWith("0")) return;
    setTicketForm({ ...ticketForm, total: value });
    if (errors.total) clearError("total");
  };

  const handleSave = () => {
    if (validate()) onSave();
  };

  // ─── Error style ──────────────────────────────────────────
  const errorStyle = { color: "#ef4444", fontSize: 12, marginTop: 4 };

  return (
    <div className={styles.modalBackdrop}>
      <div className={styles.modal}>

        {/* Header */}
        <div className={styles.modalHeader}>
          <h3 className={styles.modalTitle}>Ticket</h3>
          <span className={styles.closeBtn} onClick={handleClose}>✕</span>
        </div>

        {/* Free / Paid Switch */}
<div className={styles.switchRow}>
  <span
    className={ticketType === "FREE" ? styles.active : ""}
    onClick={() => { setTicketType("FREE"); setErrors({}); }}
  >
    Free
  </span>
  <span
    className={ticketType === "PAID" ? styles.active : ""}
    onClick={() => { setTicketType("PAID"); setErrors({}); }}
  >
    Paid
  </span>
</div>

        {/* Form */}
        <div className={styles.grid2}>

          {/* Ticket Name */}
          <div className={styles.field}>
            <label>Ticket Name <span>*</span></label>
            <input
              className={styles.input}
              value={ticketForm.name}
              onChange={handleNameChange}
              maxLength={50}
              placeholder="Enter ticket name"
            />
            {errors.name && <p style={errorStyle}>{errors.name}</p>}
          </div>

          {/* Description */}
          <div className={styles.field}>
            <label>Description</label>
            <input
              className={styles.input}
              value={ticketForm.description}
              onChange={handleDescriptionChange}
              maxLength={200}
              placeholder="Enter the Description"
            />
            {errors.description && <p style={errorStyle}>{errors.description}</p>}
          </div>

          {/* From Date */}
          <div className={styles.field}>
            <label>From Date <span>*</span></label>
            <input
              type="date"
              className={styles.input}
              min={minDate}
              max={maxDate}
              value={ticketForm.from?.split("T")[0] || ""}
              onChange={(e) => {
                setTicketForm({
                  ...ticketForm,
                  from: new Date(`${e.target.value}T00:00:00.000Z`).toISOString(),
                });
                if (errors.from) clearError("from");
              }}
            />
            {errors.from && <p style={errorStyle}>{errors.from}</p>}
          </div>

          {/* To Date */}
          <div className={styles.field}>
            <label>To Date <span>*</span></label>
            <input
              type="date"
              className={styles.input}
              min={ticketForm.from?.split("T")[0] || minDate}
              max={maxDate}
              value={ticketForm.to?.split("T")[0] || ""}
              onChange={(e) => {
                setTicketForm({
                  ...ticketForm,
                  to: new Date(`${e.target.value}T23:59:59.000Z`).toISOString(),
                });
                if (errors.to) clearError("to");
              }}
            />
            {errors.to && <p style={errorStyle}>{errors.to}</p>}
          </div>

          {/* Amount (PAID only) */}
          {ticketType === "PAID" && (
            <div className={styles.field}>
              <label>Amount <span>*</span></label>
              <input
                className={styles.input}
                inputMode="numeric"
                placeholder="Enter amount"
                value={ticketForm.amount}
                onChange={handleAmountChange}
                maxLength={7}
              />
              {errors.amount && <p style={errorStyle}>{errors.amount}</p>}
            </div>
          )}

          {/* Total Tickets */}
          <div className={styles.field}>
            <label>Total Tickets</label>
            <input
              className={styles.input}
              inputMode="numeric"
              placeholder="Enter total tickets"
              value={ticketForm.total}
              onChange={handleTotalChange}
              maxLength={7}
            />
            {errors.total && <p style={errorStyle}>{errors.total}</p>}
          </div>

        </div>

        {/* Footer */}
        <div className={styles.modalFooter}>
          <button className={styles.outlineBtn} onClick={handleClose}>
            Close
          </button>
          <button className={styles.primaryBtn} onClick={handleSave}>
            Save
          </button>
        </div>

      </div>
    </div>
  );
}