"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "./EventSearchBar.module.css";
import { SEARCH_ICON } from "../../../const-value/config-icons/page";

export default function EventSearchBar({
  whatIcon,
  whereIcon,
  whenIcon,
  eventTypes = [],
}) {
  const router = useRouter();

  const [selectedEventType, setSelectedEventType] = useState(null);
  const [selectedMode, setSelectedMode] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);

  const [openDropdown, setOpenDropdown] = useState(null); // "type" | "mode" | "date"

  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = () => {
    const params = new URLSearchParams();

    if (selectedEventType)
      params.append("eventTypeIdentity", selectedEventType.identity);

    if (selectedMode) params.append("mode", selectedMode);

    if (selectedDate) params.append("date", selectedDate);

    router.push(`/events?${params.toString()}`);
  };

  const modes = ["ONLINE", "OFFLINE", "HYBRID"];

  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <div className={styles.row} ref={dropdownRef}>
          
          {/* WHAT */}
          <div
            className={styles.col}
            onClick={() => setOpenDropdown("type")}
          >
            <div className={styles.icon}>{whatIcon}</div>
            <div className={styles.sec}>
              <div className={styles.title}>What</div>
              <div className={styles.sub}>
                {selectedEventType?.name || "Event Type"}
              </div>
            </div>

            {openDropdown === "type" && (
              <div className={styles.dropdown}>
                {eventTypes.length === 0 && (
                  <div className={styles.dropdownItem}>No Event Types</div>
                )}
                {eventTypes.map((e) => (
                  <div
                    key={e.identity}
                    className={styles.dropdownItem}
                    onClick={() => {
                      setSelectedEventType(e);
                      setOpenDropdown(null);
                    }}
                  >
                    {e.name}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* MODE */}
          <div
            className={styles.col}
            onClick={() => setOpenDropdown("mode")}
          >
            <div className={styles.icon}>{whereIcon}</div>
            <div className={styles.sec}>
              <div className={styles.title}>Event Mode</div>
              <div className={styles.sub}>
                {selectedMode || "Select mode"}
              </div>
            </div>

            {openDropdown === "mode" && (
              <div className={styles.dropdown}>
                {modes.map((mode) => (
                  <div
                    key={mode}
                    className={styles.dropdownItem}
                    onClick={() => {
                      setSelectedMode(mode);
                      setOpenDropdown(null);
                    }}
                  >
                    {mode}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* DATE */}
          <div
            className={styles.col}
            onClick={() => setOpenDropdown("date")}
          >
            <div className={styles.icon}>{whenIcon}</div>
            <div className={styles.sec}>
              <div className={styles.title}>When</div>
              <div className={styles.sub}>
                {selectedDate || "Date"}
              </div>
            </div>

            {openDropdown === "date" && (
              <div className={styles.dropdown}>
                <input
                  type="date"
                  className={styles.dateInput}
                  onChange={(e) => {
                    setSelectedDate(e.target.value);
                    setOpenDropdown(null);
                  }}
                />
              </div>
            )}
          </div>

          <button className={styles.searchBtn} onClick={handleSearch}>
            Search
          </button>
        </div>
      </div>
    </div>
  );
}
