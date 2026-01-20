"use client";

import { useEffect, useState } from "react";
import "./landing.css";
// ICONS
import {
  DATEICON,
  LOCATION_ICON,
  WHATICON,
} from "../../const-value/config-icons/page.js";
import { useRouter } from "next/navigation";
// API
import { getAllEventsApi } from "../../lib/api/event.api.js";
import toast from "react-hot-toast";
import ChooseEventCategory from "../../components/global/ChooseEventCategory/ChooseEventCategory";
import EventSearchBar from "../../components/global/EventSearchBar/EventSearchBar";
import EventSlider from "../../components/global/EventSlider/EventSlider";
import Footer from "../../components/global/Footer/Footer";

import HeroBanner from "../../components/global/HeroBanner/HeroBanner.js";
import HeroBannerCarousel from "../../components/global/HeroBannerCarousel/HeroBannerCarousel";
import SpotlightCarousel from "../../components/global/SpotlightCarousel/SpotlightCarousel";
import LeaderboardModal from "../../components/global/LeaderboardModal/LeaderboardModal";
import LocationHighlights from "../../components/global/LocationHighlights/LocationHighlights";
import OrganizersCarousel from "../../components/global/OrganizerCarousel/OrganizerCarousel.js";
// import HowItWorks from "../../components/global/HowItWorks/HowItWorks.js";
import { useLoading } from "../../context/LoadingContext.js";
import { getAllOrganizationsApi } from "../../lib/api/organizer.api.js";

export default function LandingPage() {
  const [openLB, setOpenLB] = useState(false);
  const [events, setEvents] = useState([]);
  const [organization, setOrganization] = useState([]);
  const router = useRouter();

  const { setLoading: setGlobalLoading } = useLoading();

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

  const ORGANIZERSS = [
    {
      id: 1,
      name: "Swaram Academy",
      avatar:
        "https://png.pngtree.com/element_pic/00/16/07/06577d261edb9ec.jpg",
      events: 17,
      views: 2517,
      rank: 1,
    },
  ];

  const loadEvents = async () => {
    setGlobalLoading(true);

    try {
      const res = await getAllEventsApi();
      if (res?.status) {
        setEvents(res.data);
      } else {
        toast.error(res?.message || "Failed to load events");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setGlobalLoading(false);
    }
  };

  const loadOrganization = async () => {
    setGlobalLoading(true);

    try {
      const res = await getAllOrganizationsApi();

      if (res?.status) {
        setOrganization(res.data);
      } else {
        toast.error(res?.message || "Failed to load organization");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setGlobalLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
    loadOrganization();
  }, []);

  return (
    <div className="dashboard-root">
      <main className="dash-hero">
        <HeroBanner text={apiText} />

        <button
          className="btn-explore"
          onClick={() => router.push("/explore-events")}
        >
          Explore Events
        </button>

        <div className="hero-carousel-area">
          <HeroBannerCarousel images={posters} />
        </div>

        <EventSearchBar
          whatIcon={WHATICON}
          whereIcon={LOCATION_ICON}
          whenIcon={DATEICON}
        />
      </main>

      <ChooseEventCategory categories={CATEGORIES} />

      <>
        <EventSlider title="Trending Events" data={events} />
        <EventSlider title="Virtual Events" data={events} />
      </>

      <SpotlightCarousel data={events} />

      <OrganizersCarousel
        onOpenLeaderboard={() => setOpenLB(true)}
        data={organization}
      />
      <EventSlider title="Upcoming Events" data={events} />
      {/* <HowItWorks /> */}

      <LeaderboardModal
        open={openLB}
        onClose={() => setOpenLB(false)}
        data={ORGANIZERSS}
      />

      <LocationHighlights />
      <Footer />
    </div>
  );
}
