"use client";

/**
 * Contact Page (Client Component)
 *
 * Displays:
 * - Contact form (name, email, attachment placeholder, message)
 * - Support illustration
 * - Social media follow section
 * - Global footer
 */

import Footer from "../../components/global/Footer/Footer";
import { FACEBOOKICON, INSTAGRAMICON, LINKEDINICON, WHATSAPP } from "../../const-value/config-icons/page";
import styles from "./contact.module.css";

export default function ContactPage() {
  return (
    <>
    <section className={styles.container}>
        {/* PAGE HEADER */}
      <div className={styles.header}>
        <h1>
          We’re Here for <span>You</span>
        </h1>
        <p>Let’s connect – we are here to answer your queries</p>
      </div>

        {/* CONTACT CARD */}
        <div className={styles.card}>
          {/* LEFT: CONTACT FORM */}
          <div className={styles.form}>
            <input type="text" placeholder="Enter your name" />
            <input type="email" placeholder="Email" />

            {/* Attachment Placeholder */}
            <div className={styles.attachment}>
              <input type="text" placeholder="Attachments" disabled />
              <span>📎</span>
            </div>

            <textarea placeholder="Your Message" rows={4}></textarea>

            <button>Submit</button>
          </div>

          {/* RIGHT: IMAGE + SOCIAL LINKS */}
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

      {/* GLOBAL FOOTER */}
      <Footer />
    </>
  );
}
