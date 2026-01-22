"use client";

import { createContext, useContext, useState } from "react";
import GlobalLoader from "../components/global/GlobalLoader/GlobalLoader";

const LoadingContext = createContext();

export function LoadingProvider({ children }) {
  const [loading, setLoading] = useState(false);

  return (
    <LoadingContext.Provider value={{ loading, setLoading }}>
      {children}
      {loading && <GlobalLoader />}
    </LoadingContext.Provider>
  );
}

export const useLoading = () => useContext(LoadingContext);
