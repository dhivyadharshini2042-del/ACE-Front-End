"use client";
import "./WhyChoose.css";

export default function WhyChoose() {
  return (
    <section className="why-ace container-xl">
      {/* HEADER */}
      <div className="text-center mb-5">
        <h2 className="why-title">Why Choose AllCollegeEvent ?</h2>
        <p className="why-sub">
          Enjoy a seamless and delightful ticketing experience with these powerful benefits
        </p>
      </div>

      {/* GRID */}
      <div className="why-grid">

        {/* LEFT – TOP */}
        <div className="why-card horizontal">
          <div className="why-img-left">
            <img src="/images/fast-secure-payments.png" alt="" />
          </div>

          <div className="why-text">
            <h5>Fast & Secure Payments</h5>
            <p>
              Experience quick transactions with advanced security to protect
              your data. Pay in minutes with seamless processing and instant confirmation.
            </p>
          </div>
        </div>

        {/* RIGHT – BIG */}
        <div className="why-card vertical">
          <h5>Book Anytime!</h5>
          <p>
            Enjoy 24/7 booking flexibility reserve your tickets at your convenience
            with no time restrictions. Access events anytime with a hassle-free booking experience.
          </p>

          <div className="why-img-bottom">
            <img src="/images/book-anytime.png" alt="" />
          </div>
        </div>

        {/* LEFT – BOTTOM */}
        <div className="why-card horizontal">
          <div className="why-img-left">
            <img src="/images/smart-deals.png" alt="" />
          </div>

          <div className="why-text">
            <h5>Smart Deals</h5>
            <p>
              Unlock exclusive offers and discounts.
              Save more while enjoying premium event experiences.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}
