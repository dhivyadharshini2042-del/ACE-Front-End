"use client";

import { useEffect } from "react";

import {
  FOOTER_FACEBOOK,
  FOOTER_INSTA,
  FOOTER_LINKEDIN,
  FOOTER_WHATSAPP,
  FOOTER_X,
  WHATSAPP,
} from "../../../const-value/config-icons/page";

import styles from "./Footer.module.css";
import { useRouter } from "next/navigation";

export default function Footer() {
  const router = useRouter();
  return (
    <footer className={styles.root}>
      {/* Skyline */}
      <div className={styles.skyline}>
        <img src="/images/footer.png" alt="Skyline" />
      </div>

      {/* Main */}
      <div className={styles.main}>
        {/* Top */}
        <div className={styles.top}>
          {/* Brand */}
          <div className={styles.brand}>
            <img src="/images/logo.png" alt="ACE" className={styles.logo} />

            <p className={styles.text}>
              Life is Full of Events, don't Let them Pass Unnoticed,
              <br />
              Explore and Join What Excites You!
            </p>
          </div>

          {/* Subscribe */}
          <div className={styles.subscribe}>
            <h3>Get In Touch!</h3>
            <p>Don't Miss the Next Big Event, Stay in the Loop.</p>

            <div className={styles.subscribeRow}>
              <div className={styles.inputWrap}>
                <span>@</span>
                <input type="email" placeholder="Enter your email" />
                <button className={styles.subscribeBtn}>Subscribe</button>
              </div>
              <div className={styles.whatsapp}>{WHATSAPP}</div>
            </div>
          </div>
        </div>

        {/* Links */}
        <div className={styles.links}>
          <div className={styles.socialBlock}>
            <div className={styles.socials}>
              {FOOTER_FACEBOOK}
              {FOOTER_INSTA}
              {FOOTER_X}
              {FOOTER_LINKEDIN}
            </div>

            <div className={styles.query}>
              <h4>Send Your Query</h4>
              <p>
                support@allcollegeevent.com
              </p>
            </div>
          </div>

          {/* COMPANY */}
          <div className={styles.col}>
            <h4>Company</h4>
            <a onClick={() => router.push("/about")}>About us</a>
            <a onClick={() => router.push("/faq")}>FAQ’s</a>
            <a onClick={() => router.push("/feedback")}>Feedback</a>
            <a onClick={() => router.push("/contact")}>Contact us</a>
          </div>

          {/* EVENTS */}
          <div className={styles.col}>
            <h4>Events</h4>
            <a onClick={() => router.push("/events?type=trending")}>
              Trending Events
            </a>
            <a onClick={() => router.push("/events?type=upcoming")}>
              Upcoming Events
            </a>
            <a onClick={() => router.push("/events?type=featured")}>
              Featured Events
            </a>
            <a onClick={() => router.push("/events?type=virtual")}>
              Virtual Events
            </a>
          </div>

          {/* POLICIES */}
          <div className={styles.col}>
            <h4>Our Policies</h4>
            <a onClick={() => router.push("/privacy-policy")}>Privacy Policy</a>
            <a onClick={() => router.push("/terms-and-conditions")}>Terms & Conditions</a>
            <a onClick={() => router.push("/cookies")}>Cookies</a>
            <a onClick={() => router.push("/disclaimer")}>Disclaimer</a>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className={styles.bottom}>
        © 2025 All College Event. All rights reserved.
      </div>
    </footer>
  );
}
