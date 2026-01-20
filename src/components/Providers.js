"use client";

import { Provider } from "react-redux";
import { Toaster } from "react-hot-toast";
import { store } from "../store/store";
import { LoadingProvider } from "../context/LoadingContext";

export default function Providers({ children }) {
  return (
    <Provider store={store}>
      <LoadingProvider>
        <Toaster position="top-right" />
        {children}
      </LoadingProvider>
    </Provider>
  );
}
