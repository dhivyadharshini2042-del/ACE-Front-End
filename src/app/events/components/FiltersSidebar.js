"use client";

import dynamic from "next/dynamic";

/**
 * IMPORTANT:
 * react-select must be loaded only on client
 * to avoid hydration mismatch
 */
const Select = dynamic(() => import("react-select"), {
  ssr: false,
});

export default function FiltersSidebar({
  categories = [],
  eventTypes = [],
  perks = [],
  certifications = [],
  eligibleDepartments = [],
  accommodations = [],
  filters,
  setFilters,
  onReset,
}) {
  /* ================= OPTIONS ================= */

  // Event Type (single select)
  const eventTypeOptions = eventTypes.map((e) => ({
    value: e.identity,
    label: e.eventTypeName || e.name, // SAFE
  }));

  // Eligible Department (multi select)
  const departmentOptions = eligibleDepartments.map((d) => ({
    value: d.identity,
    label: d.name,
  }));

  const modeLabels = {
    ONLINE: "Online",
    OFFLINE: "Offline",
    HYBRID: "Hybrid",
  };

  return (
    <aside className="filters-sidebar">
      {/* ================= HEADER ================= */}
      <div className="filters-header">
        <h6>Filters</h6>
        <button className="reset-btn" onClick={onReset}>
          Reset
        </button>
      </div>

      {/* ================= EVENT STATUS ================= */}
      <div className="filter-block">
        <label className="filter-check">
          <input
            type="checkbox"
            checked={filters.eventTypes.includes("featured")}
            onChange={() =>
              setFilters((prev) => ({
                ...prev,
                eventTypes: ["featured"],
              }))
            }
          />
          Featured Events
        </label>

        <label className="filter-check">
          <input
            type="checkbox"
            checked={filters.eventTypes.includes("trending")}
            onChange={() =>
              setFilters((prev) => ({
                ...prev,
                eventTypes: ["trending"],
              }))
            }
          />
          Trending Events
        </label>
      </div>

      {/* ================= EVENT DATE ================= */}
      <div className="filter-block">
        <h6>Event Date</h6>
        <input
          type="date"
          className="filter-input"
          value={filters.dateRange?.startDate || ""}
          onChange={(e) =>
            setFilters((p) => ({
              ...p,
              dateRange: e.target.value
                ? {
                    startDate: e.target.value,
                    endDate: e.target.value,
                  }
                : null,
            }))
          }
        />
      </div>

      {/* ================= MODE OF EVENT ================= */}
      <div className="filter-block">
        <h6>Mode of Event</h6>
        {["ONLINE", "OFFLINE", "HYBRID"].map((mode) => (
          <label key={mode} className="filter-check">
            <input
              type="checkbox"
              checked={filters.modes.includes(mode)}
              onChange={() => setFilters((p) => ({ ...p, modes: [mode] }))}
            />
            {modeLabels[mode]}
          </label>
        ))}
      </div>

      {/* ================= EVENT TYPE (react-select) ================= */}
      <div className="filter-block">
        <h6>Event Type</h6>
        <Select
          options={eventTypeOptions}
          placeholder="Select Event Type"
          value={eventTypeOptions.find(
            (o) => o.value === filters.eventTypeIdentity,
          )}
          onChange={(selected) =>
            setFilters((p) => ({
              ...p,
              eventTypeIdentity: selected?.value || "",
            }))
          }
          isClearable
          menuPortalTarget={
            typeof window !== "undefined" ? document.body : null
          }
          styles={{
            menuPortal: (base) => ({ ...base, zIndex: 9999 }),
          }}
        />
      </div>

      {/* ================= ELIGIBLE DEPARTMENT (MAX 2) ================= */}
      <div className="filter-block">
        <h6>Eligible Department</h6>
        <Select
          options={departmentOptions}
          placeholder="Select Departments"
          isMulti
          value={departmentOptions.filter((o) =>
            filters.eligibleDeptIdentities.includes(o.value),
          )}
          onChange={(selected) =>
            setFilters((p) => ({
              ...p,
              eligibleDeptIdentities: selected
                ? selected.map((s) => s.value)
                : [],
            }))
          }
        />
      </div>

      {/* ================= PRICING ================= */}
      <div className="filter-block">
        <h6>Pricing</h6>
        <input
          type="range"
          min="0"
          max="10000"
          className="pricing-input"
          value={filters.priceRange.max}
          onChange={(e) =>
            setFilters((p) => ({
              ...p,
              priceRange: {
                min: 0,
                max: Number(e.target.value),
              },
            }))
          }
        />

        <div className="d-flex justify-content-between">
          <span>0</span>
          <span>{filters.priceRange.max}</span>
        </div>
      </div>

      {/* ================= PERKS ================= */}
      <div className="filter-block">
        <h6>Perks</h6>
        {perks.map((p) => (
          <label key={p.identity} className="filter-check">
            <input
              type="checkbox"
              checked={filters.perkIdentities.includes(p.identity)}
              onChange={() =>
                setFilters((f) => ({
                  ...f,
                  perkIdentities: f.perkIdentities.includes(p.identity)
                    ? f.perkIdentities.filter((x) => x !== p.identity)
                    : [...f.perkIdentities, p.identity],
                }))
              }
            />
            {p.perkName}
          </label>
        ))}
      </div>

      {/* ================= CERTIFICATE TYPE ================= */}
      <div className="filter-block">
        <h6>Certificate Type</h6>
        <select
          className="filter-select"
          value={filters.certIdentity}
          onChange={(e) =>
            setFilters((p) => ({
              ...p,
              certIdentity: e.target.value,
            }))
          }
        >
          <option value="">Select certificate type</option>
          {certifications.map((c) => (
            <option key={c.identity} value={c.identity}>
              {c.certName}
            </option>
          ))}
        </select>
      </div>

      {/* ================= ACCOMMODATION ================= */}
      <div className="filter-block">
        <h6>Accommodation</h6>

        {accommodations.length === 0 && (
          <p style={{ fontSize: "12px", color: "#999" }}>
            No accommodations available
          </p>
        )}

        {accommodations.map((a) => (
          <label key={a.identity} className="filter-check">
            <input
              type="checkbox"
              checked={filters.accommodationIdentities.includes(a.identity)}
              onChange={() =>
                setFilters((p) => ({
                  ...p,
                  accommodationIdentities: p.accommodationIdentities.includes(
                    a.identity,
                  )
                    ? p.accommodationIdentities.filter((x) => x !== a.identity)
                    : [...p.accommodationIdentities, a.identity],
                }))
              }
            />
            {a.accommodationName}
          </label>
        ))}
      </div>
    </aside>
  );
}
