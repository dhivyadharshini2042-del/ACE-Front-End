"use client";
import styles from "./StoryBehindFest.module.css";

export default function StoryBehindFest() {
  const images = [
    "/images/aboutImageOne.png",
    "/images/aboutImageTwo.png",
    "/images/aboutImageThree.png",
    "/images/aboutImageFour.png",
    "/images/aboutImageFive.png",
    "/images/aboutImageSix.png",
    "/images/aboutImageSev.png",
  ];

  return (
    <section className={styles.section}>
      <h1 className={styles.title}>
        The <span className={styles.orange}>Story</span> Behind the{" "}
        <span className={styles.purple}>Fest</span>
      </h1>

      <div className={styles.stage}>
        {images.map((src, i) => (
          <img
            key={i}
            src={src}
            alt="story"
            className={`${styles.img} ${styles[`img${i}`]}`}
          />
        ))}

        {/* inward cutting curve */}
        <div className={styles.curveBg}></div>
      </div>
    </section>
  );
}
