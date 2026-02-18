"use client";
import { VIDEOICON, SEARCH_ICON } from "../../../const-value/config-icons/page";
import "./ExploreHero.css";

export default function ExploreHero() {

  return (
    <section className="ace-hero container-xl">
      <div className="row align-items-center gx-5 gy-5">
        {/* LEFT CONTENT */}
        <div className="col-lg-6">
          {/* <div className="ace-date">09–29, Nov 2025</div> */}

          <h1 className="ace-title">
            ALL <br />
            EVENTS
          </h1>

          <p className="ace-desc">
            From cultural fests to tech challenges, our events are designed to
            engage, empower, and elevate every participant.
          </p>

          {/* <div className="d-flex gap-3 mt-4 flex-wrap">
            <button className="btn ace-primary">
              {VIDEOICON} Watch Our Journey
            </button>
          </div> */}
          <div className="d-flex gap-3 mt-4 flex-wrap">
            <button className="ace-create-event">
              Create event
            </button>

            <button className="btn ace-primary">
              <span className="ace-btn-icon">{VIDEOICON}</span>
              <span>Watch Our Journey</span>
            </button>

          </div>

        </div>

        {/* RIGHT IMAGE GRID – EXACT 6 IMAGES */}
        <div className="col-lg-6">
          <div className="ace-image-grid">
            <img
              src="/images/concert-live-event.jpeg"
              alt="Live Concert Event"
              loading="lazy"
            />
            <img
              src="/images/conference-seminar-hall.jpeg"
              alt="Conference Seminar Hall"
              loading="lazy"
            />
            <img
              src="/images/coding-workshop-session.jpeg"
              alt="Coding Workshop Session"
              loading="lazy"
            />
            <img
              src="/images/marathon-sports-event.jpeg"
              alt="Marathon Sports Event"
              loading="lazy"
            />
            <img
              src="/images/college-sports-ground.jpeg"
              alt="College Sports Ground"
              loading="lazy"
            />
            <img
              src="/images/professional-networking-event.jpeg"
              alt="Professional Networking Event"
              loading="lazy"
            />
          </div>
        </div>
        <div className="ace-search-wrapper">
          <span className="ace-search-icon">
            {SEARCH_ICON}
          </span>

          <input
            type="text"
            placeholder="Search Events"
            className="ace-search-input"
          />
        </div>

      </div>
    </section>
  );
}
