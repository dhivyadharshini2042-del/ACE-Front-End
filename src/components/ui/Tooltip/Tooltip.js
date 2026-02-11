"use client";
import { useState } from "react";
import styles from "./Tooltip.module.css";

export default function Tooltip({ text, children, className = "" }) {
  const [show, setShow] = useState(false);

  return (
    <div
      className={styles.tooltipWrapper}
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      {children}
      {show && (
        <div className={`${styles.tooltipBox} ${className}`}>
          {text}
        </div>
      )}
    </div>
  );
}
