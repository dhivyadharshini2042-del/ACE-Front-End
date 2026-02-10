// src/lib/location.api.js

import apiPublic from "./axiosPublic";
import { API_ENDPOINTS } from "./api/endpoints";
import { handleApi } from "./api/apiHelper";

/* =======================
   COUNTRIES
======================= */
export const getCountries = async () => {
  const res = await handleApi(
    apiPublic.get(API_ENDPOINTS.LOCATIONS.ALL_COUNTRIES)
  );

  // expected backend response:
  // [{ identity, name }]
  return res?.status ? res.data : [];
};

/* =======================
   STATES (by countryId)
======================= */
export const getStates = async (countryId) => {
  if (!countryId) return [];

  const res = await handleApi(
    apiPublic.get(API_ENDPOINTS.LOCATIONS.COUNTRIES_STATES(countryId))
  );

  // expected:
  // [{ identity, name }]
  return res?.status ? res.data : [];
};

/* =======================
   CITIES (by stateId)
======================= */
export const getCities = async (stateId) => {
  if (!stateId) return [];

  const res = await handleApi(
    apiPublic.get(API_ENDPOINTS.LOCATIONS.STATES_CITIES(stateId))
  );

  // expected:
  // [{ identity, name }]
  return res?.status ? res.data : [];
};
