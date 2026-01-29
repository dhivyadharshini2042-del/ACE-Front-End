"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import DeleteConfirmModal from "../../../../components/ui/DeleteConfirmModal/DeleteConfirmModal";
import EmptyState from "../../../../components/global/EmptyState/EmptyState";
import "./MyEvents.css";
import {
  DATEICON,
  LOCATION_ICON,
  TIMEICON,
} from "../../../../const-value/config-icons/page";

export default function MyEventsGrid({ events = [], loading }) {
  const [deleteId, setDeleteId] = useState(null);
  const [openMenuId, setOpenMenuId] = useState(null);
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

  return (
    <>
      {/* ✅ CSS GRID */}
      <div className="events-grid">
        {events.map((e) => {
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
                  src={e.bannerImages?.[0] || "/images/event.png"}
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

      <DeleteConfirmModal
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={() => setDeleteId(null)}
      />
    </>
  );
}
