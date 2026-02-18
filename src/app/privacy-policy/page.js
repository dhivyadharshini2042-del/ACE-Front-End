"use client";

import { useState } from "react";
import Footer from "../../components/global/Footer/Footer";
import styles from "./privacy-policy.module.css";

const privacyPolicyJson = {
  privacyPolicy: {
    title: "All College Event (ACE)",
    intro:
      "All College Event (ACE), a product of ECLearnix EdTech Private Limited, values your trust and is committed to protecting your privacy.",
    sections: [
      {
        sectionTitle: "Information We Collect",
        content:
          "We collect information when you create an account, register for events, or interact with the platform.",
      },
      {
        sectionTitle: "How We Use Your Information",
        content:
          "We use your information to provide platform services, communication, analytics, and security.",
      },
      {
        sectionTitle: "Data Storage, Retention, and Security",
        content:
          "We implement safeguards to protect your data while maintaining platform functionality.",
      },
      {
        sectionTitle: "User Rights and Choices",
        content:
          "You may access, update, or request changes to your personal information.",
      },
      {
        sectionTitle: "Sharing and Disclosure",
        content:
          "We do not sell personal data and only share information when required.",
      },
      {
        sectionTitle: "Cookies",
        content: "Cookies are used to improve functionality and experience.",
      },
      {
        sectionTitle: "Children's Privacy",
        content:
          "We do not knowingly collect personal information from children under 13.",
      },
      {
        sectionTitle: "Changes to Policy",
        content:
          "ACE may update this policy periodically to reflect platform changes.",
      },
      {
        sectionTitle: "Contact Information",
        content: "Contact ACE support for privacy-related questions.",
      },
    ],
  },
};

export default function PrivacyPolicy() {
  const policy = privacyPolicyJson.privacyPolicy;

  const [activeIndex, setActiveIndex] = useState(0);
  const activeSection = policy.sections[activeIndex];

  return (
    <>
      <div className={`container-fluid ${styles.wrapper}`}>
        <div className="container py-5">
          {/* Header */}
          <div className="text-center mb-5">
            <h1 className={styles.title}>
              Privacy <span>Policy</span>
            </h1>
            <p className={styles.subtitle}>{policy.intro}</p>
          </div>

          <div className="row">
            {/* LEFT MENU */}
            <div className="col-md-3">
              <div className={styles.sidebar}>
                {policy.sections.map((section, index) => (
                  <div
                    key={index}
                    onClick={() => setActiveIndex(index)}
                    className={`${styles.sidebarItem} ${
                      activeIndex === index ? styles.activeItem : ""
                    }`}
                  >
                    {section.sectionTitle}
                  </div>
                ))}
              </div>
            </div>

            {/* DIVIDER */}
            <div className="col-md-1 d-none d-md-flex justify-content-center">
              <div className={styles.divider}></div>
            </div>

            {/* RIGHT CONTENT (ONLY ACTIVE SECTION) */}
            <div className="col-md-8">
              <h3 className={styles.sectionTitle}>
                {activeSection.sectionTitle}
              </h3>
              <p className={styles.content}>{activeSection.content}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Fotter Added check*/}
      <Footer />
    </>
  );
}
