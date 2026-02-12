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

      {/* SVG CLIP MASK */}
      <svg width="0" height="0">
        <defs>
          <clipPath id="bottomCurve" clipPathUnits="objectBoundingBox">
            {/* smooth professional curve */}
            <path d="
              M 0 0
              L 1 0
              L 1 0.75
              C 0.75 0.9, 0.25 0.9, 0 0.75
              Z
            " />
          </clipPath>
        </defs>
      </svg>

      {/* <div className={styles.stage}>
        {images.map((src, i) => (
          <img
            key={i}
            src={src}
            alt="story"
            className={`${styles.img} ${styles[`img${i}`]}`}
          />
        ))} */}

      {/* pink curve background */}
      {/* <div className={styles.curveBg}></div>
      </div> */}
      <div className={styles.stage}>
        <div className={styles.curveMask}>
          {images.map((src, i) => (
            <img
              key={i}
              src={src}
              alt="story"
              className={`${styles.img} ${styles[`img${i}`]}`}
            />
          ))}
        </div>
      </div>

    </section>
  );
}
