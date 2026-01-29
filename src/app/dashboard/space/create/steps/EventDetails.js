"use client";

import { useEffect, useState } from "react";
import styles from "./EventDetails.module.css";
import CalendarModal from "../../../../../components/global/CalendarModal/CalendarModal";
import {
  getEventCategoriesApi,
  getEventTypesApi,
} from "../../../../../lib/api/event.api";

import {
  getCountries,
  getStates,
  getCities,
} from "../../../../../lib/location.api";
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
  // const [mode, setMode] = useState("online");
  const [showCalendar, setShowCalendar] = useState(false);
  const [tagInput, setTagInput] = useState("");
  const [categories, setCategories] = useState([]);
  const [eventTypes, setEventTypes] = useState([]);

  /* ===== LOCATION STATE ===== */
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  /* ================= LOAD CATEGORIES ================= */
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

  /* ================= LOAD EVENT TYPES (ON CATEGORY CHANGE) ================= */
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

  /* ================= LOAD COUNTRIES ================= */
  useEffect(() => {
    async function loadCountries() {
      const res = await getCountries();
      setCountries(res || []);
    }
    loadCountries();
  }, []);

  /* ================= LOAD STATES ================= */
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

  /* ================= LOAD CITIES ================= */
  useEffect(() => {
    if (!data.state || !data.country) {
      setCities([]);
      return;
    }

    async function loadCities() {
      const res = await getCities(data.country, data.state);
      setCities(res || []);
    }
    loadCities();
  }, [data.state, data.country]);

  const addTag = () => {
    let value = tagInput.trim();
    if (!value) return;

    if (data.tags?.includes(value)) {
      setTagInput("");
      return;
    }

    setData({
      ...data,
      tags: [...(data.tags || []), value],
    });

    setTagInput("");
  };

  const removeTag = (tag) => {
    setData({
      ...data,
      tags: (data.tags || []).filter((t) => t !== tag),
    });
  };

  /* ================= RESET ON SUCCESS ================= */
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

  return (
    <>
      {/* PRIMARY DETAILS */}
      <div className={styles.card}>
        <h3 className={styles.cardTitle}>Primary Details</h3>

        <div className={styles.grid3}>
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
                  eventType: "",
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

          {/* EVENT TYPE */}
          <div className={styles.field}>
            <label>
              Event Type <span>*</span>
            </label>
            <select
              className={styles.input}
              value={data.eventType || ""}
              disabled={!data.category}
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

        <div className={styles.grid3}>
          <div className={styles.field}>
            <label>
              Tags <span>*</span>
            </label>
            <div className={styles.tagRow}>
              <input
                className={styles.input}
                placeholder="#tags"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
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

            <div className={styles.tagList}>
              {(data.tags || []).map((t, index) => (
                <span key={`${t}-${index}`} className={styles.tag}>
                  {t}
                  <button type="button" onClick={() => removeTag(t)}>
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

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

      {/* CALENDAR */}
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

      {/* EVENT MODE – SAME UI AS OLD */}
      <div className={styles.card}>
        <h3 className={styles.cardTitle}>Event Mode</h3>

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
                  mode: m,
                })
              }
            >
              {m.charAt(0).toUpperCase() + m.slice(1)}
            </button>
          ))}
        </div>

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

        {(data.mode === "offline" || data.mode === "hybrid") && (
          <>
            <div className={styles.grid3}>
              <div className={styles.field}>
                <label>Country *</label>
                <select
                  className={styles.input}
                  value={data.country || ""}
                  onChange={(e) =>
                    setData({
                      ...data,
                      country: e.target.value,
                      state: "",
                      city: "",
                    })
                  }
                >
                  <option value="">Select Country</option>
                  {countries.map((c) => (
                    <option key={c.name} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

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
                    <option key={s.name} value={s.name}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className={styles.field}>
                <label>City *</label>
                <select
                  className={styles.input}
                  value={data.city || ""}
                  onChange={(e) => setData({ ...data, city: e.target.value })}
                >
                  <option value="">Select City</option>
                  {cities.map((ct) => (
                    <option key={ct.name} value={ct.name}>
                      {ct.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className={styles.grid2}>
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

      {/* ACTIONS */}
      <div className={styles.actions}>
        <button className={styles.btnOutline} onClick={onBack}>
          Back
        </button>
        <button className={styles.btnPrimary} onClick={onNext}>
          Next
        </button>
      </div>

      {showCalendar && (
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
