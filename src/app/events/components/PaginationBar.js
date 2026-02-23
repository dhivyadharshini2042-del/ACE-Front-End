"use client";
import "./PaginationBar.css";

export default function PaginationBar({ page, total, onChange }) {
  if (!total || total <= 1) return null;

  /* ================= BUILD PAGES (MAX 5 ITEMS) ================= */
  const getPages = () => {
    // If total pages <= 5 → show all
    if (total <= 5) {
      return Array.from({ length: total }, (_, i) => i + 1);
    }

    // Page near start
    if (page <= 3) {
      return [1, 2, 3, "...", total];
    }

    // Page near end
    if (page >= total - 2) {
      return [1, "...", total - 2, total - 1, total];
    }

    // Page in middle
    return ["...", page - 1, page, page + 1, "..."];
  };

  const pages = getPages().filter(Boolean);

  const handleChange = (p) => {
    if (p === "..." || p === page) return;

    onChange(p);

    // scroll to top
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div className="pagination-wrap">
      {/* PREV */}
      <button
        className="pg-btn"
        disabled={page === 1}
        onClick={() => handleChange(page - 1)}
      >
        ← Prev
      </button>

      {/* PAGES */}
      <div className="pg-pages">
        {pages.map((p, i) =>
          p === "..." ? (
            <span key={`dots-${i}`} className="pg-dots">
              ...
            </span>
          ) : (
            <button
              key={`page-${p}-${i}`} 
              className={`pg-page ${p === page ? "active" : ""}`}
              onClick={() => handleChange(p)}
            >
              {p}
            </button>
          )
        )}
      </div>

      {/* NEXT */}
      <button
        className="pg-btn"
        disabled={page === total}
        onClick={() => handleChange(page + 1)}
      >
        Next →
      </button>
    </div>
  );
}