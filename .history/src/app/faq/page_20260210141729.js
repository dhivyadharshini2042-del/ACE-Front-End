"use client";
import { useState } from "react";
import Image from "next/image";
import styles from "./faq.module.css";
import Footer from "../../components/global/Footer/Footer";

const TABS = ["All", "Tickets", "Event", "Price"];

const FAQ_DATA = [
  {
    q: "What types of events does this website cover?",
    a: "We cover college events, workshops, cultural fests, tech events and more.",
    type: "All",
  },
  {
    q: "How can I book tickets?",
    a: "You can book tickets directly from the event page.",
    type: "Tickets",
  },
  {
    q: "Is ticket booking refundable?",
    a: "Refund policy depends on the event organizer.",
    type: "Price",
  },
  {
    q: "Can organizers create free events?",
    a: "Yes, organizers can create both free and paid events.",
    type: "Event",
  },
  {
    q: "How do I contact the organizer?",
    a: "Organizer contact details are available on the event page.",
    type: "All",
  },
];

export default function FAQ() {
  const [activeTab, setActiveTab] = useState("All");
  const [openIndex, setOpenIndex] = useState(null);

  const filteredFaqs =
    activeTab === "All"
      ? FAQ_DATA
      : FAQ_DATA.filter((f) => f.type === activeTab);

  return (
    <>
      <section className={styles.wrapper}>
        {/* HEADER */}
        <h2 className={styles.title}>Frequently Asked Questions</h2>
        <p className={styles.subtitle}>
          Do you have questions? We’re here to help.
        </p>

        {/* SEARCH */}
        <div className={styles.searchWrap}>
          <input placeholder="Search your answers" />
        </div>

        {/* TABS */}
        <div className={styles.tabs}>
          {TABS.map((tab) => (
            <button
              key={tab}
              className={`${styles.tab} ${activeTab === tab ? styles.active : ""
                }`}
              onClick={() => {
                setActiveTab(tab);
                setOpenIndex(null);
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* CONTENT */}
        <div className={styles.content}>
          {/* LEFT FAQ */}
          <div className={styles.faqList}>
            {filteredFaqs.map((item, i) => (
              <div key={i} className={styles.faqItem}>
                <button
                  className={styles.faqQuestion}
                  onClick={() => setOpenIndex(openIndex === i ? null : i)}
                >
                  {item.q}
                  {/* <span>{openIndex === i ? "−" : "+"}</span> */}
                  <Image
                    src={openIndex === i ? "/images/plusIcon.png" : "/images/plusIcon.png"}
                    alt="toggle icon"
                    width={16}
                    height={16}
                  />
                </button>

                {openIndex === i && (
                  <div className={styles.faqAnswer}>{item.a}</div>
                )}
              </div>
            ))}
          </div>

          {/* RIGHT CARD */}
          <div className={styles.askCard}>
            <h3>Make your Question</h3>

            <input placeholder="Name" />
            <input placeholder="Email" />
            <textarea placeholder="Put your message here" />

            <button className={styles.submit}>Submit</button>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
