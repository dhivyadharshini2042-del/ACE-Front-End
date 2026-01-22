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

export default function MyEventsGrid({ events = [] }) {
  const [deleteId, setDeleteId] = useState(null);
  const [openMenuId, setOpenMenuId] = useState(null);
  const router = useRouter();

  const handleClick = (event) => {
    router.push(`/dashboard/space/dashboard-chart/${event.slug}`);
  };

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
      <div className="row g-4">
        {events.map((e) => {
          const calendar = e.calendars?.[0];
          const location = e.location;

          return (
            <div key={e.identity} className="col-xl-3 col-lg-4 col-md-6">
              <div
                className="card h-100 shadow-sm rounded-4 overflow-hidden event-card"
                onClick={() => handleClick(e)}
              >
                {/* IMAGE */}
                <div className="event-img-wrapper">
                  <img
                    src={e.bannerImages?.[0] || "/images/event.png"}
                    alt={e.title}
                    className="w-100 h-100"
                  />
                  <div className={`event-status ${e.status?.toLowerCase()}`}>
                    {e.status}
                  </div>
                </div>

                {/* BODY */}
                <div className="card-body">
                  {/* TITLE + 3 DOT MENU */}
                  <div
                    className="event-title-row"
                    onClick={(ev) => ev.stopPropagation()}
                  >
                    <h6
                      className="fw-semibold text-uppercase text-truncate"
                      title={e.title}
                    >
                      {e.title}
                    </h6>

                    {/* 3 DOT MENU */}
                    <div className="event-menu-wrapper">
                      <div
                        className="event-menu"
                        onClick={() =>
                          setOpenMenuId(
                            openMenuId === e.identity ? null : e.identity,
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
                                `/dashboard/space/edit/${e.identity}`,
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

                  <span>
                    {LOCATION_ICON}{" "}
                    {[location?.city, location?.state]
                      .filter(Boolean)
                      .join(", ") || "Location not set"}
                  </span>
                  {/* META */}
                  <div className="event-meta d-flex justify-content-between mb-2 gap-1">
                    {/* DATE */}
                    <span>
                      {DATEICON}{" "}
                      {new Date(e.createdAt).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>

                    {/* TIME */}
                    <span>
                      {TIMEICON}{" "}
                      {calendar?.startTime && calendar?.endTime
                        ? `${calendar.startTime} - ${calendar.endTime}`
                        : "Time not set"}
                    </span>

                    {/* LOCATION */}
                  </div>
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
