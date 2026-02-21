"use client";
import { createPortal } from "react-dom";
import "./ShareModal.css";
import toast from "react-hot-toast";

import {
  WHATSAPPICON,
  XICON,
  LINKEDINICON,
  INSTAGRAMICON,
  YOUTUBEICON,
} from "../../../const-value/config-icons/page";

export default function ShareModal({ open, onClose, title }) {
  if (!open) return null;

  const shareUrl =
    typeof window !== "undefined" ? window.location.href : "";

  // ENV CONFIG
  const WHATSAPP_BASE = process.env.NEXT_PUBLIC_WHATSAPP_BASE;
  const X_SHARE = process.env.NEXT_PUBLIC_X_SHARE;
  const LINKEDIN_SHARE = process.env.NEXT_PUBLIC_LINKEDIN_SHARE;
  const INSTAGRAM_URL = process.env.NEXT_PUBLIC_INSTAGRAM_URL;
  const YOUTUBE_URL = process.env.NEXT_PUBLIC_YOUTUBE_URL;

  const handleShare = (type) => {
    if (!shareUrl) return;

    switch (type) {
      case "whatsapp":
        window.open(
          `${WHATSAPP_BASE}?text=${encodeURIComponent(
            title + " - " + shareUrl
          )}`,
          "_blank"
        );
        toast.success("Opening WhatsApp…");
        break;

      case "x":
        window.open(
          `${X_SHARE}?text=${encodeURIComponent(
            title
          )}&url=${encodeURIComponent(shareUrl)}`,
          "_blank"
        );
        toast.success("Opening X (Twitter)…");
        break;

      case "linkedin":
        window.open(
          `${LINKEDIN_SHARE}/?url=${encodeURIComponent(shareUrl)}`,
          "_blank"
        );
        toast.success("Opening LinkedIn…");
        break;

      case "instagram":
        window.open(INSTAGRAM_URL, "_blank");
        toast.success("Opening Instagram page…");
        break;

      case "youtube":
        window.open(YOUTUBE_URL, "_blank");
        toast.success("Opening YouTube channel…");
        break;

      case "copy":
        navigator.clipboard.writeText(shareUrl);
        toast.success("Event link copied 🔗");
        break;

      default:
        toast.error("Share option not configured");
        break;
    }

    onClose();
  };

  return createPortal(
    <div className="share-overlay" onClick={onClose}>
      <div className="share-modal" onClick={(e) => e.stopPropagation()}>
        {/* HEADER */}
        <div className="share-header">
          <h4>Share Event</h4>
          <span className="close-btn" onClick={onClose}>✕</span>
        </div>

        {/* SOCIAL OPTIONS */}
        <div className="share-options">
          <button onClick={() => handleShare("whatsapp")}>
            {WHATSAPPICON} WhatsApp
          </button>

          <button onClick={() => handleShare("x")}>
            {XICON} X (Twitter)
          </button>

          <button onClick={() => handleShare("linkedin")}>
            {LINKEDINICON} LinkedIn
          </button>

          <button onClick={() => handleShare("instagram")}>
            {INSTAGRAMICON} Instagram
          </button>

          <button onClick={() => handleShare("youtube")}>
            {YOUTUBEICON} YouTube
          </button>

          <button onClick={() => handleShare("copy")}>
            🔗 Copy Event Link
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
