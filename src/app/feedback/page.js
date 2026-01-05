"use client";
import { useState } from "react";
import styles from "./feedback.module.css";
import Footer from "../../components/global/Footer/Footer";

export default function FeedbackPage() {
  const [rating, setRating] = useState("");

  const ratings = [
    { key: "average", emoji: "😢", label: "Average" },
    { key: "good", emoji: "😊", label: "Good" },
    { key: "excellent", emoji: "🥰", label: "Excellent" },
  ];

  return (
    <>
    <section className={styles.container}>
      <div className={styles.card}>
        {/* TITLE */}
        <h2 className={styles.title}>Give Feedback</h2>
        <p className={styles.subtitle}>
          How would you rate your experience using our platform?
        </p>

        {/* RATINGS */}
        <div className={styles.ratings}>
          {ratings.map((item) => (
            <div
              key={item.key}
              className={`${styles.rateItem} ${
                rating === item.key ? styles.active : ""
              }`}
              onClick={() => setRating(item.key)}
            >
              <span className={styles.emoji}>{item.emoji}</span>
              <span className={styles.text}>{item.label}</span>
            </div>
          ))}
        </div>

        {/* MESSAGE */}
        <label className={styles.label}>
          How is your overall experience?
        </label>

        <textarea
          className={styles.textarea}
          placeholder="What worked well? What could we improve?"
        />

        {/* ACTIONS */}
        <div className={styles.actions}>
          <button className={styles.cancel}>Cancel</button>
          <button className={styles.submit} disabled={!rating}>
            Submit
          </button>
        </div>
      </div>
    </section>
    <Footer/>
    </>
  );
}
