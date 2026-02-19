"use client";

import { useState } from "react";
import styles from "./RateSection.module.css";
import { useRouter } from "next/navigation";
import ReportProblemModal from "../../ui/ReportProblemModal/ReportProblemModal";

export default function RateSection({
  title = "Rate for Organizers",
  onSubmit,
  onReport,
}) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const router = useRouter();
  const [openReport, setOpenReport] = useState(false);

  const handleSubmit = () => {
    if (!rating) return;

    if (onSubmit) {
      onSubmit({ rating, comment });
    }

    setRating(0);
    setComment("");
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.headerRow}>
        <h3 className={styles.title}>{title}</h3>

        <button
          className={styles.reportBtn}
          onClick={() => setOpenReport(true)}
        >
          ⚠ Report Organization
        </button>
      </div>

      <div className={styles.ratingRow}>
        <span className={styles.label}>Give your ratings</span>

        <div className={styles.stars}>
          {[1, 2, 3, 4, 5].map((num) => (
            <span
              key={num}
              className={`${styles.star} ${rating >= num ? styles.active : ""}`}
              onClick={() => setRating(num)}
            >
              ★
            </span>
          ))}
        </div>
      </div>

      <div className={styles.inputRow}>
        <input
          type="text"
          placeholder="Share Your Thoughts"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className={styles.input}
        />

        <button className={styles.submitBtn} onClick={handleSubmit}>
          ✓
        </button>
      </div>
      <ReportProblemModal
        open={openReport}
        onClose={() => setOpenReport(false)}
        onSubmit={(data) => console.log(data)}
      />
    </div>
  );
}
