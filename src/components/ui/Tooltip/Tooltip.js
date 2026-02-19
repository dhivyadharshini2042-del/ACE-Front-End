"use client";
import { useState } from "react";
import styles from "./Tooltip.module.css";

export default function Tooltip({
  text,
  children,
  position = "top",
  className = "",
}) {
  const [show, setShow] = useState(false);

  return (
    <div
      className={styles.tooltipWrapper}
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      {children}

      {show && (
        <div
          className={`${styles.tooltipBox} ${styles[position]} ${className}`}
        >
          {text}
        </div>
      )}
    </div>
  );
}
