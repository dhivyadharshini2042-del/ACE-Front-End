"use client";

import { useEffect, useState } from "react";
import { getOrgCategoriesApi } from "../../../../../lib/api/event.api";
import styles from "./OrganizerDetails.module.css";

export default function OrganizerDetails({
  data,
  resetSignal,
  setData,
  onNext,
}) {
  const [orgCategories, setOrgCategories] = useState([]);

  const organizations = data.organizations || [
    {
      hostBy: "",
      orgName: "",
      location: "",
      department: "",
    },
  ];

  const contacts = data.contacts || [
    { name: "", number: "", email: "" },
  ];

  /* ================= FETCH ORG CATEGORIES ================= */
  useEffect(() => {
    async function loadCategories() {
      try {
        const res = await getOrgCategoriesApi();
        if (res?.status) {
          setOrgCategories(res.data);
        }
      } catch (err) {
        console.error("Org category fetch failed", err);
      }
    }
    loadCategories();
  }, []);

  /* ================= ORGANIZATION ================= */
  const addOrganization = () => {
    if (organizations.length >= 3) return;

    setData({
      ...data,
      organizations: [
        ...organizations,
        {
          hostBy: "",
          orgName: "",
          location: "",
          department: "",
        },
      ],
    });
  };

  const updateOrg = (index, key, value) => {
    const updated = [...organizations];
    updated[index][key] = value;

    if (key === "hostBy" && !showDepartment(value)) {
      updated[index].department = "";
    }

    setData({ ...data, organizations: updated });
  };

  const deleteOrganization = (index) => {
    setData({
      ...data,
      organizations: organizations.filter((_, i) => i !== index),
    });
  };

  const showDepartment = (hostBy) => {
    const selected = orgCategories.find((c) => c.identity === hostBy);
    if (!selected) return false;

    return (
      selected.categoryName === "College / University" ||
      selected.categoryName === "Training & Coaching Institute"
    );
  };

  /* ================= CONTACT ================= */
  const addContact = () => {
    setData({
      ...data,
      contacts: [...contacts, { name: "", number: "", email: "" }],
    });
  };

  const updateContact = (index, key, value) => {
    const updated = [...contacts];
    updated[index][key] = value;
    setData({ ...data, contacts: updated });
  };

  const deleteContact = (index) => {
    setData({
      ...data,
      contacts: contacts.filter((_, i) => i !== index),
    });
  };

  /* ================= RESET ================= */
  useEffect(() => {
    if (!resetSignal) return;

    setData({
      organizations: [
        {
          hostBy: "",
          orgName: "",
          location: "",
          department: "",
        },
      ],
      contacts: [{ name: "", number: "", email: "" }],
    });
  }, [resetSignal]);

  return (
    <>
      {/* ================= ORGANIZATION ================= */}
      <div className={styles.card}>
        <h3 className={styles.cardTitle}>Hosting Information</h3>

        {organizations.map((org, index) => (
          <div key={index} className={styles.orgBlock}>
            <div className={styles.orgHeader}>
              <span>Organization {index + 1}</span>
              {index !== 0 && (
                <button
                  className={styles.deleteBtn}
                  onClick={() => deleteOrganization(index)}
                >
                  Delete
                </button>
              )}
            </div>

            <div className={styles.field}>
              <label>Event Host By <span>*</span></label>
              <select
                className={styles.input}
                value={org.hostBy}
                onChange={(e) =>
                  updateOrg(index, "hostBy", e.target.value)
                }
              >
                <option value="">Select Category</option>
                {orgCategories.map((cat) => (
                  <option key={cat.identity} value={cat.identity}>
                    {cat.categoryName}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.grid2}>
              <div className={styles.field}>
                <label>Organization Name <span>*</span></label>
                <input
                  className={styles.input}
                  value={org.orgName}
                  onChange={(e) =>
                    updateOrg(index, "orgName", e.target.value)
                  }
                />
              </div>

              <div className={styles.field}>
                <label>Location <span>*</span></label>
                <input
                  className={styles.input}
                  value={org.location}
                  onChange={(e) =>
                    updateOrg(index, "location", e.target.value)
                  }
                />
              </div>
            </div>

            {showDepartment(org.hostBy) && (
              <div className={styles.field}>
                <label>Department <span>*</span></label>
                <select
                  className={styles.input}
                  value={org.department}
                  onChange={(e) =>
                    updateOrg(index, "department", e.target.value)
                  }
                >
                  <option value="">Select Department</option>
                  <option value="CSE">CSE</option>
                  <option value="ECE">ECE</option>
                  <option value="IT">IT</option>
                </select>
              </div>
            )}
          </div>
        ))}

        <div className={styles.addWrap}>
          <button className={styles.addBtn} onClick={addOrganization}>
            + Add Collaborators
          </button>
        </div>
      </div>

      {/* ================= CONTACT DETAILS ================= */}
      <div className={styles.card}>
        <h3 className={styles.cardTitle}>Contact Details</h3>

        {contacts.map((contact, index) => (
          <div key={index} className={styles.orgBlock}>
            <div className={styles.orgHeader}>
              <span>Contact {index + 1}</span>
              {index !== 0 && (
                <button
                  className={styles.deleteBtn}
                  onClick={() => deleteContact(index)}
                >
                  Delete
                </button>
              )}
            </div>

            <div className={styles.grid2}>
              <div className={styles.field}>
                <label>Name <span>*</span></label>
                <input
                  className={styles.input}
                  value={contact.name}
                  onChange={(e) =>
                    updateContact(index, "name", e.target.value)
                  }
                />
              </div>

              <div className={styles.field}>
                <label>Phone Number <span>*</span></label>
                <input
                  className={styles.input}
                  maxLength={10}
                  value={contact.number}
                  onChange={(e) =>
                    updateContact(
                      index,
                      "number",
                      e.target.value.replace(/\D/g, "")
                    )
                  }
                />
              </div>
            </div>

            <div className={styles.field}>
              <label>Email <span>*</span></label>
              <input
                type="email"
                className={styles.input}
                value={contact.email}
                onChange={(e) =>
                  updateContact(index, "email", e.target.value)
                }
              />
            </div>
          </div>
        ))}

        <div className={styles.addWrap}>
          <button className={styles.addBtn} onClick={addContact}>
            + Add Contact
          </button>
        </div>
      </div>

      <div className={styles.actionEnd}>
        <button className={styles.nextBtn} onClick={onNext}>
          Next
        </button>
      </div>
    </>
  );
}