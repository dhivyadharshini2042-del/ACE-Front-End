"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./LocationHighlights.module.css";
import { getLocationCounts } from "../../../lib/location.api";
import Tooltip from "../../ui/Tooltip/Tooltip";

export default function PopularLocations() {
  const [activeTab, setActiveTab] = useState("countries");
  const [countries, setCountries] = useState([]);
  const [cities, setCities] = useState([]);
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

  const handleClick = (item) => {
    if (activeTab === "cities") {
      const encoded = btoa(item.cityIdentity);

      router.push(`/location/city/${encoded}`);
    } else {
      const encoded = btoa(item.countryIdentity);

      router.push(`/location/country/${encoded}`);
    }
  };

  console.log("-----list", list);
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

      <div className={styles.grid}>
        {list.map((item) => {
          const name =
            activeTab === "cities" ? item.cityName : item.countryName;

          const identity =
            activeTab === "cities" ? item.cityIdentity : item.countryIdentity;

          return (
            <Tooltip
              key={identity}
              text={`View ${name} - ${item.count} Events`}
            >
              <div className={styles.card} onClick={() => handleClick(item)}>
                {/* IMAGE NOT AVAILABLE → SHOW LETTER */}
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

                <div className={styles.text}>
                  <h3 className={styles.name}>{name}</h3>
                  <p className={styles.events}>{item.count} Events</p>
                </div>
              </div>
            </Tooltip>
          );
        })}
      </div>
    </section>
  );
}
