"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { getUserProfileApi } from "../../../lib/api/user.api";
import { getOrganizationProfileApi } from "../../../lib/api/organizer.api";

// 🔐 SESSION AUTH (NO REDUX)
import { getAuthFromSession, isUserLoggedIn } from "../../../lib/auth";

import "./Navbar.css";
import {
  EXPLORE_ICON,
  LOCATION_ICON,
} from "../../../const-value/config-icons/page";

export default function Navbar() {
  const router = useRouter();

  /* ================= SESSION AUTH STATE ================= */
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [auth, setAuth] = useState(null);

  const [mounted, setMounted] = useState(false);
  const [initial, setInitial] = useState("U");
  const [profileImage, setProfileImage] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  /* ================= INITIAL MOUNT ================= */
  useEffect(() => {
    setMounted(true);

    const loggedIn = isUserLoggedIn();
    setIsLoggedIn(loggedIn);

    if (loggedIn) {
      const sessionAuth = getAuthFromSession();
      setAuth(sessionAuth);

      if (sessionAuth?.email) {
        setInitial(sessionAuth.email.charAt(0).toUpperCase());
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
        // silent fail (navbar shouldn't break app)
      }
    }

    loadProfile();
  }, [isLoggedIn, auth]);

  if (!mounted) return null;

  /* ================= HANDLERS ================= */
  const handleCreateEventClick = () => {
    // not logged in
    if (!isLoggedIn) {
      router.push("/auth/organization/login");
      return;
    }

    // logged in but USER
    if (auth?.type === "user") {
      router.push("/auth/organization/login");
      return;
    }

    // logged in & ORGANIZER
    if (auth?.type === "org") {
      router.push("/dashboard/space/create");
      return;
    }

    // fallback
    router.push("/auth/organization/login");
  };

  const handleSignup = () => {
    setMenuOpen(false);
    router.push("/auth/user/login");
  };

  const handleProfileClick = () => {
    setMenuOpen(false);
    router.push("/dashboard");
  };

  /* ================= UI (UNCHANGED) ================= */
  return (
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

        <button className="nav-create" onClick={handleCreateEventClick}>
          + Create Event
        </button>

        {!isLoggedIn && (
          <button className="nav-sinup" onClick={handleSignup}>
            Sign In
          </button>
        )}
      </div>

      {/* RIGHT */}
      {isLoggedIn && (
        <div className={`nav-right ${menuOpen ? "open" : ""}`}>
          <button className="nav-avatar-btn" onClick={handleProfileClick}>
            {profileImage ? (
              <img
                src={profileImage}
                alt="profile"
                className="nav-profile-image"
                onError={() => setProfileImage(null)}
              />
            ) : (
              <div className="nav-letter-avatar">{initial}</div>
            )}
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
  );
}
