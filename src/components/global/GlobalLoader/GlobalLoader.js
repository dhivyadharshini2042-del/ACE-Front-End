"use client";

import Lottie from "lottie-react";
import loaderAnimation from "../../../assets/lottie/globalLoader.json";
import "./GlobalLoader.css";

export default function GlobalLoader() {
  return (
    <div className="overlay">
      <Lottie
        animationData={loaderAnimation}
        loop
        autoplay
        style={{ width: 120, height: 120 }}
      />
      <p className="text">Loading...</p>
    </div>
  );
}
