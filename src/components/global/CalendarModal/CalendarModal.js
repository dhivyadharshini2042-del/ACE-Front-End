"use client";

import { useState, useEffect, useRef } from "react";
import styles from "./CalendarModal.module.css";
import { ADDICON, DELETICON } from "../../../const-value/config-icons/page";
export default function CalendarModal({ onClose, onSave }) {
  const [multiDate, setMultiDate] = useState(false);
  const [rows, setRows] = useState([
    { startDate: "", startTime: "", endDate: "", endTime: "" },
  ]);

  const rowsRef = useRef(null);

  const today = new Date().toISOString().split("T")[0];
  const nowTime = new Date().toTimeString().slice(0, 5);
  const HOURS = Array.from({ length: 12 }, (_, i) =>
    String(i + 1).padStart(2, "0"),
  );

  const MINUTES = Array.from({ length: 60 }, (_, i) =>
    String(i).padStart(2, "0"),
  );

  useEffect(() => {
    if (rowsRef.current) {
      rowsRef.current.scrollTop = rowsRef.current.scrollHeight;
    }
  }, [rows.length]);

  const addRow = () => {
    setRows([
      ...rows,
      { startDate: "", startTime: "", endDate: "", endTime: "" },
    ]);
  };

  const removeRow = (index) => {
    setRows(rows.filter((_, i) => i !== index));
  };

  const updateRow = (index, field, value) => {
    const updated = [...rows];
    updated[index][field] = value;

    // reset invalid end date/time
    if (field === "startDate") {
      if (updated[index].endDate < value) {
        updated[index].endDate = "";
        updated[index].endTime = "";
      }
    }

    if (field === "startTime") {
      if (
        updated[index].endDate === updated[index].startDate &&
        updated[index].endTime < value
      ) {
        updated[index].endTime = "";
      }
    }

    setRows(updated);
  };

  return (
    <div className={styles.backdrop}>
      <div className={styles.modal}>
        <h3 className={styles.title}>
          Calendar <span className={styles.req}>*</span>
        </h3>

        {/* TIME ZONE */}
        <label className={styles.label}>Select Your Time Zone</label>
        <select className={styles.input}>
          <option>(UTC-12:00)</option>
          <option>(UTC+05:30) India</option>
        </select>

        {/* DATE ROWS */}
        <div className={styles.rowsContainer} ref={rowsRef}>
          {multiDate && (
            <div className={styles.addRow} onClick={addRow}>
              {ADDICON} Add
            </div>
          )}

          {rows.map((row, index) => (
            <div key={index} className={styles.rowGrid}>
              <div className={styles.field}>
                <label>
                  Start Date <span>*</span>
                </label>
                <input
                  type="date"
                  className={styles.input}
                  min={today}
                  value={row.startDate}
                  onChange={(e) =>
                    updateRow(index, "startDate", e.target.value)
                  }
                />
              </div>

              <div className={styles.field}>
                <label>
                  Start Time <span>*</span>
                </label>
                <div className={styles.timeRow}>
                  {/* HOUR */}
                  <select
                    className={styles.input}
                    onChange={(e) =>
                      updateRow(
                        index,
                        "startTime",
                        `${e.target.value}:${row.startTime?.split(":")[1] || "00"} ${row.startTime?.includes("PM") ? "PM" : "AM"}`,
                      )
                    }
                  >
                    <option value="">HH</option>
                    {HOURS.map((h) => (
                      <option key={h} value={h}>
                        {h}
                      </option>
                    ))}
                  </select>

                  {/* MINUTE */}
                  <select
                    className={styles.input}
                    onChange={(e) =>
                      updateRow(
                        index,
                        "startTime",
                        `${row.startTime?.split(":")[0] || "01"}:${e.target.value} ${row.startTime?.includes("PM") ? "PM" : "AM"}`,
                      )
                    }
                  >
                    {MINUTES.map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                  </select>

                  {/* AM / PM */}
                  <select
                    className={styles.input}
                    onChange={(e) =>
                      updateRow(
                        index,
                        "startTime",
                        `${row.startTime?.split(" ")[0] || "01:00"} ${e.target.value}`,
                      )
                    }
                  >
                    <option>AM</option>
                    <option>PM</option>
                  </select>
                </div>
              </div>

              <div className={styles.field}>
                <label>
                  End Date <span>*</span>
                </label>
                <input
                  type="date"
                  className={styles.input}
                  min={row.startDate || today}
                  value={row.endDate}
                  onChange={(e) => updateRow(index, "endDate", e.target.value)}
                />
              </div>

              <div className={styles.field}>
                <label>
                  End Time <span>*</span>
                </label>
                <div className={styles.timeRow}>
                  <select
                    className={styles.input}
                    onChange={(e) =>
                      updateRow(
                        index,
                        "endTime",
                        `${e.target.value}:${row.endTime?.split(":")[1] || "00"} ${row.endTime?.includes("PM") ? "PM" : "AM"}`,
                      )
                    }
                  >
                    <option value="">HH</option>
                    {HOURS.map((h) => (
                      <option key={h} value={h}>
                        {h}
                      </option>
                    ))}
                  </select>

                  <select
                    className={styles.input}
                    onChange={(e) =>
                      updateRow(
                        index,
                        "endTime",
                        `${row.endTime?.split(":")[0] || "01"}:${e.target.value} ${row.endTime?.includes("PM") ? "PM" : "AM"}`,
                      )
                    }
                  >
                    {MINUTES.map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                  </select>

                  <select
                    className={styles.input}
                    onChange={(e) =>
                      updateRow(
                        index,
                        "endTime",
                        `${row.endTime?.split(" ")[0] || "01:00"} ${e.target.value}`,
                      )
                    }
                  >
                    <option>AM</option>
                    <option>PM</option>
                  </select>
                </div>
              </div>

              {multiDate && index > 0 && (
                <div
                  className={styles.deleteIcon}
                  onClick={() => removeRow(index)}
                >
                  {DELETICON}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* MULTI DATE TOGGLE */}
        <div className={styles.toggleRow}>
          {/* <span>Schedule on Multiple Dates</span> */}
          {/* <label className={styles.switch}>
            <input
              type="checkbox"
              checked={multiDate}
              onChange={() => {
                setMultiDate(!multiDate);
                if (!multiDate && rows.length === 1) addRow();
              }}
            />
            <span className={styles.slider}></span>
          </label> */}
        </div>

        {/* ACTIONS */}
        <div className={styles.actions}>
          <button className={styles.save} onClick={() => onSave(rows)}>
            Save
          </button>
        </div>

        <button className={styles.close} onClick={onClose}>
          ✕
        </button>
      </div>
    </div>
  );
}
