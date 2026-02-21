"use client";

import { useEffect, useRef, useState } from "react";
import "./landing.css";

import {
  HOME_PAGE_DATE_ICON,
  HOME_PAGE_LOCATION_ICON,
  WHATICON,
} from "../../const-value/config-icons/page.js";

import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import { getExploreEventTypes } from "../../lib/api/event.api.js";

import { getAllOrganizationsApi } from "../../lib/api/organizer.api.js";

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
import AppLandingHero from "../../components/global/AppLandingHero/AppLandingHero.js";
import {
  getTrendingEventsApi,
  getUpcomingEventsApi,
  getVirtualEventsApi,
  getFeaturedEventsApi,
} from "../../lib/api/event.api.js";
import { getAllEventTypesApi } from "../../lib/api/event.api.js";
import { useLoading } from "../../context/LoadingContext.js";
import UserTypeModal from "../../components/ui/UserTypeModal/UserTypeModal";
import { getUserTypeApi } from "../../lib/api/auth.api";
import { TOAST_ERROR_MSG_ORGANIZERS_LOAD_FAILED } from "../../const-value/config-message/page.js";

export default function LandingPage({ searchParams }) {
  const { setLoading } = useLoading();

  const [organization, setOrganization] = useState([]);
  const [categories, setCategories] = useState([]);
  const [trendingEvents, setTrendingEvents] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [virtualEvents, setVirtualEvents] = useState([]);
  const [featuredEvents, setFeaturedEvents] = useState([]);
  const [eventTypes, setEventTypes] = useState([]);
  const [showTypeModal, setShowTypeModal] = useState(false);
  const [userTypes, setUserTypes] = useState([]);

  const [offsets, setOffsets] = useState({
    trending: 0,
    upcoming: 0,
    virtual: 0,
    featured: 0,
  });

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

  useEffect(() => {
    if (!searchParams) return;

    if (searchParams.showTypeModal === "true") {
      setShowTypeModal(true);
      loadUserTypes();
    }
  }, [searchParams]);

  const loadUserTypes = async () => {
    try {
      const res = await getUserTypeApi();
      console.log("]]]]]]]]]]]", res);

      if (res?.success) {
        setUserTypes(res.data);
      }
    } catch (error) {
      console.error("User Type API failed", error);
    }
  };

  useEffect(() => {
    const loadEventTypes = async () => {
      const res = await getAllEventTypesApi();
      console.log("EVENT TYPES API:", res); // 👈 CHECK THIS

      if (res?.status) {
        setEventTypes(res.data);
      }
    };
    loadEventTypes();
  }, []);

  /* ================= LOAD CATEGORIES ================= */
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const res = await getExploreEventTypes();
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

  /* ================= LOAD EVENTS + ORGANIZERS ================= */
  const loadMoreEvents = async () => {
    try {
      setLoading(true);

      const orgRes = await getAllOrganizationsApi();

      if (orgRes?.status) {
        setOrganization(orgRes.data);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to load organizers");
    } finally {
      setLoading(false);
    }
  };

  const loadEvents = async (type, setter) => {
    try {
      setLoading(true);

      const apiMap = {
        trending: getTrendingEventsApi,
        upcoming: getUpcomingEventsApi,
        virtual: getVirtualEventsApi,
        featured: getFeaturedEventsApi,
      };

      const res = await apiMap[type]({
        offset: offsets[type],
        limit: 5,
      });

      if (res?.status) {
        setter((prev) => [
          ...prev,
          ...res.data.filter(
            (newEvent) => !prev.some((e) => e.identity === newEvent.identity),
          ),
        ]);

        setOffsets((prev) => ({
          ...prev,
          [type]: prev[type] + 5,
        }));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvents("trending", setTrendingEvents);
    loadEvents("upcoming", setUpcomingEvents);
    loadEvents("virtual", setVirtualEvents);
    loadEvents("featured", setFeaturedEvents);
  }, []);

  useEffect(() => {
    loadMoreEvents();
  }, []);

  /* ================= UI ================= */
  return (
    <>
    {/* skjjfks */}
      <UserTypeModal
        open={showTypeModal}
        data={userTypes}
        onClose={() => setShowTypeModal(false)}
      />
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
            eventTypes={eventTypes}
          />
        </main>

        <ChooseEventCategory categories={categories} />

        <EventSlider
          title="Trending Events"
          data={trendingEvents}
          onReachEnd={() => loadEvents("trending", setTrendingEvents)}
        />
        </div>
    
      <ChooseEventCategory categories={categories} />

      <EventSlider
        title="Trending Events"
        data={trendingEvents}
        onReachEnd={() => loadEvents("trending", setTrendingEvents)}
      />

      <EventSlider
        title="Virtual Events"
        data={virtualEvents}
        onReachEnd={() => loadEvents("virtual", setVirtualEvents)}
      />

      <SpotlightCarousel data={featuredEvents} />

      <OrganizersCarousel data={organization} />

      <EventSlider
        title="Upcoming Events"
        data={upcomingEvents}
        onReachEnd={() => loadEvents("upcoming", setUpcomingEvents)}
      />

      <LocationHighlights />
      <AppLandingHero />
      <FloatingExploreButton targetRef={exploreRef} />
      <Footer />
    </>
  );
}
