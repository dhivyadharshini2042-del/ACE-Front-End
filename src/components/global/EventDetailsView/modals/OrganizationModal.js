"use client";
import { useState } from "react";
import "./OrganizationModal.css";

export default function OrganizationModal({ orgs = [], onClose, onSave }) {

  // editable local state
  const [editableOrgs, setEditableOrgs] = useState(
    orgs.map((org) => ({
      ...org,
      member: { ...org.member },
    }))
  );

  // update handler
  const updateField = (index, key, value) => {
    const updated = [...editableOrgs];
    updated[index].member[key] = value;
    setEditableOrgs(updated);
  };

  const handleSave = () => {
    const payload = {
      collaborators: editableOrgs.map((org) => ({
        collaboratorMemberId: org.member.identity,
        organizerName: org.member.organizerName,
        organizerNumber: org.member.organizerNumber,
      })),
    };

    onSave(payload);
  };

  return (
    <div className="child-overlay" onClick={onClose}>
      <div className="child-modal" onClick={(e) => e.stopPropagation()}>

        {/* HEADER */}
        <div className="modal-header">
          <button className="back-btn" onClick={onClose}>←</button>
          <h3>Organization Details</h3>
        </div>

        {/* BODY */}
        {editableOrgs.map((org, index) => (
          <div key={index} className="org-section">
            <h4>Organization {index + 1}</h4>

            <div className="org-grid">

              {/* Organizer Name – EDITABLE */}
              <div>
                <label>Organizer Name </label>
                <input
                  value={org.member.organizerName || ""}
                  onChange={(e) =>
                    updateField(index, "organizerName", e.target.value)
                  }
                />
              </div>

              {/* Organizer Number – EDITABLE */}
              <div>
                <label>Organizer Number </label>
                <input
                  value={org.member.organizerNumber || ""}
                  onChange={(e) =>
                    updateField(index, "organizerNumber", e.target.value)
                  }
                />
              </div>

              {/* READ ONLY FIELDS */}
              <div>
                <label>Location</label>
                <input
                  value={org.member.location || ""}
                  readOnly
                  className="readonly-highlight"
                />
              </div>

              <div>
                <label>Event Host By</label>
                <input
                  value={org.member.hostCategoryName || ""}
                  readOnly
                  className="readonly-highlight"
                />
              </div>

              <div>
                <label>Organization Name</label>
                <input
                  value={org.member.organizationName || ""}
                  readOnly
                  className="readonly-highlight"
                />
              </div>

            </div>
          </div>
        ))}

        {/* FOOTER */}
        <div className="modal-footer">
          <button className="outline-btn" onClick={onClose}>Cancel</button>
          <button className="primary-btn" onClick={handleSave}>Save</button>
        </div>

      </div>
    </div>
  );
}
