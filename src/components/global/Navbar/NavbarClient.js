"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Navbar,
  Nav,
  Container,
  Dropdown,
} from "react-bootstrap";
import "./Navbar.css";

import { getAuthFromSession, isUserLoggedIn } from "../../../lib/auth";
import { getUserProfileApi } from "../../../lib/api/user.api";
import { getOrganizationProfileApi } from "../../../lib/api/organizer.api";

export default function NavbarClient() {
  const router = useRouter();

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [auth, setAuth] = useState(null);
  const [initial, setInitial] = useState("U");
  const [profileImage, setProfileImage] = useState(null);

  /* ================= SESSION INIT ================= */
  useEffect(() => {
    const logged = isUserLoggedIn();
    setIsLoggedIn(logged);

    if (logged) {
      const session = getAuthFromSession();
      setAuth(session);

      if (session?.email) {
        setInitial(session.email.charAt(0).toUpperCase());
      }
    }
  }, []);

  /* ================= LOAD PROFILE IMAGE ================= */
  useEffect(() => {
    async function loadProfile() {
      if (!isLoggedIn || !auth?.identity || !auth?.type) return;

      try {
        let res;

        if (auth.type === "org") {
          res = await getOrganizationProfileApi(auth.identity);
        } else {
          res = await getUserProfileApi(auth.identity);
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
        }
      } catch {
        // silent fail – navbar should not break
      }
    }

    loadProfile();
  }, [isLoggedIn, auth]);

  return (
    <Navbar expand="lg" sticky="top" className="ace-navbar">
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
                <input type="text" placeholder="Search anything" />
                <span className="search-icon">🔍</span>
              </div>

              {isLoggedIn && (
                <button className="icon-circle outline">📍</button>
              )}

              {!isLoggedIn ? (
                <>
                  <button
                    className="btn-primary non-pill"
                    onClick={() => router.push("/dashboard/space/create")}
                  >
                    Create Event
                  </button>
                  <button
                    className="btn-primary pill"
                    onClick={() => router.push("/auth/user/login")}
                  >
                    Sign In
                  </button>
                </>
              ) : (
                <button
                  className="btn-primary pill"
                  onClick={() => router.push("/dashboard/space/create")}
                >
                  Create Event
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
                      <span className="view-all">View All</span>
                    </div>
                  </Dropdown.Menu>
                </Dropdown>
              )}

              {/* PROFILE IMAGE / LETTER */}
              {isLoggedIn && (
                profileImage ? (
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
                )
              )}
            </div>
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
