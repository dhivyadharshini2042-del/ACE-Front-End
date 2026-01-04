"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./Sidebar.module.css";
import { getUserData } from "../../../../lib/auth";

export default function Sidebar() {
  const pathname = usePathname();
  const [expanded, setExpanded] = useState(false);
  const [openMenu, setOpenMenu] = useState(null);
  const [role, setRole] = useState("user");

  useEffect(() => {
    const user = getUserData();
    if (user?.type === "org") setRole("org");
  }, []);

  const toggleMenu = (menu) => {
    setOpenMenu(openMenu === menu ? null : menu);
  };

  const Arrow = ({ open }) => (
    <span className={styles.arrow}>{open ? "▲" : "▼"}</span>
  );

  return (
    <aside
      className={`${styles.sidebar} ${expanded ? styles.expand : ""}`}
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => {
        setExpanded(false);
        setOpenMenu(null);
      }}
    >
      {/* PROFILE */}
      <div className={styles.menu} onClick={() => toggleMenu("profile")}>
        <img src="/images/User.png" alt="profile" />
        {expanded && (
          <div className={styles.menuText}>
            Profile <Arrow open={openMenu === "profile"} />
          </div>
        )}
      </div>

      {expanded && openMenu === "profile" && (
        <div className={styles.dropdown}>
          <Link href="/dashboard/profile">My Profile</Link>
          {role === "org" && (
            <Link href="/dashboard/profile/manage">Manage</Link>
          )}
          <Link href="/dashboard/profile/delete">Delete</Link>
        </div>
      )}

      {/* ACTIVITIES */}
      <div className={styles.menu} onClick={() => toggleMenu("activities")}>
        <img src="/images/myactivityes.png" alt="activities" />
        {expanded && (
          <div className={styles.menuText}>
            Activities <Arrow open={openMenu === "activities"} />
          </div>
        )}
      </div>

      {expanded && openMenu === "activities" && (
        <div className={styles.dropdown}>
          <Link href="/dashboard/activities/saved">Saved</Link>
          {role === "org" && (
            <Link href="/dashboard/activities/bookings">Bookings</Link>
          )}
        </div>
      )}

      {/* ORGANIZER SPACE */}
      {role === "org" && (
        <>
          <div className={styles.menu} onClick={() => toggleMenu("space")}>
            <img src="/images/myspace.png" alt="space" />
            {expanded && (
              <div className={styles.menuText}>
                My Space <Arrow open={openMenu === "space"} />
              </div>
            )}
          </div>

          {expanded && openMenu === "space" && (
            <div className={styles.dropdown}>
              <Link href="/dashboard/space/create">Create Event</Link>
              <Link href="/dashboard/space/dashboard-chart">Dashboard</Link>
              <Link href="/dashboard/space/my-events">My Events</Link>
            </div>
          )}
        </>
      )}

      {/* SETTINGS */}
      <div className={styles.menu} onClick={() => toggleMenu("settings")}>
        <img src="/images/Settings.png" alt="settings" />
        {expanded && (
          <div className={styles.menuText}>
            Settings <Arrow open={openMenu === "settings"} />
          </div>
        )}
      </div>

      {expanded && openMenu === "settings" && (
        <div className={styles.dropdown}>
          <Link href="/dashboard/settings/notification">Notification</Link>
          <Link href="/dashboard/settings/email">Email</Link>
        </div>
      )}
    </aside>
  );
}
