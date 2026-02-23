"use client";

import styles from "./Stepper.module.css";

/**
 * Stepper Component 
 * -----------------
 * Props: step (number): Current active step (1, 2, or 3)
 */
export default function Stepper({ step }) {
  return (
    <div className={styles.stepperWrap}>
      {/* STEP 1 */}
      <div className={`${styles.stepItem} ${step === 1 ? styles.active : ""}`}>
        <div className={styles.circle}>
          <img src="/images/basicdetails.png" alt="organization" />
        </div>
        <p>ORGANIZATION DETAILS</p>
      </div>

      {/* STEP 2 */}
      <div className={`${styles.stepItem} ${step === 2 ? styles.active : ""}`}>
        <div className={styles.circle}>
          <img src="/images/creatordetails.png" alt="event" />
        </div>
        <p>EVENT DETAILS</p>
      </div>

      {/* STEP 3 */}
      <div className={`${styles.stepItem} ${step === 3 ? styles.active : ""}`}>
        <div className={styles.circle}>
          <img src="/images/finaldetails.png" alt="media" />
        </div>
        <p>MEDIA & TICKETS</p>
      </div>
    </div>
  );
}
