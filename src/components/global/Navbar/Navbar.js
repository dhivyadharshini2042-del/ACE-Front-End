"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { getUserData } from "../../../lib/auth";
import { logoutOrganizer } from "../../../lib/logout";
import { LABEL_LOGOUT } from "../../../const-value/config-message/page";

import "./Navbar.css";
import { EXPLORE_ICON, LOCATION_ICON } from "../../../const-value/config-icons/page";
import ConfirmModal from "../../ui/Modal/ConfirmModal";

export default function Navbar() {
  const router = useRouter();

  const [mounted, setMounted] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [initial, setInitial] = useState("U");
  const [menuOpen, setMenuOpen] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  useEffect(() => {
    setMounted(true);

    const userData = getUserData();
    if (userData?.email) {
      setIsLoggedIn(true);
      setUserEmail(userData.email);
      setInitial(userData.email.charAt(0).toUpperCase());
    }
  }, []);

  if (!mounted) return null;

  const handleSignup = () => {
    setMenuOpen(false);
    router.push("/auth/user/login");
  };

  const handleProfileClick = () => {
    setMenuOpen(false);
    router.push("/dashboard");
  };

  return (
    <>
      <nav className="nav-container">
        {/* LEFT */}
        <div className="nav-left">
          <img
            src="/images/logo.png"
            alt="logo"
            className="nav-logo"
            onClick={() => router.push("/")}
          />
          <button className="nav-explore">Explore {EXPLORE_ICON}</button>
        </div>

        {/* CENTER */}
        <div className="nav-center">
          <div className="nav-search-box">
            <input
              type="text"
              placeholder="Search anything"
              className="search-input"
            />
          </div>

          <button className="nav-location-btn">{LOCATION_ICON}</button>

          {!isLoggedIn && (
            <>
              <button className="nav-create" onClick={handleSignup}>
                Sign In
              </button>
            </>
          )}
        </div>

        {/* RIGHT */}
        {isLoggedIn && (
          <div className={`nav-right ${menuOpen ? "open" : ""}`}>
            {/* <button onClick={handleLogoutClick} className="logout-btn">
              {LABEL_LOGOUT}
            </button> */}

            <button className="nav-avatar-btn" onClick={handleProfileClick}>
              <div className="nav-letter-avatar">{initial}</div>
            </button>
          </div>
        )}

        {/* HAMBURGER */}
        <button
          className={`nav-hamburger ${menuOpen ? "is-open" : ""}`}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </button>
      </nav>
    </>
  );
}
