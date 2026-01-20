"use client";

import { useEffect, useState } from "react";
import { ORG_EDITE_ICON } from "../../../../const-value/config-icons/page";
import { getUserData } from "../../../../lib/auth";

export default function EditOverlay({ onEdit, eventOrgIdentity }) {
  const [mounted, setMounted] = useState(false);
  const [userData, setUserData] = useState(null);

  // CLIENT ONLY
  useEffect(() => {
    setMounted(true);
    const data = getUserData();
    setUserData(data);
  }, []);

  // IMPORTANT: server + first client render SAME
  if (!mounted) return null;

  // user type na edit venda
  if (!userData || userData.type === "user") return null;

  // identity match aagala na edit venda
  if (userData.identity !== eventOrgIdentity) return null;

  return (
    <div className="edit-overlay">
      <div
        className="edit-section"
        onClick={(e) => {
          e.stopPropagation();
          onEdit();
        }}
      >
        <span>Edit</span>
        <span>{ORG_EDITE_ICON}</span>
      </div>
    </div>
  );
}
