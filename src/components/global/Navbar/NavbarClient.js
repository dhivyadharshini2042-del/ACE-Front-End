"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Navbar, Nav, Container, Dropdown } from "react-bootstrap";
import "./Navbar.css";
import { SEARCH_ICON } from "../../../const-value/config-icons/page";

import { getAuthFromSession, isUserLoggedIn } from "../../../lib/auth";
import { getUserProfileApi } from "../../../lib/api/user.api";
import { getOrganizationProfileApi } from "../../../lib/api/organizer.api";
import { getNotificationsApi } from "../../../lib/api";
import Tooltip from "../../ui/Tooltip/Tooltip";
import { markAsOneReadApi } from "../../../lib/api";
import { markAsAllReadApi } from "../../../lib/api";

export default function NavbarClient() {
  const router = useRouter();

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [auth, setAuth] = useState(null);
  const [initial, setInitial] = useState("U");
  const [profileImage, setProfileImage] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [displayName, setDisplayName] = useState("");
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const handler = (event) => {
      const payload = event.detail;

      const newNotification = {
        identity: crypto.randomUUID(),
        title: payload.notification?.title,
        body: payload.notification?.body,
        imageUrl: payload.notification?.image,
        actionUrl: payload.data?.actionUrl,
        isRead: false,
        createdAt: new Date().toISOString(),
      };

      setNotifications((prev) => [newNotification, ...prev]);
      setUnreadCount((prev) => prev + 1);
    };

    window.addEventListener("ace-notification", handler);
    return () => window.removeEventListener("ace-notification", handler);
  }, []);

  /* ================= SESSION INIT ================= */
  useEffect(() => {
    const logged = isUserLoggedIn();
    setIsLoggedIn(logged);

    if (logged) {
      const session = getAuthFromSession();
      setAuth(session);

      const email = session?.identity?.email || session?.identity?.domainEmail;

      if (email) {
        setInitial(email.charAt(0).toUpperCase());
      }
    }
  }, []);

  /* ================= LOAD PROFILE ================= */
  useEffect(() => {
    async function loadProfile() {
      if (!isLoggedIn || !auth?.identity || !auth?.type) return;

      try {
        let res;
        const identityId = auth.identity.identity;

        if (auth.type === "org") {
          res = await getOrganizationProfileApi(identityId);
        } else {
          res = await getUserProfileApi(identityId);
        }

        if (res?.status && res.data) {
          const image =
            res.data.profileImage ||
            res.data.logo ||
            res.data.bannerImages?.[0] ||
            null;

          if (image) setProfileImage(image);

          const name =
            res.data.organizationName ||
            res.data.fullName ||
            res.data.name ||
            "";

          setDisplayName(name);
        }
      } catch {
        // silent
      }
    }

    loadProfile();
  }, [isLoggedIn, auth]);

  /* ================= LOAD NOTIFICATIONS ================= */
  useEffect(() => {
    async function loadNotifications() {
      if (!isLoggedIn) return;

      try {
        const res = await getNotificationsApi(1, 20);

        if (res?.status) {
          setNotifications(res.data || []);
          setUnreadCount(res.unreadCount || 0);
        }
      } catch {
        console.log("Notification load failed");
      }
    }

    loadNotifications();
  }, [isLoggedIn]);

  const handleNotificationClick = async (notification) => {
    try {
      // 🔹 1. Mark as read (if needed)
      if (!notification.isRead) {
        await markAsOneReadApi(notification.identity);

        setNotifications((prev) =>
          prev.map((n) =>
            n.identity === notification.identity ? { ...n, isRead: true } : n,
          ),
        );

        setUnreadCount((prev) => (prev > 0 ? prev - 1 : 0));
      }

      // 🔹 2. Safe Redirect Logic
      if (notification.actionUrl) {
        let path = notification.actionUrl;

        // If full URL → extract only pathname
        if (path.startsWith("http")) {
          try {
            const parsed = new URL(path);
            path = parsed.pathname;
          } catch {
            console.log("Invalid URL format");
          }
        }

        // Small timeout to avoid dropdown conflict
        setTimeout(() => {
          router.push(path);
        }, 100);
      }
    } catch (err) {
      console.log("Notification click failed", err);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await markAsAllReadApi();

      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));

      setUnreadCount(0);
    } catch (err) {
      console.log("Mark all read failed");
    }
  };

  console.log("notifications");

  return (
    <Navbar expand="lg" sticky="top" className="ace-navbar">
      <Container fluid className="nav-wrapper">
        {/* LEFT - BRAND */}
        <Navbar.Brand onClick={() => router.push("/")} className="logo-pointer">
          <img src="/images/logo.png" height="38" alt="ACE" />
        </Navbar.Brand>

        {/* TOGGLE BUTTON */}
        <Navbar.Toggle aria-controls="ace-navbar-nav" />

        {/* COLLAPSIBLE CONTENT */}
        <Navbar.Collapse id="ace-navbar-nav">
          {/* CENTER */}
          <Nav className="nav-links align-items-lg-center">
            <Nav.Link onClick={() => router.push("/events")}>Events</Nav.Link>

            <Nav.Link onClick={() => router.push("/leaderboard")}>
              Organizations
            </Nav.Link>
          </Nav>
          {/* CENTER SIDE */}

          {/* SEARCH */}
          <div className="search-box ms-lg-3 my-3 my-lg-0 d-none d-lg-flex">
            <span className="search-icon">{SEARCH_ICON}</span>
            <input type="text" placeholder="Search events..." />
          </div>

          {!isLoggedIn && (
            <button
              className="btn-primary non-pill ms-lg-3 mt-3 mt-lg-0"
              onClick={() => router.push("/auth/organization/login")}
            >
              Create Event
            </button>
          )}

          {isLoggedIn && auth?.type === "org" && (
            <button
              className="btn-primary ms-lg-3 mt-3 mt-lg-0"
              onClick={() => router.push("/dashboard/space/create")}
            >
              Create Event
            </button>
          )}

          {!isLoggedIn && (
            <button
              className="btn-primary ms-lg-2 mt-3 mt-lg-0"
              onClick={() => router.push("/auth/user/login")}
            >
              Sign In
            </button>
          )}

          {/* RIGHT SIDE */}
          <div className="d-flex align-items-center gap-3 mt-3 mt-lg-0">
            {isLoggedIn && (
              <Dropdown align="end">
                <Dropdown.Toggle as="div" className="icon-circle">
                  🔔
                  {unreadCount > 0 && (
                    <span className="notif-badge">
                      {unreadCount > 99 ? "99+" : unreadCount}
                    </span>
                  )}
                </Dropdown.Toggle>

                <Dropdown.Menu className="notification-panel">
                  {/* Your same notification code here */}
                </Dropdown.Menu>
              </Dropdown>
            )}

            {isLoggedIn && (
              <Tooltip text={displayName || "My Profile"} position="bottom">
                {profileImage ? (
                  <img
                    src={profileImage}
                    className="profile-img"
                    alt="profile"
                    onClick={() => router.push("/dashboard")}
                    onError={() => setProfileImage(null)}
                  />
                ) : (
                  <div
                    className="profile-img letter-avatar"
                    onClick={() => router.push("/dashboard")}
                  >
                    {initial}
                  </div>
                )}
              </Tooltip>
            )}
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
