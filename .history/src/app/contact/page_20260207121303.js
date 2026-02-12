"use client";
import Footer from "../../components/global/Footer/Footer";
import { FACEBOOKICON, INSTAGRAMICON, LINKEDINICON, WHATSAPP } from "../../const-value/config-icons/page";
import styles from "./contact.module.css";

export default function ContactPage() {
  return (
    <>
      <section className={styles.container}>
        <div className={styles.blurOne}></div>
        <div className={styles.blurTwo}></div>

        {/* HEADER */}
        <div className={styles.header}>
          <h1>
            We’re Here for <span>You</span>
          </h1>
          <p>Let’s connect – we are here to answer your queries</p>
        </div>

        {/* CARD */}
        <div className={styles.card}>
          {/* LEFT FORM */}
          <div className={styles.form}>
            <input type="text" placeholder="Your Name" />
            <input type="email" placeholder="Email Address" />
            <textarea placeholder="Your Message" rows={4}></textarea>
            <button>Send Message</button>
          </div>

          {/* RIGHT SIDE */}
          <div className={styles.right}>
            <img src="/images/contactImage.png" alt="Contact support" />

            {/* NEW FOLLOW UI */}
            <div className={styles.followBox}>
              <p>Follow us</p>
              <div className={styles.socials}>
                <div className={styles.icon}>{LINKEDINICON}</div>
                <div className={styles.icon}>{FACEBOOKICON}</div>
                <div className={styles.icon}>{WHATSAPP}</div>
                <div className={styles.icon}>{INSTAGRAMICON}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
