"use client";
import Image from "next/image";
import styles from "./StandFor.module.css";

export default function StandFor() {
  return (
    <section className={styles.wrapper}>
      <h2 className={styles.heading}>
        What We <span>Stand For</span>
      </h2>

      <div className={styles.cards}>
        {/* Mission */}
        <div className={`${styles.card} ${styles.left}`}>
          <Image
            src="/images/pin-yellow.png"
            alt="pin"
            width={40}
            height={40}
            className={styles.pin}
          />

          <div className={`${styles.inner} ${styles.mission}`}>
            <h3 className={`${styles.title} ${styles.missionTitle}`}>
              <Image
                src="/images/bullseye-arrow.png"
                alt="mission"
                width={18}
                height={18}
              />
              Mission
            </h3>
            <p>
              Our mission is to connect learners and organizers through a single
              platform that simplifies event discovery, participation, and
              collaboration.
            </p>
          </div>
        </div>

        {/* Vision */}
        <div className={`${styles.card} ${styles.center}`}>
          <Image
            src="/images/pin-purple.png"
            alt="pin"
            width={40}
            height={40}
            className={styles.pin}
          />

          <div className={`${styles.inner} ${styles.vision}`}>
            <h3 className={`${styles.title} ${styles.visionTitle}`}>
              <Image
                src="/images/vision-target.png"
                alt="vision"
                width={18}
                height={18}
              />
              Vision
            </h3>
            <p>
              Our vision is to be the world’s most trusted platform for academic
              & professional event engagement.
            </p>
          </div>
        </div>

        {/* Value */}
        <div className={`${styles.card} ${styles.right}`}>
          <Image
            src="/images/pin-blue.png"
            alt="pin"
            width={40}
            height={40}
            className={styles.pin}
          />

          <div className={`${styles.inner} ${styles.value}`}>
            <h3 className={`${styles.title} ${styles.valueTitle}`}>
              <Image
                src="/images/diamond.png.png"
                alt="value"
                width={18}
                height={18}
              />
              Value
            </h3>
            <p>
              Built on trust, accessibility, and innovation to empower learning
              and collaboration.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
