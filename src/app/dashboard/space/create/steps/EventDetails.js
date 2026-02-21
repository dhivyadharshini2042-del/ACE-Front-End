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
import CalendarModal from "../../../../../components/global/CalendarModal/CalendarModal";

// API functions to fetch categories, event types, and location data
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
  // state for internal UI controls and fetched lists
  // const [mode, setMode] = useState("online");
  const [showCalendar, setShowCalendar] = useState(false);
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
        if (res?.status) {
          setCategories(res.data);
        }
      } catch (err) {
        console.error("Category fetch failed", err);
      }
    }

    loadCategories();
  }, []);

  // load event types whenever a category is chosen
  useEffect(() => {
    if (!data.category) return;

    async function loadEventTypes() {
      try {
        const res = await getEventTypesApi(data.category);
        if (res?.status) {
          setEventTypes(res.data);
        }
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
    if (!data.country) {
      setStates([]);
      return;
    }

    async function loadStates() {
      const res = await getStates(data.country);
      setStates(res || []);
    }
    loadStates();
  }, [data.country]);

  // fetch cities when a state (and country) are specified
  useEffect(() => {
    if (!data.state || !data.country) {
      setCities([]);
      return;
    }

    async function loadCities() {
      const res = await getCities(data.state);
      setCities(res || []);
    }
    loadCities();
  }, [data.state]);

  // append a new tag if not already present
  const addTag = () => {
    if (!tagInput) return;

    const finalTag = `#${tagInput}`;

    // duplicate check
    if ((data.tags || []).includes(finalTag)) {
      setTagInput("");
      return;
    }

    setData({
      ...data,
      tags: [...(data.tags || []), finalTag],
    });

    setTagInput("");
  };
  // remove specified tag from tags array
  const removeTag = (tag) => {
    setData({
      ...data,
      tags: (data.tags || []).filter((t) => t !== tag),
    });
  };

  // reset all fields when resetSignal changes (indicating a new event creation flow)
  useEffect(() => {
    if (!resetSignal) return;

    // setMode("online");
    setTagInput("");
    setEventTypes([]);
    setShowCalendar(false);

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

  // render form sections and conditional UI elements
  return (
    <>
      {/* ================= PRIMARY DETAILS SECTION ================= */}
      <div className={styles.card}>
        <h3 className={styles.cardTitle}>Primary Details</h3>

        {/* -------- Title, Category & Event Type -------- */}
        <div className={styles.grid3}>

          {/* Event Title Input */}
          <div className={styles.field}>
            <label>
              Event Title <span>*</span>
            </label>
            <input
              className={styles.input}
              placeholder="Enter event title"
              value={data.title || ""}
              onChange={(e) => setData({ ...data, title: e.target.value })}
            />
          </div>

          {/* Category Dropdown (Resets event type when changed) */}
          <div className={styles.field}>
            <label>
              Category <span>*</span>
            </label>
            <select
              className={styles.input}
              value={data.category || ""}
              onChange={(e) =>
                setData({
                  ...data,
                  category: e.target.value,
                  eventType: "", // Clear event type when category changes
                })
              }
            >
              <option value="">Select Category</option>
              {categories.map((c) => (
                <option key={c.identity} value={c.identity}>
                  {c.categoryName}
                </option>
              ))}
            </select>
          </div>
            
          {/* Event Type Dropdown (Filtered based on selected category) */}
          <div className={styles.field}>
            <label>
              Event Type <span>*</span>
            </label>
            <select
              className={styles.input}
              value={data.eventType || ""}
              disabled={!data.category} // Disabled until category is selected
              onChange={(e) => setData({ ...data, eventType: e.target.value })}
            >
              <option value="">Select Event Type</option>
              {eventTypes.map((t) => (
                <option key={t.identity} value={t.identity}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>
        </div>
            
        {/* -------- Tags & Offers -------- */}
        <div className={styles.grid3}>
            
          {/* Tags Input & Display */}
          <div className={styles.field}>
            <label>
              Tags <span>*</span>
            </label>
            
            {/* Tag input row with Add button */}
            <div className={styles.tagRow}>
              <input
                className={styles.input}
                placeholder="tags"
                value={tagInput}
                onChange={(e) => {
                  let value = e.target.value;
                
                  // Remove spaces
                  value = value.replace(/\s/g, "");
                
                  // Prevent manual '#' entry (auto-added internally)
                  value = value.replace(/#/g, "");
                
                  // Allow only alphanumeric characters and underscore
                  value = value.replace(/[^a-zA-Z0-9_]/g, "");

                  setTagInput(value);
                }}
                onKeyDown={(e) => {
                  // Add tag on Enter key press
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addTag();
                  }
                }}
              />

              <button
                type="button"
                className={styles.btnSmall}
                onClick={addTag}
              >
                Add
              </button>
            </div>
              
            {/* Render Added Tags */}
            <div className={styles.tagList}>
              {(data.tags || []).map((t, index) => (
                <span key={`${t}-${index}`} className={styles.tag}>
                  {t}
                  {/* Remove individual tag */}
                  <button type="button" onClick={() => removeTag(t)}>
                    ×
                  </button>
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
          <label>
            About Event <span>*</span>
          </label>
          <textarea
            className={styles.textarea}
            placeholder="About the event"
            value={data.about || ""}
            onChange={(e) => setData({ ...data, about: e.target.value })}
          />
        </div>
      </div>

      {/* CALENDAR section for scheduling dates/times */}
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <h3 className={styles.cardTitle}>Calendar *</h3>
          <button
            className={styles.btnPrimary}
            onClick={() => setShowCalendar(true)}
          >
            + Add
          </button>
        </div>
        {data.calendar?.length > 0 ? (
          <div className={styles.calendarGrid}>
            {data.calendar.map((c, i) => (
              <div key={i} className={styles.calendarItem}>
                <div className={styles.calendarDate}>
                  {DATEICON}{" "}
                  {c.startDate === c.endDate
                    ? c.startDate
                    : `${c.startDate} → ${c.endDate}`}
                </div>

                <div className={styles.calendarTime}>
                  {TIMEICON} {c.startTime} – {c.endTime}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className={styles.muted}>
            Nothing scheduled – create a calendar to organize your events.
          </p>
        )}
      </div>

      {/* ================= EVENT MODE SECTION ================= */}
      {/* Allows switching between Online, Offline, and Hybrid modes.
          Fields are conditionally rendered based on selected mode. */}
      <div className={styles.card}>
        <h3 className={styles.cardTitle}>Event Mode</h3>
      
        {/* Mode Selection Buttons */}
        <div className={styles.modeSwitch}>
          {["online", "offline", "hybrid"].map((m) => (
            <button
              key={m}
              className={`${styles.modeBtn} ${
                data.mode === m ? styles.active : ""
              }`}
              onClick={() =>
                setData({
                  ...data,
                  mode: m, // Update selected event mode
                })
              }
            >
              {/* Capitalize first letter for display */}
              {m.charAt(0).toUpperCase() + m.slice(1)}
            </button>
          ))}
        </div>
        
        {/* Online Link (Shown for Online & Hybrid modes) */}
        {(data.mode === "online" || data.mode === "hybrid") && (
          <div className={styles.field}>
            <label>
              Online Meet Link <span>*</span>
            </label>
            <input
              className={styles.input}
              placeholder="Enter meet link"
              value={data.meetLink || ""}
              onChange={(e) => setData({ ...data, meetLink: e.target.value })}
            />
          </div>
        )}
      
        {/* Location Fields (Shown for Offline & Hybrid modes) */}
        {(data.mode === "offline" || data.mode === "hybrid") && (
          <>
            {/* Country, State, City Selection */}
            <div className={styles.grid3}>
              
              {/* Country Dropdown */}
              <div className={styles.field}>
                <label>Country *</label>
                <select
                  className={styles.input}
                  value={data.country || ""}
                  onChange={(e) =>
                    setData({
                      ...data,
                      country: e.target.value,
                      state: "", // Reset state when country changes
                      city: "",  // Reset city when country changes
                    })
                  }
                >
                  <option value="">Select Country</option>
                  {countries.map((c) => (
                    <option key={c.identity} value={c.identity}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
                
              {/* State Dropdown (Depends on Country) */}
              <div className={styles.field}>
                <label>State *</label>
                <select
                  className={styles.input}
                  value={data.state || ""}
                  onChange={(e) =>
                    setData({ ...data, state: e.target.value, city: "" })
                  }
                >
                  <option value="">Select State</option>
                  {states.map((s) => (
                    <option key={s.identity} value={s.identity}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>
                
              {/* City Dropdown (Depends on State) */}
              <div className={styles.field}>
                <label>City *</label>
                <select
                  className={styles.input}
                  value={data.city || ""}
                  onChange={(e) => setData({ ...data, city: e.target.value })}
                >
                  <option value="">Select City</option>
                  {cities.map((ct) => (
                    <option key={ct.identity} value={ct.identity}>
                      {ct.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
                
            {/* Map Link & Venue Details */}
            <div className={styles.grid2}>
                
              {/* Google Map Link */}
              <div className={styles.field}>
                <label>
                  Google Map Link <span>*</span>
                </label>
                <input
                  className={styles.input}
                  placeholder="Enter map link"
                  value={data.mapLink || ""}
                  onChange={(e) =>
                    setData({ ...data, mapLink: e.target.value })
                  }
                />
              </div>
                
              {/* Venue */}
              <div className={styles.field}>
                <label>
                  Venue <span>*</span>
                </label>
                <input
                  className={styles.input}
                  placeholder="Enter venue"
                  value={data.venue || ""}
                  onChange={(e) => setData({ ...data, venue: e.target.value })}
                />
              </div>
            </div>
          </>
        )}
      </div>

      {/* navigation buttons to move between wizard steps */}
      <div className={styles.actions}>
        <button className={styles.btnOutline} onClick={onBack}>
          Back
        </button>
        <button className={styles.btnPrimary} onClick={onNext}>
          Next
        </button>
      </div>

      {showCalendar && (
        // CalendarModal is rendered when user wants to add timeslots
        <CalendarModal
          onClose={() => setShowCalendar(false)}
          onSave={(rows) => {
            const formatted = rows.map((r) => ({
              startDate: r.startDate,
              endDate: r.endDate,
              startTime: r.startTime,
              endTime: r.endTime,
              timeZone: "Asia/Kolkata",
            }));

            setData({
              ...data,
              calendar: formatted,
            });

            setShowCalendar(false);
          }}
        />
      )}
    </>
  );
}
