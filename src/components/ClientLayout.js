"use client";

import { useEffect, useState, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import Navbar from "./global/Navbar/Navbar";
import { listenForegroundMessage } from "../lib/firebase/foregroundMessage";
import { requestPermission } from "../lib/firebase/requestPermission";

export default function ClientLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [notification, setNotification] = useState(null);
  const timerRef = useRef(null);

  const hideNavbar =
    pathname.startsWith("/auth") ||
    pathname.startsWith("/login") ||
    pathname.startsWith("/signup");

  useEffect(() => {
    requestPermission();

    const unsubscribe = listenForegroundMessage((payload) => {

      const notif = {
        title: payload.notification?.title,
        body: payload.notification?.body,
        imageUrl: payload.notification?.image,
        actionUrl: payload.data?.actionUrl,
      };

      //Sound
      const audio = new Audio("/sounds/notification.mp3");
      audio.play().catch(() => {});

      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }

      setNotification(notif);

      timerRef.current = setTimeout(() => {
        setNotification(null);
      }, 3000);
    });

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const handleClick = () => {
    if (notification?.actionUrl) {
      let path = notification.actionUrl;

      if (path.startsWith("http")) {
        const parsed = new URL(path);
        path = parsed.pathname;
      }

      router.push(path);
    }

    setNotification(null);
  };

  return (
    <>
      {!hideNavbar && <Navbar />}

      {notification && (
        <div className="inapp-wrapper" onClick={handleClick}>
          <div className="inapp-card">
            {notification.imageUrl && (
              <img src={notification.imageUrl} alt="notif" />
            )}
            <div>
              <strong>{notification.title}</strong>
              <p>{notification.body}</p>
            </div>
          </div>
        </div>
      )}

      {children}
    </>
  );
}