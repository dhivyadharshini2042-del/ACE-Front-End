"use client";
import { useState } from "react";
import styles from "./Tooltip.module.css";

export default function Tooltip({ text, children }) {
  const [show, setShow] = useState(false);

  return (
    <div
      className={styles.tooltipWrapper}
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      {children}
      {show && <div className={styles.tooltipBox}>{text}</div>}
    </div>
  );
}
