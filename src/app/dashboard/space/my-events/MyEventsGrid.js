"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import DeleteConfirmModal from "../../../../components/ui/DeleteConfirmModal/DeleteConfirmModal";
import EmptyState from "../../../../components/global/EmptyState/EmptyState";
import PaginationBar from "../../../events/components/PaginationBar";
import "./MyEvents.css";

import {
  DATEICON,
  LOCATION_ICON,
  TIMEICON,
} from "../../../../const-value/config-icons/page";
import { NO_IMAGE_FOUND_IMAGE } from "../../../../const-value/config-message/page";

const PAGE_SIZE = 12; // number of cards per page

export default function MyEventsGrid({ events = [], loading }) {
  const [deleteId, setDeleteId] = useState(null);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [page, setPage] = useState(1);
  const router = useRouter();

  const handleClick = (event) => {
    router.push(`/dashboard/space/dashboard-chart/${event.slug}`);
  };

  if (loading) {
    return <p className="text-center py-5">Loading events...</p>;
  }

  if (!events.length) {
    return (
      <EmptyState
        img="/images/no-data.png"
        title="No events created yet"
        subtitle="Create your first event to get started"
      />
    );
  }

  /* ================= PAGINATION LOGIC ================= */
  const totalPages = Math.ceil(events.length / PAGE_SIZE);
  const startIndex = (page - 1) * PAGE_SIZE;
  const paginatedEvents = events.slice(
    startIndex,
    startIndex + PAGE_SIZE
  );

  return (
    <>
      {/* EVENTS GRID */}
      <div className="events-grid">
        {paginatedEvents.map((e) => {
          const calendar = e.calendars?.[0];
          const location = e.location;

          return (
            <div
              key={e.identity}
              className="event-card"
              onClick={() => handleClick(e)}
            >
              {/* IMAGE */}
              <div className="event-img-wrapper">
                <img
                  src={e.bannerImages?.[0] || NO_IMAGE_FOUND_IMAGE}
                  alt={e.title}
                />
                <div className={`event-status ${e.status?.toLowerCase()}`}>
                  {e.status}
                </div>
              </div>

              {/* BODY */}
              <div className="card-body">
                {/* TITLE + MENU */}
                <div
                  className="event-title-row"
                  onClick={(ev) => ev.stopPropagation()}
                >
                  <h6 className="event-title" title={e.title}>
                    {e.title}
                  </h6>

                  <div className="event-menu-wrapper">
                    <div
                      className="event-menu"
                      onClick={() =>
                        setOpenMenuId(
                          openMenuId === e.identity ? null : e.identity
                        )
                      }
                    >
                      &#8942;
                    </div>

                    {openMenuId === e.identity && (
                      <div className="event-menu-dropdown">
                        <button
                          className="dropdown-item"
                          onClick={() => {
                            router.push(
                              `/dashboard/space/edit/${e.identity}`
                            );
                            setOpenMenuId(null);
                          }}
                        >
                          Edit
                        </button>

                        <button
                          className="dropdown-item delete"
                          onClick={() => {
                            setDeleteId(e.id);
                            setOpenMenuId(null);
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* LOCATION */}
                <div className="event-location">
                  {LOCATION_ICON}{" "}
                  {[location?.city, location?.state]
                    .filter(Boolean)
                    .join(", ") || "Location not set"}
                </div>

                {/* META */}
                <div className="event-meta">
                  <span>
                    {DATEICON}{" "}
                    {new Date(e.createdAt).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>

                  <span>
                    {TIMEICON}{" "}
                    {calendar?.startTime && calendar?.endTime
                      ? `${calendar.startTime} - ${calendar.endTime}`
                      : "Time not set"}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* PAGINATION */}
      {totalPages > 1 && (
        <PaginationBar
          page={page}
          total={totalPages}
          onChange={setPage}
        />
      )}

      <DeleteConfirmModal
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={() => setDeleteId(null)}
      />
    </>
  );
}