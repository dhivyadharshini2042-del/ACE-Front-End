"use client";

import { useEffect, useState } from "react";
import MyEventsGrid from "./MyEventsGrid";
import MyEventsList from "./MyEventsList";
import { FaThLarge, FaListUl } from "react-icons/fa";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

import { getOrganizerEventsApi } from "../../../../lib/api/organizer.api";
import { getEventStatusesApi } from "../../../../lib/api/event.api";
import { getUserData } from "../../../../lib/auth";
import { useLoading } from "../../../../context/LoadingContext";

export default function MyEventPage() {
  const [events, setEvents] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [view, setView] = useState("grid");
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const router = useRouter();
  const { setLoading } = useLoading();

  /* ================= FETCH EVENTS + STATUSES ================= */
  useEffect(() => {
    async function loadAll() {
      try {
        setLoading(true);

        const user = getUserData();
        if (!user?.identity) {
          setEvents([]);
          return;
        }

        // parallel API calls
        const [eventsRes, statusRes] = await Promise.all([
          getOrganizerEventsApi(user.identity),
          getEventStatusesApi(),
        ]);

        // EVENTS
        if (eventsRes?.status) {
          setEvents(eventsRes.data || []);
        } else {
          toast.error(eventsRes?.message || "Failed to load events");
          setEvents([]);
        }

        // STATUSES
        if (statusRes?.status) {
          setStatuses(statusRes.data || []);
        }
      } catch (err) {
        toast.error("Error loading events");
        setEvents([]);
      } finally {
        setLoading(false);
      }
    }

    loadAll();
  }, []); 

  /* ================= FILTER + SEARCH ================= */
  const filteredEvents = events.filter((e) => {
    if (filter !== "all" && e.status !== filter) return false;
    if (search && !e.title?.toLowerCase().includes(search.toLowerCase()))
      return false;
    return true;
  });

  return (
    <div className="container-fluid p-3 mb-5 rounded">
      {/* ================= HEADER ================= */}
      <div className="d-flex align-items-center justify-content-between mb-4">
        <h2 className="fw-bold mb-0">My Events</h2>

        <button
          className="px-4 create-btn"
          onClick={() => router.push("/dashboard/space/create")}
        >
          + Create Event
        </button>
      </div>

      {/* ================= CONTROLS ================= */}
      <div className="p-4">
        <div className="row g-3 align-items-center">
          {/* SEARCH */}
          <div className="col-md-5">
            <input
              type="text"
              className="form-control"
              placeholder="Search events"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* FILTER (DYNAMIC) */}
          <div className="col-md-3">
            <select
              className="form-select"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="all">All Events</option>

              {statuses.map((s) => (
                <option key={s} value={s}>
                  {s.charAt(0) + s.slice(1).toLowerCase()}
                </option>
              ))}
            </select>
          </div>

          {/* VIEW TOGGLE */}
          <div className="col-md-4 text-md-end">
            <div className="btn-group">
              {/* GRID BUTTON */}
              <button
                className={`btn ${view === "grid" ? "btn-grid" : "btn-list"}`}
                onClick={() => setView("grid")}
              >
                <FaThLarge />
              </button>

              {/* LIST BUTTON */}
              <button
                className={`btn ${view === "list" ? "btn-grid" : "btn-list"}`}
                onClick={() => setView("list")}
              >
                <FaListUl />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ================= CONTENT ================= */}
      <div className="mt-5">
        {view === "grid" ? (
          <MyEventsGrid events={filteredEvents} />
        ) : (
          <MyEventsList events={filteredEvents} />
        )}
      </div>
    </div>
  );
}
