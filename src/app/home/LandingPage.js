"use client";

import { useEffect, useRef, useState } from "react";
import "./landing.css";

// ICONS
import {
  DATEICON,
  HOME_PAGE_DATE_ICON,
  HOME_PAGE_LOCATION_ICON,
  WHATICON,
} from "../../const-value/config-icons/page.js";

import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

// API
import {
  getAllEventsApi,
  getExploreEventTypes,
} from "../../lib/api/event.api.js";
import { getAllOrganizationsApi } from "../../lib/api/organizer.api.js";

// COMPONENTS
import ChooseEventCategory from "../../components/global/ChooseEventCategory/ChooseEventCategory";
import EventSearchBar from "../../components/global/EventSearchBar/EventSearchBar";
import EventSlider from "../../components/global/EventSlider/EventSlider";
import Footer from "../../components/global/Footer/Footer";
import HeroBanner from "../../components/global/HeroBanner/HeroBanner.js";
import HeroBannerCarousel from "../../components/global/HeroBannerCarousel/HeroBannerCarousel";
import SpotlightCarousel from "../../components/global/SpotlightCarousel/SpotlightCarousel";
import LocationHighlights from "../../components/global/LocationHighlights/LocationHighlights";
import OrganizersCarousel from "../../components/global/OrganizerCarousel/OrganizerCarousel.js";
import FloatingExploreButton from "../../components/global/FloatingExploreButton/FloatingExploreButton.js";

import { useLoading } from "../../context/LoadingContext.js";

export default function LandingPage() {
  const { setLoading } = useLoading();

  const [events, setEvents] = useState([]);
  const [organization, setOrganization] = useState([]);
  const [categories, setCategories] = useState([]);

  const exploreRef = useRef(null);
  const router = useRouter();

  const apiText = "What Event would you like to go to?";

  const posters = [
    "/images/bannerImageThree.png",
    "/images/bannerImageFour.png",
    "/images/bannerImageTwo.png",
    "/images/bannerImageOne.png",
    "/images/bannerImageFive.png",
    "/images/bannerImageSix.png",
    "/images/bannerImageSev.png",
  ];

  const CATEGORIES = [
    {
      name: "Conferences",
      img: "/images/Conferences.png",
      class: "conference",
    },
    { name: "Hackathon", img: "/images/Hackathon.png", class: "hackathon" },
    { name: "Webinars", img: "/images/Webinars.png", class: "webinar" },
    { name: "Athletics", img: "/images/Athletics.png", class: "athletics" },
    { name: "Concerts", img: "/images/concert.png", class: "concerts" },
    {
      name: "Tournaments",
      img: "/images/Tournaments.png",
      class: "tournaments",
    },
    { name: "Job Fairs", img: "/images/JobFairs.png", class: "jobfairs" },
    { name: "Explore more", img: "/images/Explore.png", class: "explore" },
  ];

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const res = await getExploreEventTypes();
console.log("34567",res)
        if (res?.status && Array.isArray(res.data)) {
          const apiCategories = res.data.slice(0, 7).map((item) => ({
            name: item.name,
            color: item.color,
            identity: item.identity,
            imageUrl: item.imageUrl || "/images/default.png",
            class: item.slug || item.name.toLowerCase(),
          }));

          const exploreMore = {
            name: "Explore more",
            imageUrl: "/images/Explore.png",
            class: "explore",
          };

          setCategories([...apiCategories, exploreMore]);
        }
      } catch (err) {
        console.error("Category load failed", err);
      }
    };

    loadCategories();
  }, []);

  /* ================= LOAD DATA ================= */
  const loadLandingData = async () => {
    try {
      setLoading(true);

      const [eventsRes, orgRes] = await Promise.all([
        getAllEventsApi(),
        getAllOrganizationsApi(),
      ]);

      if (eventsRes?.status) {
        setEvents(eventsRes.data);
      }

      if (orgRes?.status) {
        setOrganization(orgRes.data);
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLandingData();
  }, []);

  console.log("jkjkjkjkjkjkjk",categories)

  /* ================= UI ================= */
  return (
    <div className="dashboard-root">
      <main className="dash-hero" ref={exploreRef}>
        <HeroBanner text={apiText} />

        <div className="exp-btn">
          <img src="/images/sparkles.png" alt="sparkles" />
          <button
            className="btn-explore"
            onClick={() => router.push("/explore-events")}
          >
            Explore Events
          </button>
        </div>

        <div className="hero-carousel-area">
          <HeroBannerCarousel images={posters} />
        </div>

        <EventSearchBar
          whatIcon={WHATICON}
          whereIcon={HOME_PAGE_LOCATION_ICON}
          whenIcon={HOME_PAGE_DATE_ICON}
        />
      </main>

      <ChooseEventCategory categories={categories} />


      <EventSlider title="Trending Events" data={events} />
      <EventSlider title="Virtual Events" data={events} />

      <SpotlightCarousel data={events} />

      {/*  View Leaderboard navigates to /leaderboard */}
      <OrganizersCarousel data={organization} />

      <EventSlider title="Upcoming Events" data={events} />

      <LocationHighlights />
      <FloatingExploreButton targetRef={exploreRef} />
      <Footer />
    </div>
  );
}
