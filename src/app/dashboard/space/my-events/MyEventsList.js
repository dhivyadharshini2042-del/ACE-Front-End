"use client";

import { useState } from "react";
import DeleteConfirmModal from "../../../../components/ui/DeleteConfirmModal/DeleteConfirmModal";
import EmptyState from "../../../../components/global/EmptyState/EmptyState";
import {
  DATEICON,
  LOCATION_ICON,
  TIMEICON,
} from "../../../../const-value/config-icons/page";

export default function MyEventsList({ events = [] }) {
  const [deleteId, setDeleteId] = useState(null);

  if (!events.length) {
    return (
      <EmptyState
        img="/images/no-data.png"
        title="No events created yet"
        subtitle="Create your first event to see it here"
      />
    );
  }
  const handleClick = (event) => {
    router.push(`/dashboard/space/dashboard-chart/${event.slug}`);
  };

  const handleDelete = () => {
    console.log("DELETE EVENT:", deleteId);
    setDeleteId(null);
  };

  return (
    <>
      <div className="list-group list-group-flush p-5">
        {events.map((e) => {
          const createdDate = new Date(e.createdAt);

          const date = createdDate.toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          });

          const time = createdDate.toLocaleTimeString("en-IN", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          });

          const location = [
            e.location?.city,
            e.location?.state,
            e.location?.country,
          ]
            .filter(Boolean)
            .join(", ");

          return (
            <div
              key={e.id}
              className="shadow-sm p-3 mb-5 bg-body-tertiary rounded"
              onClick={() => handleClick(e)}
            >
              <div className="d-flex justify-content-between align-items-start">
                <div className="d-flex gap-4">
                  {/* IMAGE */}
                  <img
                    src={
                      e.bannerImages?.[0] ||
                      "https://cloudinary-marketing-res.cloudinary.com/images/w_1000,c_scale/v1679921049/Image_URL_header/Image_URL_header-png?_i=AA"
                    }
                    alt={e.title}
                    style={{ width: 248, height: 132, objectFit: "cover" }}
                    className="rounded"
                  />

                  {/* DETAILS */}
                  <div>
                    <h6
                      className="fw-semibold text-uppercase mb-1"
                      title={e.title}
                    >
                      {e.title || "Untitled Event"}
                    </h6>
                    <div className="event-meta d-flex justify-content-between mt-3">
                      <div className="text-muted">
                        {DATEICON} {date}
                      </div>

                      <div className="text-muted">
                        {TIMEICON} {time}
                      </div>
                    </div>

                    <div
                      className={`event-list-status ${e.status?.toLowerCase()} mt-2`}
                    >
                      {e.status}
                    </div>
                    <div>
                      <div className="text-muted mt-1">
                        {LOCATION_ICON} {location || "Location not set"}
                      </div>
                    </div>
                  </div>
                </div>

                {/* ACTION */}
                <button
                  className="btn btn-outline-danger btn-sm"
                  onClick={() => setDeleteId(e.id)}
                >
                  Delete
                </button>
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
