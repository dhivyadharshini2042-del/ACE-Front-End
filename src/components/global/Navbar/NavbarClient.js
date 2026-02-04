"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Navbar,
  Nav,
  Container,
  Button,
  Form,
  Dropdown,
} from "react-bootstrap";
import "./Navbar.css";

import { getAuthFromSession, isUserLoggedIn } from "../../../lib/auth";

export default function NavbarClient() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [initial, setInitial] = useState("U");

  useEffect(() => {
    const logged = isUserLoggedIn();
    setIsLoggedIn(logged);

    if (logged) {
      const session = getAuthFromSession();
      if (session?.email) {
        setInitial(session.email[0].toUpperCase());
      }
    }
  }, []);

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

              {/* SEARCH */}
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
              {/* NOTIFICATION */}
              {isLoggedIn && (
                <Dropdown align="end">
                  <Dropdown.Toggle as="div" className="icon-circle ">
                    🔔
                    {/* <span className="dot" /> */}
                  </Dropdown.Toggle>

                  <Dropdown.Menu className="notification-panel">
                    <div className="notification-header">
                      <h6>Notifications (45)</h6>
                      <span className="view-all">View All</span>
                    </div>

                    <div className="notification-list">
                      {[1, 2, 3, 4].map((i) => (
                        <div className="notification-item" key={i}>
                          <img
                            src="/images/user.png"
                            alt="user"
                            className="notif-avatar"
                          />

                          <div className="notif-text">
                            <strong>Event 'Hackathon X' Rejected</strong>
                            <p>Reason: Description missing objectives.</p>
                          </div>

                          <span className="notif-time">14h</span>
                        </div>
                      ))}
                    </div>
                  </Dropdown.Menu>
                </Dropdown>
              )}

              {/* PROFILE */}
              {isLoggedIn && (
                <img
                  src="/images/user.png"
                  className="profile-img"
                  alt="profile"
                  onClick={() => router.push("/dashboard")}
                />
              )}
            </div>
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
