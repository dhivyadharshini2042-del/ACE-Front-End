"use client";

import { useState } from "react";
import styles from "./Notification.module.css";
import { MdEmail } from "react-icons/md";
import { IoNotificationsOutline } from "react-icons/io5";

export default function NotificationPageClient() {
  const [emailNotify, setEmailNotify] = useState(true);
  const [whatsappNotify, setWhatsappNotify] = useState(false);

  return (
    <div className={styles.wrapper}>
      <h2 className={styles.heading}>Notification</h2>

      <div className={styles.card}>
        <div className={styles.left}>
          <MdEmail className={styles.icon} />
          <div>
            <h4>Email Notification</h4>
            <p>
              Stay updated with event alerts directly in your inbox.
            </p>
          </div>
        </div>

        <label className={styles.switch}>
          <input
            type="checkbox"
            checked={emailNotify}
            onChange={() => setEmailNotify(!emailNotify)}
          />
          <span className={styles.slider}></span>
        </label>
      </div>

      <div className={styles.card}>
        <div className={styles.left}>
          <IoNotificationsOutline className={styles.icon} />
          <div>
            <h4>WhatsApp Notification</h4>
            <p>
              Stay updated with event alerts directly in your chat.
            </p>
          </div>
        </div>

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
