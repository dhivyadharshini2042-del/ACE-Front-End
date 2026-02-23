"use client";

/**
 * EventDetails Component
 * ----------------------
 * Handles event creation step for:
 * - Primary event information
 * - Tags management
 * - Calendar scheduling
 * - Event mode (online/offline/hybrid)
 * - Location details
 */

import { useEffect, useState } from "react";
import styles from "./EventDetails.module.css";
import {
  getEventCategoriesApi,
  getEventTypesApi,
} from "../../../../../lib/api/event.api";
import {
  getCountries,
  getStates,
  getCities,
} from "../../../../../lib/location.api";

// icons for calendar display
import {
  DATEICON,
  TIMEICON,
} from "../../../../../const-value/config-icons/page";

export default function EventDetails({
  data,
  setData,
  onBack,
  onNext,
  resetSignal,
}) {
  const [tagInput, setTagInput] = useState("");
  const [categories, setCategories] = useState([]);
  const [eventTypes, setEventTypes] = useState([]);

  // lists for address dropdowns: countries, states, cities
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  // fetch available categories once when component mounts
  useEffect(() => {
    async function loadCategories() {
      try {
        const res = await getEventCategoriesApi();
        if (res?.status) setCategories(res.data);
      } catch (err) {
        console.error("Category fetch failed", err);
      }
    }
    loadCategories();
  }, []);

  /* ================= LOAD EVENT TYPES ================= */
  useEffect(() => {
    if (!data.category) return;
    async function loadEventTypes() {
      try {
        const res = await getEventTypesApi(data.category);
        if (res?.status) setEventTypes(res.data);
      } catch (err) {
        console.error("Event type fetch failed", err);
      }
    }
    loadEventTypes();
  }, [data.category]);

  // populate country dropdown on initial render
  useEffect(() => {
    async function loadCountries() {
      const res = await getCountries();
      setCountries(res || []);
    }
    loadCountries();
  }, []);

  // fetch states when user selects a country
  useEffect(() => {
    if (!data.country) { setStates([]); return; }
    async function loadStates() {
      const res = await getStates(data.country);
      setStates(res || []);
    }
    loadStates();
  }, [data.country]);

  // fetch cities when a state (and country) are specified
  useEffect(() => {
    if (!data.state || !data.country) { setCities([]); return; }
    async function loadCities() {
      const res = await getCities(data.state);
      setCities(res || []);
    }
    loadCities();
  }, [data.state]);

  /* ================= TAGS ================= */
  const addTag = () => {
    if (!tagInput) return;
    const finalTag = `#${tagInput}`;
    if ((data.tags || []).includes(finalTag)) { setTagInput(""); return; }
    setData({ ...data, tags: [...(data.tags || []), finalTag] });
    setTagInput("");
  };
  const removeTag = (tag) => {
    setData({ ...data, tags: (data.tags || []).filter((t) => t !== tag) });
  };

  /* ================= RESET ================= */
  useEffect(() => {
    if (!resetSignal) return;
    setTagInput("");
    setEventTypes([]);
    setData({
      title: "",
      category: "",
      eventType: "",
      tags: [],
      about: "",
      mode: "online",
      calendar: [],
      country: "",
      state: "",
      city: "",
      mapLink: "",
      meetLink: "",
      offers: "",
      venue: "",
    });
  }, [resetSignal]);

  /* ================= CALENDAR HELPER ================= */
  const updateCalendar = (field, value) => {
    const cal = data.calendar?.[0] || {};
    setData({
      ...data,
      calendar: [{ ...cal, [field]: value, timeZone: cal.timeZone || "Asia/Kolkata" }],
    });
  };

  const cal = data.calendar?.[0] || {};

  return (
    <>
      {/* ================= PRIMARY DETAILS ================= */}
      <div className={styles.card}>
        <h3 className={styles.cardTitle}>Event Details</h3>

        {/* -------- Title, Category & Event Type -------- */}
        <div className={styles.grid3}>

          {/* Event Title Input */}
          <div className={styles.field}>
            <label>Event Title <span>*</span></label>
            <input
              className={styles.input}
              placeholder="Enter event name"
              value={data.title || ""}
              onChange={(e) => setData({ ...data, title: e.target.value })}
            />
          </div>

          {/* Category Dropdown (Resets event type when changed) */}
          <div className={styles.field}>
            <label>Type of Category <span>*</span></label>
            <select
              className={styles.input}
              value={data.category || ""}
              onChange={(e) => setData({ ...data, category: e.target.value, eventType: "" })}
            >
              <option value="">Types of Category</option>
              {categories.map((c) => (
                <option key={c.identity} value={c.identity}>{c.categoryName}</option>
              ))}
            </select>
          </div>
          <div className={styles.field}>
            <label>Type of Event <span>*</span></label>
            <select
              className={styles.input}
              value={data.eventType || ""}
              disabled={!data.category} // Disabled until category is selected
              onChange={(e) => setData({ ...data, eventType: e.target.value })}
            >
              <option value="">Select your Event</option>
              {eventTypes.map((t) => (
                <option key={t.identity} value={t.identity}>{t.name}</option>
              ))}
            </select>
          </div>
        </div>
            
        {/* -------- Tags & Offers -------- */}
        <div className={styles.grid3}>
            
          {/* Tags Input & Display */}
          <div className={styles.field}>
            <label>Tags <span>*</span></label>
            <div className={styles.tagRow}>
              <input
                className={styles.input}
                placeholder="#TAGS"
                value={tagInput}
                onChange={(e) => {
                  let v = e.target.value.replace(/\s/g, "").replace(/#/g, "").replace(/[^a-zA-Z0-9_]/g, "");
                  setTagInput(v);
                }}
                onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addTag(); } }}
              />
              <button type="button" className={styles.btnSmall} onClick={addTag}>Add</button>
            </div>
            <div className={styles.tagList}>
              {(data.tags || []).map((t, i) => (
                <span key={`${t}-${i}`} className={styles.tag}>
                  {t}
                  <button type="button" onClick={() => removeTag(t)}>×</button>
                </span>
              ))}
            </div>
          </div>
            
          {/* Optional Offers Field */}
          <div className={styles.field}>
            <label>Offers</label>
            <input
              className={styles.input}
              placeholder="Enter offers"
              value={data.offers || ""}
              onChange={(e) => setData({ ...data, offers: e.target.value })}
            />
          </div>
        </div>
            
        {/* Event Description */}
        <div className={styles.field}>
          <label>About the event <span>*</span></label>
          <textarea
            className={styles.textarea}
            placeholder="About The Event"
            value={data.about || ""}
            onChange={(e) => setData({ ...data, about: e.target.value })}
          />
        </div>
      </div>

      {/* ================= CALENDAR ================= */}
      <div className={styles.card}>
        <h3 className={styles.cardTitle}>Schedule Event On <span style={{ color: "red" }}>*</span></h3>

        <div className={styles.field}>
          <label>Select Your Time Zone</label>
          <select
            className={styles.input}
            value={cal.timeZone || "Asia/Kolkata"}
            onChange={(e) => updateCalendar("timeZone", e.target.value)}
          >
            {[
              { label: "(UTC-12:00) Baker Island", value: "Etc/GMT+12" },
              { label: "(UTC-08:00) Pacific Time", value: "America/Los_Angeles" },
              { label: "(UTC-05:00) Eastern Time", value: "America/New_York" },
              { label: "(UTC+00:00) London", value: "Europe/London" },
              { label: "(UTC+01:00) Berlin", value: "Europe/Berlin" },
              { label: "(UTC+03:00) Moscow", value: "Europe/Moscow" },
              { label: "(UTC+05:30) India", value: "Asia/Kolkata" },
              { label: "(UTC+08:00) Singapore", value: "Asia/Singapore" },
              { label: "(UTC+09:00) Tokyo", value: "Asia/Tokyo" },
              { label: "(UTC+11:00) Sydney", value: "Australia/Sydney" },
            ].map((tz) => (
              <option key={tz.value} value={tz.value}>{tz.label}</option>
            ))}
          </select>
        </div>

        {/* <div className={styles.grid4}>
          <div className={styles.field}>
            <label>Start Date</label>
            <div className={styles.iconInput}>
              <span>{DATEICON}</span>
              <input
                type="date"
                value={cal.startDate || ""}
                onChange={(e) => updateCalendar("startDate", e.target.value)}
              />
            </div>
          </div>

          <div className={styles.field}>
            <label>Start Time</label>
            <div className={styles.iconInput}>
              <span>{TIMEICON}</span>
              <input
                type="time"
                value={cal.startTime || ""}
                onChange={(e) => updateCalendar("startTime", e.target.value)}
              />
            </div>
          </div>

          <div className={styles.field}>
            <label>End Date</label>
            <div className={styles.iconInput}>
              <span>{DATEICON}</span>
              <input
                type="date"
                value={cal.endDate || ""}
                onChange={(e) => updateCalendar("endDate", e.target.value)}
              />
            </div>
          </div>

          <div className={styles.field}>
            <label>End Time</label>
            <div className={styles.iconInput}>
              <span>{TIMEICON}</span>
              <input
                type="time"
                value={cal.endTime || ""}
                onChange={(e) => updateCalendar("endTime", e.target.value)}
              />
            </div>
          </div>
        </div> */}

<div className={styles.grid4}>
          {/* Start Date */}
          <div className={styles.field}>
            <label>Start Date</label>
            <div className={styles.calInput}>
              <span className={styles.calIcon}>{DATEICON}</span>
              <input
                type="date"
                className={styles.calNative}
                value={cal.startDate || ""}
                onChange={(e) => updateCalendar("startDate", e.target.value)}
              />
            </div>
          </div>

          {/* Start Time */}
          <div className={styles.field}>
            <label>Start Time</label>
            <div className={styles.calInput}>
              <span className={styles.calIcon}>{TIMEICON}</span>
              <input
                type="time"
                className={styles.calNative}
                value={cal.startTime || ""}
                onChange={(e) => updateCalendar("startTime", e.target.value)}
              />
              <span className={styles.amBadge}>AM</span>
            </div>
          </div>

          {/* End Date */}
          <div className={styles.field}>
            <label>End Date</label>
            <div className={styles.calInput}>
              <span className={styles.calIcon}>{DATEICON}</span>
              <input
                type="date"
                className={styles.calNative}
                value={cal.endDate || ""}
                onChange={(e) => updateCalendar("endDate", e.target.value)}
              />
            </div>
          </div>

          {/* End Time */}
          <div className={styles.field}>
            <label>End Time</label>
            <div className={styles.calInput}>
              <span className={styles.calIcon}>{TIMEICON}</span>
              <input
                type="time"
                className={styles.calNative}
                value={cal.endTime || ""}
                onChange={(e) => updateCalendar("endTime", e.target.value)}
              />
              <span className={styles.amBadge}>AM</span>
            </div>
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "16px" }}>
          <button className={styles.btnPrimary}>Save</button>
        </div>
      </div>

      {/* ================= EVENT MODE ================= */}
      <div className={styles.card}>
        <div className={styles.cardHeader} style={{ marginBottom: "20px" }}>
          <h3 className={styles.cardTitle} style={{ marginBottom: 0 }}>Event Mode</h3>
          <div className={styles.modeSwitch}>
            {["online", "offline", "hybrid"].map((m) => (
              <button
                key={m}
                className={`${styles.modeBtn} ${data.mode === m ? styles.active : ""}`}
                onClick={() => setData({ ...data, mode: m })}
              >
                {m.charAt(0).toUpperCase() + m.slice(1)}
              </button>
            ))}
          </div>
        </div>
        
        {/* Online Link (Shown for Online & Hybrid modes) */}
        {(data.mode === "online" || data.mode === "hybrid") && (
          <div className={styles.field}>
            <label>Online Meet Link <span>*</span></label>
            <div className={styles.iconInput}>
              <span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2">
                  <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
                  <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
                </svg>
              </span>
              <input
                placeholder="Enter the access link for your online event."
                value={data.meetLink || ""}
                onChange={(e) => setData({ ...data, meetLink: e.target.value })}
              />
            </div>
          </div>
        )}
      
        {/* Location Fields (Shown for Offline & Hybrid modes) */}
        {(data.mode === "offline" || data.mode === "hybrid") && (
          <>
            <div className={styles.field}>
              <label>Venue <span>*</span></label>
              <input
                className={styles.input}
                placeholder="Enter the event venue details"
                value={data.venue || ""}
                onChange={(e) => setData({ ...data, venue: e.target.value })}
              />
            </div>

            <div className={styles.grid3} style={{ marginTop: 12 }}>
              <div className={styles.field}>
                <label>Country <span>*</span></label>
                <select
                  className={styles.input}
                  value={data.country || ""}
                  onChange={(e) => setData({ ...data, country: e.target.value, state: "", city: "" })}
                >
                  <option value="">Select your Country</option>
                  {countries.map((c) => (
                    <option key={c.identity} value={c.identity}>{c.name}</option>
                  ))}
                </select>
              </div>
                
              {/* State Dropdown (Depends on Country) */}
              <div className={styles.field}>
                <label>State <span>*</span></label>
                <select
                  className={styles.input}
                  value={data.state || ""}
                  onChange={(e) => setData({ ...data, state: e.target.value, city: "" })}
                >
                  <option value="">Select your State</option>
                  {states.map((s) => (
                    <option key={s.identity} value={s.identity}>{s.name}</option>
                  ))}
                </select>
              </div>
                
              {/* City Dropdown (Depends on State) */}
              <div className={styles.field}>
                <label>City <span>*</span></label>
                <select
                  className={styles.input}
                  value={data.city || ""}
                  onChange={(e) => setData({ ...data, city: e.target.value })}
                >
                  <option value="">Select your City</option>
                  {cities.map((ct) => (
                    <option key={ct.identity} value={ct.identity}>{ct.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className={styles.field} style={{ marginTop: 12 }}>
              <label>Google Map Link <span>*</span></label>
              <div className={styles.iconInput}>
                <span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2">
                    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
                    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
                  </svg>
                </span>
                <input
                  placeholder="Enter the Map link"
                  value={data.mapLink || ""}
                  onChange={(e) => setData({ ...data, mapLink: e.target.value })}
                />
              </div>
            </div>
          </>
        )}
      </div>

      {/* ================= ACTIONS ================= */}
      <div className={styles.actions}>
        <button className={styles.btnOutline} onClick={onBack}>Back</button>
        <button className={styles.btnPrimary} onClick={onNext}>Next</button>
      </div>
    </>
  );
}