"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import DeleteConfirmModal from "../../../../components/ui/DeleteConfirmModal/DeleteConfirmModal";
import EmptyState from "../../../../components/global/EmptyState/EmptyState";
import PaginationBar from "../../../events/components/PaginationBar";

import {
  DATEICON,
  LOCATION_ICON,
  TIMEICON,
} from "../../../../const-value/config-icons/page";

const PAGE_SIZE = 5; // list view – nice readable count

export default function MyEventsList({ events = [], loading }) {
  const [deleteId, setDeleteId] = useState(null);
  const [page, setPage] = useState(1);
  const router = useRouter();

  if (loading) {
    return <p className="text-center py-5">Loading events...</p>;
  }

  if (!events.length) {
    return (
      <EmptyState
        img="/images/no-data.png"
        title="No events created yet"
        subtitle="Create your first event to see it here"
      />
    );
  }

  /* ================= PAGINATION LOGIC ================= */
  const totalPages = Math.ceil(events.length / PAGE_SIZE);
  const startIndex = (page - 1) * PAGE_SIZE;
  const paginatedEvents = events.slice(startIndex, startIndex + PAGE_SIZE);

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
        {paginatedEvents.map((e) => {
          const calendar = e.calendars?.[0];
          const ticket = e.tickets?.[0];

          const dateRange =
            calendar?.startDate && calendar?.endDate
              ? `${calendar.startDate} - ${calendar.endDate}`
              : "Date not set";

          const timeRange =
            calendar?.startTime && calendar?.endTime
              ? `${calendar.startTime} - ${calendar.endTime}`
              : "Time not set";

          const locationText = e.location?.venue
            ? `${e.location.venue}, ${e.org?.city || ""}`
            : "Location not set";

          const priceText = ticket?.isPaid ? `₹${ticket?.price}` : "Free";

          return (
            <div
              key={e.identity}
              className="shadow-sm p-3 mb-4 bg-body-tertiary rounded event-list-card"
              onClick={() => handleClick(e)}
            >
              <div className="d-flex justify-content-between align-items-start">
                <div className="d-flex gap-4 w-100">
                  {/* IMAGE */}
                  <img
                    src={
                      e.bannerImages?.[0] ||
                      "https://cloudinary-marketing-res.cloudinary.com/images/w_1000,c_scale/v1679921049/Image_URL_header/Image_URL_header-png?_i=AA"
                    }
                    alt={e.title}
                    className="rounded event-list-img"
                  />

                  {/* DETAILS */}
                  <div className="flex-grow-1">
                    {/* TITLE */}
                    <h6 className="event-title" title={e.title}>
                      {e.title || "Untitled Event"}
                    </h6>

                    {/* LOCATION */}
                    <div className="event-location">
                      {LOCATION_ICON} {locationText} | Mode : {e.mode} | Event Category : {e.categoryName} | Event Type :   {e.eventTypeName}
                    </div>

                    {/* DATE + TIME */}
                    <div className="event-meta d-flex gap-4 mt-2">
                      <div className="text-muted">
                        {DATEICON} {dateRange}
                      </div>

                      <div className="text-muted">
                        {TIMEICON} {timeRange}
                      </div>
                    </div>

                    {/* PRICE + STATS */}
                    <div className="d-flex gap-4 mt-2 small">
                      <div className="fw-semibold text-success">
                        {priceText}
                      </div>
                    </div>

                    {/* STATUS */}
                    <div
                      className={`event-list-status ${e.status?.toLowerCase()} mt-2`}
                    >
                      {e.status}
                    </div>
                  </div>
                </div>

                {/* DELETE BUTTON */}
                <button
                  className="btn btn-outline-danger btn-sm"
                  onClick={(ev) => {
                    ev.stopPropagation();
                    setDeleteId(e.id);
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* ✅ PAGINATION */}
      {totalPages > 1 && (
        <PaginationBar page={page} total={totalPages} onChange={setPage} />
      )}

      <DeleteConfirmModal
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
      />
    </>
  );
}
