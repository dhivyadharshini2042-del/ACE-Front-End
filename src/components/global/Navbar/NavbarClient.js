"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Navbar, Nav, Container, Dropdown } from "react-bootstrap";
import "./Navbar.css";
import { SEARCH_ICON } from "../../../const-value/config-icons/page";

import { getAuthFromSession, isUserLoggedIn } from "../../../lib/auth";
import { getUserProfileApi } from "../../../lib/api/user.api";
import { getOrganizationProfileApi } from "../../../lib/api/organizer.api";
import Tooltip from "../../ui/Tooltip/Tooltip";

export default function NavbarClient() {
  const router = useRouter();

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [auth, setAuth] = useState(null);
  const [initial, setInitial] = useState("U");
  const [profileImage, setProfileImage] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [displayName, setDisplayName] = useState("");

  useEffect(() => {
    const handler = (event) => {
      const payload = event.detail;

      const newNotification = {
        title: payload.notification?.title,
        body: payload.notification?.body,
        time: new Date().toLocaleTimeString(),
      };

      setNotifications((prev) => [newNotification, ...prev]);
    };

    window.addEventListener("ace-notification", handler);

    return () => {
      window.removeEventListener("ace-notification", handler);
    };
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

  /* ================= LOAD PROFILE IMAGE ================= */
  useEffect(() => {
    async function loadProfile() {
      if (!isLoggedIn || !auth?.identity || !auth?.type) return;

      try {
        let res;
        const identityId = auth.identity.identity;

        if (auth.type === "org") {
          res = await getOrganizationProfileApi(identityId);
          console.log("==========res org", res);
        } else {
          res = await getUserProfileApi(identityId);
          console.log("==========res", res);
        }

        if (res?.status && res.data) {
          const image =
            res.data.profileImage ||
            res.data.logo ||
            res.data.bannerImages?.[0] ||
            null;

          if (image) {
            setProfileImage(image);
          }
          
          const name =
            res.data.organizationName ||
            res.data.fullName ||
            res.data.name ||
            "";

          setDisplayName(name);
        }
      } catch {
        // silent fail
      }
    }

    loadProfile();
  }, [isLoggedIn, auth]);

  return (
    <Navbar expand="md" sticky="top" className="ace-navbar">
      <Container fluid className="nav-wrapper">
        {/* LOGO */}
        <Navbar.Brand onClick={() => router.push("/")} className="logo-pointer">
          <img src="/images/logo.png" height="38" alt="ACE" />
        </Navbar.Brand>

        <Navbar.Toggle />
        <Navbar.Collapse>
          <div className="nav-content">
            {/* CENTER */}
            <div className="nav-center">
              <Nav className="gap-5">
                <Nav.Link onClick={() => router.push("/events")}>
                  All Events
                </Nav.Link>
                <Nav.Link onClick={() => router.push("/leaderboard")}>
                  Top Organizations
                </Nav.Link>
              </Nav>

              <div className="search-box">
                <span className="search-icon">{SEARCH_ICON}</span>
                <input type="text" placeholder="Search anything" />
                <span className="search-icon">X</span>
              </div>

              {/* {isLoggedIn && (
                <button className="icon-circle outline">📍</button>
              )} */}

              {/* ---------- CREATE EVENT LOGIC FIX ---------- */}
              {!isLoggedIn && (
                <button
                  className="btn-primary non-pill"
                  onClick={() => router.push("/auth/organization/login")}
                >
                  Create Event
                </button>
              )}

              {isLoggedIn && auth?.type === "org" && (
                <button
                  className="btn-primary pill"
                  onClick={() => router.push("/dashboard/space/create")}
                >
                  Create Event
                </button>
              )}

              {!isLoggedIn && (
                <button
                  className="btn-primary pill"
                  onClick={() => router.push("/auth/user/login")}
                >
                  Sign In
                </button>
              )}
            </div>

            {/* RIGHT */}
            <div className="nav-right">
              {isLoggedIn && (
                <Dropdown align="end">
                  <Dropdown.Toggle as="div" className="icon-circle">
                    🔔
                  </Dropdown.Toggle>

                  <Dropdown.Menu className="notification-panel">
                    <div className="notification-header">
                      <h6>Notifications</h6>
                      <span
                        className="view-all"
                        onClick={() =>
                          router.push("/dashboard/settings/notification")
                        }
                      >
                        View All
                      </span>
                    </div>

                    {notifications.length === 0 ? (
                      <div className="notification-empty">No notifications</div>
                    ) : (
                      notifications.slice(0, 5).map((n, i) => (
                        <div key={i} className="notification-item">
                          <strong>{n.title}</strong>
                          <p>{n.body}</p>
                          <small>{n.time}</small>
                        </div>
                      ))
                    )}
                  </Dropdown.Menu>
                </Dropdown>
              )}

              {/* PROFILE IMAGE / LETTER */}
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
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
