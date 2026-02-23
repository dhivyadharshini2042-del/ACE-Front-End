"use client";

import { useState, useEffect, useRef } from "react";
import styles from "./CalendarModal.module.css";
import { ADDICON, DELETICON } from "../../../const-value/config-icons/page";

export default function CalendarModal({ onClose, onSave }) {
  const [multiDate, setMultiDate] = useState(false);
  const [rows, setRows] = useState([
    {
      startDate: "", endDate: "",
      startHour: "", startMinute: "00", startMeridian: "AM",
      endHour: "", endMinute: "00", endMeridian: "AM",
    },
  ]);

  const rowsRef = useRef(null);
  const today = new Date().toISOString().split("T")[0];

  const HOURS = Array.from({ length: 12 }, (_, i) =>
    String(i + 1).padStart(2, "0")
  );
  const MINUTES = Array.from({ length: 60 }, (_, i) =>
    String(i).padStart(2, "0")
  );

  const timeToMinutes = (time) => {
    if (!time) return 0;
    const [t, meridian] = time.split(" ");
    const [h, m] = t.split(":").map(Number);
    let hour = h % 12;
    if (meridian === "PM") hour += 12;
    return hour * 60 + m;
  };

  const getTime = (hour, minute, meridian) => {
    if (!hour) return "";
    return `${hour}:${minute} ${meridian}`;
  };

  useEffect(() => {
    if (rowsRef.current) {
      rowsRef.current.scrollTop = rowsRef.current.scrollHeight;
    }
  }, [rows.length]);

  const addRow = () => {
    setRows([
      ...rows,
      {
        startDate: "", endDate: "",
        startHour: "", startMinute: "00", startMeridian: "AM",
        endHour: "", endMinute: "00", endMeridian: "AM",
      },
    ]);
  };

  const removeRow = (index) => {
    setRows(rows.filter((_, i) => i !== index));
  };

  const updateRow = (index, field, value) => {
    const updated = [...rows];
    updated[index][field] = value;

    // If startDate changes and endDate is now before it, reset endDate
    if (field === "startDate" && updated[index].endDate && updated[index].endDate < value) {
      updated[index].endDate = "";
    }

    setRows(updated);
  };

  const isRowEndTimeInvalid = (row) => {
    if (!row.startDate || !row.endDate) return false;
    if (row.startDate !== row.endDate) return false;
    const startTime = getTime(row.startHour, row.startMinute, row.startMeridian);
    const endTime = getTime(row.endHour, row.endMinute, row.endMeridian);
    if (!startTime || !endTime) return false;
    return timeToMinutes(endTime) <= timeToMinutes(startTime);
  };

  // const isValid = rows.every((row) => {
  //   if (!row.startDate || !row.startHour) return false;
  //   if (row.endDate && row.endDate < row.startDate) return false;
  //   if (isRowEndTimeInvalid(row)) return false;
  //   return true;
  // });

  const isValid = rows.every((row) => {
    // Start date and time must be fully filled
    if (!row.startDate || !row.startHour) return false;

    // If end date is filled, end hour must also be filled
    if (row.endDate && !row.endHour) return false;

    // If end hour is filled, end date must also be filled
    if (row.endHour && !row.endDate) return false;
    if (!row.endHour && !row.endDate) return false;

    // End date cannot be before start date
    if (row.endDate && row.endDate < row.startDate) return false;

    // Same date → end time must be after start time
    if (isRowEndTimeInvalid(row)) return false;

    return true;
  });

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

              {/* START DATE */}
              <div className={styles.field}>
                <label>Start Date <span>*</span></label>
                <input
                  type="date"
                  className={styles.input}
                  min={today}
                  value={row.startDate}
                  onChange={(e) => updateRow(index, "startDate", e.target.value)}
                />
              </div>

              {/* START TIME */}
              <div className={styles.field}>
                <label>Start Time <span>*</span></label>
                <div className={styles.timeRow}>
                  <select
                    className={styles.input}
                    value={row.startHour}
                    onChange={(e) => updateRow(index, "startHour", e.target.value)}
                  >
                    <option value="">HH</option>
                    {HOURS.map((h) => <option key={h} value={h}>{h}</option>)}
                  </select>

                  <select
                    className={styles.input}
                    value={row.startMinute}
                    onChange={(e) => updateRow(index, "startMinute", e.target.value)}
                  >
                    {MINUTES.map((m) => <option key={m} value={m}>{m}</option>)}
                  </select>

                  <select
                    className={styles.input}
                    value={row.startMeridian}
                    onChange={(e) => updateRow(index, "startMeridian", e.target.value)}
                  >
                    <option>AM</option>
                    <option>PM</option>
                  </select>
                </div>
              </div>

              {/* END DATE */}
              <div className={styles.field}>
                <label>End Date <span>*</span></label>
                <input
                  type="date"
                  className={styles.input}
                  min={row.startDate || today}
                  value={row.endDate}
                  onChange={(e) => updateRow(index, "endDate", e.target.value)}
                />
              </div>

              {/* END TIME */}
              <div className={styles.field}>
                <label>End Time <span>*</span></label>
                <div className={styles.timeRow}>
                  <select
                    className={styles.input}
                    value={row.endHour}
                    onChange={(e) => updateRow(index, "endHour", e.target.value)}
                  >
                    <option value="">HH</option>
                    {HOURS.map((h) => <option key={h} value={h}>{h}</option>)}
                  </select>

                  <select
                    className={styles.input}
                    value={row.endMinute}
                    onChange={(e) => updateRow(index, "endMinute", e.target.value)}
                  >
                    {MINUTES.map((m) => <option key={m} value={m}>{m}</option>)}
                  </select>

                  <select
                    className={styles.input}
                    value={row.endMeridian}
                    onChange={(e) => updateRow(index, "endMeridian", e.target.value)}
                  >
                    <option>AM</option>
                    <option>PM</option>
                  </select>
                </div>
              </div>

              {/* HINT & ERROR MESSAGES */}
              {row.startDate && row.endDate && row.startDate === row.endDate && row.startHour && (
                <div style={{ gridColumn: "1 / -1" }}>
                  {isRowEndTimeInvalid(row) ? (
                    <small style={{ color: "#e74c3c", fontSize: "12px" }}>
                      ⚠ End time must be after start time ({getTime(row.startHour, row.startMinute, row.startMeridian)})
                    </small>
                  ) : (
                    <small style={{ color: "#888", fontSize: "12px" }}>
                      ℹ End time must be after {getTime(row.startHour, row.startMinute, row.startMeridian)}
                    </small>
                  )}
                </div>
              )}

              {/* DELETE ROW */}
              {multiDate && index > 0 && (
                <div className={styles.deleteIcon} onClick={() => removeRow(index)}>
                  {DELETICON}
                </div>
              )}

            </div>
          ))}
        </div>

        {/* MULTI DATE TOGGLE */}
        <div className={styles.toggleRow}></div>

        {/* ACTIONS */}
        <div className={styles.actions}>
          <button
            className={styles.save}
            disabled={!isValid}
            style={{ opacity: isValid ? 1 : 0.5, cursor: isValid ? "pointer" : "not-allowed" }}
            onClick={() => {
              const formatted = rows.map((row) => ({
                startDate: row.startDate,
                endDate: row.endDate,
                startTime: getTime(row.startHour, row.startMinute, row.startMeridian),
                endTime: getTime(row.endHour, row.endMinute, row.endMeridian),
              }));
              onSave(formatted);
            }}
          >
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