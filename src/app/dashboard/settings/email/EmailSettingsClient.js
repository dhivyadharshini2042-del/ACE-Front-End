"use client";

import { useState } from "react";
import styles from "./Email.module.css";

/**
 * EmailSettingsClient
 * -------------------
 * Manages user email notification preferences
 * for event-related updates.
 */
export default function EmailSettingsClient() {
  // Notification toggles

  // Event created notification
  const [created, setCreated] = useState(true);
  // Event approval/rejection notification
  const [status, setStatus] = useState(false);
  // Event completion notification
  const [completed, setCompleted] = useState(false);

  return (
    <div className={styles.wrapper}>
      <h2 className={styles.heading}>Email Settings</h2>

      {/* ================= EVENT CREATED ================= */}
      <div className={styles.card}>
        <div>
          <h4>Event Created Successfully</h4>
          <p>
            We will notify you once your event is reviewed and approved.
          </p>
        </div>

        {/* Toggle switch */}
        <label className={styles.switch}>
          <input
            type="checkbox"
            checked={created}
            onChange={() => setCreated(!created)}
          />
          <span className={styles.slider}></span>
        </label>
      </div>

      {/* ================= EVENT STATUS ================= */}
      <div className={styles.card}>
        <div>
          <h4>Event Status</h4>
          <p>
            We will notify when your event is approved or rejected.
          </p>
        </div>

        {/* Toggle switch */}
        <label className={styles.switch}>
          <input
            type="checkbox"
            checked={status}
            onChange={() => setStatus(!status)}
          />
          <span className={styles.slider}></span>
        </label>
      </div>

      {/* ================= EVENT COMPLETED ================= */}
      <div className={styles.card}>
        <div>
          <h4>Event Completed</h4>
          <p>We will notify when your event has ended.</p>
        </div>

        {/* Toggle switch */}
        <label className={styles.switch}>
          <input
            type="checkbox"
            checked={completed}
            onChange={() => setCompleted(!completed)}
          />
          <span className={styles.slider}></span>
        </label>
      </div>
    </div>
  );
}
