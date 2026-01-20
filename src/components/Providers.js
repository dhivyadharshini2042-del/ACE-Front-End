"use client";

import { Provider } from "react-redux";
import { Toaster } from "react-hot-toast";
import { store } from "../store/store";


export default function Providers({ children }) {
  return (
    <Provider store={store}>
      <Toaster position="top-right" />
      {children}
    </Provider>
  );
}
