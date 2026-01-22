"use client";

import { useEffect, useState } from "react";
import styles from "./Email.module.css";

export default function EmailSettingsPage() {
  const [created, setCreated] = useState(true);
  const [status, setStatus] = useState(false);
  const [completed, setCompleted] = useState(false);

  return (
    <div className={styles.wrapper}>
      <h2 className={styles.heading}>Email Settings</h2>

      <div className={styles.card}>
        <div>
          <h4>Event Created Successfully</h4>
          <p>
            We will notify you once your event is reviewed and approved.
          </p>
        </div>

        <label className={styles.switch}>
          <input
            type="checkbox"
            checked={created}
            onChange={() => setCreated(!created)}
          />
          <span className={styles.slider}></span>
        </label>
      </div>

      <div className={styles.card}>
        <div>
          <h4>Event Status</h4>
          <p>
            We will notify when your event is approved or rejected.
          </p>
        </div>

        <label className={styles.switch}>
          <input
            type="checkbox"
            checked={status}
            onChange={() => setStatus(!status)}
          />
          <span className={styles.slider}></span>
        </label>
      </div>

      <div className={styles.card}>
        <div>
          <h4>Event Completed</h4>
          <p>We will notify when your event has ended.</p>
        </div>

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
