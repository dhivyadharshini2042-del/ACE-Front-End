"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import DeleteConfirmModal from "../../../../components/ui/DeleteConfirmModal/DeleteConfirmModal";
import EmptyState from "../../../../components/global/EmptyState/EmptyState";
import "./MyEvents.css";
import { encodeId } from "../../../../lib/utils/secureId";

export default function MyEventsGrid({ events = [] }) {
  const [deleteId, setDeleteId] = useState(null);
  const [openMenuId, setOpenMenuId] = useState(null);
  const router = useRouter();

  if (!events.length) {
    return (
      <EmptyState
        img="/images/no-data.png"
        title="No events created yet"
        subtitle="Create your first event to get started"
      />
    );
  }

  const handleDelete = () => {
    console.log("DELETE EVENT:", deleteId);
    setDeleteId(null);
  };

  const handleClick = (eventId) => {
      router.push(`/events/${encodeId(eventId)}`);
    };

  return (
    <>
      <div className="row g-4">
        {events.map((e) => {
          const calendar = e.calendars?.[0]; 

          return (
            <div key={e.identity} className="col-xl-3 col-lg-4 col-md-6">
              <div
                className="card h-100 shadow-sm rounded-4 overflow-hidden event-card"
                onClick={() => handleClick(e.identity)}
              >
                {/* IMAGE */}
                <div className="event-img-wrapper">
                  <img
                    src={
                      e.bannerImages?.[0] ||
                      "https://cloudinary-marketing-res.cloudinary.com/images/w_1000,c_scale/v1679921049/Image_URL_header/Image_URL_header-png?_i=AA"
                    }
                    alt={e.title}
                    className="w-100 h-100"
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
                    onClick={(e) => e.stopPropagation()}
                  >
                    <h6 className="fw-semibold text-truncate text-uppercase" title={e.title}>
                      {e.title || "Untitled Event"}
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
                              console.log("EDIT EVENT:", e.identity);
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

                  {/* EVENT META */}
                  <div className="event-meta">
                    <div className="d-flex justify-content-between">
                      <span>
                        Start :{" "}
                        {calendar?.startDate
                          ? calendar.startDate
                          : "Date not set"}
                      </span>
                      <span>
                        End :{" "}
                        {calendar?.endDate ? calendar.endDate : "Date not set"}
                      </span>
                    </div>

                    <span>
                      {[
                        e.location?.city,
                        e.location?.state,
                        e.location?.country,
                      ]
                        .filter(Boolean)
                        .join(", ") || "Location not set"}
                    </span>
                    <span className="text-end">{e.mode || "Mode not set"}</span>
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
        onConfirm={handleDelete}
      />
    </>
  );
}
