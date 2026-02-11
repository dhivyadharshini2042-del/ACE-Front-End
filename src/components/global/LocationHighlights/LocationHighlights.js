"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./LocationHighlights.module.css";
import { getLocationCounts } from "../../../lib/location.api";
import Tooltip from "../../ui/Tooltip/Tooltip";

export default function PopularLocations() {
  const [activeTab, setActiveTab] = useState("cities");
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
      router.push(
        `/location/city/${item.cityIdentity}?name=${item.cityName}&count=${item.count}`,
      );
    } else {
      router.push(
        `/location/country/${item.countryIdentity}?name=${item.countryName}&count=${item.count}`,
      );
    }
  };

  console.log("-----list", list);
  return (
    <section className={styles.popularlocationroot}>
      {/* Tabs */}
      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${
            activeTab === "cities" ? styles.active : ""
          }`}
          onClick={() => setActiveTab("cities")}
        >
          Popular Cities
        </button>

        <button
          className={`${styles.tab} ${
            activeTab === "countries" ? styles.active : ""
          }`}
          onClick={() => setActiveTab("countries")}
        >
          Popular Countries
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
                <div className={styles.fallback}>{name?.charAt(0)}</div>

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
