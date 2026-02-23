"use client";

import { useEffect } from "react";

export default function InAppNotification({ data, onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 4000); // auto close 4 sec

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="inapp-notification">
      {data.imageUrl && (
        <img src={data.imageUrl} alt="notif" />
      )}
      <div>
        <strong>{data.title}</strong>
        <p>{data.body}</p>
      </div>
    </div>
  );
}