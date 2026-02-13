"use client";

import { useState } from "react";
import styles from "../terms-and-conditions/terms-and-conditions.module.css";
import Footer from "../../components/global/Footer/Footer";

const SECTIONS = [
  {
    id: "intro",
    label: "Introduction",
    content: (
      <>
        <h3>All College Event (ACE)</h3>
        <p>
          All College Event (ACE), a product of ECLearnix EdTech Private Limited,
          values your trust and is committed to protecting your privacy.
        </p>

        <p>
          This Privacy Policy explains how we collect, use, store, share, and
          safeguard your information when you access or use our website and
          mobile application.
        </p>

        <p>
          By using ACE, you agree to the practices described in this Privacy
          Policy. If you do not agree, please discontinue use of the platform.
        </p>
      </>
    ),
  },

  {
    id: "info",
    label: "Information We Collect",
    content: (
      <>
        <h3>Personal Information</h3>
        <p>
          When you create an account, register for an event, or organize an
          event on ACE, we may collect:
        </p>
        <ul>
          <li>Full name</li>
          <li>Email address</li>
          <li>Phone number</li>
          <li>Institution or Organization details</li>
          <li>Profile information</li>
          <li>Event participation details</li>
        </ul>

        <h3>Organizer Information</h3>
        <p>
          If you create or collaborate on events, we may collect organizer
          details, organization information, and event-related content.
        </p>

        <h3>Payment Information</h3>
        <p>
          Payments are processed securely through third-party gateways. ACE does
          not store sensitive financial information such as card details or CVV.
        </p>

        <h3>Usage & Technical Data</h3>
        <ul>
          <li>IP address</li>
          <li>Device & browser details</li>
          <li>Operating system</li>
          <li>Pages visited & interaction data</li>
          <li>Date & time access logs</li>
        </ul>
      </>
    ),
  },

  {
    id: "usage",
    label: "How We Use Information",
    content: (
      <>
        <h3>Platform Services</h3>
        <ul>
          <li>Create and manage accounts</li>
          <li>Enable event discovery and registration</li>
          <li>Support organizer collaboration</li>
          <li>Send confirmations and updates</li>
        </ul>

        <h3>Sharing with Organizers</h3>
        <p>
          Participant information may be shared with event organizers solely
          for legitimate event-related purposes.
        </p>

        <h3>Analytics & Security</h3>
        <ul>
          <li>Improve platform features</li>
          <li>Enhance personalization</li>
          <li>Prevent fraud and misuse</li>
        </ul>
      </>
    ),
  },

  {
    id: "storage",
    label: "Data Storage & Security",
    content: (
      <>
        <h3>Security Measures</h3>
        <p>
          We implement reasonable administrative and technical safeguards to
          protect your information. However, no online transmission is 100%
          secure.
        </p>

        <h3>Third-Party Services</h3>
        <p>
          Trusted third-party providers support payment processing, analytics,
          email communication, and hosting.
        </p>

        <h3>Data Retention</h3>
        <ul>
          <li>Maintain platform services</li>
          <li>Comply with legal obligations</li>
          <li>Resolve disputes</li>
        </ul>
      </>
    ),
  },

  {
    id: "rights",
    label: "User Rights",
    content: (
      <>
        <h3>Access & Update</h3>
        <p>
          You may review and update your personal information through your ACE
          account dashboard.
        </p>

        <h3>Data Requests</h3>
        <p>
          Certain data may be retained to comply with legal or operational
          requirements.
        </p>
      </>
    ),
  },

  {
    id: "sharing",
    label: "Sharing & Disclosure",
    content: (
      <>
        <h3>Limited Sharing</h3>
        <ul>
          <li>With event organizers</li>
          <li>With essential service providers</li>
          <li>When required by law</li>
        </ul>

        <h3>Legal Disclosures</h3>
        <ul>
          <li>Comply with court orders</li>
          <li>Enforce platform policies</li>
          <li>Protect users and public safety</li>
        </ul>
      </>
    ),
  },

  {
    id: "cookies",
    label: "Cookies & Tracking",
    content: (
      <>
        <p>ACE uses cookies to:</p>
        <ul>
          <li>Remember preferences</li>
          <li>Enable platform functionality</li>
          <li>Analyze user behavior</li>
        </ul>

        <p>
          You may disable cookies in browser settings, but some features may
          not function properly.
        </p>
      </>
    ),
  },

  {
    id: "children",
    label: "Children's Privacy",
    content: (
      <p>
        ACE does not knowingly collect data from children under 13 without
        parental consent.
      </p>
    ),
  },

  {
    id: "changes",
    label: "Policy Updates",
    content: (
      <p>
        ACE may update this Privacy Policy at any time. Continued use of the
        platform after updates constitutes acceptance of changes.
      </p>
    ),
  },

  {
    id: "contact",
    label: "Contact Information",
    content: (
      <>
        <p>
          For questions or requests related to this Privacy Policy, please
          contact All College Event support through official platform channels.
        </p>

        <p>
          By using ACE, you acknowledge that you have read and agreed to this
          Privacy Policy.
        </p>
      </>
    ),
  },
];

export default function PrivacyPolicyClient() {
  const [active, setActive] = useState("intro");
  const activeSection = SECTIONS.find((s) => s.id === active);

  return (
    <>
      <div className={styles.root}>
        <div className={styles.header}>
          <h1>
            Privacy <span>Policy</span>
          </h1>
          <p>
            Learn how All College Event collects, uses, and protects your
            information.
          </p>
        </div>

        <div className={styles.container}>
          <aside className={styles.sidebar}>
            <ul>
              {SECTIONS.map((item) => (
                <li
                  key={item.id}
                  className={active === item.id ? styles.active : ""}
                  onClick={() => setActive(item.id)}
                >
                  {item.label}
                </li>
              ))}
            </ul>
          </aside>

          <section className={styles.content} style={{ paddingTop: "20px" }}>
            {activeSection?.content}
          </section>
        </div>
      </div>

      <Footer />
    </>
  );
}
