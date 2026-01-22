"use client";

import { IoClose } from "react-icons/io5";

export default function ActiveFilterChips({
  filters,
  onRemove,
  eventTypes = [],
  departments = [],
  perks = [],
  certifications = [],
}) {
  const chips = [];

  /* ================= HELPERS ================= */

  const getEventTypeName = (id) =>
    eventTypes.find((e) => e.identity === id)?.name || "Event Type";

  const getDepartmentName = (id) =>
    departments.find((d) => d.identity === id)?.name || "Department";

  const getPerkName = (id) =>
    perks.find((p) => p.identity === id)?.perkName || "Perk";

  const getCertificateName = (id) =>
    certifications.find((c) => c.identity === id)?.certName || "Certificate";

  /* ================= EVENT TYPES ================= */
  filters.eventTypes?.forEach((t) =>
    chips.push({
      key: "eventTypes",
      value: t,
      label: t === "featured" ? "Featured Events" : "Trending Events",
    })
  );

  /* ================= MODE ================= */
  filters.modes?.forEach((m) =>
    chips.push({
      key: "modes",
      value: m,
      label: m,
    })
  );

  /* ================= EVENT TYPE ================= */
  if (filters.eventTypeIdentity) {
    chips.push({
      key: "eventTypeIdentity",
      value: filters.eventTypeIdentity,
      label: getEventTypeName(filters.eventTypeIdentity),
    });
  }

  /* ================= DEPARTMENTS ================= */
  filters.eligibleDeptIdentities?.forEach((id) =>
    chips.push({
      key: "eligibleDeptIdentities",
      value: id,
      label: getDepartmentName(id),
    })
  );

  /* ================= PERKS ================= */
  filters.perkIdentities?.forEach((id) =>
    chips.push({
      key: "perkIdentities",
      value: id,
      label: getPerkName(id),
    })
  );

  /* ================= CERTIFICATE ================= */
  if (filters.certIdentity) {
    chips.push({
      key: "certIdentity",
      value: filters.certIdentity,
      label: getCertificateName(filters.certIdentity),
    });
  }

  /* ================= DATE ================= */
  if (filters.dateRange?.startDate) {
    chips.push({
      key: "dateRange",
      value: filters.dateRange.startDate,
      label: `Date: ${filters.dateRange.startDate}`,
    });
  }

  /* ================= PRICE ================= */
  if (filters.priceRange?.max !== 10000) {
    chips.push({
      key: "priceRange",
      value: filters.priceRange.max,
      label: `Up to ₹${filters.priceRange.max}`,
    });
  }

  if (!chips.length) return null;

  return (
    <div className="active-filters">
      {chips.map((chip, i) => (
        <div key={i} className="filter-chip">
          <span>{chip.label}</span>
          <button onClick={() => onRemove(chip.key, chip.value)}>
            <IoClose />
          </button>
        </div>
      ))}
    </div>
  );
}
