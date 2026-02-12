"use client";

import { useEffect, useState } from "react";
import styles from "./StoryBehindFest.module.css";
import { getAllOrganizationsApi } from "../../../../lib/api/organizer.api";
import Tooltip from "../../../ui/Tooltip/Tooltip";

export default function StoryBehindFest() {
  const [organizations, setOrganizations] = useState([]);
  const [hoveredId, setHoveredId] = useState(null);

  useEffect(() => {
    fetchOrganizations();
  }, []);

  const fetchOrganizations = async () => {
    try {
      const res = await getAllOrganizationsApi();
      setOrganizations(res?.data || []);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <section className={styles.container}>
      <h2 className={styles.title}>
        <span className={styles.the}>The</span>
        <span className={styles.story}>Story</span>
        <span className={styles.behind}>Behind</span>
        <span className={styles.the}>the</span>
        <span className={styles.fest}>Fest</span>
      </h2>

      <div className={styles.circleWrapper}>
        {organizations?.slice(0, 8).map((org, index) => (
          <div
            key={org.id}
            className={`${styles.circle} ${styles[`pos${index}`]}`}
            onMouseEnter={() => setHoveredId(org.id)}
            onMouseLeave={() => setHoveredId(null)}
          >
            {org.profileImage ? (
              <img
                src={org.profileImage}
                alt={org.organizationName}
                className={styles.image}
              />
            ) : (
              <div className={styles.avatar}>
                {org.organizationName?.charAt(0).toUpperCase()}
              </div>
            )}

            {/* Hover Card */}
            {hoveredId === org.id && (
              <div className={styles.hoverCard}>
                <h4>{org.organizationName}</h4>
                <p>{org.eventCount || 0} Events</p>
              </div>
            )}
            <Tooltip text="Follow">
              <div className={styles.followBtn}>+</div>
            </Tooltip>
          </div>
        ))}
      </div>
    </section>
  );
}
