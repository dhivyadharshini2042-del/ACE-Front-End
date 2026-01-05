"use client";
import Footer from "../../components/global/Footer/Footer";
import { FACEBOOKICON, INSTAGRAMICON, LINKEDINICON, WHATSAPP } from "../../const-value/config-icons/page";
import styles from "./contact.module.css";

export default function ContactPage() {
  return (
    <>
    <section className={styles.container}>
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
          <input type="text" placeholder="Enter your name" />
          <input type="email" placeholder="Email" />

          <div className={styles.attachment}>
            <input type="text" placeholder="Attachments" disabled />
            <span>📎</span>
          </div>

          <textarea placeholder="Your Message" rows={4}></textarea>

          <button>Submit</button>
        </div>

        {/* RIGHT SIDE */}
        <div className={styles.right}>
          <img
            src="/images/contactImage.png"
            alt="Contact support"
          />

          <div className={styles.followBox}>
            <p>Follow us on</p>
            <div className={styles.socials}>
              <span className={styles.linkedin}>{LINKEDINICON}</span>
              <span className={styles.facebook}>{FACEBOOKICON}</span>
              <span className={styles.whatsapp}>{WHATSAPP}</span>
              <span className={styles.instagram}>{INSTAGRAMICON}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
    <Footer/>
    </>
  );
}
