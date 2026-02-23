"use client";

import { Provider } from "react-redux";
import { Toaster } from "react-hot-toast";
import { useEffect, useRef } from "react";
import { store } from "../store/store";
import { LoadingProvider } from "../context/LoadingContext";
import { requestPermission } from "../lib/firebase/requestPermission";
import { isUserLoggedIn } from "../lib/auth";

function FcmInitializer() {
  const hasRequested = useRef(false);

  useEffect(() => {
    if (!isUserLoggedIn()) return;
    if (hasRequested.current) return;

    hasRequested.current = true;

    requestPermission();
  }, []);

  return null;
}

export default function Providers({ children }) {
  return (
    <Provider store={store}>
      <LoadingProvider>
        <FcmInitializer />
        <Toaster position="top-right" />
        {children}
      </LoadingProvider>
    </Provider>
  );
}