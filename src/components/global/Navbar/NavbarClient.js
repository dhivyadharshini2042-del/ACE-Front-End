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

import { getAuthFromSession, isUserLoggedIn } from "../../../lib/auth";
import "./Navbar.css";

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
      <Container fluid>
        {/* LEFT */}
        <Navbar.Brand onClick={() => router.push("/")}>
          <img src="/images/logo.png" height="36" alt="logo" />
        </Navbar.Brand>

        {/* TOGGLER */}
        <Navbar.Toggle aria-controls="main-navbar" />

        {/* COLLAPSE */}
        <Navbar.Collapse id="main-navbar">
          {/* CENTER */}
          <Nav className="mx-auto nav-end">
            <Nav.Link onClick={() => router.push("/events")}>
              All Events
            </Nav.Link>

            <Nav.Link onClick={() => router.push("/leaderboard")}>
              Top Organizers
            </Nav.Link>

            {/* Search – desktop only */}
            <Form className="d-none d-lg-block">
              <Form.Control
                className="search-input"
                placeholder="Search anything"
              />
            </Form>
          </Nav>

          {/* RIGHT */}
          <Nav className="nav-right">
            {!isLoggedIn && (
              <Button
                className="btn-primary-pill"
                onClick={() => router.push("/auth/user/login")}
              >
                Sign In
              </Button>
            )}

            {isLoggedIn && (
              <>
                <Button
                  className="btn-primary-pill"
                  onClick={() => router.push("/dashboard/space/create")}
                >
                  Create Event +
                </Button>

                {/* Notification */}
                <Dropdown align="end">
                  <Dropdown.Toggle className="icon-btn">
                    🔔 <span className="dot" />
                  </Dropdown.Toggle>

                  <Dropdown.Menu className="notification-dropdown">
                    <h6 className="px-3 mb-2">Notifications</h6>

                    {[1, 2, 3].map((i) => (
                      <Dropdown.Item key={i} className="notif-item">
                        <img src="/images/user.png" alt="user" />
                        <div>
                          <strong>Event Rejected</strong>
                          <p>Missing description</p>
                        </div>
                      </Dropdown.Item>
                    ))}
                  </Dropdown.Menu>
                </Dropdown>

                {/* Profile */}
                <div
                  className="profile-avatar"
                  onClick={() => router.push("/dashboard")}
                >
                  {initial}
                </div>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}