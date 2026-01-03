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
export default function Footer() {
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
              </div>

              <button className={styles.subscribeBtn}>Subscribe</button>

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
                <span>@</span> info@ace.com
              </p>
            </div>
          </div>

          <div className={styles.col}>
            <h4>Company</h4>
            <a>About us</a>
            <a>FAQ’s</a>
            <a>Feedback</a>
            <a>Contact us</a>
          </div>

          <div className={styles.col}>
            <h4>Events</h4>
            <a>Trending Events</a>
            <a>Upcoming Events</a>
            <a>Featured Events</a>
            <a>Virtual Events</a>
          </div>

          <div className={styles.col}>
            <h4>Our Policies</h4>
            <a>Privacy Policy</a>
            <a>Top Organizers</a>
            <a>Cookies</a>
            <a>Disclaimer</a>
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
