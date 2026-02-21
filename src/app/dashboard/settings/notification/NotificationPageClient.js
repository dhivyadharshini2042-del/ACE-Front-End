"use client";

import { useState } from "react";
import styles from "./Notification.module.css";
import { MdEmail } from "react-icons/md";
import { IoNotificationsOutline } from "react-icons/io5";

/**
 * NotificationPageClient
 * ----------------------
 * Manages user notification preferences
 * for email and WhatsApp alerts related to event updates.
 */
export default function NotificationPageClient() {
  // Notification toggle states

  // Email notifications
  const [emailNotify, setEmailNotify] = useState(true);
  // WhatsApp notifications
  const [whatsappNotify, setWhatsappNotify] = useState(false);

  return (
    <div className={styles.wrapper}>
      <h2 className={styles.heading}>Notification</h2>

      {/* ================= EMAIL NOTIFICATION ================= */}
      <div className={styles.card}>
        <div className={styles.left}>
          {/* Email icon */}
          <MdEmail className={styles.icon} />
          <div>
            <h4>Email Notification</h4>
            <p>
              Stay updated with event alerts directly in your inbox.
            </p>
          </div>
        </div>

        {/* Toggle switch */}
        <label className={styles.switch}>
          <input
            type="checkbox"
            checked={emailNotify}
            onChange={() => setEmailNotify(!emailNotify)}
          />
          <span className={styles.slider}></span>
        </label>
      </div>

      {/* ================= WHATSAPP NOTIFICATION ================= */}
      <div className={styles.card}>
        <div className={styles.left}>
          {/* Notification icon */}
          <IoNotificationsOutline className={styles.icon} />
          <div>
            <h4>WhatsApp Notification</h4>
            <p>
              Stay updated with event alerts directly in your chat.
            </p>
          </div>
        </div>

        {/* Toggle switch */}
        <label className={styles.switch}>
          <input
            type="checkbox"
            checked={whatsappNotify}
            onChange={() => setWhatsappNotify(!whatsappNotify)}
          />
          <span className={styles.slider}></span>
        </label>
      </div>
    </div>
  );
}
