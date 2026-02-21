"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./LocationPage.module.css";
import PaginationBar from "../../../events/components/PaginationBar";
import { getLocationEvents } from "../../../../lib/location.api";

import {
  HEART_ICON,
  SAVEICON,
  LOCATION_ICON,
  DATEICON,
  VIEW_ICON,
} from "../../../../const-value/config-icons/page";

import { likeEventApi, saveEventApi } from "../../../../lib/api/event.api";
import { getAuthFromSession, isUserLoggedIn } from "../../../../lib/auth";
import ConfirmModal from "../../../../components/ui/Modal/ConfirmModal";
import { NO_IMAGE_FOUND_IMAGE } from "../../../../const-value/config-message/page";

import toast from "react-hot-toast";
import Footer from "../../../../components/global/Footer/Footer";
import Tooltip from "../../../../components/ui/Tooltip/Tooltip";

export default function LocationClient({ params }) {
  const { type, identity } = params;

  const router = useRouter();

  const [events, setEvents] = useState([]);
  const [meta, setMeta] = useState(null);
  const [page, setPage] = useState(1);

  const [likedMap, setLikedMap] = useState({});
  const [savedMap, setSavedMap] = useState({});
  const [likeCountMap, setLikeCountMap] = useState({});

  const [auth, setAuth] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);
  const [locationInfo, setLocationInfo] = useState(null);
  const [cityCounts, setCityCounts] = useState([]);

  const decodeBase64 = (value) => {
    try {
      return atob(value);
    } catch (err) {
      return value; // already normal UUID
    }
  };

  const decodedIdentity = decodeBase64(identity);

  /* ================= INIT AUTH ================= */
  useEffect(() => {
    if (isUserLoggedIn()) {
      setAuth(getAuthFromSession());
    }
  }, []);

  /* ================= RESET PAGE WHEN LOCATION CHANGES ================= */
  useEffect(() => {
    setPage(1);
  }, [decodedIdentity]);

  /* ================= FETCH EVENTS ================= */
  useEffect(() => {
    loadEvents();
  }, [decodedIdentity, page]);

  const loadEvents = async () => {
    const res = await getLocationEvents({
      countryId: type === "country" ? decodedIdentity : null,
      cityId: type === "city" ? decodedIdentity : null,
      page,
    });

    if (res?.status) {
      setEvents(res.data);
      setMeta(res.meta);

      if (res.country) {
        setLocationInfo(res.country);
      }

      if (type === "country") {
        const cityMap = {};

        res.data.forEach((event) => {
          const cityName = event.location?.city;

          if (!cityName) return;

          if (!cityMap[cityName]) {
            cityMap[cityName] = {
              cityName,
              count: 0,
            };
          }

          cityMap[cityName].count += 1;
        });

        const cityArray = Object.values(cityMap);

        setCityCounts(cityArray);
      }

      if (type === "city") {
        setLocationInfo(res.city);
      }

      const liked = {};
      const saved = {};
      const counts = {};

      res.data.forEach((e) => {
        liked[e.identity] = !!e.isLiked;
        saved[e.identity] = !!e.isSaved;
        counts[e.identity] = e.likeCount || 0;
      });

      setLikedMap(liked);
      setSavedMap(saved);
      setLikeCountMap(counts);
    }
  };

  /* ================= LIKE ================= */
  const handleLike = async (event) => {
    if (!auth?.identity) {
      setPendingAction("like");
      setShowLoginModal(true);
      return;
    }

    const eventId = event.identity;
    const wasLiked = likedMap[eventId];

    // optimistic UI
    setLikedMap((p) => ({ ...p, [eventId]: !wasLiked }));
    setLikeCountMap((p) => ({
      ...p,
      [eventId]: wasLiked ? p[eventId] - 1 : p[eventId] + 1,
    }));

    const res = await likeEventApi({
      eventIdentity: eventId,
      userIdentity: auth.identity.identity,
    });

    if (!res?.status) {
      setLikedMap((p) => ({ ...p, [eventId]: wasLiked }));
      setLikeCountMap((p) => ({ ...p, [eventId]: p[eventId] }));
      toast.error("Failed to like event");
    }
  };

  /* ================= SAVE ================= */
  const handleSave = async (event) => {
    if (!auth?.identity) {
      setPendingAction("save");
      setShowLoginModal(true);
      return;
    }

    const eventId = event.identity;
    const wasSaved = savedMap[eventId];

    setSavedMap((p) => ({ ...p, [eventId]: !wasSaved }));

    const res = await saveEventApi({
      eventIdentity: eventId,
      userIdentity: auth.identity.identity,
    });

    if (!res?.status) {
      setSavedMap((p) => ({ ...p, [eventId]: wasSaved }));
      toast.error("Failed to save event");
    }
  };

  return (
    <>
      <div className={styles.wrapper}>
        {/* HERO SECTION */}
        <section className={styles.hero}>
          {/* <div className={styles.overlay}></div> */}

          <div
            className={`${styles.heroContainer} ${
              type === "city" ? styles.alignCenter : styles.alignStart
            }`}
          >
            {/* LEFT SIDE */}
            <div className={styles.heroLeft}>
              {type === "country" && (
                <h3 className={styles.smallTitle}>
                  Explore to{" "}
                  {locationInfo?.flagImageUrl && (
                    <img
                      src={locationInfo.flagImageUrl}
                      alt={locationInfo?.name}
                      className={styles.flag}
                    />
                  )}
                </h3>
              )}

              <h1 className={styles.bigTitle}>
                {locationInfo?.name || "Loading..."}
              </h1>

              <p className={styles.desc}>
                {type === "country" && locationInfo?.description}

                {type === "city" &&
                  `${locationInfo?.name} is a vibrant city known for its culture, lifestyle, and growing opportunities. 
From educational institutions and business hubs to entertainment and local attractions, 
${locationInfo?.name} offers a dynamic environment for students and professionals alike.`}
              </p>

              {type === "country" && cityCounts.length > 0 && (
                <div className={styles.citySection}>
                  <h4 className={styles.cityHeading}>Popular Cities</h4>

                  <div className={styles.cityList}>
                    {cityCounts.map((city) => (
                      <Tooltip
                        text={`${city.count} Events`}
                        className={styles.whiteTooltip}
                        key={city.cityName}
                      >
                        <span className={styles.cityName}>
                          <span className={styles.bullet}></span>
                          {city.cityName}
                        </span>
                      </Tooltip>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* RIGHT SIDE */}
            {/* RIGHT SIDE GLOBE */}
            <div className={styles.heroRight}>
              <img
                src="/images/earth-globe.gif"
                alt="Earth Globe"
                className={styles.globe}
              />
            </div>
          </div>
        </section>

        {/* EVENTS */}
        <section className={styles.eventsSection}>
          <h2>All Events</h2>

          <div className={styles.cardGrid}>
            {events.map((event) => {
              const calendar = event.calendars?.[0];
              const isLiked = likedMap[event.identity];
              const isSaved = savedMap[event.identity];

              const lowestPrice = event.tickets?.length
                ? Math.min(...event.tickets.map((t) => t.price || 0))
                : null;

              const formatDate = (date) => {
                if (!date) return "N/A";
                return new Date(date).toLocaleDateString("en-IN", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                });
              };

              const getModeClass = (mode) => {
                if (!mode) return styles.online;
                switch (mode.toUpperCase()) {
                  case "ONLINE":
                    return styles.online;
                  case "OFFLINE":
                    return styles.offline;
                  case "HYBRID":
                    return styles.hybrid;
                  default:
                    return styles.online;
                }
              };

              return (
                <div
                  key={event.identity}
                  className={styles.eventCard}
                  onClick={() => router.push(`/events/${event.slug}`)}
                >
                  {/* IMAGE */}
                  <div className={styles.eventImgWrapper}>
                    <img
                      src={event.bannerImages?.[0] || NO_IMAGE_FOUND_IMAGE}
                      className={styles.eventImg}
                      alt={event.title}
                    />

                    <span
                      className={styles.saveOnImage}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSave(event);
                      }}
                    >
                      <SAVEICON active={isSaved} />
                    </span>
                  </div>

                  {/* BODY */}
                  <div className={styles.cardBody}>
                    <div className={styles.titleLikeRow}>
                      <span className={styles.cardTitle}>{event.title}</span>

                      <div
                        className={styles.likeInline}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleLike(event);
                        }}
                      >
                        <HEART_ICON active={isLiked} />
                        <span>{likeCountMap[event.identity] ?? 0}</span>
                      </div>
                    </div>

                    <div className={styles.eventDetails}>
                      <div className={styles.rowBetween}>
                        <span>
                          {LOCATION_ICON}{" "}
                          {event.location?.city ||
                            (event.mode === "ONLINE" ? "Online Event" : "N/A")}
                        </span>

                        <span>
                          ₹
                          {lowestPrice === null
                            ? "N/A"
                            : lowestPrice === 0
                              ? "Free"
                              : lowestPrice}
                        </span>
                      </div>

                      <div className={styles.rowBetween}>
                        <span>
                          {DATEICON} {formatDate(calendar?.startDate)}
                        </span>

                        <span
                          className={`${styles.modeText} ${getModeClass(event.mode)}`}
                        >
                          <span className={styles.modeDot}></span>
                          {event.mode || "ONLINE"}
                        </span>
                      </div>
                    </div>

                    <div className={styles.footerRow}>
                      <span className={styles.viewBadge}>
                        {VIEW_ICON} {event.viewCount || 0}
                      </span>

                      <span className={styles.badgePaid}>
                        {event.categoryName || "No category"}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {meta && (
            <PaginationBar
              page={meta.page}
              total={meta.totalPages}
              onChange={(p) => setPage(p)}
            />
          )}
        </section>
        <Footer />
      </div>

      {/* LOGIN MODAL */}
      <ConfirmModal
        open={showLoginModal}
        image="/images/logo.png"
        title="Login Required"
        description={
          pendingAction === "like"
            ? "You need to login to like this event."
            : "You need to login to save this event."
        }
        onCancel={() => {
          setShowLoginModal(false);
          setPendingAction(null);
        }}
        onConfirm={() => {
          setShowLoginModal(false);
          setPendingAction(null);
          router.push("/auth/user/login");
        }}
      />
    </>
  );
}
