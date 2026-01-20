"use client";

import { useRouter } from "next/navigation";
import "./not-found.css";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="nf-wrapper">
      <div className="nf-content">
        <img
          src="/images/page-not-found-image.png"
          alt="Page Not Found"
          className="nf-image"
        />
        <h2 className="nf-title">Page Not Found</h2>
        <h3 className="nf-error">ERROR</h3>

        <p className="nf-desc">
          It seems like the page you're looking for doesn’t exist or has been
          moved. <br />
          But don’t worry, you can get back on track!
        </p>

        <button className="nf-btn" onClick={() => router.back()}>
          Go Back
        </button>
      </div>
    </div>
  );
}
