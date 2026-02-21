"use client";

/**
 * Organization Signup - Details Step (Step 2)
 * Handles country, state, city selection and organization name input.
 */

import "../../auth-common.css";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-hot-toast";

/** UI text constants */
import {
  LABEL_ORG_STEP_CATEGORY,
  LABEL_ORG_STEP_DETAILS,
  LABEL_ORG_STEP_ACCOUNT,
  SUBTITLE_ORG_DETAILS,
  BTN_CONTINUE,
  LABEL_ORG_COUNTRY,
  LABEL_ORG_STATE,
  LABEL_ORG_CITY,
  LABEL_ORG_NAME,
  LABEL_ORG_SELECT_COUNTRY,
  LABEL_ORG_SELECT_STATE,
  LABEL_ORG_SELECT_CITY,
  LABEL_LOADING,
  LABEL_LOADING_STATES,
  LABEL_LOADING_CITIES,
  MSG_ERR_FILL_ALL_FIELDS,
  MSG_ORG_SELECT_COUNTRY,
  MSG_ORG_SELECT_STATE,
  PH_ORG_ORGANIZATION_NAME,
  TEXT_NO_ACCOUNT,
  TEXT_SIGNIN,
  TITLE_ALREADY_HAVE_ACCOUNT
} from "../../../../../const-value/config-message/page";

/** Stepper icons */
import {
  ORG_CATEGORY,
  CONTACT_ICON,
  TICK_ICON,
} from "../../../../../const-value/config-icons/page";

/** Location APIs */
import {
  getCountries,
  getStates,
  getCities,
} from "../../../../../lib/location.api";

import { useLoading } from "../../../../../context/LoadingContext";

export default function Page() {
  const router = useRouter();
  const params = useSearchParams();
  const { setLoading } = useLoading();

  /** Retrieve selected category from query params */
  const category = params.get("cat");

  /** Form state */
  const [country, setCountry] = useState("");
  const [stateName, setStateName] = useState("");
  const [city, setCity] = useState("");
  const [orgName, setOrgName] = useState("");

  /** Dropdown data */
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  /** Loading indicators for dropdowns */
  const [loadingCountry, setLoadingCountry] = useState(false);
  const [loadingState, setLoadingState] = useState(false);
  const [loadingCity, setLoadingCity] = useState(false);

  /**
   * Load countries on component mount
   */
  useEffect(() => {
    async function load() {
      setLoadingCountry(true);
      try {
        const data = await getCountries();
        setCountries(data || []);
      } catch (error) {
        console.error("Error loading countries:", error);
        setCountries([]);
      } finally {
        setLoadingCountry(false);
      }
    }
    load();
  }, []);

  /**
   * Load states when country changes
   * Resets state and city when no country selected
   */
  useEffect(() => {
    if (!country) {
      setStates([]);
      setStateName("");
      return;
    }

    async function load() {
      setLoadingState(true);
      try {
        const data = await getStates(country);
        setStates(data || []);
      } catch (error) {
        console.error("Error loading states:", error);
        setStates([]);
      } finally {
        setLoadingState(false);
      }
    }
    load();
  }, [country]);

  /**
   * Load cities when state changes
   * Resets city when no state selected
   */
  useEffect(() => {
    if (!stateName) {
      setCities([]);
      setCity("");
      return;
    }

    async function load() {
      setLoadingCity(true);
      try {
        const data = await getCities(stateName);
        setCities(data || []);
      } catch (error) {
        console.error("Error loading cities:", error);
        setCities([]);
      } finally {
        setLoadingCity(false);
      }
    }
    load();
  }, [stateName]);

  /**
   * Handles Continue action
   * Validates required fields and navigates to account step
   */
  function onContinue(e) {
    e.preventDefault();

    if (!country || !stateName || !city || !orgName) {
      return toast.error(MSG_ERR_FILL_ALL_FIELDS);
    }

    try {
      setLoading(true);

      router.push(
        `/auth/organization/signup/account?cat=${category}&country=${country}&state=${stateName}&city=${city}&orgName=${orgName}`,
      );
    } catch (err) {
      console.error("Navigation error", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="org-shell">
      {/* LEFT VISUAL PANEL */}
      <aside
        className="org-left"
        style={{ backgroundImage: "url('/images/organizer-bg-circles.png')" }}
      >
        <img
          src="/images/organizer-rocket.png"
          alt="rocket"
          className="org-left-img"
        />
      </aside>

      {/* RIGHT CONTENT PANEL */}
      <main className="org-right">
        <div className="org-card">

          {/* STEPPER NAVIGATION */}
          <div className="org-stepper">
            <div className="org-step active">
              <div className="dot">{ORG_CATEGORY}</div>
              <small>{LABEL_ORG_STEP_CATEGORY}</small>
            </div>

            <div className="line active"></div>

            <div className="org-step active">
              <div className="dot">{CONTACT_ICON}</div>
              <small>{LABEL_ORG_STEP_DETAILS}</small>
            </div>

            <div className="line"></div>

            <div className="org-step">
              <div className="dot">{TICK_ICON}</div>
              <small>{LABEL_ORG_STEP_ACCOUNT}</small>
            </div>
          </div>

          {/* PAGE TITLE */}
          <h2 className="org-title">{LABEL_ORG_STEP_DETAILS}</h2>
          <p className="org-sub">{SUBTITLE_ORG_DETAILS}</p>

          {/* DETAILS FORM */}
          <form className="org-form" onSubmit={onContinue}>

            {/* COUNTRY SELECT */}
            <div className="form-group">
              <label className="form-label">{LABEL_ORG_COUNTRY}</label>
              <select
                className="form-control"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
              >
                <option value="">
                  {loadingCountry ? LABEL_LOADING : LABEL_ORG_SELECT_COUNTRY}
                </option>
                {countries.map((c) => (
                  <option key={c.identity} value={c.identity}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* STATE SELECT */}
            <div className="form-group">
              <label className="form-label">{LABEL_ORG_STATE}</label>
              <select
                className="form-control"
                value={stateName}
                onChange={(e) => {
                  setStateName(e.target.value);
                  setCity("");
                }}
              >
                <option value="">
                  {!country
                    ? MSG_ORG_SELECT_COUNTRY
                    : loadingState
                      ? LABEL_LOADING_STATES
                      : LABEL_ORG_SELECT_STATE}
                </option>
                {states.map((s) => (
                  <option key={s.identity} value={s.identity}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            {/* CITY SELECT */}
            <div className="form-group">
              <label className="form-label">{LABEL_ORG_CITY}</label>
              <select
                className="form-control"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              >
                <option value="">
                  {!stateName
                    ? MSG_ORG_SELECT_STATE
                    : loadingCity
                      ? LABEL_LOADING_CITIES
                      : LABEL_ORG_SELECT_CITY}
                </option>
                {cities.map((ct) => (
                  <option key={ct.identity} value={ct.identity}>
                    {ct.name}
                  </option>
                ))}
              </select>
            </div>

            {/* ORGANIZATION NAME INPUT */}
            <div className="form-group">
              <label className="form-label">{LABEL_ORG_NAME}</label>
              <input
                className="form-control"
                value={orgName}
                onChange={(e) => setOrgName(e.target.value)}
                placeholder={PH_ORG_ORGANIZATION_NAME}
                minLength={3}
                required

              />
            </div>

            {/* CONTINUE BUTTON */}
            <div className="org-actions">
              <button className="btn-primary-ghost" type="submit">
                {BTN_CONTINUE}
              </button>
            </div>
          </form>

          {/* LOGIN REDIRECT */}
          <div className="text-center mt-3">
            <small>
              {TITLE_ALREADY_HAVE_ACCOUNT}{" "}
              <a href="/auth/organization/login" className="text-primary fw-bold">
                {TEXT_SIGNIN}
              </a>
            </small>
          </div>

        </div>
      </main>
    </div>
  );
}
