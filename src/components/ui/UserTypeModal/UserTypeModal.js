"use client";

import { selectUserTypeApi } from "../../../lib/api/auth.api";
import styles from "./UserTypeModal.module.css";
import { useState } from "react";

export default function UserTypeModal({ open, data = [], onClose }) {
  const [loadingId, setLoadingId] = useState(null);

  if (!open) return null;

  const handleSelect = async (identity) => {
    try {
      setLoadingId(identity);

      await selectUserTypeApi({
        userTypeIdentity: identity,
      });

      onClose(); 
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>

        <div className={styles.header}>
          <h2>
            <span>Select your vibe!</span> Start your journey!
          </h2>
          <p>Click & enjoy your events vibe!</p>
        </div>

        <div className={styles.content}>
          <div className={styles.left}>
            <img
              src="/images/Firstscreen.png"
              alt="Select User Type"
            />
          </div>

          <div className={styles.right}>
            {data.map((item, index) => (
              <div
                key={item.identity}
                className={`${styles.option} ${styles["option" + index]}`}
                onClick={() => handleSelect(item.identity)}
              >
                <div className={styles.iconCircle}>
                  <img src={item.image} alt={item.name} />
                </div>

                <span>
                  {loadingId === item.identity
                    ? "Selecting..."
                    : item.name}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}