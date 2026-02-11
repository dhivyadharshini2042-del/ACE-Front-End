"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./LocationHighlights.module.css";
import { getLocationCounts } from "../../../lib/location.api";
import Tooltip from "../../ui/Tooltip/Tooltip";
import LocationModal from "../../ui/LocationModal/LocationModal";

export default function PopularLocations() {
  const [activeTab, setActiveTab] = useState("countries");
  const [countries, setCountries] = useState([]);
  const [cities, setCities] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const router = useRouter();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const res = await getLocationCounts();
    if (!res) return;

    setCountries(res.countries || []);
    setCities(res.cities || []);
  };

  const list = activeTab === "cities" ? cities : countries;

  const visibleItems = list.slice(0, 12);
  const hasMore = list.length > 12;

  const handleClick = (item) => {
    if (activeTab === "cities") {
      const encoded = btoa(item.cityIdentity);
      router.push(`/location/city/${encoded}`);
    } else {
      const encoded = btoa(item.countryIdentity);
      router.push(`/location/country/${encoded}`);
    }
  };

  const renderCard = (item) => {
    const name = activeTab === "cities" ? item.cityName : item.countryName;

    const identity =
      activeTab === "cities" ? item.cityIdentity : item.countryIdentity;

    return (
      <Tooltip key={identity} text={`View ${name} - ${item.count} Events`}>
        <div className={styles.card} onClick={() => handleClick(item)}>
          <div className={styles.fallback}>
            {activeTab === "countries" && item.flagImageUrl ? (
              <img
                src={item.flagImageUrl}
                alt={name}
                className={styles.flagImage}
              />
            ) : (
              name?.charAt(0)
            )}
          </div>

          <div className={styles.textWrapper}>
            <h3 className={styles.name}>{name}</h3>
            <p className={styles.events}>{item.count} Events</p>
          </div>
        </div>
      </Tooltip>
    );
  };

  return (
    <section className={styles.popularlocationroot}>
      {/* Tabs */}
      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${
            activeTab === "countries" ? styles.active : ""
          }`}
          onClick={() => setActiveTab("countries")}
        >
          Popular Countries
        </button>

        <button
          className={`${styles.tab} ${
            activeTab === "cities" ? styles.active : ""
          }`}
          onClick={() => setActiveTab("cities")}
        >
          Popular Cities
        </button>
      </div>

      <p className={styles.sub}>
        {activeTab === "cities"
          ? "Cities That Never Stop Celebrating"
          : "Where Every Continent Comes Alive with Events"}
      </p>

      {/* MAIN GRID (15 only) */}
      <div className={styles.grid}>
        {visibleItems.map((item) => renderCard(item))}
      </div>

      {/* SEE MORE */}
      {hasMore && (
        <div className={styles.seeMoreWrapper}>
          <Tooltip
            text={`Explore all ${list.length} ${
              activeTab === "cities" ? "Cities" : "Countries"
            }`}
          >
            <button
              className={styles.seeMore}
              onClick={() => setShowModal(true)}
            >
              See All
            </button>
          </Tooltip>
        </div>
      )}

      {/* MODAL */}
      {showModal && (
        <LocationModal
          open={showModal}
          title={`All ${activeTab === "cities" ? "Cities" : "Countries"}`}
          onClose={() => setShowModal(false)}
        >
          <div className={styles.modalGrid}>
            {list.map((item) => renderCard(item))}
          </div>
        </LocationModal>
      )}
    </section>
  );
}
