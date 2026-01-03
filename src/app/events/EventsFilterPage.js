"use client";

import { useEffect, useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";

import "./Events-filter.css";

import {
  getAllEventsApi,
  getEventCategoriesApi,
  getEventTypesApi,
  getPerksApi,
  getCertificationsApi,
} from "../../lib/api/event.api";

import FiltersSidebar from "./components/FiltersSidebar";
import EventsList from "./components/EventsList";
import SortBar from "./components/SortBar";
import PaginationBar from "./components/PaginationBar";

export default function EventsFilterPage() {
  const params = useSearchParams();

  /* ================= STATE ================= */
  const [events, setEvents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [eventTypes, setEventTypes] = useState([]);
  const [perks, setPerks] = useState([]);
  const [certifications, setCertifications] = useState([]);

  const [filters, setFilters] = useState({
    category: params.get("category") || "",
    mode: [],
    perks: [],
    certifications: [],
    date: null,
    search: "",
  });

  const [sort, setSort] = useState("new");
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 6;

  /* ================= API LOAD ================= */
  useEffect(() => {
    getAllEventsApi().then((r) => r?.status && setEvents(r.data));
    getEventCategoriesApi().then((r) => r?.success && setCategories(r.data));
    getPerksApi().then((r) => r?.success && setPerks(r.data));
    getCertificationsApi().then((r) => r?.success && setCertifications(r.data));
  }, []);

  useEffect(() => {
    if (filters.category) {
      getEventTypesApi(filters.category).then(
        (r) => r?.status && setEventTypes(r.data)
      );
    }
  }, [filters.category]);

  /* ================= FILTER LOGIC ================= */
  const filteredEvents = useMemo(() => {
    let list = [...events];

    if (filters.category) {
      list = list.filter(
        (e) => e.eventTypeIdentity === filters.category
      );
    }

    if (filters.mode.length) {
      list = list.filter((e) =>
        filters.mode.includes(e.mode?.toLowerCase())
      );
    }

    if (filters.search) {
      list = list.filter((e) =>
        e.title.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    if (sort === "new") {
      list.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
    }

    return list;
  }, [events, filters, sort]);

  /* ================= PAGINATION ================= */
  const totalPages = Math.ceil(filteredEvents.length / PAGE_SIZE);

  const paginatedEvents = filteredEvents.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  console.log("====eeeee",events)

  useEffect(() => {
  setPage(1);
}, [filters, sort]);


  return (
    <div className="events-page container-fluid">
      <div className="row">

        {/* LEFT FILTERS */}
        <div className="col-xl-3 col-lg-4">
          <FiltersSidebar
            categories={categories}
            eventTypes={eventTypes}
            perks={perks}
            certifications={certifications}
            filters={filters}
            onChange={setFilters}
            onReset={() => setFilters({ category: "", mode: [] })}
          />
        </div>

        {/* RIGHT CONTENT */}
        <div className="col-xl-9 col-lg-8 mt-5">
          <SortBar
            value={sort}
            onChange={setSort}
            onSearch={(v) => setFilters((f) => ({ ...f, search: v }))}
          />

          <EventsList events={paginatedEvents} />

          <PaginationBar
            page={page}
            total={totalPages}
            onChange={setPage}
          />
        </div>

      </div>
    </div>
  );
}
