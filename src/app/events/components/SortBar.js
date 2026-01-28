"use client";

import { useEffect, useRef } from "react";
import {
  LOCATION_ICON,
  SEARCH_ICON,
} from "../../../const-value/config-icons/page";
import { FaThLarge, FaListUl } from "react-icons/fa";

export default function SortBar({ value, onChange, onSearch, autoFocus }) {
  const inputRef = useRef(null);

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);
  return (
    <div className="sort-bar">
      {/* SEARCH */}
      <div className="sort-search">
        <span className="icon">{SEARCH_ICON}</span>
        <input
          ref={inputRef}
          type="text"
          placeholder="Search anything..."
          onChange={(e) => onSearch(e.target.value)}
        />
      </div>

      {/* LOCATION */}
      {/* <div className="sort-location">
        <span className="icon">{LOCATION_ICON}</span>
        <input
          type="text"
          placeholder="Search anything..."
          onChange={(e) => onSearch(e.target.value)}
        />
      </div> */}

      {/* SORT */}
      <select
        className="sort-select"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="" disabled>
          Sort By Top Rated
        </option>
        <option value="MOST_VIEWED">Top Rated</option>
        <option value="MOST_VIEWED">Most Viewed</option>
        <option value="A_Z">Alphabetical (A–Z)</option>
        <option value="Z_A">Alphabetical (Z–A)</option>
        <option value="RECENT">Recent</option>
      </select>
    </div>
  );
}
