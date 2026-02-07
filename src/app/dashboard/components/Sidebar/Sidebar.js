"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./Sidebar.module.css";

import { getOrganizationProfileApi } from "../../../../lib/api/organizer.api";
import { getUserProfileApi } from "../../../../lib/api/user.api";
import ConfirmModal from "../../../../components/ui/Modal/ConfirmModal";

// 🔐 SESSION AUTH
import {
  getAuthFromSession,
  isUserLoggedIn,
  clearAuthSession,
} from "../../../../lib/auth";

export default function Sidebar() {
  const pathname = usePathname();

  const [expanded, setExpanded] = useState(false);
  const [openMenu, setOpenMenu] = useState(null);

  const [profile, setProfile] = useState(null);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const [auth, setAuth] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  /* ================= ACTIVE HELPERS ================= */
  const isActive = (path) => pathname === path;
  const isActivePrefix = (path) => pathname.startsWith(path);

  /* ================= INIT AUTH ================= */
  useEffect(() => {
    const loggedIn = isUserLoggedIn();
    setIsLoggedIn(loggedIn);

    if (loggedIn) {
      setAuth(getAuthFromSession());
    }
  }, []);

  /* ================= LOAD PROFILE ================= */
  useEffect(() => {
    async function loadProfile() {
      if (!isLoggedIn || !auth?.identity || !auth?.type) return;

      try {
        let res;
        if (auth.type === "org") {
          res = await getOrganizationProfileApi(auth.identity.identity);
        } else {
          res = await getUserProfileApi(auth.identity.identity);
        }

        if (res?.status) {
          setProfile(res.data);
        }
      } catch (err) {
        console.error("Sidebar profile error:", err);
      }
    }

    loadProfile();
  }, [isLoggedIn, auth]);

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

  const confirmLogout = async () => {
    setShowLogoutConfirm(false);
    await clearAuthSession();
    window.location.href = "/";
  };

  const cancelLogout = () => {
    setShowLogoutConfirm(false);
  };

  const displayName =
    profile?.organizationName || profile?.name || "User";
  const displayEmail =
    profile?.domainEmail || profile?.email || "User";
  const firstLetter = displayName.charAt(0).toUpperCase();

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
      <div
        className={`${styles.menu} ${
          isActivePrefix("/dashboard/profile") ? styles.activeMenu : ""
        }`}
        onClick={() => toggleMenu("profile")}
      >
        <img src="/images/User.png" alt="profile" />
        {expanded && (
          <div className={styles.menuText}>
            Profile <Arrow open={openMenu === "profile"} />
          </div>
        )}
      </div>

      {expanded && openMenu === "profile" && (
        <div className={styles.dropdown}>
          <Link
            href="/dashboard/profile"
            className={isActive("/dashboard/profile") ? styles.activeLink : ""}
          >
            My Profile
          </Link>

          {auth?.type === "org" && (
            <Link
              href="/dashboard/profile/manage"
              className={
                isActive("/dashboard/profile/manage")
                  ? styles.activeLink
                  : ""
              }
            >
              Manage
            </Link>
          )}

          <Link
            href="/dashboard/profile/delete"
            className={
              isActive("/dashboard/profile/delete")
                ? styles.activeLink
                : ""
            }
          >
            Delete
          </Link>
        </div>
      )}

      {/* ACTIVITIES */}
      <div
        className={`${styles.menu} ${
          isActivePrefix("/dashboard/activities")
            ? styles.activeMenu
            : ""
        }`}
        onClick={() => toggleMenu("activities")}
      >
        <img src="/images/myactivityes.png" alt="activities" />
        {expanded && (
          <div className={styles.menuText}>
            Activities <Arrow open={openMenu === "activities"} />
          </div>
        )}
      </div>

      {expanded && openMenu === "activities" && (
        <div className={styles.dropdown}>
          <Link
            href="/dashboard/activities/saved"
            className={
              isActive("/dashboard/activities/saved")
                ? styles.activeLink
                : ""
            }
          >
            Saved
          </Link>

          {auth?.type === "org" && (
            <Link
              href="/dashboard/activities/bookings"
              style={{display:"none"}}
              className={
                isActive("/dashboard/activities/bookings")
                  ? styles.activeLink
                  : ""
              }
            >
              Bookings
            </Link>
          )}
        </div>
      )}

      {/* MY SPACE */}
      {auth?.type === "org" && (
        <>
          <div
            className={`${styles.menu} ${
              isActivePrefix("/dashboard/space")
                ? styles.activeMenu
                : ""
            }`}
            onClick={() => toggleMenu("space")}
          >
            <img src="/images/myspace.png" alt="space" />
            {expanded && (
              <div className={styles.menuText}>
                My Space <Arrow open={openMenu === "space"} />
              </div>
            )}
          </div>

          {expanded && openMenu === "space" && (
            <div className={styles.dropdown}>
              <Link
                href="/dashboard/space/create"
                className={
                  isActive("/dashboard/space/create")
                    ? styles.activeLink
                    : ""
                }
              >
                Create Event
              </Link>

              <Link
                href="/dashboard/space/overview-dashboard"
                className={
                  isActive("/dashboard/space/overview-dashboard")
                    ? styles.activeLink
                    : ""
                }
              >
                Event Analytics
              </Link>

              <Link
                href="/dashboard/space/my-events"
                className={
                  isActive("/dashboard/space/my-events")
                    ? styles.activeLink
                    : ""
                }
              >
                My Events
              </Link>
            </div>
          )}
        </>
      )}

      {/* SETTINGS */}
      <div
        className={`${styles.menu} ${
          isActivePrefix("/dashboard/settings")
            ? styles.activeMenu
            : ""
        }`}
        onClick={() => toggleMenu("settings")}
      >
        <img src="/images/Settings.png" alt="settings" />
        {expanded && (
          <div className={styles.menuText}>
            Settings <Arrow open={openMenu === "settings"} />
          </div>
        )}
      </div>

      {expanded && openMenu === "settings" && (
        <div className={styles.dropdown}>
          <Link
            href="/dashboard/settings/notification"
            className={
              isActive("/dashboard/settings/notification")
                ? styles.activeLink
                : ""
            }
          >
            Notification
          </Link>

          {auth?.type === "org" && (
            <Link
              href="/dashboard/settings/email"
              className={
                isActive("/dashboard/settings/email")
                  ? styles.activeLink
                  : ""
              }
            >
              Email
            </Link>
          )}
        </div>
      )}

      {/* BOTTOM PROFILE */}
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
          <div onClick={handleLogoutClick}>
            <div className={styles.profileText}>{displayName}</div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div className={styles.profileTextEmail}>
                {displayEmail}
              </div>
              <img
                src="/images/exit.png"
                alt="logout"
                className={styles.exitImage}
              />
            </div>
          </div>
        )}
      </div>

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
