"use client";

import { useEffect, useState } from "react";
import MyEventsGrid from "./MyEventsGrid";
import MyEventsList from "./MyEventsList";
import { FaThLarge, FaListUl } from "react-icons/fa";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { getOrganizerEventsApi } from "../../../../lib/api/organizer.api";
import { getUserData } from "../../../../lib/auth";
import { useLoading } from "../../../../context/LoadingContext";

export default function MyEventPage() {
  const [events, setEvents] = useState([]);
  const [view, setView] = useState("grid");
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true); 
  const router = useRouter();

  const { setLoading: setGlobalLoading } = useLoading(); 

  /* ================= FETCH EVENTS ================= */
  useEffect(() => {
    async function loadEvents() {
      setGlobalLoading(true); // START GLOBAL LOADING

      try {
        const user = getUserData();
        if (!user?.identity) return;

        const res = await getOrganizerEventsApi(user.identity);

        if (res?.status) {
          setEvents(res.data || []);
        } else {
          toast.error(res.message || "Failed to load events");
        }
      } catch (err) {
        toast.error("Error loading events");
      } finally {
        setLoading(false);           
        setGlobalLoading(false);    
      }
    }

    loadEvents();
  }, [setGlobalLoading]);

  /* ================= FILTER + SEARCH ================= */
  const filteredEvents = events.filter((e) => {
    if (filter !== "all" && e.status !== filter) return false;
    if (search && !e.title?.toLowerCase().includes(search.toLowerCase()))
      return false;
    return true;
  });

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center py-5">
        <div className="spinner-border text-primary" />
      </div>
    );
  }

  return (
    <div className="container-fluid shadow-sm p-3 mb-5 bg-body-tertiary rounded">
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
      <div className="p-4 ">
        <div className="card-body">
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

            {/* FILTER */}
            <div className="col-md-3">
              <select
                className="form-select"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              >
                <option value="all">All Events</option>
                <option value="APPROVED">Published</option>
                <option value="DRAFT">Draft</option>
                <option value="COMPLETED">Completed</option>
              </select>
            </div>

            {/* VIEW TOGGLE */}
            <div className="col-md-4 text-md-end">
              <div className="btn-group">
                <button
                  className={`btn ${
                    view === "grid" ? "btn-primary" : "btn-outline-secondary"
                  }`}
                  onClick={() => setView("grid")}
                >
                  <FaThLarge />
                </button>

                <button
                  className={`btn ${
                    view === "list" ? "btn-primary" : "btn-outline-secondary"
                  }`}
                  onClick={() => setView("list")}
                >
                  <FaListUl />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ================= CONTENT ================= */}
      <div className="border-0 mt-5">
        <div className="card-body">
          {view === "grid" ? (
            <MyEventsGrid events={filteredEvents} />
          ) : (
            <MyEventsList events={filteredEvents} />
          )}
        </div>
      </div>
    </div>
  );
}
