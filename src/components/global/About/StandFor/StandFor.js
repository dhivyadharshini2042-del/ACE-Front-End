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
        <div className={styles.cardYellow}>
          <Image
            src="/images/pin-yellow.png"
            alt="pin"
            width={54}
            height={54}
            className={styles.pin}
          />
          <div className={styles.innerYellow}>
            <h3 className={`${styles.cardTitle} ${styles.titleYellow}`}>
              <Image
                src="/images/bullseye-arrow.png"
                alt="mission icon"
                width={20}
                height={20}
              />
              Mission
            </h3>
            <p className={styles.cardText}>
              Our mission is to connect learners and organizers through a single
              platform that simplifies event discovery, participation, and
              collaboration.
            </p>
          </div>
        </div>

        <div className={styles.cardPurple}>
          <Image
            src="/images/pin-purple.png"
            alt="pin"
            width={54}
            height={54}
            className={styles.pin}
          />
          <div className={styles.innerPurple}>
            <h3 className={`${styles.cardTitle} ${styles.titlePurple}`}>
              <Image
                src="/images/vision-targetIcon.png"
                alt="vision icon"
                width={20}
                height={20}
              />
              Vision
            </h3>
            <p className={styles.cardText}>
              Our vision is to be the world&apos;s most trusted platform for
              academic &amp; professional event engagement.
            </p>
          </div>
        </div>

        <div className={styles.cardBlue}>
          <Image
            src="/images/pin-blue.png"
            alt="pin"
            width={54}
            height={54}
            className={styles.pin}
          />
          <div className={styles.innerBlue}>
            <h3 className={`${styles.cardTitle} ${styles.titleBlue}`}>
              <Image
                src="/images/diamond.png"
                alt="value icon"
                width={20}
                height={20}
              />
              Value
            </h3>
            <p className={styles.cardText}>
              Built on trust, accessibility, and innovation to empower learning
              and collaboration.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}