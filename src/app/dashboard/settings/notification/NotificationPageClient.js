"use client";

import { useEffect, useState } from "react";
import styles from "./Notification.module.css";
import { MdEmail } from "react-icons/md";
import { IoNotificationsOutline } from "react-icons/io5";
import { toast } from "react-hot-toast";
import {
  updateNotificationPreferencesApi,
  getNotificationPreferencesApi,
} from "../../../../lib/api";

export default function NotificationPageClient() {
  const [emailNotify, setEmailNotify] = useState(false);
  const [pushNotify, setPushNotify] = useState(false);
  const [loading, setLoading] = useState(false);

  /* ================= LOAD CURRENT PREFERENCES ================= */
  useEffect(() => {
    fetchPreferences();
  }, []);

  const fetchPreferences = async () => {
    try {
      setLoading(true);

      const res = await getNotificationPreferencesApi();

      if (!res?.status) return;

      setEmailNotify(res.data.emailEnabled);
      setPushNotify(res.data.pushEnabled);

    } catch (err) {
      toast.error("Failed to load preferences");
    } finally {
      setLoading(false);
    }
  };

  /* ================= UPDATE FUNCTION ================= */
  const handleUpdate = async (newEmail, newPush) => {
    try {
      setLoading(true);

      const res = await updateNotificationPreferencesApi({
        emailEnabled: newEmail,
        pushEnabled: newPush,
      });

      if (!res?.status) {
        toast.error("Update failed");
        return;
      }

      toast.success("Preferences updated");
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.wrapper}>
      <h2 className={styles.heading}>Notification</h2>

      {/* EMAIL */}
      <div className={styles.card}>
        <div className={styles.left}>
          <MdEmail className={styles.icon} />
          <div>
            <h4>Email Notification</h4>
            <p>Stay updated with event alerts directly in your inbox.</p>
          </div>
        </div>

        <label className={styles.switch}>
          <input
            type="checkbox"
            checked={emailNotify}
            disabled={loading}
            onChange={async () => {
              const newValue = !emailNotify;
              setEmailNotify(newValue);
              await handleUpdate(newValue, pushNotify);
            }}
          />
          <span className={styles.slider}></span>
        </label>
      </div>

      {/* PUSH */}
      <div className={styles.card}>
        <div className={styles.left}>
          <IoNotificationsOutline className={styles.icon} />
          <div>
            <h4>App Notification</h4>
            <p>Stay updated with event alerts directly on your device.</p>
          </div>
        </div>

        <label className={styles.switch}>
          <input
            type="checkbox"
            checked={pushNotify}
            disabled={loading}
            onChange={async () => {
              const newValue = !pushNotify;
              setPushNotify(newValue);
              await handleUpdate(emailNotify, newValue);
            }}
          />
          <span className={styles.slider}></span>
        </label>
      </div>
    </div>
  );
}