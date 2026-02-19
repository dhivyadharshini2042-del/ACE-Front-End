"use client";

import { useState } from "react";
import styles from "./ReportProblemModal.module.css";

export default function ReportProblemModal({ open, onClose, onSubmit }) {
  const [image, setImage] = useState(null);
  const [name, setName] = useState("");
  const [problem, setProblem] = useState("");

  if (!open) return null;

  const handleSubmit = () => {
    if (!name || !problem) return;

    onSubmit?.({ image, name, problem });
    onClose?.();
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h3 className={styles.title}>Report a Problem</h3>
        <p className={styles.subtitle}>
          Upload a photo of the issue, provide your name, and we’ll forward it
          to the concerned team for resolution.
        </p>

        {/* Upload */}
        <div className={styles.uploadBox}>
          <input
            type="file"
            accept="image/*"
            hidden
            id="reportUpload"
            onChange={(e) => setImage(e.target.files[0])}
          />
          <label htmlFor="reportUpload" className={styles.uploadLabel}>
            <div className={styles.icon}>📷</div>
            <button type="button" className={styles.uploadBtn}>
              Upload image
            </button>
          </label>
        </div>

        {/* Inputs */}
        <div className={styles.inputRow}>
          <div className={styles.inputGroup}>
            <label>Your Name</label>
            <input
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className={styles.inputGroup}>
            <label>Report your problem</label>
            <input
              type="text"
              placeholder="Submit your report"
              value={problem}
              onChange={(e) => setProblem(e.target.value)}
            />
          </div>
        </div>

        {/* Buttons */}
        <div className={styles.buttonRow}>
          <button className={styles.cancelBtn} onClick={onClose}>
            Cancel
          </button>

          <button className={styles.submitBtn} onClick={handleSubmit}>
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}
