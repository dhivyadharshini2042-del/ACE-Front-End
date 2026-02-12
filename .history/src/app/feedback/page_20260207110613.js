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
          {/* LEFT */}
          <div className={styles.left}>
            <h2>Give Your<br />Valuable Feedback</h2>
          </div>

          {/* RIGHT */}
          <div className={styles.right}>
            <input type="text" placeholder="Enter your name" />
            <input type="email" placeholder="Email" />

            <label>How is your overall experience?</label>
            <textarea placeholder="What worked well? What could we improve?" />

            <p className={styles.rateTitle}>
              How would you rate your experience using our platform?
            </p>

            <div className={styles.ratings}>
              {ratings.map((item) => (
                <div
                  key={item.key}
                  className={`${styles.rateItem} ${rating === item.key ? styles.active : ""
                    }`}
                  onClick={() => setRating(item.key)}
                >
                  <span className={styles.emoji}>{item.emoji}</span>
                  <span>{item.label}</span>
                </div>
              ))}
            </div>

            <button className={styles.submit} disabled={!rating}>
              Submit
            </button>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
