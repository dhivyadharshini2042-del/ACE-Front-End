"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./Sidebar.module.css";

import { getUserData } from "../../../../lib/auth";
import { getOrganizationProfileApi } from "../../../../lib/api/organizer.api";
import { getUserProfileApi } from "../../../../lib/api/user.api";
import ConfirmModal from "../../../../components/ui/Modal/ConfirmModal";
import { logoutOrganizer } from "../../../../lib/logout";

export default function Sidebar() {
  const pathname = usePathname();
  const [expanded, setExpanded] = useState(false);
  const [openMenu, setOpenMenu] = useState(null);
  const [role, setRole] = useState("user");

  // profile display-only data
  const [profile, setProfile] = useState(null);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  /* ================= FALLBACK LETTER ================= */
  const displayName = profile?.organizationName || profile?.name || "User";
  const displayEmail = profile?.domainEmail || profile?.email || "User";
  const firstLetter = displayName.charAt(0).toUpperCase();
  /* ================= LOAD USER + PROFILE ================= */

  useEffect(() => {
    async function loadProfile() {
      const user = getUserData();
      if (!user?.identity) return;

      if (user.type === "org") setRole("org");

      try {
        let res;
        if (user.type === "org") {
          res = await getOrganizationProfileApi(user.identity);
        } else {
          res = await getUserProfileApi(user.identity);
        }

        if (res?.status) {
          setProfile(res.data);
        }
      } catch (err) {
        console.error("Sidebar profile error:", err);
      }
    }

    loadProfile();
  }, []);

  const toggleMenu = (menu) => {
    setOpenMenu(openMenu === menu ? null : menu);
  };

  const Arrow = ({ open }) => (
    <span className={styles.arrow}>{open ? "▲" : "▼"}</span>
  );

  /* ================= LOGOUT ================= */
  const handleLogoutClick = () => {
    setShowLogoutConfirm(true);
  };

  const confirmLogout = () => {
    setShowLogoutConfirm(false);
    logoutOrganizer();
    window.location.href = "/";
  };

  const cancelLogout = () => {
    setShowLogoutConfirm(false);
  };

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

      {/* ================= ACTIVITIES ================= */}
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

      {/* ================= ORGANIZER SPACE ================= */}
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
              {role === "org" && (
                <Link href="/dashboard/space/overview-dashboard">
                  Event Analytics
                </Link>
              )}
              <Link href="/dashboard/space/my-events">My Events</Link>
            </div>
          )}
        </>
      )}

      {/* ================= SETTINGS ================= */}
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

          {role === "org" && (
            <Link href="/dashboard/settings/email">Email</Link>
          )}
        </div>
      )}

      {/* =================================================== */}
      {/* =============== BOTTOM PROFILE ==================== */}
      {/* DISPLAY ONLY – NO CLICK – NO EDIT */}
      {/* =================================================== */}

      <div className={styles.bottomProfile}>
        {profile?.profileImage ? (
          <img
            src={profile.profileImage}
            alt="profile"
            className={styles.profileImg}
          />
        ) : (
          <div className={styles.profileCircle}>{firstLetter}</div>
        )}

        {expanded && (
          <>
            <div onClick={handleLogoutClick}>
              <div className={styles.profileText}>{displayName}</div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div className={styles.profileTextEmail}>{displayEmail}</div>
                <img
                  src="/images/exit.png"
                  alt="logout"
                  className={styles.exitImage}
                />
              </div>
            </div>
          </>
        )}
      </div>
      {/* ================= LOGOUT CONFIRM MODAL ================= */}
      <ConfirmModal
        open={showLogoutConfirm}
        title="Confirm Logout"
        description="Are you sure you want to logout?"
        image="/images/logo.png"
        onCancel={cancelLogout}
        onConfirm={confirmLogout}
      />
    </aside>
  );
}
