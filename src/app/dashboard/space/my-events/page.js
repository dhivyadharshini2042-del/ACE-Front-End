"use client";

import { useEffect, useState } from "react";
import MyEventsGrid from "./MyEventsGrid";
import MyEventsList from "./MyEventsList";
import { FaThLarge, FaListUl } from "react-icons/fa";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

import {
  getEventStatusesApi,
  getOrganizerEventsApi,
} from "../../../../lib/api/event.api";

import { getAuth, isUserLoggedIn } from "../../../../lib/auth";

export default function MyEventPage() {
  const [events, setEvents] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [view, setView] = useState("grid");
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true); // ✅ FIX

  const router = useRouter();

  const [auth, setAuth] = useState(null);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const ok = isUserLoggedIn();
    setLoggedIn(ok);

    if (ok) {
      const authData = getAuth(); 
      setAuth(authData);
    } else {
      setAuth(null);
    }
  }, []);

  useEffect(() => {
    async function loadAll() {
      try {
        setLoading(true);

        if (!loggedIn || auth?.type !== "org") {
          setEvents([]);
          return;
        }

        const [eventsRes, statusRes] = await Promise.all([
          getOrganizerEventsApi(auth.identity),
          getEventStatusesApi(),
        ]);

        if (eventsRes?.status) {
          setEvents(eventsRes.data || []);
        } else {
          toast.error("Failed to load events");
          setEvents([]);
        }

        if (statusRes?.status) {
          setStatuses(statusRes.data || []);
        }
      } catch {
        toast.error("Error loading events");
        setEvents([]);
      } finally {
        setLoading(false);
      }
    }

    if (loggedIn && auth) loadAll();
  }, [loggedIn, auth]);

  const filteredEvents = events.filter((e) => {
    if (filter !== "all" && e.status !== filter) return false;
    if (search && !e.title?.toLowerCase().includes(search.toLowerCase()))
      return false;
    return true;
  });

  return (
    <div className="container-fluid p-3 mb-5 rounded">
      <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3 mb-4">
        <h2 className="fw-bold mb-0">My Events</h2>

        <button
          className="px-4 create-btn"
          onClick={() => router.push("/dashboard/space/create")}
        >
          + Create Event
        </button>
      </div>

      {/* CONTROLS */}
      <div className="p-4">
        <div className="row g-3 align-items-center">
          <div className="col-md-5">
            <input
              className="form-control"
              placeholder="Search events"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="col-md-3">
            <select
              className="form-select"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="all">All Events</option>
              {statuses.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-4 text-md-end">
            <div className="btn-group">
              <button
                className={`btn ${view === "grid" ? "btn-grid" : "btn-list"}`}
                onClick={() => setView("grid")}
              >
                <FaThLarge />
              </button>
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

      {/* CONTENT */}
      <div className="mt-5">
        {view === "grid" ? (
          <MyEventsGrid events={filteredEvents} loading={loading} />
        ) : (
          <MyEventsList events={filteredEvents} loading={loading} />
        )}
      </div>
    </div>
  );
}
