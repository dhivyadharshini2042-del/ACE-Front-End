"use client";

import "../../auth-common.css";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-hot-toast";

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
  TOAST_ERROR_MSG_FILL_ALL_FIELDS,
  MSG_ORG_SELECT_COUNTRY,
  MSG_ORG_SELECT_STATE,
  PH_ORG_ORGANIZATION_NAME,
  TEXT_NO_ACCOUNT,
  TEXT_SIGNIN,
  TITLE_ALREADY_HAVE_ACCOUNT,
} from "../../../../../const-value/config-message/page";
import {
  ORG_CATEGORY,
  CONTACT_ICON,
  TICK_ICON,
} from "../../../../../const-value/config-icons/page";

import {
  getCountries,
  getStates,
  getCities,
} from "../../../../../lib/location.api";

import { useLoading } from "../../../../../context/LoadingContext";
import { NAME_REGEX } from "../../../../../components/validation";

export default function Page() {
  const router = useRouter();
  const params = useSearchParams();
  const { setLoading } = useLoading();

  const category = params.get("cat");

  const [country, setCountry] = useState("");
  const [stateName, setStateName] = useState("");
  const [city, setCity] = useState("");
  const [orgName, setOrgName] = useState("");

  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  const [loadingCountry, setLoadingCountry] = useState(false);
  const [loadingState, setLoadingState] = useState(false);
  const [loadingCity, setLoadingCity] = useState(false);
  const [orgNameError, setOrgNameError] = useState("");
  const [customCity, setCustomCity] = useState("");

  /* LOAD COUNTRIES */
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

  /* LOAD STATES */
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

  /* LOAD CITIES */
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

  const handleOrgNameChange = (e) => {
    const value = e.target.value;
    setOrgName(value);

    if (!value) {
      setOrgNameError("Organization name is required");
    } else if (!NAME_REGEX.test(value)) {
      setOrgNameError(
        "Organization name must contain only letters and spaces (2–50 characters)",
      );
    } else {
      setOrgNameError("");
    }
  };

  function onContinue(e) {
    e.preventDefault();

    const finalCity = cities.length > 0 ? city : customCity;

    if (!country || !stateName || !city || !orgName) {
      return toast.error(TOAST_ERROR_MSG_FILL_ALL_FIELDS);
    }

    router.push(
      `/auth/organization/signup/account?cat=${category}&country=${country}&state=${stateName}&city=${finalCity}&orgName=${orgName}`,
    );
  }

  return (
    <div className="org-shell">
      {/* LEFT */}
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

      {/* RIGHT */}
      <main className="org-right">
        <div className="org-card">
          {/* STEPPER */}
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

          <h2 className="org-title">{LABEL_ORG_STEP_DETAILS}</h2>
          <p className="org-sub">{SUBTITLE_ORG_DETAILS}</p>

          <form className="org-form" onSubmit={onContinue}>
            {/* COUNTRY */}
            <div className="form-group">
              <label className="form-label">{LABEL_ORG_COUNTRY}</label>
              <div className="select-wrapper">
                <select
                  className="form-control custom-select"
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
            </div>

            {/* STATE */}
            <div className="form-group">
              <label className="form-label">{LABEL_ORG_STATE}</label>
              <div className="select-wrapper">
                <select
                  className="form-control custom-select"
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
            </div>

            {/* CITY */}
            <div className="form-group">
              <label className="form-label">{LABEL_ORG_CITY}</label>

              {/* If cities available → Show dropdown */}
              {cities.length > 0 ? (
                <div className="select-wrapper">
                  <select
                    className="form-control custom-select"
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
                      <option key={ct.identity} value={ct.name}>
                        {ct.name}
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                /* If no cities → Show input */
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter your city"
                  value={customCity}
                  onChange={(e) => setCustomCity(e.target.value)}
                />
              )}
            </div>

            {/* ORG NAME */}
            <div className="form-group">
              <label className="form-label">{LABEL_ORG_NAME}</label>

              <input
                className={`form-control ${orgNameError ? "is-invalid" : ""}`}
                value={orgName}
                onChange={handleOrgNameChange}
                placeholder={PH_ORG_ORGANIZATION_NAME}
                required
              />

              {orgNameError && (
                <div className="invalid-feedback">{orgNameError}</div>
              )}
            </div>

            <div className="org-actions">
              <button className="btn-primary-ghost" type="submit">
                {BTN_CONTINUE}
              </button>
            </div>
          </form>
          <div className="text-center mt-3">
            <small>
              {TITLE_ALREADY_HAVE_ACCOUNT}{" "}
              <a
                href="/auth/organization/login"
                className="text-primary fw-bold"
              >
                {TEXT_SIGNIN}
              </a>
            </small>
          </div>
        </div>
      </main>
    </div>
  );
}
